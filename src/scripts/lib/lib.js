import CONSTANTS from "../constants/constants.js";
import SETTINGS from "../constants/settings.js";
import { ItemLinkTreeHelpers } from "./item-link-tree-helpers.js";

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, ...args) {
  try {
    if (
      game.settings.get(CONSTANTS.MODULE_ID, "debug") ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean")
    ) {
      console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
    }
  } catch (e) {
    console.error(e.message);
  }
  return msg;
}

export function log(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function notify(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    ui.notifications?.notify(message);
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function info(info, notify = false, ...args) {
  try {
    info = `${CONSTANTS.MODULE_ID} | ${info}`;
    if (notify) {
      ui.notifications?.info(info);
    }
    console.log(info.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return info;
}

export function warn(warning, notify = false, ...args) {
  try {
    warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
    if (notify) {
      ui.notifications?.warn(warning);
    }
    console.warn(warning.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return warning;
}

export function error(error, notify = true, ...args) {
  try {
    error = `${CONSTANTS.MODULE_ID} | ${error}`;
    if (notify) {
      ui.notifications?.error(error);
    }
    console.error(error.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message) {
  warn(Date.now(), message);
}

export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
}

// ===============================================================================

export const SUPPORTED_SHEET = [
  {
    id: "CHARACTER_DEFAULT",
    name: "",
    template: "systems/dnd5e/templates/actors/character-sheet.html",
    templateId: "dnd5e/templates/actors/character-sheet",
    moduleId: "",
  },
  {
    id: "CHARACTER_5E_SHEET",
    name: "",
    template: "systems/dnd5e/templates/actors/character-sheet.html",
    templateId: "dnd5e/templates/actors/character-sheet",
    moduleId: "",
  },
  {
    id: "DNDBEYOND_CHARACTER_SHEET",
    name: "dnd5e.DNDBeyondCharacterSheet5e",
    template: "modules/dndbeyond-character-sheet/template/dndbeyond-character-sheet.html",
    templateId: "dndbeyond-character-sheet",
    moduleId: "dndbeyond-character-sheet",
  },
  {
    id: "COMPACT_BEYOND_5E_SHEET",
    name: "dnd5e.CompactBeyond5eSheet",
    template: "modules/compact-beyond-5e-sheet/templates/character-sheet.hbs",
    templateId: "compact-beyond-5e-sheet",
    moduleId: "compact-beyond-5e-sheet",
  },
  {
    id: "TIDY_SHEET",
    name: "dnd5e.Tidy5eSheet",
    template: "modules/tidy5e-sheet/templates/actors/tidy5e-sheet.html",
    templateId: "tidy5e-sheet",
    moduleId: "tidy5e-sheet",
  },
  {
    id: "OBSIDIAN",
    name: "dnd5e.ObsidianCharacter",
    template: "modules/obsidian/html/obsidian.html",
    templateId: "obsidian",
    moduleId: "obsidian",
  },
];

/**
 * Evaluates the given formula with the given actors data. Uses FoundryVTT's Roll
 * to make this evaluation.
 * @param {string|number} formula The rollable formula to evaluate.
 * @param {object} actor The actor used for variables.
 * @return {number} The result of the formula.
 */
export function rollFormulaWithActorSync(formula, actor) {
  let dataObject = actor.getRollData();
  dataObject.flags = actor.flags;
  const r = new Roll(formula.toString(), dataObject);
  r.evaluate({ async: false });
  return r.total;
}

/**
 * Evaluates the given formula with the given actors data. Uses FoundryVTT's Roll
 * to make this evaluation.
 * @param {string|number} formula The rollable formula to evaluate.
 * @param {object} actor The actor used for variables.
 * @return {number} The result of the formula.
 */
export async function rollFormulaWithActorASync(formula, actor) {
  let dataObject = actor.getRollData();
  dataObject.flags = actor.flags;
  const r = new Roll(formula.toString(), dataObject);
  await r.evaluate({ async: true });
  return r.total;
}

export function getDocument(target) {
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  }
  return target?.document ?? target;
}

export function stringIsUuid(inId) {
  return typeof inId === "string" && (inId.match(/\./g) || []).length && !inId.endsWith(".");
}

export function getUuid(target) {
  if (stringIsUuid(target)) {
    return target;
  }
  const document = getDocument(target);
  return document?.uuid ?? false;
}

export function getItemSync(target, ignoreError = false, ignoreName = true) {
  if (!target) {
    throw error(`Item is undefined`, true, target);
  }
  if (target instanceof Item) {
    return target;
  }
  // This is just a patch for compatibility with others modules
  if (target.document) {
    target = target.document;
  }
  if (target.uuid) {
    target = target.uuid;
  }

  if (target instanceof Item) {
    return target;
  }
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  } else {
    target = game.items.get(target);
    if (!target && !ignoreName) {
      target = game.items.getName(target);
    }
  }
  if (!target) {
    if (ignoreError) {
      warn(`Item is not found`, false, target);
      return;
    } else {
      throw error(`Item is not found`, true, target);
    }
  }
  // Type checking
  if (!(target instanceof Item)) {
    if (ignoreError) {
      warn(`Invalid Item`, true, target);
      return;
    } else {
      throw error(`Invalid Item`, true, target);
    }
  }
  return target;
}

export async function getItemAsync(target, ignoreError = false, ignoreName = true) {
  if (!target) {
    throw error(`Item is undefined`, true, target);
  }
  if (target instanceof Item) {
    return target;
  }
  // This is just a patch for compatibility with others modules
  if (target.document) {
    target = target.document;
  }
  if (target.uuid) {
    target = target.uuid;
  }

  if (target instanceof Item) {
    return target;
  }
  if (stringIsUuid(target)) {
    target = await fromUuid(target);
  } else {
    target = game.items.get(target);
    if (!target && !ignoreName) {
      target = game.items.getName(target);
    }
  }
  if (!target) {
    if (ignoreError) {
      warn(`Item is not found`, false, target);
      return;
    } else {
      throw error(`Item is not found`, true, target);
    }
  }
  // Type checking
  if (!(target instanceof Item)) {
    if (ignoreError) {
      warn(`Invalid Item`, true, target);
      return;
    } else {
      throw error(`Invalid Item`, true, target);
    }
  }
  return target;
}

export function is_real_number(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}

export function isEmptyObject(obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  if (obj === null || obj === undefined) {
    return true;
  }
  const result =
    obj && // null and undefined check
    Object.keys(obj).length === 0; // || Object.getPrototypeOf(obj) === Object.prototype);
  return result;
}

const signCase = {
  add: "+",
  subtract: "-",
  equals: "=",
  default: " ",
};

export function is_lazy_number(inNumber) {
  if (!inNumber) {
    return false;
  }
  const isSign =
    String(inNumber).startsWith(signCase.add) ||
    String(inNumber).startsWith(signCase.subtract) ||
    String(inNumber).startsWith(signCase.equals) ||
    String(inNumber).startsWith(signCase.default);
  if (isSign) {
    const withoutFirst = String(inNumber).slice(1);
    try {
      return is_real_number(parseInt(withoutFirst));
    } catch (e) {
      error(e);
      return false;
    }
  } else {
    return true;
  }
}

export function isLessThanOneIsOne(inNumber) {
  return inNumber < 1 ? 1 : inNumber;
}

export function manageNewName(itemCurrentName, itemNewName, itemNewPrefix, itemNewSuffix) {
  let currentName = itemCurrentName;
  if (itemNewName) {
    currentName = itemNewName;
  }
  if (itemNewPrefix) {
    if (!currentName.startsWith(itemNewPrefix)) {
      currentName = itemNewPrefix + currentName;
    }
  }
  if (itemNewSuffix) {
    if (!currentName.endsWith(itemNewSuffix)) {
      currentName = currentName + itemNewSuffix;
    }
  }
  return currentName;
}
