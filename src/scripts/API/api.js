import CONSTANTS from "../constants/constants.js";
import { error } from "../lib/lib.js";
import { retrieveAndApplyBonuses } from "../retrieve-and-apply-babonus.js";

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
};

export default API;
