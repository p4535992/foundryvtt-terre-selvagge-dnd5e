import { getItemAsync, getItemSync } from "./lib.js";

export class BabonusHelpers {
  static retrieveBonusesFromItem(baseItem) {
    // returns a Collection of bonuses on the object.
    let bonusesInitial = game.modules.get("babonus").api.getCollection(baseItem);
    return bonusesInitial;
  }

  static retrieveBonusFromCollection(collection, id) {
    // returns a Collection of bonuses on the object.
    let bonusesInitial = collection.get(id);
    return bonusesInitial;
  }

  static async applyBonusToItem(item, bonus) {
    // returns a Collection of bonuses on the object.
    const itemWithBonus = await game.modules.get("babonus").api.embedBabonus(item, bonus, true);
    return itemWithBonus;
  }

  static async deleteAllBonusFromItem(itemToCheck) {
    itemToCheck = await getItemAsync(itemToCheck);
    const collection = retrieveBonusesFromItem(itemToCheck);
    for (const bonus of collection) {
      await game.modules.get("babonus").api.deleteBonus(itemToCheck, bonus.id);
    }
  }
}
