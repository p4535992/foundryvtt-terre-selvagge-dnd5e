export class ItemLinkTreeHelpers {
  static getCollection(item) {
    return game.modules.get("item-link-tree").api.getCollection({
      item: item,
    });
  }

  static getCollectionEffectAndBonus(item) {
    const leafs = ItemLinkTreeHelpers.getCollection(item);
    const leafsFilter = leafs.filter((leaf) => {
      return leaf.customLink === "bonus" || leaf.customLink === "effect" || leaf.customLink === "effectAndBonus";
    });
    return leafsFilter;
  }

  static isItemLeaf(itemToCheck) {
    const isLeaf = itemToCheck.getFlag("item-link-tree", "isLeaf");
    if (isLeaf) {
      return true;
    }
    return false;
  }

  static isFilterByItemTypeOk(itemToCheck, itemType) {
    const filterItemType = itemToCheck.getFlag("item-link-tree", "filterItemType");
    if (filterItemType && itemType) {
      const filterItemTypeArr = filterItemType.split(",") ?? [];
      if (filterItemTypeArr.length > 0 && filterItemTypeArr.includes(itemType)) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }
}
