import CONSTANTS from "../constants/constants";

export class CustomCharacterSheetSectionsHelpers {
  static async customSectionGetData(wrapped) {
    // Call wrapped function to get appData
    const data = await wrapped();

    // Loop for Feature-type items, Inventory items, and Spell-type items
    for (const type of ["features", "inventory", "spellbook"]) {
      const itemsSpells = type === "spellbook" ? "spells" : "items";

      // Create array containing all items of current type
      const items = data[type].reduce((acc, current) => {
        if (current.isclass) return acc;

        return acc.concat(current[itemsSpells]);
      }, []);

      // Get items flagged with a custom section
      const customSectionItems = items.filter((i) => i.flags["item-link-tree"]?.subType);
      // Create array of custom section names
      const customSections = [];
      for (const item of customSectionItems) {
        if (!customSections.includes(item.flags["item-link-tree"]?.subType))
          customSections.push(item.flags["item-link-tree"]?.subType);
      }

      // For items flagged with a custom section, remove them from their original section
      for (const section of data[type]) {
        section[itemsSpells] = section[itemsSpells].filter((i) => !customSectionItems.includes(i));
      }

      // Create new custom sections and add to parent array
      for (const customSection of customSections) {
        const newSection = {
          label: customSection,
          [itemsSpells]: customSectionItems.filter((i) => i.flags["item-link-tree"]?.subType === customSection),
        };
        if (type === "features") {
          newSection.hasActions = true;
          newSection.isClass = false;
          newSection.dataset = { type: "feat" };
        } else if (type === "inventory") {
        } else if (type === "spellbook") {
          //newSection.spells = customSectionItems.filter(i => i.flags["item-link-tree"]?.subType === customSection);
          newSection.canCreate = false;
          newSection.canPrepare = true;
          newSection.dataset = {
            "preparation.mode": "prepared",
            type: "spell",
          };
          newSection.usesSlots = false;
        }

        data[type].push(newSection);
      }
    }

    // Return updated data for sheet rendering
    return data;
  }

  static renderActorSheet5eCharacterHandler(app, html, appData) {
    // Remove "Add Item" buttons from custom sections on character sheet
    const addButtons = html.find(`a.item-create`);
    addButtons.each(function () {
      // Default dnd5e sheet
      const firstItemLi = $(this).closest(`li.items-header`).next(`ol.item-list`).find(`li.item`);
      const firstItem = app.object.items.get(firstItemLi?.data("itemId"));

      // Tidy5e sheet
      const prevItemLi = $(this).closest(`li.items-footer`).prev(`li.item`);
      const prevItem = app.object.items.get(prevItemLi?.data("itemId"));

      const item = firstItem || prevItem;
      const customSectionName = item?.getFlag("item-link-tree", "subType");
      if (!customSectionName) return;

      $(this).remove();
      return;
    });

    if (game.settings.get(CONSTANTS.MODULE_ID, "hideEmpty")) {
      const headers = html[0].querySelectorAll("li.items-header");
      for (const header of headers) {
        const ol = header.nextElementSibling;
        if (ol.tagName !== "OL" || ol.childElementCount) continue;

        header.remove();
      }
    }
  }
}
