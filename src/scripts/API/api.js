import CONSTANTS from "../constants/constants.js";
import { BabonusHelpers } from "../lib/babonus-helpers.js";
import { BeaverCraftingHelpers } from "../lib/beavers-crafting-helpers.js";
import { HarvesterHelpers } from "../lib/harvester-helpers.js";
import { error } from "../lib/lib.js";
import { ScrollHelpers } from "../lib/scroll-helpers.js";
import { retrieveAndApplyBonuses } from "../old/retrieve-and-apply-babonus.js";
import { retrieveSuperiorItemAndReplaceOnActor } from "../old/retrieve-superior-bymagus.js";

const API = {
  // TODO
  async retrieveAndApplyBonuses(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }

    return retrieveAndApplyBonuses(
      inAttributes.item,
      inAttributes.type,
      inAttributes.name,
      inAttributes.image,
      inAttributes.prefix,
      inAttributes.suffix
    );
  },

  // actor: Actor
  // gem: Item
  // type: 'armor' | 'weapon'
  // target_bonus: number e.g. 3
  async retrieveSuperiorItemAndReplaceOnActor(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }

    return retrieveSuperiorItemAndReplaceOnActor(
      inAttributes.item, // gem
      inAttributes.type,
      inAttributes.target_bonus,
      inAttributes.name,
      inAttributes.image,
      inAttributes.prefix,
      inAttributes.suffix
    );
  },

  async deleteAllBonusFromItem(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }
    return await BabonusHelpers.deleteAllBonusFromItem(inAttributes.item);
  },

  async setItemAsBeaverCrafted(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("setItemAsBeaverCrafted | inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("setItemAsBeaverCrafted | inAttributes must be of type object");
    }
    return await BeaverCraftingHelpers.setItemAsBeaverCrafted(inAttributes.item);
  },

  async unsetItemAsBeaverCrafted(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("setItemAsBeaverCrafted | inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("setItemAsBeaverCrafted | inAttributes must be of type object");
    }
    return await BeaverCraftingHelpers.unsetItemAsBeaverCrafted(inAttributes.item);
  },

  async createScroll(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("createScroll | inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("createScroll | inAttributes must be of type object");
    }
    return await ScrollHelpers.createScroll(inAttributes.item);
  },

  async createScrollWithParams(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("createScrollWithParams | inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("createScrollWithParams | inAttributes must be of type object");
    }
    return await ScrollHelpers.createScrollWithParams(
      inAttributes.item,
      inAttributes.spellComponents,
      inAttributes.feats,
      inAttributes.label,
      inAttributes.timeToken
    );
  },

  async updateHarvesterQuantityByRegEx(packToExportKey) {
    return await HarvesterHelpers.updateHarvesterQuantityByRegEx(packToExportKey);
  },
};

export default API;
