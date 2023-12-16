import { getItem, warn } from "./lib";

export class BeaverCraftingHelpers {
  static isItemBeaverCrafted(item) {
    // NOTE: is a boolean now
    const status = item.getFlag("beavers-crafting", "status");
    const isCrafted = item.getFlag("beavers-crafting", "isCrafted");
    // For retrocompatibility
    if (status === "created") {
      return true;
    }
    // For retrocompatibility
    if (status === "updated") {
      return true;
    }
    if (isCrafted) {
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
    const isCrafted = item.getFlag("beavers-crafting", "isCrafted");
    await item.unsetFlag("beavers-crafting", "status");
    if (!isCrafted) {
      await item.setFlag(`beavers-crafting`, `isCrafted`, true);
    }
  }

  static async unsetItemAsBeaverCrafted(itemOrItemUuid) {
    const item = getItem(itemOrItemUuid);
    if (!item) {
      warn(`Non sono riuscito a torvare l'item con riferimento ${itemOrItemUuid}`);
      return;
    }
    await item.unsetFlag("beavers-crafting", "status");
    await item.unsetFlag("beavers-crafting", "isCrafted");
  }
}
