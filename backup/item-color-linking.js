import CONSTANTS from "../src/scripts/constants/constants";

export function setItemLinkingColor(actorSheet, html, dat) {
  if (!actorSheet) {
    return;
  }
  const isTidySheetKgar = actorSheet.id.startsWith("Tidy5eCharacterSheet");
  if (isTidySheetKgar) {
    return;
  }
  const actor = actorSheet.object;
  // Check if this is a 5E actor sheet
  // Non ve n e' più bisogno l'hook adesso e' renderActorSheet5e
  // if (actor.constructor.name !== "CompactBeyond5eSheet") return;

  let items = html.find($(".item-list .item"));
  for (let itemElement of items) {
    let htmlId = itemElement.outerHTML.match(/data-item-id="(.*?)"/);
    if (!htmlId) {
      continue;
    }
    let id = htmlId[1];
    let item = actor.items.get(id);
    if (!item) {
      continue;
    }

    let rarity = item.getRollData()?.item?.rarity || item?.system?.rarity || undefined;
    rarity = rarity ? rarity.replaceAll(/\s/g, "").toLowerCase().trim() : undefined;
    let source = item.system?.source?.toLowerCase();
    let consumableType = item.system?.consumableType?.toLowerCase() || undefined;

    if (
      rarity === "common" &&
      !(
        source === undefined ||
        source?.includes("xge") ||
        source?.includes("xanathar") ||
        source?.includes("tce") ||
        source?.includes("tasha") ||
        source?.includes("terre") ||
        consumableType === "potion" ||
        consumableType === "rod" ||
        consumableType === "scroll" ||
        consumableType === "wand"
      )
    ) {
      continue;
    }

    if (rarity) {
      itemElement.classList.add("rarity-color-" + rarity);
    }

    if (game.modules.get("beavers-crafting")?.active) {
      const title = itemElement.querySelector("h4");
      const status = item.getFlag("beavers-crafting", "status");
      if (status === "created") {
        const img = document.createElement("img");
        img.src = CONSTANTS.IMAGES.IS_BEAVER_CRAFTED; //`/modules/${CONSTANTS.MODULE_ID}/assets/images/item-color-linking/cra.png`;
        img.style.border = "none";
        img.style.paddingRight = "5px";
        title.appendChild(img);
      }
      if (status === "updated") {
        const img = document.createElement("img");
        img.src = CONSTANTS.IMAGES.IS_BEAVER_CRAFTED; //`/modules/${CONSTANTS.MODULE_ID}/assets/images/item-color-linking/cra.png`;
        img.style.border = "none";
        img.style.paddingRight = "5px";
        title.appendChild(img);
      }
      // if (status === 'updated') title.appendChild($('<i class="fas fa-tools" style="padding-right:5px"></i>')[0]);
      // if (status === 'created') itemElement.classList.add('beavers-created');
      // if (status === 'updated') itemElement.classList.add('beavers-updated');
    }

    if (game.modules.get("item-linking")?.active) {
      const linked = item.getFlag("item-linking", "isLinked");
      if (!linked) {
        continue;
      }
      itemElement.classList.add("linked");
      fromUuid(item.getFlag("item-linking", "baseItem")).then((i) => {
        if (i === null) {
          itemElement.classList.add("broken-link");
        }
      });
    }
  }
}
