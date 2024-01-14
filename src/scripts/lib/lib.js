import CONSTANTS from "../constants/constants.js";
import SETTINGS from "../constants/settings.js";
import { ItemLinkTreeHelpers } from "./item-link-tree-helpers.js";
import Logger from "./Logger.js";
import { RetrieveHelpers } from "./retrieve-helpers.js";

// ================================
// Logger utility
// ================================

export function debug(msg, ...args) {
  return Logger.debug(msg, args);
}

export function log(message, ...args) {
  return Logger.log(message, args);
}

export function notify(message, ...args) {
  return Logger.notify(message, args);
}

export function info(info, notify = false, ...args) {
  return Logger.info(info, notify, args);
}

export function warn(warning, notify = false, ...args) {
  return Logger.warn(warning, notify, args);
}

export function error(error, notify = true, ...args) {
  return Logger.error(error, notify, args);
}

export function timelog(message) {
  return Logger.timelog(message);
}

export const i18n = (key) => {
  return Logger.i18n(key);
};

export const i18nFormat = (key, data = {}) => {
  return Logger.i18nFormat(key, data);
};

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return Logger.dialogWarning(message, icon);
}

// ================================================================================

export function getDocument(target) {
  return RetrieveHelpers.getDocument(target);
}

export function stringIsUuid(inId) {
  return RetrieveHelpers.stringIsUuid(inId);
}

export function getUuid(target) {
  return RetrieveHelpers.getUuid(target);
}

export function getCompendiumCollectionSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getCompendiumCollectionSync(target, ignoreError, ignoreName);
}

export async function getCompendiumCollectionAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getCompendiumCollectionAsync(target, ignoreError, ignoreName);
}

export function getUserSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getUserSync(target, ignoreError, ignoreName);
}

export function getActorSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getActorSync(target, ignoreError, ignoreName);
}

export async function getActorAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getActorAsync(target, ignoreError, ignoreName);
}

export function getJournalSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getJournalSync(target, ignoreError, ignoreName);
}

export async function getJournalAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getJournalAsync(target, ignoreError, ignoreName);
}

export function getMacroSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getMacroSync(target, ignoreError, ignoreName);
}

export async function getMacroAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getMacroAsync(target, ignoreError, ignoreName);
}

export function getSceneSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getSceneSync(target, ignoreError, ignoreName);
}

export async function getSceneAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getSceneAsync(target, ignoreError, ignoreName);
}

export function getItemSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getItemSync(target, ignoreError, ignoreName);
}

export async function getItemAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getItemAsync(target, ignoreError, ignoreName);
}

export function getPlaylistSoundPathSync(target, ignoreError = false, ignoreName = true) {
  return RetrieveHelpers.getPlaylistSoundPathSync(target, ignoreError, ignoreName);
}

export async function getPlaylistSoundPathAsync(target, ignoreError = false, ignoreName = true) {
  return await RetrieveHelpers.getPlaylistSoundPathAsync(target, ignoreError, ignoreName);
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
