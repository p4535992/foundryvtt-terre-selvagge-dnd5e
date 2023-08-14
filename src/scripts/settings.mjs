import { debug, log, warn, i18n } from "./lib/lib.mjs";
import CONSTANTS from "./constants.mjs";

let possibleSystems = ["dnd5e", "symbaroum", "pf2e", "pf1", "swade"];

let fontFamilies = {};

const colors = CONFIG.Canvas.dispositionColors;

export const registerSettings = function () {
  let index = 0;
  for (let [key, value] of Object.entries(CONFIG.fontDefinitions)) {
    fontFamilies[`${index}`] = key;
    index++;
  }

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_ID, "borderControlEnabled", {
    name: `${CONSTANTS.MODULE_ID}.setting.borderControlEnabled.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.borderControlEnabled.hint`,
    default: true,
    type: Boolean,
    scope: "world",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "removeBorders", {
    name: `${CONSTANTS.MODULE_ID}.setting.removeBorders.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.removeBorders.hint`,
    scope: "world",
    type: String,
    choices: {
      0: "None",
      1: "Non Owned",
      2: "All",
    },
    default: "0",
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "permanentBorder", {
    name: `${CONSTANTS.MODULE_ID}.setting.permanentBorder.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.permanentBorder.hint`,
    scope: "client",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "stepLevel", {
    name: `${CONSTANTS.MODULE_ID}.setting.stepLevel.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.stepLevel.hint`,
    scope: "world",
    type: Number,
    default: 10,
    config: possibleSystems.includes(game.system.id),
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderWidth", {
    name: `${CONSTANTS.MODULE_ID}.setting.borderWidth.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.borderWidth.hint`,
    scope: "client",
    type: Number,
    default: 4,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderGridScale", {
    name: `${CONSTANTS.MODULE_ID}.setting.borderGridScale.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.borderGridScale.hint`,
    scope: "client",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "borderOffset", {
    name: `${CONSTANTS.MODULE_ID}.setting.borderOffset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.borderOffset.hint`,
    scope: "client",
    type: Number,
    default: 0,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "circleBorders", {
    name: `${CONSTANTS.MODULE_ID}.setting.circleBorders.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.circleBorders.hint`,
    scope: "client",
    type: Boolean,
    default: false,
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "scaleBorder", {
    name: `${CONSTANTS.MODULE_ID}.setting.scaleBorder.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.scaleBorder.hint`,
    scope: "world",
    type: Boolean,
    default: false,
    config: true,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "hudEnable", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.hudEnable.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.hudEnable.hint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true,
  });

  /** Which column should the button be placed on */
  game.settings.register(CONSTANTS.MODULE_ID, "hudColumn", {
    name: i18n(`${CONSTANTS.MODULE_ID}.setting.hudColumn.name`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.setting.hudColumn.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Right",
    choices: {
      Left: "Left",
      Right: "Right",
    },
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(CONSTANTS.MODULE_ID, "hudTopBottom", {
    name: i18n(`${CONSTANTS.MODULE_ID}.setting.hudTopBottom.name`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.setting.hudTopBottom.hint`),
    scope: "world",
    config: true,
    type: String,
    default: "Bottom",
    choices: {
      Top: "Top",
      Bottom: "Bottom",
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "controlledColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.controlledColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.controlledColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.CONTROLLED).css ?? "#FF9829",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "controlledColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.controlledColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.controlledColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "hostileColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.hostileColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.hostileColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.HOSTILE).css ?? "#E72124",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "hostileColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.hostileColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.hostileColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.friendlyColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.friendlyColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.FRIENDLY).css ?? "#43DFDF",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "friendlyColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.friendlyColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.friendlyColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "neutralColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.neutralColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.neutralColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.NEUTRAL).css ?? "#F1D836",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "neutralColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.neutralColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.neutralColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "partyColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.partyColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.partyColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.PARTY).css ?? "#33BC4E",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "partyColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.partyColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.partyColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "secretColor", {
    name: `${CONSTANTS.MODULE_ID}.setting.secretColor.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.secretColor.hint`,
    scope: "client",
    type: String,
    default: Color.from(colors.SECRET).css ?? "#A612D4",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "secretColorEx", {
    name: `${CONSTANTS.MODULE_ID}.setting.secretColorEx.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.secretColorEx.hint`,
    scope: "client",
    type: String,
    default: "#000000",
    config: true,
  });
  game.settings.register(CONSTANTS.MODULE_ID, "actorFolderColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.actorFolderColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: true,
  });

  // Setting off
  game.settings.register(CONSTANTS.MODULE_ID, "customDispositionColorEx", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.customDispositionColorEx.hint"),
    scope: "world",
    type: String,
    default: "#000000",
    config: false,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "color-from", {
    name: i18n(CONSTANTS.MODULE_ID + ".setting.color-from.name"),
    hint: i18n(CONSTANTS.MODULE_ID + ".setting.color-from.hint"),
    scope: "world",
    config: true,
    default: "token-disposition",
    type: String,
    choices: {
      "token-disposition": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.token-disposition"),
      "actor-folder-color": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.actor-folder-color"),
      // "custom-disposition": i18n(CONSTANTS.MODULE_ID + ".setting.color-from.opt.custom-disposition")
    },
  });

  // Nameplate Feature (Deprecated)

  // game.settings.register(CONSTANTS.MODULE_ID, "disableNameplateDesign", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.disableNameplateDesign.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.disableNameplateDesign.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "circularNameplate", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.circularNameplate.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.circularNameplate.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "circularNameplateRadius", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.circularNameplateRadius.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.circularNameplateRadius.hint`,
  //   scope: "world",
  //   type: Number,
  //   default: 0,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "nameplateColor", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.nameplateColor.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.nameplateColor.hint`,
  //   scope: "client",
  //   type: String,
  //   default: "#FFFFFF",
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "nameplateColorGM", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.nameplateColorGM.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.nameplateColorGM.hint`,
  //   scope: "client",
  //   type: String,
  //   default: "#FFFFFF",
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "nameplateOffset", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.nameplateOffset.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.nameplateOffset.hint`,
  //   scope: "world",
  //   type: Number,
  //   default: 0,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "plateFont", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.plateFont.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.plateFont.hint`,
  //   scope: "world",
  //   type: String,
  //   choices: fontFamilies,
  //   default: "signika",
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "sizeMultiplier", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.sizeMultiplier.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.sizeMultiplier.hint`,
  //   scope: "world",
  //   type: Number,
  //   default: 1,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "plateConsistency", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.plateConsistency.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.plateConsistency.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // Target Feature (Deprecated)

  // game.settings.register(CONSTANTS.MODULE_ID, "disableRefreshTarget", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.disableRefreshTarget.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.disableRefreshTarget.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "targetSize", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.targetSize.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.targetSize.hint`,
  //   scope: "client",
  //   type: Number,
  //   default: 1,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "internatTarget", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.internatTarget.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.internatTarget.hint`,
  //   scope: "client",
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "targetColor", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.targetColor.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.targetColor.hint`,
  //   scope: "client",
  //   type: String,
  //   default: "#FF9829",
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "targetColorEx", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.targetColorEx.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.targetColorEx.hint`,
  //   scope: "client",
  //   type: String,
  //   default: "#000000",
  //   config: true,
  // });

  // Bars Feature (Deprecated)

  // game.settings.register(CONSTANTS.MODULE_ID, "disableDrawBarsDesign", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.disableDrawBarsDesign.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.disableDrawBarsDesign.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: true,
  //   config: true,
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "barAlpha", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.barAlpha.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.barAlpha.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: false,
  //   config: true,
  // });

  // HealthGradient Feature (Deprecated)

  // game.settings.register(CONSTANTS.MODULE_ID, "healthGradient", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.healthGradient.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.healthGradient.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: false,
  //   config: possibleSystems.includes(game.system.id),
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "tempHPgradient", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.tempHPgradient.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.tempHPgradient.hint`,
  //   scope: "world",
  //   type: Boolean,
  //   default: false,
  //   config: possibleSystems.includes(game.system.id),
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "healthGradientA", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.healthGradientA.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.healthGradientA.hint`,
  //   scope: "world",
  //   type: String,
  //   default: "#1b9421",
  //   config: possibleSystems.includes(game.system.id),
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "healthGradientB", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.healthGradientB.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.healthGradientB.hint`,
  //   scope: "world",
  //   type: String,
  //   default: "#c9240a",
  //   config: possibleSystems.includes(game.system.id),
  // });

  // game.settings.register(CONSTANTS.MODULE_ID, "healthGradientC", {
  //   name: `${CONSTANTS.MODULE_ID}.setting.healthGradientC.name`,
  //   hint: `${CONSTANTS.MODULE_ID}.setting.healthGradientC.hint`,
  //   scope: "world",
  //   type: String,
  //   default: "#22e3dd",
  //   config: possibleSystems.includes(game.system.id),
  // });

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
