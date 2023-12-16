import { getItem, warn } from "./lib";

export class BeaverCraftingHelpers {
  static isItemBeaverCrafted(item) {
    // NOTE: is a boolean now
    const status = item.getFlag("beavers-crafting", "status");
    // For retrocompatibility
    if (status === "created") {
      return true;
    }
    // For retrocompatibility
    if (status === "updated") {
      return true;
    }
    if (status) {
      return true;
    }
    return false;
  }

  static async setItemAsBeaverCrafted(itemOrItemUuid) {
    const item = getItem(itemOrItemUuid);
    if (!item) {
      warn(`Non sono riuscito a torvare l'item con riferimento ${itemOrItemUuid}`);
      return;
    }
    // NOTE: is a boolean now
    const status = item.getFlag("beavers-crafting", "status");
    if (!status) {
      await item.setFlag(`beavers-crafting`, `status`, true);
    }
  }

  static async unsetItemAsBeaverCrafted(itemOrItemUuid) {
    const item = getItem(itemOrItemUuid);
    if (!item) {
      warn(`Non sono riuscito a torvare l'item con riferimento ${itemOrItemUuid}`);
      return;
    }
    await item.unsetFlag("beavers-crafting", "status");
  }
}
