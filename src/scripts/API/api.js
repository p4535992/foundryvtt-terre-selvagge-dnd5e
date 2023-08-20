import CONSTANTS from "../constants/constants.js";
import { error } from "../lib/lib.js";
import { clearBabonusFromItem, retrieveAndApplyBonuses } from "../retrieve-and-apply-babonus.js";
import { retrieveSuperiorItemAndReplaceOnActor } from "../retrieve-superior-bymagus.js";

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
      inAttributes.actor,
      inAttributes.gem,
      inAttributes.type,
      inAttributes.target_bonus
    );
  },

  clearBabonusFromItem(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inAttributes !== "object") {
      throw error("retrieveAndApplyBonuses | inAttributes must be of type object");
    }
    return clearBabonusFromItem(inAttributes.item);
  },
};

export default API;
