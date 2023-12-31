import { BabonusHelpers } from "../lib/babonus-helpers";
import { BeaverCraftingHelpers } from "../lib/beavers-crafting-helpers";
import { ItemLinkingHelpers } from "../lib/item-linking-helper";
import { getItemAsync, log, manageNewName, warn } from "../lib/lib";

export async function retrieveAndApplyBonuses(
  itemToCheck,
  itemTypeToCheck,
  itemNewName,
  itemNewImage,
  itemNewPrefix,
  itemNewSuffix
) {
  //   const [itemToCheck] = args;
  itemToCheck = await getItemAsync(itemToCheck);
  // e.g. 'Compendium.' + compendium.metadata.id + '.Item.' + item.id;
  // const baseItemUuid = getProperty(itemToCheck,`flags.item-linking.baseItem`);
  const baseItemUuid = itemToCheck.getFlag("item-linking", "baseItem");
  if (!baseItemUuid) {
    warn(`No baseItemUuid is been found for ${itemToCheck.name}|${itemToCheck.uuid}`, true);
    return;
  }
  const baseItem = await fromUuid(baseItemUuid);
  if (!baseItem) {
    warn(`No baseItem is been found for ${itemToCheck.name}|${itemToCheck.uuid}`, true);
    return;
  }

  if (!itemTypeToCheck) {
    warn(`No itemTypeToCheck is been found for ${itemToCheck.name}|${itemToCheck.uuid}`, true);
    return;
  }

  //   const baseItem = itemToCheck;

  const actor = itemToCheck.actor;
  if (!actor) {
    warn(`${game.user.name} please at least select a actor`, true);
    return;
  }

  const weaponsInitial = retrieveWeaponsFromActor(actor, itemTypeToCheck);
  const weaponsSecondary = BabonusHelpers.retrieveBonusesFromItem(baseItem);

  let content = initialDialogContent(weaponsInitial);

  let title;
  let d;

  const mainDialog = await new Promise((resolve, reject) => {
    d = new Dialog({
      title: `Item Loadout for ${actor.name}`,
      content,
      render: (html) => {
        let containerMain = document.querySelector(".mainWeaponImg");
        //$(".mainWeaponImg").css("padding": "1px","border": "0px","border-radius": "5px")
        let clickMain =
          containerMain &&
          containerMain.addEventListener("click", async function getMain(event) {
            let target = event.target;
            let mainWeaponID = target.getAttribute("id");
            let mainChosenWeapon;
            let chosenMainContent;
            if (target.nodeName != "IMG") {
              d.render(true);
            }
            if (target.nodeName == "IMG" && (mainWeaponID = target.getAttribute("id"))) {
              mainChosenWeapon = actor.items.get(mainWeaponID);
              chosenMainContent = await mainWeaponChosenDialogContent(mainChosenWeapon);
            }

            let secondaryDialogContent = await getSecondaryDialogContent(
              mainChosenWeapon,
              chosenMainContent,
              false,
              weaponsSecondary,
              itemToCheck.img
            );
            d.data.content = secondaryDialogContent[0];
            d.render(true);

            return mainChosenWeapon;
          });
        let containerSecondary = document.querySelector(".secondaryWeaponImg");
        // $(".secondaryWeaponImg").css("padding": "1px","border": "0px","border-radius": "5px")
        let clickSecondary =
          containerSecondary &&
          containerSecondary.addEventListener("click", async function getSecondary(event) {
            let target = event.target;
            let secondaryWeaponID = target.getAttribute("id");
            if (target.nodeName != "IMG") {
              d.render(true);
            }
            if (target.nodeName == "IMG" && (secondaryWeaponID = target.getAttribute("id"))) {
              let secondaryChosenWeapon = BabonusHelpers.retrieveBonusFromCollection(
                weaponsSecondary,
                secondaryWeaponID
              );
              let chosenSecondaryContent = d.data.content;
              let getMainWeaponId = $(chosenSecondaryContent).find(".mainWeaponImg").attr("id");
              let mainChosenWeapon = actor.items.get(getMainWeaponId);
              let ccc = await mainWeaponChosenDialogContent(mainChosenWeapon);
              ccc = ccc.replace("Weapons available:", "Bonus item:");

              let chosenInitialSecondaryContent = await getSecondaryDialogContent(
                mainChosenWeapon,
                ccc,
                secondaryChosenWeapon,
                weaponsSecondary,
                itemToCheck.img
              );
              d.data.content = chosenInitialSecondaryContent[0];
              d.render(true);
            }
          });
      },
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: "Accept Loadout!",
          callback: async (html) => {
            log(`Accept Loadout!`);
            let weaponMain;
            let weaponSecondary;
            const weaponMainId = html[0].querySelector(".mainWeaponImg").id;
            weaponMain = actor.items.get(weaponMainId);

            const weaponSecondaryId = html[0].querySelector(".secondaryWeaponImg")?.id;
            if (weaponSecondaryId) {
              weaponSecondary = BabonusHelpers.retrieveBonusFromCollection(weaponsSecondary, weaponSecondaryId);
            }
            // const results = [weaponMain, weaponSecondary];
            // resolve(results);

            if (!weaponMain) {
              warn(`${game.user.name} you didn't choose any weapon for you main hand (loadout aborted) :(`, true);
              return;
            }
            if (!weaponSecondary) {
              warn(`${game.user.name} you didn't choose any bonus for you main hand (loadout aborted) :(`, true);
              return;
            }
            await BabonusHelpers.applyBonusToItem(weaponMain, weaponSecondary);

            let currentName = manageNewName(weaponMain.name, itemNewName, itemNewPrefix, itemNewSuffix);
            let currentImage = weaponMain.img;
            if (itemNewImage) {
              currentImage = itemNewImage;
            }
            await weaponMain.update({
              name: currentName,
              img: currentImage,
            });

            if (itemToCheck.system.quantity > 1) {
              log(`Update quantity item '${itemToCheck.name}|${itemToCheck.id}'`);
              await itemToCheck.update({ "system.quantity": itemToCheck.system.quantity - 1 });
            } else {
              log(`Delete item '${itemToCheck.name}|${itemToCheck.id}'`);
              await actor.deleteEmbeddedDocuments("Item", [itemToCheck.id]);
            }
          },
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: "Reset selection",
          callback: () => {
            log(`Reset selection`);
            let contentReset = initialDialogContent(weaponsInitial);
            d.data.content = contentReset;
            d.render(true);
          },
        },
      },
      default: "yes",
    }).render(true, {
      width: "400",
      height: "auto",
      resizable: true,
      id: "Loadout",
    });
  });

  //   const results = await mainDialog;
  //   const weaponMain = results[0];
  //   const bonusMain = results[1];
  //   if (!weaponMain) {
  //     warn(`${game.user.name} you didn't choose any weapon for you main hand (loadout aborted) :(`);
  //     return;
  //   }
}

function initialDialogContent(weapons) {
  let initialWeaponsContent = weapons.reduce(
    (acc, weapon) =>
      (acc += `<img width="36" height="36" src="${weapon?.img}" title="${weapon.name}" id="${weapon.id}"/>`),
    ``
  );
  let content = `
      <p>Choose weapon to boost.</p>
      <hr>
      <form>
      <div class="form-group">
      <label for="type">Weapons available:</label>
        <div class="form-fields"><center>
       <div class="mainWeaponImages"><a class="mainWeaponImg">${initialWeaponsContent}</a></div>
        </center></div>
      </div>
    </form>
    `;
  return content;
}

//<center style="width: ${Math.ceil(weapons.length/7)*40}px"></center>
async function mainWeaponChosenDialogContent(mainChosenWeapon) {
  let content = `
    <p>Selected main hand weapon.</p>
    <hr>
    <form>
    <div class="form-group">
    <label for="type">Weapon Selected:</label>
      <div class="form-fields"><center style="width: 40px">
     <div class="mainWeaponImages"><a class="mainWeaponImg" id="${mainChosenWeapon.id}"><img height="36" src="${mainChosenWeapon?.img}" title="${mainChosenWeapon.name}" id="${mainChosenWeapon.id}"/></a></div>
      </center></div>
    </div>
  </form>
  `;
  return content;
}

async function getSecondaryDialogContent(mainWeapon, content, secondaryWeapon, weaponsSecondary, itemImage) {
  if (secondaryWeapon) {
    //if a secondary is already provided do the dialog rerendering
    let secondaryDialogContent = `
            <p>Choose your off hand item.</p>
            <hr>
            <form>
            <div class="form-group">
            <label for="type">Bonus selected:</label>
            <div class="form-fields"><center style="width: 40px">
            <div class="secondaryWeaponImages"><a class="secondaryWeaponImg" id="${secondaryWeapon.id}">
                <img height="36" src="${secondaryWeapon?.img ?? itemImage ?? "icons/svg/aura.svg"}" title="${
      secondaryWeapon.name
    }" id="${secondaryWeapon.id}"/></a></div>
            </center></div>
            </div>
            </form>
        `;
    let secondaryDialogInitialContent = content;
    content += secondaryDialogContent;
    let returns = [content, secondaryDialogInitialContent];
    return returns;
  }
  weaponsSecondary = weaponsSecondary.reduce(
    (acc, weapon) => (acc += `<img height="36" src="${weapon?.item.img}" title="${weapon.name}" id="${weapon.id}"/>`),
    ``
  );
  let secondaryDialogContent = `
      <p>Choose your bonus.</p>
      <hr>
      <form>
        <div class="form-group">
        <label for="type">Bonus available:</label>
          <div class="form-fields"><center><a class="secondaryWeaponImg">
          ${weaponsSecondary}
          </a></center></div>
        </div>
      </form>
    `;
  let secondaryDialogInitialContent = content;
  content += secondaryDialogContent;
  let returns = [content, secondaryDialogInitialContent];
  return returns;
}

function retrieveWeaponsFromActor(actor, itemTypeToCheck) {
  // gather the available weapons.
  //let weaponsInitial = actor.itemTypes.weapon.filter((weapon) => !!weapon.getRollData().item.quantity);
  let weaponsInitial = actor.itemTypes[itemTypeToCheck]?.filter((weapon) => {
    return (
      (!!weapon.getRollData().item.quantity || weapon.item.quantity > 0) &&
      ItemLinkingHelpers.isItemLinked(weapon) &&
      BeaverCraftingHelpers.isItemBeaverCrafted(weapon)
    );
  });

  function plainComparing(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  }

  weaponsInitial = weaponsInitial.sort((a, b) => {
    return plainComparing(a.name, b.name);
  });

  return weaponsInitial;
}
