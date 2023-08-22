import { log, warn } from "./lib/lib";

export class ItemLinkTreeManager {
  static async manageAddLeafToItem(item, itemAdded) {
    const customType = getProperty(itemAdded, `flags.item-link-tree.customType`) ?? "";
    const prefix = getProperty(itemAdded, `flags.item-link-tree.prefix`) ?? "";
    const suffix = getProperty(itemAdded, `flags.item-link-tree.suffix`) ?? "";
    if (customType === "bonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToAdd = game.modules.get("babonus").api.getCollection(itemAdded) ?? [];

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
          await game.modules.get("babonus").api.embedBabonus(item, bonusToAdd, true); // Keepid
        }
      }
    } else {
      warn(`The use case with customType=${customType} must be manage yet`);
    }
  }

  static async manageRemoveLeafFromItem(item, itemRemoved) {
    const customType = getProperty(itemRemoved, `flags.item-link-tree.customType`) ?? "";
    const prefix = getProperty(itemRemoved, `flags.item-link-tree.prefix`) ?? "";
    const suffix = getProperty(itemRemoved, `flags.item-link-tree.suffix`) ?? "";
    if (customType === "bonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToRemove = game.modules.get("babonus").api.getCollection(itemRemoved) ?? [];

      for (const bonusToRemove of bonusesToRemove) {
        for (const bonus of bonuses) {
          if (bonus.name === bonusToRemove.name) {
            log(`Rimosso bonus '${bonus.name}'`, true);
            await game.modules.get("babonus").api.deleteBonus(item, bonus.id);
          }
        }
      }
    } else {
      warn(`The use case with customType=${customType} must be manage yet`);
    }
  }
}
