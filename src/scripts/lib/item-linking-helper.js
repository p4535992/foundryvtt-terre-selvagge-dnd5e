import { warn } from "./lib";

export class ItemLinkingHelpers {
    static isItemLinked(itemToCheck) {
        const isLinked = itemToCheck.getFlag("item-linking", "baseItem");
        if (isLinked) {
          return true;
        }
        return false;
      }

    static retrieveLinkedItem(itemToCheck) {
          if(!ItemLinkingHelpers.isItemLinked(itemToCheck)) {
              warn(`The item ${itemToCheck.name}|${itemToCheck.uuid} is not linked`);
              return;
          }
          const baseItemUuid = i.getFlag("item-linking", "baseItem");
          if (!baseItemUuid) {
            warn(`No baseItemUuid is been found for ${itemToCheck.name}|${itemToCheck.uuid}`);
            return;
          }
          const baseItem = fromUuidSync(baseItemUuid);
          if (!baseItem) {
            warn(`No baseItem is been found for ${itemToCheck.name}|${itemToCheck.uuid}`);
            return;
          }
          return baseItem;
      }
}
