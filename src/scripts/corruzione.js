import CONSTANTS from "./constants/constants";
import { SUPPORTED_SHEET, log } from "./lib/lib";

export class Corruzione {
  static isActorCharacter(actor) {
    return getProperty(actor, "type") == "character";
  }

  static isModuleActive() {
    return game.modules.get(CONSTANTS.MODULE_ID)?.active;
  }

  /**
   * Evaluates the given formula with the given actors data. Uses FoundryVTT's Roll
   * to make this evaluation.
   * @param {string|number} formula The rollable formula to evaluate.
   * @param {object} actor The actor used for variables.
   * @return {number} The result of the formula.
   */
  static withActorData(formula, actor) {
    let dataObject = actor.getRollData();
    dataObject.flags = actor.flags;
    const r = new Roll(formula.toString(), dataObject);
    r.evaluate({ async: false });
    return r.total;
  }

  /** check what resource is corruzione on this actor **/
  static getCorruzioneResource(actor) {
    let _resources = getProperty(actor, "system.resources");
    for (let r in _resources) {
      if (_resources[r].label == CONSTANTS.RESOURCE_CORRUZIONE.LABEL) {
        return { values: _resources[r], key: r };
        break;
      }
    }
    return false;
  }

  /**
   * It adds a checkbox to the character sheet that allows the user to enable/disable spell points for
   * the character
   * @param actorSheet - The application object.
   * @param html - The HTML of the Actor sheet.
   * @param data - The data object passed to the sheet.
   * @returns The return value is the html_checkbox variable.
   */
  static async mixedMode(actorSheet, html, data) {
    if (!this.isModuleActive() || data.actor.type != "character") {
      return;
    }

    if (!actorSheet) {
      return;
    }
    const a = actorSheet.object;
    log("Update resource primary label " + a.name);
    if (
      a &&
      a.type === "character" &&
      (a.system.resources.primary.label !== CONSTANTS.RESOURCE_CORRUZIONE.LABEL ||
        a.system.resources.primary.max !== CONSTANTS.RESOURCE_CORRUZIONE.MAX)
    ) {
      log(
        "Update on actor '" +
          a.name +
          "|" +
          a.id +
          "' resource primary label from '" +
          a.system.resources.primary.label +
          "' to '" +
          CONSTANTS.RESOURCE_CORRUZIONE.LABEL +
          "'"
      );
      log(
        "Update on actor '" +
          a.name +
          "|" +
          a.id +
          "' resource primary max from '" +
          a.system.resources.primary.max +
          "' to '" +
          CONSTANTS.RESOURCE_CORRUZIONE.MAX +
          "'"
      );

      await a.update({
        "system.resources.primary.label": CONSTANTS.RESOURCE_CORRUZIONE.LABEL,
        "system.resources.primary.max": CONSTANTS.RESOURCE_CORRUZIONE.MAX,
      });
    }

    let sheetClass = actorSheet.object.flags?.core?.sheetClass ?? "";
    if (!sheetClass) {
      for (const obj of SUPPORTED_SHEET) {
        if (game.modules.get(obj.moduleId)?.active && actorSheet.template.includes(obj.templateId)) {
          sheetClass = obj.name;
        }
        if (sheetClass) {
          break;
        }
      }
    }

    switch (sheetClass) {
      case "dnd5e.Tidy5eSheet": {
        const htmlPrimaryResource = html.find("ul.attributes").find(".attribute.resource")[0];
        // Set css on corruzione
        if (!htmlPrimaryResource.classList.contains("ts-corruzione-dnd5e-resource")) {
          htmlPrimaryResource.classList.add("ts-corruzione-dnd5e-resource");
        }
        if (!game.user.isGM) {
          const inputs = htmlPrimaryResource.querySelectorAll("input[type='text']");
          for (let i = 0; i < inputs.length; ++i) {
            inputs[i].setAttribute("readonly", true);
          }
        }
        break;
      }
      case "dnd5e.CompactBeyond5eSheet": {
        const htmlPrimaryResource = html.find("ul.attributes").find(".attribute.resource")[0];
        // Set css on corruzione
        if (!htmlPrimaryResource.classList.contains("ts-corruzione-dnd5e-resource")) {
          htmlPrimaryResource.classList.add("ts-corruzione-dnd5e-resource");
        }
        if (!game.user.isGM) {
          const inputs = htmlPrimaryResource.querySelectorAll("input[type='text']");
          for (let i = 0; i < inputs.length; ++i) {
            inputs[i].setAttribute("readonly", true);
          }
        }
        break;
      }
      default: {
        const htmlPrimaryResource = html.find("ul.attributes").find(".attribute.resource")[0];
        // Set css on corruzione
        if (!htmlPrimaryResource.classList.contains("ts-corruzione-dnd5e-resource")) {
          htmlPrimaryResource.classList.add("ts-corruzione-dnd5e-resource");
        }
        if (!game.user.isGM) {
          const inputs = htmlPrimaryResource.querySelectorAll("input[type='text']");
          for (let i = 0; i < inputs.length; ++i) {
            inputs[i].setAttribute("readonly", true);
          }
        }
        break;
      }
    }
  }
  // /**
  //  * If the module is active, the actor is a character, and the actor has a spell point resource, then
  //  * update the spell point resource's maximum value
  //  * @param actor - The actor that was updated.
  //  * @param updates - The updates that are being applied to the item.
  //  * @param isDifferent - true if the item is being updated, false if it's being dropped
  //  * @returns True
  //  */
  // static calculateCorruzione(actor, updates, isDifferent) {
  //   // const actor = item.parent;

  //   if (!Corruzione.isModuleActive() || !Corruzione.isActorCharacter(actor)) {
  //     return true;
  //   }
  //   /* updating or dropping a class item */
  //   // if (item.type !== "class") {
  //   //   return true;
  //   // }
  //   if (!getProperty(updates.system, "levels")) {
  //     return true;
  //   }
  //   let corruzioneResource = Corruzione.getCorruzioneResource(actor);
  //   const actorName = actor.name;

  //   let SpeakTo = game.users.filter((u) => u.isGM);
  //   let message = "";

  //   if (!corruzioneResource) {
  //     message =
  //       "CORRUZIONE: Cannot find resource '" +
  //       CONSTANTS.RESOURCE_CORRUZIONE.LABEL +
  //       "' on " +
  //       actorName +
  //       " character sheet!";
  //     ChatMessage.create({
  //       content: "<i style='color:red;'>" + message + "</i>",
  //       speaker: ChatMessage.getSpeaker({ alias: actorName }),
  //       isContentVisible: false,
  //       isAuthor: true,
  //       whisper: SpeakTo,
  //     });
  //     return true;
  //   }
  //   const corruzioneMax = CONSTANTS.RESOURCE_CORRUZIONE.MAX;
  //   // const isCustom = Corruzione.settings.isCustom.toString().toLowerCase() == "true";
  //   // const corruzioneMax = isCustom
  //   // ? Corruzione._calculateCorruzioneCustom(actor)
  //   // : Corruzione._calculateCorruzioneFixed(item, updates, actor);

  //   const corruzioneCurrentMax = getProperty(actor, `system.resources.${corruzioneResource.key}.max`);
  //   const corruzioneCurrentValue = getProperty(actor, `system.resources.${corruzioneResource.key}.value`);

  //   if (corruzioneCurrentMax > corruzioneMax) {
  //     let updateActor = { [`system.resources.${corruzioneResource.key}.max`]: corruzioneMax };
  //     actor.update(updateActor);
  //     let message =
  //       "CORRUZIONE: Found resource '" +
  //       corruzioneCurrentValue +
  //       "' on " +
  //       actorName +
  //       " character sheet! Your Maximum " +
  //       corruzioneCurrentMax +
  //       " have been updated to " +
  //       corruzioneMax;
  //     ChatMessage.create({
  //       content: "<i style='color:red;'>" + message + "</i>",
  //       speaker: ChatMessage.getSpeaker({ alias: actorName }),
  //       isContentVisible: false,
  //       isAuthor: true,
  //       whisper: SpeakTo,
  //     });
  //   }
  //   return true;
  // }
}
