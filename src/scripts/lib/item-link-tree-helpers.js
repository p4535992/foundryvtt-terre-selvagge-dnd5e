export class ItemLinkTreeHelpers {
  static getCollection(item) {
    return game.modules.get("item-link-tree").api.getCollection({
      item: item,
    });
  }

  static getCollectionEffectAndBonus(item) {
    return game.modules.get("item-link-tree").api.getCollectionEffectAndBonus({
      item: item,
    });
  }

  static isItemLeaf(itemToCheck) {
    return game.modules.get("item-link-tree").api.isItemLeaf(itemToCheck);
  }

  static isFilterByItemTypeOk(itemToCheck, itemType) {
    return game.modules.get("item-link-tree").api.isFilterByItemTypeOk(itemToCheck, itemType);
  }

  static getCollectionBySubType(itemToCheck, types) {
    return game.modules.get("item-link-tree").api.getCollectionBySubType({
      item: itemToCheck,
      types: types,
    });
  }

  static isItemLeafBySubType(itemToCheck, subTypeToCheck) {
    return game.modules.get("item-link-tree").api.isItemLeafBySubType(itemToCheck, subTypeToCheck);
  }

  static async upgradeItem(item, leaf) {
    return await game.modules.get("item-link-tree").api.upgradeItem(item, leaf);
  }
}
