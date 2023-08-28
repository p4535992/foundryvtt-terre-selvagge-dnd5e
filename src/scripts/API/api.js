import CONSTANTS from "../constants/constants.js";
import { BabonusHelpers } from "../lib/babonus-helpers.js";
import { error } from "../lib/lib.js";
import { retrieveAndApplyBonuses } from "../old/retrieve-and-apply-babonus.js";
import { retrieveSuperiorItemAndReplaceOnActor } from "../old/retrieve-superior-bymagus.js";

const API = {
  // TODO
  retrieveAndApplyBonuses(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }

    retrieveAndApplyBonuses(
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
  retrieveSuperiorItemAndReplaceOnActor(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }

    retrieveSuperiorItemAndReplaceOnActor(
      inAttributes.item, // gem
      inAttributes.type,
      inAttributes.target_bonus,
      inAttributes.name,
      inAttributes.image,
      inAttributes.prefix,
      inAttributes.suffix
    );
  },

  deleteAllBonusFromItem(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }
    return BabonusHelpers.deleteAllBonusFromItem(inAttributes.item);
  },
};

export default API;
