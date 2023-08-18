import CONSTANTS from "../constants/constants.js";
import { retrieveAndApplyBonuses } from "../retrieve-and-apply-babonus.js";

const API = {
  // TODO
  retrieveAndApplyBonuses(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error("calculateWeightOnActorFromIdArr | inAttributes must be of type array");
    }
    const [uuidOrItem] = inAttributes;
    retrieveAndApplyBonuses(uuidOrItem);
  },
};

export default API;
