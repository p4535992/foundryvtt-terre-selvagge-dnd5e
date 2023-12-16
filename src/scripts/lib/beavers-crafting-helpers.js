import { getItemSync, warn } from "./lib";

export class BeaverCraftingHelpers {
  static isBeaverCraftingModuleActive() {
    return game.modules.get("beavers-crafting")?.active;
  }

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
    // For retrocompatibility
    if (String(status) === "true") {
      return true;
    }
    if (isCrafted) {
      return true;
    }
    return false;
  }

  static async setItemAsBeaverCrafted(itemOrItemUuid) {
    const item = getItemSync(itemOrItemUuid);
    if (!item) {
      warn(`I could not find the item with reference ${itemOrItemUuid}`);
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
    const item = getItemSync(itemOrItemUuid);
    if (!item) {
      warn(`I could not find the item with reference ${itemOrItemUuid}`);
      return;
    }
    const status = item.getFlag("beavers-crafting", "status");
    if (status) {
      await item.unsetFlag("beavers-crafting", "status");
    }
    await item.unsetFlag("beavers-crafting", "isCrafted");
  }
}
