import { ItemLinkTreeHelpers } from "./item-link-tree-helpers";

export class LockersHelpers {
  static lockActorSheetQuantity(app, html, data) {
    if (!game.user.isGM) {
      for (const elem of html.find("input[name^='system.quantity']")) {
        elem.setAttribute("readonly", true);
      }
      for (const elem of html.find("input[data-name^='system.quantity']")) {
        elem.setAttribute("readonly", true);
      }
    }
  }

  static lockActorSheetEquipped(app, html, data) {
    if (!game.user.isGM) {
      const actorEntityTmp = data && data.type ? data : data.actor;

      const inventoryItems = [];
      const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
      actorEntityTmp.items.contents.forEach((im) => {
        if (im && physicalItems.includes(im.type)) {
          inventoryItems.push(im);
        }
      });

      const listItem = html.find("li.item .item-toggle");
      for (const liItemB of listItem) {
        const liItem = $(liItemB);
        const itemHTML = liItem?.parent()?.parent();
        if (itemHTML) {
          const itemId = itemHTML.attr("data-item-id");
          const itemName = itemHTML.find(".item-name h4").html().replace(/\n/g, "").trim();
          const item = inventoryItems.find((im) => {
            return im.id === itemId || im.name === itemName;
          });
          if (item) {
            const isLeaf = ItemLinkTreeHelpers.isItemLeaf(item);
            if (isLeaf) {
              itemHTML.find(".item-toggle")?.hide();
            }
          }
        }
      }
    }
  }

  static lockItemSheetQuantity(app, html, data) {
    if (!game.user.isGM) {
      for (const elem of html.find("input[name^='system.quantity']")) {
        elem.setAttribute("readonly", true);
      }
      for (const elem of html.find("input[data-name^='system.quantity']")) {
        elem.setAttribute("readonly", true);
      }
    }
  }

  static lockItemSheetWeight(app, html, data) {
    if (!game.user.isGM) {
      for (const elem of html.find("input[name^='system.weight']")) {
        elem.setAttribute("readonly", true);
      }
      for (const elem of html.find("input[data-name^='system.weight']")) {
        elem.setAttribute("readonly", true);
      }
    }
  }

  static lockItemSheetPrice(app, html, data) {
    if (!game.user.isGM) {
      for (const elem of html.find("input[name^='system.price.value']")) {
        elem.setAttribute("readonly", true);
      }
      for (const elem of html.find("input[data-name^='system.price.value']")) {
        elem.setAttribute("readonly", true);
      }
      for (const elem of html.find("select[name^='system.price.denomination']")) {
        elem.setAttribute("disabled", true);
      }
      for (const elem of html.find("select[data-name^='system.price.denomination']")) {
        elem.setAttribute("disabled", true);
      }
    }
  }

  // static lockItemSheetDescription(app, html, data) {
  //     if(!game.user.isGM) {
  //         for (const elem of html.find("input[name^='system.price.value']")) {
  //             elem.setAttribute("readonly", true);
  //         }
  //         for (const elem of html.find("select[name^='system.price.denomination']")) {
  //             elem.setAttribute("disabled", true);
  //         }
  //     }
  // }

  static lockItemSheetEquippedForLeaf(app, html, data) {
    if (!game.user.isGM) {
      const isLeaf = ItemLinkTreeHelpers.isItemLeaf(app.object);
      if (isLeaf) {
        for (const elem of html.find("select[name^='system.equipped']")) {
          elem.setAttribute("disabled", true);
        }
        for (const elem of html.find("select[data-name^='system.equipped']")) {
          elem.setAttribute("disabled", true);
        }
      }
    }
  }
}
