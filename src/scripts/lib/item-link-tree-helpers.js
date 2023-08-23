
export class ItemLinkTreeHelpers {

    static getCollection(item) {
        return game.modules.get("item-link-tree").api.getCollection(item);
    }

    static getCollectionEffectAndBonus(item) {
        const leafs = ItemLinkTreeHelpers.getCollection(item);
        const leafsFilter = leafs.filter((leaf) => {
            return (leaf.customLink === "bonus" || leaf.customLink === "effect" || leaf.customLink === "effectAndBonus");
        });
        return leafsFilter;
    }
}
