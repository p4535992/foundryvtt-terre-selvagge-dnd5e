import CONSTANTS from "../constants/constants.js";
import SETTINGS from "../constants/settings.js";

// =================================
// Logger Utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_ID, SETTINGS.debug)) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_ID} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace("<br>", "\n"));
  return info;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_ID} | ${error}`;
  if (notify) ui.notifications?.error(error);
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

// export const setDebugLevel = (debugText: string): void => {
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

export function getItem(target) {
  if (stringIsUuid(target)) {
    target = fromUuidSync(target);
  }
  return target;
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



export function manageNewName(itemCurrentName, itemNewName, itemNewPrefix ,itemNewSuffix) {
    let currentName = itemCurrentName;
    if (itemNewName) {
      currentName = itemNewName;
    }
    if (itemNewPrefix) {
        if(!currentName.startsWith(itemNewPrefix)) {
            currentName = itemNewPrefix + currentName;
        }
    }
    if (itemNewSuffix) {
        if(!currentName.endsWith(itemNewSuffix)) {
            currentName = currentName + itemNewSuffix;
        }
    }
    return currentName;
}
