export class ItemTagsHelpers {
  static isItemTagsModuleActive() {
    return game.modules.get("item-tags")?.active;
  }
}
