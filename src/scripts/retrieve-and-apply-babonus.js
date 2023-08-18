import { warn } from "./lib/lib";

export async function retrieveAndApplyBonuses(args) {
  const [itemToCheck] = args;
  // e.g. 'Compendium.' + compendium.metadata.id + '.Item.' + item.id;
  // const baseItemUuid = getProperty(itemToCheck,`flags.item-linking.baseItem`);
  const baseItemUuid = itemToCheck.getFlag("item-linking", "baseItem");
  if (baseItemUuid) {
    ui.notifications.warn(`Nop baseItemUuid is been found for ${itemToCheck.name}|${itemToCheck.uuid}`);
    return;
  }
  const baseItem = fromUuid(baseItemUuid);
  if (baseItem) {
    ui.notifications.warn(`Nop baseItem is been found for ${itemToCheck.name}|${itemToCheck.uuid}`);
    return;
  }

  const actor = itemToCheck.actor;
  if (!actor) {
    ui.notifications.warn(`${game.user.name} please at least select a actor`);
    return;
  }

  const weaponsInitial = retrieveWeaponsFromActor(actor);
  const weaponsSecondary = []; // retrieveBonusesFromItem(baseItem);

  let content = initialDialogContent(weaponsInitial);

  let title;
  let d;

  const mainDialog = await new Promise((resolve, reject) => {
    d = new Dialog({
      title: `Weapon Loadout for ${actor.name}`,
      content,
      render: (html) => {
        containerMain = document.querySelector(".mainWeaponImg");
        //$(".mainWeaponImg").css("padding": "1px","border": "0px","border-radius": "5px")
        clickMain =
          containerMain &&
          containerMain.addEventListener("click", async function getMain(event) {
            target = event.target;
            if (target.nodeName != "IMG") d.render(true);
            if (target.nodeName == "IMG" && (mainWeaponID = target.getAttribute("id"))) {
              mainChosenWeapon = actor.items.get(mainWeaponID);
              chosenMainContent = await mainWeaponChosenDialogContent(mainChosenWeapon);
            }
            return mainChosenWeapon;
          });
        containerSecondary = document.querySelector(".secondaryWeaponImg");
        // $(".secondaryWeaponImg").css("padding": "1px","border": "0px","border-radius": "5px")
        clickSecondary =
          containerSecondary &&
          containerSecondary.addEventListener("click", async function getSecondary(event) {
            target = event.target;
            if (target.nodeName != "IMG") d.render(true);
            if (target.nodeName == "IMG" && (secondaryWeaponID = target.getAttribute("id"))) {
              secondaryChosenWeapon = actor.items.get(secondaryWeaponID);
              chosenSecondaryContent = d.data.content;
              getMainWeaponId = $(chosenSecondaryContent).find(".mainWeaponImg").attr("id");
              mainChosenWeapon = actor.items.get(getMainWeaponId);
              ccc = await mainWeaponChosenDialogContent(mainChosenWeapon);
              ccc = ccc.replace("Weapons available:", "Bonus item:");

              chosenInitialSecondaryContent = await getSecondaryDialogContent(
                mainChosenWeapon,
                ccc,
                secondaryChosenWeapon,
                weaponsSecondary
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
            // TODO
          },
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: "Reset selection",
          callback: () => {
            // TODO
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
}

function retrieveWeaponsFromActor(actor) {
  // gather the available weapons.
  let weaponsInitial = actor.itemTypes.weapon.filter((weapon) => !!weapon.getRollData().item.quantity);

  function plainComparing(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  }

  weaponsInitial = weaponsInitial.sort((a, b) => {
    return plainComparing(a.name, b.name);
  });

  return weaponsInitial;
}

function retrieveBonusesFromItem(baseItem) {
  // returns a Collection of bonuses on the object.
  let bonusesInitial = game.modules.get("babonus").api.getCollection(baseItem);

  function plainComparing(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  }

  bonusesInitial = bonusesInitial.sort((a, b) => {
    return plainComparing(a.name, b.name);
  });
}

function initialDialogContent(weapons) {
  let initialWeaponsContent = weapons.reduce(
    (acc, weapon) =>
      (acc += `<img width="36" height="36" src="${weapon?.img}" title="${weapon.name}" id="${weapon.id}"/>`),
    ``
  );
  let content = `
      <p>Choose weapon.</p>
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

async function getSecondaryDialogContent(mainWeapon, content, secondaryWeapon, weaponsSecondary) {
  if (secondaryWeapon) {
    //if a secondary is already provided do the dialog rerendering
    let secondaryDialogContent = `
            <p>Choose your off hand item.</p>
            <hr>
            <form>  
            <div class="form-group">
            <label for="type">Secondary Item selected:</label>
            <div class="form-fields"><center style="width: 40px">
            <div class="secondaryWeaponImages"><a class="secondaryWeaponImg" id="${secondaryWeapon.id}">
                <img height="36" src="${secondaryWeapon?.img}" title="${secondaryWeapon.name}" id="${secondaryWeapon.id}"/></a></div>
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
    (acc, weapon) => (acc += `<img height="36" src="${weapon?.img}" title="${weapon.name}" id="${weapon.id}"/>`),
    ``
  );
  let secondaryDialogContent = `
      <p>Choose your bonus.</p>
      <hr>
      <form>  
        <div class="form-group">
        <label for="type">Items available:</label>
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
