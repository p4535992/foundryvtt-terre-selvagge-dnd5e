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
}
