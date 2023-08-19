import CONSTANTS from "../constants/constants.js";
import { retrieveAndApplyBonuses } from "../retrieve-and-apply-babonus.js";

const API = {
  // TODO
  retrieveAndApplyBonuses(inAttributes) {
    // if (!Array.isArray(inAttributes)) {
    //   throw error("retrieveAndApplyBonuses| inAttributes must be of type array");
    // }
    // const [uuidOrItem] = inAttributes;
    if (typeof inDefaults !== "object") {
      throw error("retrieveAndApplyBonuses | inDefaults must be of type object");
    }

    retrieveAndApplyBonuses(inDefaults.item, inDefaults.type, inDefaults.name, inDefaults.image, inDefaults.suffix);
  },
};

export default API;
