import { setApi } from "../module.js";
import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
import { Corruzione } from "./corruzione.js";
import { applyCustomRuleForCraftingItemsWithoutProficiency, setPriceToZeroIfObjectIsNotCreatedByGM } from "./custom.js";
import { setItemLinkingColor } from "./item-color-linking.js";
import { patchDAECreateActiveEffect, patchDAEDeleteActiveEffect, patchDAEUpdateActiveEffect } from "./patch-dae.js";
import { initHooksrRarityColors, readyHooksRarityColors, setupHooksRarityColors } from "./raritycolors.js";

export let invPlusActive = false;
export let itemContainerActive = false;
export let dfredsConvenientEffectsActive = false;
export let invMidiQol = false;
export let dfQualityLifeActive = false;
export let daeActive = false;
export let backPackManagerActive = false;
export let babonusActive = false;
export let itemLinkModuleActive = false;

export const initHooks = async () => {
  // Hooks.once("socketlib.ready", registerSocket);
  // registerSocket();
  initHooksrRarityColors();

  invPlusActive = game.modules.get(CONSTANTS.INVENTORY_PLUS_MODULE_NAME)?.active;
  invMidiQol = game.modules.get(CONSTANTS.MIDI_QOL_MODULE_NAME)?.active;
  itemContainerActive = game.modules.get(CONSTANTS.ITEM_COLLECTION_MODULE_NAME)?.active;
  dfredsConvenientEffectsActive = game.modules.get(CONSTANTS.DFREDS_CONVENIENT_EFFECTS_MODULE_NAME)?.active;
  dfQualityLifeActive = game.modules.get(CONSTANTS.DF_QUALITY_OF_LIFE_MODULE_NAME)?.active;
  daeActive = game.modules.get(CONSTANTS.DAE_MODULE_NAME)?.active;
  backPackManagerActive = game.modules.get(CONSTANTS.BACKPACK_MANAGER_MODULE_NAME)?.active;
  babonusActive = game.modules.get(CONSTANTS.BABONUS_MODULE_NAME)?.active;
  itemLinkModuleActive = game.modules.get("item-linking")?.active;
};

export const setupHooks = async () => {
  setupHooksRarityColors();
  setApi(API);
};

export const readyHooks = () => {
  readyHooksRarityColors();
  //// Hooks.on("updateActor", (actor, updates, data) => {
  ////   Corruzione.calculateCorruzione(actor, updates, data);
  //// });

  Hooks.on("renderActorSheet5e", (app, html, data) => {
    Corruzione.managePrimaryResourceCorruzione(app, html, data);
    setItemLinkingColor(app, html, data);
  });

  Hooks.on("preCreateItem", (doc, createData, options, user) => {
    // setPriceToZeroIfObjectIsNotPreCreatedByGM(doc, createData, options, user);
  });

  Hooks.on("createItem", (item, updates, isDifferent) => {
    setPriceToZeroIfObjectIsNotCreatedByGM(item, updates, isDifferent);
  });

  Hooks.on("dnd5e.preRollToolCheck", (actor, itemData, type) => {
    applyCustomRuleForCraftingItemsWithoutProficiency(actor, itemData, type);
  });

  //   /**
  //  * A hook event that fires when an item is used, after the measured template has been created if one is needed.
  //  * @function dnd5e.useItem
  //  * @memberof hookEvents
  //  * @param {Item5e} item                                Item being used.
  //  * @param {ItemUseConfiguration} config                Configuration data for the roll.
  //  * @param {ItemUseOptions} options                     Additional options for configuring item usage.
  //  * @param {MeasuredTemplateDocument[]|null} templates  The measured templates if they were created.
  //  */
  //   Hooks.on("dnd5e.useItem", (item, config, options, templates) => {

  //   });

  //     /**
  //    * A hook event that fires before an item usage is configured.
  //    * @function dnd5e.preUseItem
  //    * @memberof hookEvents
  //    * @param {Item5e} item                  Item being used.
  //    * @param {ItemUseConfiguration} config  Configuration data for the item usage being prepared.
  //    * @param {ItemUseOptions} options       Additional options used for configuring item usage.
  //    * @returns {boolean}                    Explicitly return `false` to prevent item from being used.
  //    */
  //    Hooks.on("dnd5e.preUseItem", (item, config, options) => {

  //    });
};

// /** spell launch dialog **/
// Hooks.on("renderAbilityUseDialog", async (dialog, html, formData) => {
//   Corruzione.checkDialogCorruzione(dialog, html, formData);
// });

// Hooks.on("updateItem", Corruzione.calculateCorruzione);
// Hooks.on("createItem", Corruzione.calculateCorruzione);

// /**
//  * Hook that is triggered after the CorruzioneSettingsForm has been rendered. This
//  * sets the visiblity of the custom formula fields based on if the current
//  * formula is a custom formula.
//  */
// Hooks.on("renderCorruzioneSettingsForm", (spellPointsForm, html, data) => {
//   const isCustom = (data.isCustom || "").toString().toLowerCase() == "true";
//   spellPointsForm.setCustomOnlyVisibility(isCustom);
// });

// Hooks.on("dnd5e.preItemUsageConsumption", (item, consume, options, update) => {
//   Corruzione.castSpell(item, consume, options, update);
// });

// Hooks.on("preCreateActiveEffect", (activeEffect, _config, _userId) => {
//   patchDAEPreCreateActiveEffect(activeEffect, _config, _userId);
// });

// Hooks.on("preUpdateActiveEffect", (activeEffect, _config, _userId) => {
//   patchDAEPreUpdateActiveEffect(activeEffect, _config, _userId);
// });

Hooks.on("createActiveEffect", async (activeEffect, _config, _userId) => {
  await patchDAECreateActiveEffect(activeEffect, _config, _userId);
});

Hooks.on("deleteActiveEffect", async (activeEffect, _config, _userId) => {
  await patchDAEDeleteActiveEffect(activeEffect, _config, _userId);
});

Hooks.on("updateActiveEffect", async (activeEffect, _config, _userId) => {
  await patchDAEUpdateActiveEffect(activeEffect, _config, _userId);
});
