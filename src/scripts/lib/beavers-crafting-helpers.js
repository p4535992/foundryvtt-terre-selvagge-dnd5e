import { getItem, warn } from "./lib";

export class BeaverCraftingHelpers {
  static isItemBeaverCrafted(item) {
    const status = item.getFlag("beavers-crafting", "status");
    if (status === "created") {
      return true;
    }
    if (status === "updated") {
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
    const status = item.getFlag("beavers-crafting", "status");
    if (!status) {
      await item.setFlag(`beavers-crafting`, `status`, "created");
    } else {
      await item.setFlag(`beavers-crafting`, `status`, "updated");
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
