import CONSTANTS from "./constants/constants";
import { BeaverCraftingHelpers } from "./lib/beavers-crafting-helpers";
import { ItemLinkingHelpers } from "./lib/item-linking-helper";

export function setItemLinkingColor(actorSheet, html, data) {
  if (!actorSheet) {
    return;
  }
  const actor = actorSheet.object;
  // Check if this is a 5E actor sheet
  // Non ve n e' più bisogno l'hook adesso e' renderActorSheet5e
  // if (actor.constructor.name !== "CompactBeyond5eSheet") return;

  let items = [];
  const isTidySheetKgar = actorSheet.id.startsWith("Tidy5eCharacterSheet");
  if (isTidySheetKgar) {
    return;
  }
  //   items = html.find($(".item-table .item-table-row"));
  // } else {
  items = html.find($(".item-list .item"));
  // }

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
    let source = item.system?.source?.custom?.toLowerCase();
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
      let title = null;
      if (isTidySheetKgar) {
        title = itemElement.querySelector(".item-name");
      } else {
        title = itemElement.querySelector("h4");
      }
      if (BeaverCraftingHelpers.isItemBeaverCrafted(item)) {
        const img = document.createElement("img");
        img.src = CONSTANTS.IMAGES.IS_BEAVER_CRAFTED; //`/modules/${CONSTANTS.MODULE_ID}/assets/images/item-color-linking/cra.png`;
        img.style.border = "none";
        img.style.paddingRight = "5px";
        title.appendChild(img);
      }
    }

    if (game.modules.get("item-linking")?.active) {
      const linked = item.getFlag("item-linking", "isLinked");
      if (!linked) {
        continue;
      }
      let title = null;
      if (isTidySheetKgar) {
        title = itemElement.querySelector(".item-name");
      } else {
        title = itemElement.querySelector("h4");
      }

      if (ItemLinkingHelpers.isItemLinked(item)) {
        //itemElement.classList.add("linked");
        const img = document.createElement("img");
        img.src = `/modules/${CONSTANTS.MODULE_ID}/assets/images/item-color-linking/TS.png`;
        img.style.border = "none";
        img.style.paddingRight = "5px";
        title.appendChild(img);
      } else {
        // itemElement.classList.add("broken-link");
        const img = document.createElement("img");
        img.src = `/modules/${CONSTANTS.MODULE_ID}/assets/images/item-color-linking/TS2.png`;
        img.style.border = "none";
        img.style.paddingRight = "5px";
        title.appendChild(img);
      }
    }
  }
}
