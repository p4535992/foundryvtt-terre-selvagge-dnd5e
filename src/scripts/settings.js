import { debug, log, warn, i18n } from "./lib/lib.js";
import CONSTANTS from "./constants/constants.js";
import { RarityColorsApp } from "./apps/rarity-colors-app.js";

export const registerSettings = function () {
  // game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
  //   icon: "fas fa-coins",
  //   type: ResetSettingsDialog,
  //   restricted: true,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "formulaCraftingToolNoProf", {
    name: `${CONSTANTS.MODULE_ID}.setting.formulaCraftingToolNoProf.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.formulaCraftingToolNoProf.hint`,
    scope: "world",
    config: true,
    default: "-2",
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "patchDAE", {
    name: `${CONSTANTS.MODULE_ID}.setting.patchDAE.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.patchDAE.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  // RARITY COLOR

  game.settings.register(CONSTANTS.MODULE_ID, "rarityFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.rarityFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.rarityFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "spellFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.spellFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.spellFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "featFlag", {
    name: `${CONSTANTS.MODULE_ID}.setting.featFlag.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.featFlag.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableBackgroundColorInsteadText", {
    name: `${CONSTANTS.MODULE_ID}.setting.enableBackgroundColorInsteadText.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.enableBackgroundColorInsteadText.hint`,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "configurations", {
    scope: "world",
    config: false,
    type: Object,
    default: {
      spellSchools: {
        custom: {},
        defaults: {},
      },
      itemRarity: {
        custom: {},
        defaults: {},
      },
      classFeatureTypes: {
        custom: {},
        defaults: {},
      },
    },
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "rarityColorsAppMenu", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.name`),
    label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.label`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.menu.hint`),
    icon: "fas fa-cogs",
    scope: "world",
    restricted: true,
    type: RarityColorsApp,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hideEmpty", {
    name: "Hide Empty Sections",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "collapse-navbars", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.collapse-navbars.name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.collapse-navbars.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "specificFolderJournalPersonsIncome", {
    name: `Seleziona la cartella dei journal attori per il calcolo dell'income`,
    hint: `Inserisci l'uuid della cartella dei journal di partenza contenente i journal delle persone`,
    scope: "world",
    type: String,
    default: "",
    config: true,
  });

  // game.settings.register(CONSTANTS.MODULE_ID, "hoverNoteSettings", {
  //   name: "Hover Note Settings",
  //   hint: "Stores settings for hover note hooks.",
  //   default: JSON.stringify({
  //     Foresta: "Tiles/POI/RegionIconsMapPack/ElfRegionIcons/Forest.png",
  //     // ...other defaults
  //   }),
  //   type: String,
  //   scope: "world",
  //   config: true,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "nameRollTableMapNOtes", {
    name: "Name of the RollTable for Mpa Notes",
    hint: "Name of the RollTable for Mpa Notes",
    type: String,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableHoverNote", {
    name: game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.enableHoverNote.name`),
    hint: game.i18n.localize(`${CONSTANTS.MODULE_ID}.setting.enableHoverNote.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  // ========================================================================
  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`));
            for (let setting of worldSettings) {
              log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }

  async _updateObject(event, formData = undefined) {
    // do nothing
  }
}
