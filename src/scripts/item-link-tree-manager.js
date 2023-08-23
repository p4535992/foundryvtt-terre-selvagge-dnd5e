import CONSTANTS from "./constants/constants";
import { ItemLinkTreeHelpers } from "./lib/item-link-tree-helpers";
import { checkIfYouCanAddMoreGemsToItem, log, warn } from "./lib/lib";

export class ItemLinkTreeManager {

    static async managePreAddLeafToItem(item, itemAdded) {
        return checkIfYouCanAddMoreGemsToItem(item);
    }

      static async managePreRemoveLeafFromItem(item, itemRemoved) {
       // NOTHING FOR NOW
      }

  static async managePostAddLeafToItem(item, itemAdded) {
    const customType = getProperty(itemAdded, `flags.item-link-tree.customType`) ?? "";
    // const prefix = getProperty(itemAdded, `flags.item-link-tree.prefix`) ?? "";
    // const suffix = getProperty(itemAdded, `flags.item-link-tree.suffix`) ?? "";

    if (customType === "bonus" || customType === "effectAndBonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToAdd = game.modules.get("babonus").api.getCollection(itemAdded) ?? [];
      if(bonusesToAdd.length > 0) {
        for (const bonusToAdd of bonusesToAdd) {
            let foundedBonus = false;
            for (const bonus of bonuses) {
            if (bonus.name === bonusToAdd.name) {
                foundedBonus = true;
                break;
            }
            }
            if (!foundedBonus) {
                log(`Aggiunto bonus '${bonusToAdd.name}'`, true);
                await game.modules.get("babonus").api.embedBabonus(item, bonusToAdd);
            }
        }
      }
    }
    if (customType === "effect" || customType === "effectAndBonus") {

    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item);

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_DIAMOND, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_DIAMOND.repeat(leafs.length);

    let currentPrice = getProperty(item, `system.price.value`) ?? 0;
    let priceValueToAdd = getProperty(itemAdded, `system.price.value`) ?? 0;
    currentPrice = currentPrice + priceValueToAdd;

    await item.update({
        "name": currentName,
        "system.price.value": currentPrice
    });
  }

  static async managePostRemoveLeafFromItem(item, itemRemoved) {
    const customType = getProperty(itemRemoved, `flags.item-link-tree.customType`) ?? "";
    // const prefix = getProperty(itemRemoved, `flags.item-link-tree.prefix`) ?? "";
    // const suffix = getProperty(itemRemoved, `flags.item-link-tree.suffix`) ?? "";

    if (customType === "bonus" || customType === "effectAndBonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToRemove = game.modules.get("babonus").api.getCollection(itemRemoved) ?? [];
      if(bonusesToRemove.length >  0) {
        for (const bonusToRemove of bonusesToRemove) {
            for (const bonus of bonuses) {
                if (bonus.name === bonusToRemove.name) {
                    log(`Rimosso bonus '${bonus.name}'`, true);
                    await game.modules.get("babonus").api.deleteBonus(item, bonus.id);
                }
            }
        }
      }
    }
    if (customType === "effect" || customType === "effectAndBonus") {

    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item);

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_DIAMOND, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_DIAMOND.repeat(leafs.length);

    let currentPrice = getProperty(item, `system.price.value`) ?? 0;
    let priceValueToRemove = getProperty(itemRemoved, `system.price.value`) ?? 0;
    currentPrice = currentPrice - priceValueToRemove;

    await item.update({
        "name": currentName,
        "system.price.value": currentPrice
    });
  }
}
