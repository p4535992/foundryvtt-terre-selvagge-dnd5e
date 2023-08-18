import { ORIGINAL_CONFIG, isEmptyObject, prepareConfigurations } from "../raritycolors.js";
import CONSTANTS from "../constants/constants.js";
import { log } from "../lib/lib.js";

export class RarityColorsApp extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.RarityColorsApp.title`),
      template: `modules/${CONSTANTS.MODULE_ID}/templates/rarityColorsApp.hbs`,
      id: `${CONSTANTS.MODULE_ID}-config-app`,
      width: 620,
      height: "auto",
      resizable: true,
      closeOnSubmit: true,
      submitOnClose: true,
      tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "canvas" }],
      filepickers: [],
    });
  }

  getData() {
    let configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    if (
      isEmptyObject(configurations) ||
      isEmptyObject(configurations.itemRarity) ||
      isEmptyObject(configurations.itemRarity.defaults)
    ) {
      configurations = prepareConfigurations();
    }

    // Item Rarity
    const configurationsItemRarityDefaultsTmp = duplicate(configurations.itemRarity.defaults);
    for (const [key, value] of Object.entries(configurationsItemRarityDefaultsTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.itemRarity.defaults[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        switch (key) {
          case "common": {
            value.color = "#000000";
            break;
          }
          case "uncommon": {
            value.color = "#008000";
            break;
          }
          case "rare": {
            value.color = "#0000ff";
            break;
          }
          case "veryRare":
          case "veryrare": {
            value.color = "#800080";
            break;
          }
          case "legendary": {
            value.color = "#ffa500";
            break;
          }
          case "artifact": {
            value.color = "#d2691e";
            break;
          }
          default: {
            value.color = "#000000";
            break;
          }
        }
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.itemRarity[key];
      }
      configurations.itemRarity.defaults[key] = value;
    }

    configurations.itemRarity.custom ??= {};
    const configurationsItemRarityCustomTmp = duplicate(configurations.itemRarity.custom);
    for (const [key, value] of Object.entries(configurationsItemRarityCustomTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.itemRarity.custom[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        value.color = "#000000";
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.itemRarity[key];
      }
      configurations.itemRarity.custom[key] = value;
    }

    // Spells School
    const configurationsSpellSchoolsDefaultsTmp = duplicate(configurations.spellSchools.defaults);
    for (const [key, value] of Object.entries(configurationsSpellSchoolsDefaultsTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.spellSchools.defaults[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        value.color = "#4a8396";
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.spellSchools[key];
      }
      configurations.spellSchools.defaults[key] = value;
    }

    configurations.spellSchools.custom ??= {};
    const configurationsSpellSchoolsCustomTmp = duplicate(configurations.spellSchools.custom);
    for (const [key, value] of Object.entries(configurationsSpellSchoolsCustomTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.spellSchools.custom[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        value.color = "#4a8396";
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.spellSchools[key];
      }
      configurations.spellSchools.custom[key] = value;
    }

    // Class feature Types
    const configurationsClassFeatureTypesDefaultsTmp = duplicate(configurations.classFeatureTypes.defaults);
    for (const [key, value] of Object.entries(configurationsClassFeatureTypesDefaultsTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.classFeatureTypes.defaults[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        value.color = "#48d1cc";
      }
      if (value.label) {
        value.name = value.label;
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.featureTypes[key].label ?? "";
      }
      configurations.classFeatureTypes.defaults[key] = value;
    }

    configurations.classFeatureTypes.custom ??= {};
    const configurationsClassFeatureTypesCustomTmp = duplicate(configurations.classFeatureTypes.custom);
    for (const [key, value] of Object.entries(configurationsClassFeatureTypesCustomTmp)) {
      if (typeof value === "string" || value instanceof String || key === "undefined") {
        delete configurations.classFeatureTypes.custom[key];
        continue;
      }
      if (!value.color || value.color === "#000000") {
        value.color = "#48d1cc";
      }
      if (value.label) {
        value.name = value.label;
      }
      if (!value.name) {
        value.name = ORIGINAL_CONFIG.featureTypes[key].label ?? "";
      }
      configurations.classFeatureTypes.custom[key] = value;
    }
    return { configurations, ORIGINAL_CONFIG };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.on("change", "input", this._onChangeInput.bind(this));
    html.on("click", "#add-item-rarity", this._addItemRarity.bind(this));
    html.on("click", ".delete-item-rarity", this._deleteItemRarity.bind(this));
    html.on("click", "#add-spell-school", this._addSpellSchool.bind(this));
    html.on("click", ".delete-spell-school", this._deleteSpellSchool.bind(this));
    html.on("click", "#add-class-feature", this._addClassFeature.bind(this));
    html.on("click", ".delete-class-feature", this._deleteClassFeature.bind(this));
  }

  async _onChangeInput(event) {
    await this._updateObject(event, this._getSubmitData());
    this.render(true);
  }

  async _addItemRarity(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const newItemRarity = {
      name: "New Item Rarity",
      key: "new",
      color: "#000000",
    };
    configurations.itemRarity.custom ??= {};
    configurations.itemRarity.custom[randomID()] = newItemRarity;
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _deleteItemRarity(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const itemRarity = event.currentTarget.closest("tr").dataset.itemRarityId;
    delete configurations.itemRarity.custom[itemRarity];
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _addSpellSchool(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const newSpellSchool = {
      name: "New Spell School",
      key: "new",
      color: "#000000",
    };
    configurations.spellSchools.custom ??= {};
    configurations.spellSchools.custom[randomID()] = newSpellSchool;
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _deleteSpellSchool(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const spellSchool = event.currentTarget.closest("tr").dataset.spellSchoolId;
    delete configurations.spellSchools.custom[spellSchool];
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _addClassFeature(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const newClassFeature = {
      name: "New Class Feature",
      key: "new",
      color: "#000000",
    };
    configurations.classFeatureTypes.custom ??= {};
    configurations.classFeatureTypes.custom[randomID()] = newClassFeature;
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _deleteClassFeature(event) {
    event.preventDefault();
    const configurations = game.settings.get(CONSTANTS.MODULE_ID, "configurations");
    const classFeature = event.currentTarget.closest("tr").dataset.classFeatureId;
    delete configurations.classFeatureTypes.custom[classFeature];
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", configurations);
    this.render(true);
  }

  async _updateObject(event, formData) {
    log("RarityColorsApp | _updateObject | formData", formData);
    const expanded = expandObject(formData);
    await game.settings.set(CONSTANTS.MODULE_ID, "configurations", expanded);
  }

  async close(...args) {
    await super.close(...args);
    SettingsConfig.reloadConfirm();
  }
}
