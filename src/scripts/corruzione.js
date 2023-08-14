import { MODULE_NAME } from "./main.js";

export class Corruzione {
  static get settings() {
    return mergeObject(this.defaultSettings, game.settings.get(MODULE_NAME, "settings"));
  }

  /**
   * Get default settings object.
   */
  static get defaultSettings() {
    return {
      spEnableSpellpoints: false,
      spResource: "Spell Points",
      spAutoSpellpoints: false,
      spFormula: "DMG",
      warlockUseSp: false,
      chatMessagePrivate: false,
      spellPointsByLevel: {
        1: 4,
        2: 6,
        3: 14,
        4: 17,
        5: 27,
        6: 32,
        7: 38,
        8: 44,
        9: 57,
        10: 64,
        11: 73,
        12: 73,
        13: 83,
        14: 83,
        15: 94,
        16: 94,
        17: 107,
        18: 114,
        19: 123,
        20: 133,
      },
      spellPointsCosts: { 1: 2, 2: 3, 3: 5, 4: 6, 5: 7, 6: 9, 7: 10, 8: 11, 9: 13 },
      spEnableVariant: false,
      spLifeCost: 2,
      spMixedMode: false,
      isCustom: "false",
      spCustomFormulaBase: "0",
      spCustomFormulaSlotMultiplier: "1",
    };
  }

  /**
   * Get a map of formulas to override values specific to those formulas.
   */
  static get formulas() {
    return {
      DMG: {
        isCustom: "false",
        spellPointsByLevel: {
          1: 4,
          2: 6,
          3: 14,
          4: 17,
          5: 27,
          6: 32,
          7: 38,
          8: 44,
          9: 57,
          10: 64,
          11: 73,
          12: 73,
          13: 83,
          14: 83,
          15: 94,
          16: 94,
          17: 107,
          18: 114,
          19: 123,
          20: 133,
        },
        spellPointsCosts: { 1: "2", 2: "3", 3: "5", 4: "6", 5: "7", 6: "9", 7: "10", 8: "11", 9: "13" },
      },
      CUSTOM: {
        isCustom: "true",
      },
      DMG_CUSTOM: {
        isCustom: "true",
        spCustomFormulaBase: "0",
        spCustomFormulaSlotMultiplier: "1",
        spellPointsCosts: { 1: "2", 2: "3", 3: "5", 4: "6", 5: "7", 6: "9", 7: "10", 8: "11", 9: "13" },
      },
      AM_CUSTOM: {
        isCustom: "true",
        spCustomFormulaBase:
          "ceil((1*@spells.spell1.max + 2*@spells.spell2.max + 3*@spells.spell3.max + 4*@spells.spell4.max + 5*@spells.spell5.max + 6*@spells.spell6.max + 7*@spells.spell7.max + 8*@spells.spell8.max + 9*@spells.spell9.max) / 2) + @attributes.spelldc - 8 - @attributes.prof",
        spCustomFormulaSlotMultiplier: "0",
        spellPointsCosts: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "12", 7: "14", 8: "24", 9: "27" },
      },
    };
  }

  static isModuleActive() {
    return game.settings.get(MODULE_NAME, "spEnableSpellpoints");
  }

  static isModuleActive() {
    return game.settings.get(MODULE_NAME, "spEnableSpellpoints");
  }

  static isActorCharacter(actor) {
    return getProperty(actor, "type") == "character";
  }

  static isMixedActorSpellPointEnabled(actor) {
    if (actor.flags !== undefined) {
      if (actor.flags.dnd5espellpoints !== undefined) {
        if (actor.flags.dnd5espellpoints.enabled !== undefined) {
          return actor.flags.dnd5espellpoints.enabled;
        }
      }
    }
    return false;
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

  /** check what resource is spellpoints on this actor **/
  static getCorruzioneResource(actor) {
    let _resources = getProperty(actor, "system.resources");
    for (let r in _resources) {
      if (_resources[r].label == this.settings.spResource) {
        return { values: _resources[r], key: r };
        break;
      }
    }
    return false;
  }

  /**
   * The function checks if the actor has enough spell points to cast the spell, and if not, checks if
   * the actor can cast the spell using hit points. If the actor can cast the spell using hit points,
   * the function reduces the actor's maximum hit points by the amount of hit points required to cast
   * the spell
   * @param actor - The actor that is being updated.
   * @param update - The update object that is passed to the actor update function.
   * @returns The update object.
   */

  static castSpell(item, consume, options) {
    if (!consume.consumeSpellLevel) {
      return [item, consume, options];
    }
    const actor = item.actor;
    /** do nothing if module is not active **/
    if (!Corruzione.isModuleActive() || !Corruzione.isActorCharacter(actor)) return [item, consume, options];

    const settings = this.settings;

    /* if mixedMode active Check if Corruzione is enabled for this actor */
    if (settings.spMixedMode && !Corruzione.isMixedActorSpellPointEnabled(actor)) return [item, consume, options];

    /** check if this is a spell casting **/
    if (item.type != "spell") return [item, consume, options];

    /** if is a pact spell, but no mixed mode and warlocks do not use spell points: do nothing */
    if (item.system.preparation.mode == "pact" && !settings.spMixedMode && !settings.warlockUseSp)
      return [item, consume, options];

    let spellPointResource = Corruzione.getCorruzioneResource(actor);

    /** not found any resource for spellpoints ? **/
    if (!spellPointResource) {
      ChatMessage.create({
        content:
          "<i style='color:red;'>" +
          game.i18n.format("dnd5e-spellpoints.actorNoSP", { ActorName: actor.name, Corruzione: settings.spResource }) +
          "</i>",
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
      });
      game.i18n.format("dnd5e-spellpoints.createNewResource", settings.spResource);
      ui.notifications.error(
        game.i18n.format("dnd5e-spellpoints.createNewResource", { Corruzione: settings.spResource })
      );
      return {};
    }

    /** find the spell level just cast */
    const spellLvl = item.system.level;

    let actualCorruzione = 0;
    if (actor.system.resources[spellPointResource.key].hasOwnProperty("value")) {
      actualCorruzione = actor.system.resources[spellPointResource.key].value;
    }

    /* get spell cost in spellpoints */
    const spellPointCost = this.withActorData(this.settings.spellPointsCosts[spellLvl], actor);

    /** check if message should be visible to all or just player+gm */
    let SpeakTo = [];
    if (this.settings.chatMessagePrivate) {
      SpeakTo = game.users.filter((u) => u.isGM);
    }

    let updateActor = {
      system: {
        attributes: {},
        resources: {},
      },
    };
    actor.update(updateActor);
    /** update spellpoints **/
    if (actualCorruzione - spellPointCost >= 0) {
      /* character has enough spellpoints */
      spellPointResource.values.value = spellPointResource.values.value - spellPointCost;

      ChatMessage.create({
        content:
          "<i style='color:green;'>" +
          game.i18n.format("dnd5e-spellpoints.spellUsingCorruzione", {
            ActorName: actor.name,
            Corruzione: this.settings.spResource,
            spellPointUsed: spellPointCost,
            remainingPoints: spellPointResource.values.value,
          }) +
          "</i>",
        speaker: ChatMessage.getSpeaker({ alias: actor.name }),
        isContentVisible: false,
        isAuthor: true,
        whisper: SpeakTo,
      });
    } else if (actualCorruzione - spellPointCost < 0) {
      /** check if actor can cast using HP **/
      if (this.settings.spEnableVariant) {
        // spell point resource is 0 but character can still cast.
        spellPointResource.values.value = 0;
        const hpMaxLost = spellPointCost * Corruzione.withActorData(Corruzione.settings.spLifeCost, actor);
        const hpActual = actor.system.attributes.hp.value;
        let hpTempMaxActual = actor.system.attributes.hp.tempmax;
        const hpMaxFull = actor.system.attributes.hp.max;
        if (!hpTempMaxActual) hpTempMaxActual = 0;
        const newTempMaxHP = hpTempMaxActual - hpMaxLost;
        const newMaxHP = hpMaxFull + newTempMaxHP;

        if (hpMaxFull + newTempMaxHP <= 0) {
          //character is permanently dead
          // 3 death saves failed and 0 hp
          updateActor.system.attributes = { death: { failure: 3 }, hp: { tempmax: -hpMaxFull, value: 0 } };
          ChatMessage.create({
            content:
              "<i style='color:red;'>" +
              game.i18n.format("dnd5e-spellpoints.castedLifeDead", { ActorName: actor.name }) +
              "</i>",
            speaker: ChatMessage.getSpeaker({ alias: actor.name }),
            isContentVisible: false,
            isAuthor: true,
            whisper: SpeakTo,
          });
        } else {
          updateActor.system.attributes = { hp: { tempmax: newTempMaxHP } }; // hp max reduction
          if (hpActual > newMaxHP) {
            // a character cannot have more hp than his maximum
            update.system.attributes = mergeObject(update.system.attributes, { hp: { value: newMaxHP } });
          }
          ChatMessage.create({
            content:
              "<i style='color:red;'>" +
              game.i18n.format("dnd5e-spellpoints.castedLife", { ActorName: actor.name, hpMaxLost: hpMaxLost }) +
              "</i>",
            speaker: ChatMessage.getSpeaker({ alias: actor.name }),
            isContentVisible: false,
            isAuthor: true,
            whisper: SpeakTo,
          });
        }
      } else {
        ChatMessage.create({
          content:
            "<i style='color:red;'>" +
            game.i18n.format("dnd5e-spellpoints.notEnoughSp", {
              ActorName: actor.name,
              Corruzione: this.settings.spResource,
            }) +
            "</i>",
          speaker: ChatMessage.getSpeaker({ alias: actor.name }),
          isContentVisible: false,
          isAuthor: true,
          whisper: SpeakTo,
        });
        console.log(item, consume, options);
        consume.consumeSpellSlot = false;
        consume.consumeSpellLevel = false;
        consume.createMeasuredTemplate = false;
        options.createMessage = false;
        delete options.flags;
        return [item, consume, options];
      }
    }

    consume.consumeSpellLevel = false;
    consume.consumeSpellSlot = false;
    updateActor.system.resources[`${spellPointResource.key}`] = { value: spellPointResource.values.value };
    actor.update(updateActor);

    return [item, consume, options];
  }

  /**
   * It checks if the spell is being cast by a player character, and if so, it replaces the spell slot
   * dropdown with a list of spell point costs, and adds a button to the dialog that will cast the
   * spell if the spell point cost is available
   * @param dialog - The dialog object.
   * @param html - The HTML element of the dialog.
   * @param formData - The data that was submitted by the user.
   * @returns the value of the variable `level`
   */
  static checkDialogCorruzione(dialog, html, formData) {
    if (!Corruzione.isModuleActive()) return;

    /** check if actor is a player character **/
    let actor = getProperty(dialog, "item.actor");
    if (!this.isActorCharacter(actor)) return;

    // Declare settings as a separate variable because jQuery overrides `this` when in an each() block
    let settings = this.settings;

    /* if mixedMode active Check if Corruzione is enabled for this actor */
    if (settings.spMixedMode && !Corruzione.isMixedActorSpellPointEnabled(actor)) return;

    /** check if this is a spell **/
    if (getProperty(dialog, "item.type") !== "spell") return;

    const spell = dialog.item.system;
    const preparation = spell.preparation.mode; //prepared,pact,always,atwill,innate
    const warlockCanCast = settings.spMixedMode || settings.warlockUseSp;
    /* if is a warlock but mixed mode is disable and warlocks cannot use spellpoints, do nothing. */
    if (preparation == "pact" && !warlockCanCast) return;

    // spell level can change later if casting it with a greater slot, baseSpellLvl is the default
    const baseSpellLvl = spell.level;

    /** get spellpoints **/
    let spellPointResource = Corruzione.getCorruzioneResource(actor);

    if (!spellPointResource) {
      // this actor has no spell point resource what to do?
      const messageCreate = game.i18n.format("dnd5e-spellpoints.pleaseCreate", {
        Corruzione: this.settings.spResource,
      });
      $("#ability-use-form", html).append('<div class="spError">' + messageCreate + "</div>");
      return;
    }

    let level = "none";
    let cost = 0;
    /** Replace list of spell slots with list of spell point costs **/
    $('select[name="consumeSpellLevel"] option', html).each(function () {
      let selectValue = $(this).val();

      if (selectValue == "pact" && warlockCanCast) {
        level = actor.system.spells.pact.level;
      } else {
        level = selectValue;
      }

      cost = Corruzione.withActorData(settings.spellPointsCosts[level], actor);

      let newText = `${CONFIG.DND5E.spellLevels[level]} (${game.i18n.format("dnd5e-spellpoints.spellCost", {
        amount: cost,
        Corruzione: settings.spResource,
      })})`;
      if ((selectValue == "pact" && warlockCanCast) || selectValue != "pact") {
        $(this).text(newText);
      }
    });

    if (level == "none") return;

    /** Calculate spell point cost and warn user if they have none left */
    let spellPointCost = 0;
    const actualCorruzione = actor.system.resources[spellPointResource.key].value;
    if (preparation == "pact" && warlockCanCast) spellPointCost = cost;
    else spellPointCost = Corruzione.withActorData(Corruzione.settings.spellPointsCosts[baseSpellLvl], actor);
    const missing_points = typeof actualCorruzione === "undefined" || actualCorruzione - spellPointCost < 0;

    if (missing_points) {
      const messageNotEnough = game.i18n.format("dnd5e-spellpoints.youNotEnough", {
        Corruzione: this.settings.spResource,
      });
      $("#ability-use-form", html).append('<div class="spError">' + messageNotEnough + "</div>");
    }

    let copyButton = $(".dialog-button", html).clone();
    $(".dialog-button", html).addClass("original").hide();
    copyButton.addClass("copy").removeClass("use").attr("data-button", "");
    $(".dialog-buttons", html).append(copyButton);

    html.on("click", ".dialog-button.copy", function (e) {
      e.preventDefault();
      /** if not consumeSlot we ignore cost, go on and cast or if variant active **/
      if (!$('input[name="consumeSpellSlot"]', html).prop("checked") || Corruzione.settings.spEnableVariant) {
        $(".dialog-button.original", html).trigger("click");
      } else if ($('select[name="consumeSpellLevel"]', html).length > 0) {
        if (missing_points) {
          ui.notifications.error("You don't have enough: '" + Corruzione.settings.spResource + "' to cast this spell");
          dialog.close();
        } else {
          $(".dialog-button.original", html).trigger("click");
        }
      }
    });
  }

  /**
   * Calculates the maximum spell points for an actor based on custom formulas.
   * @param {object} actor The actor used for variables.
   * @return {number} The calculated maximum spell points.
   */
  static _calculateCorruzioneCustom(actor) {
    let CorruzioneMax = Corruzione.withActorData(Corruzione.settings.spCustomFormulaBase, actor);

    let hasSpellSlots = false;
    let spellPointsFromSlots = 0;
    for (let [slotLvlTxt, slot] of Object.entries(actor.system.spells)) {
      let slotLvl;
      if (slotLvlTxt == "pact") {
        slotLvl = slot.level;
      } else {
        slotLvl = parseInt(slotLvlTxt.replace(/\D/g, ""));
      }

      if (slotLvl == 0) {
        continue;
      }

      spellPointsFromSlots += slot.max * Corruzione.withActorData(Corruzione.settings.spellPointsCosts[slotLvl], actor);
      if (slot.max > 0) {
        hasSpellSlots = true;
      }
    }

    if (!hasSpellSlots) {
      return 0;
    }

    CorruzioneMax +=
      spellPointsFromSlots * Corruzione.withActorData(Corruzione.settings.spCustomFormulaSlotMultiplier, actor);

    return CorruzioneMax;
  }

  /**
   * Calculates the maximum spell points for an actor based on a fixed map of
   * spellcasting level to maximum spell points. Builds up a total spellcasting
   * level based on the level of each spellcasting class according to
   * Multiclassing rules.
   * @param {object} item The class item of the actor.
   * @param {object} updates The details of how the class item was udpated.
   * @param {object} actor The actor used for variables.
   * @return {number} The calculated maximum spell points.
   */
  static _calculateCorruzioneFixed(item, updates, actor) {
    /* not an update? **/
    let changedClassLevel = null;
    let changedClassID = null;
    let levelUpdated = false;

    if (getProperty(updates.system, "levels")) {
      changedClassLevel = getProperty(updates.system, "levels");
      changedClassID = getProperty(item, "_id");
      levelUpdated = true;
    }
    // check for multiclasses
    const actorClasses = actor.items.filter((i) => i.type === "class");

    let spellcastingClassCount = 0;
    const spellcastingLevels = {
      full: [],
      half: [],
      artificer: [],
      third: [],
    };

    for (let c of actorClasses) {
      /* spellcasting: pact; full; half; third; artificier; none; **/
      let spellcasting = c.system.spellcasting.progression;
      let level = c.system.levels;

      // get updated class new level
      if (levelUpdated && c._id == changedClassID) level = changedClassLevel;

      if (spellcastingLevels[spellcasting] != undefined) {
        spellcastingLevels[spellcasting].push(level);
        spellcastingClassCount++;
      }
    }

    let totalSpellcastingLevel = 0;
    totalSpellcastingLevel += spellcastingLevels["full"].reduce((sum, level) => sum + level, 0);
    totalSpellcastingLevel += spellcastingLevels["artificer"].reduce((sum, level) => sum + Math.ceil(level / 2), 0);
    // Half and third casters only round up if they do not multiclass into other spellcasting classes and if they
    // have enough levels to obtain the spellcasting feature.
    if (spellcastingClassCount == 1 && (spellcastingLevels["half"][0] >= 2 || spellcastingLevels["third"][0] >= 3)) {
      totalSpellcastingLevel += spellcastingLevels["half"].reduce((sum, level) => sum + Math.ceil(level / 2), 0);
      totalSpellcastingLevel += spellcastingLevels["third"].reduce((sum, level) => sum + Math.ceil(level / 3), 0);
    } else {
      totalSpellcastingLevel += spellcastingLevels["half"].reduce((sum, level) => sum + Math.floor(level / 2), 0);
      totalSpellcastingLevel += spellcastingLevels["third"].reduce((sum, level) => sum + Math.floor(level / 3), 0);
    }

    return parseInt(Corruzione.settings.spellPointsByLevel[totalSpellcastingLevel]) || 0;
  }

  /**
   * If the module is active, the actor is a character, and the actor has a spell point resource, then
   * update the spell point resource's maximum value
   * @param item - The item that was updated.
   * @param updates - The updates that are being applied to the item.
   * @param isDifferent - true if the item is being updated, false if it's being dropped
   * @returns True
   */
  static calculateCorruzione(item, updates, isDifferent) {
    const actor = item.parent;

    if (!Corruzione.isModuleActive() || !Corruzione.isActorCharacter(actor)) return true;

    if (!Corruzione.settings.spAutoSpellpoints) {
      return true;
    }
    /* if mixedMode active Check if Corruzione is enabled for this actor */
    if (Corruzione.settings.spMixedMode && !Corruzione.isMixedActorSpellPointEnabled(actor)) return true;

    /* updating or dropping a class item */
    if (item.type !== "class") return true;

    if (!getProperty(updates.system, "levels")) return true;

    let spellPointResource = Corruzione.getCorruzioneResource(actor);
    const actorName = actor.name;

    let SpeakTo = game.users.filter((u) => u.isGM);
    let message = "";

    if (!spellPointResource) {
      message =
        "SPELLPOINTS: Cannot find resource '" +
        Corruzione.settings.spResource +
        "' on " +
        actorName +
        " character sheet!";
      ChatMessage.create({
        content: "<i style='color:red;'>" + message + "</i>",
        speaker: ChatMessage.getSpeaker({ alias: actorName }),
        isContentVisible: false,
        isAuthor: true,
        whisper: SpeakTo,
      });
      return true;
    }

    const isCustom = Corruzione.settings.isCustom.toString().toLowerCase() == "true";
    const CorruzioneMax = isCustom
      ? Corruzione._calculateCorruzioneCustom(actor)
      : Corruzione._calculateCorruzioneFixed(item, updates, actor);

    if (CorruzioneMax > 0) {
      let updateActor = { [`system.resources.${spellPointResource.key}.max`]: CorruzioneMax };
      actor.update(updateActor);
      let message =
        "SPELLPOINTS: Found resource '" +
        Corruzione.settings.spResource +
        "' on " +
        actorName +
        " character sheet! Your Maximum " +
        Corruzione.settings.spResource +
        " have been updated.";
      ChatMessage.create({
        content: "<i style='color:green;'>" + message + "</i>",
        speaker: ChatMessage.getSpeaker({ alias: actorName }),
        isContentVisible: false,
        isAuthor: true,
        whisper: SpeakTo,
      });
    }
    return true;
  }

  /**
   * It adds a checkbox to the character sheet that allows the user to enable/disable spell points for
   * the character
   * @param app - The application object.
   * @param html - The HTML of the Actor sheet.
   * @param data - The data object passed to the sheet.
   * @returns The return value is the html_checkbox variable.
   */
  static mixedMode(app, html, data) {
    if (!this.isModuleActive() || !this.settings.spMixedMode || data.actor.type != "character") {
      return;
    }

    let checked = "";
    if (Corruzione.isMixedActorSpellPointEnabled(data.actor)) {
      checked = "checked";
    }

    let spellPointUseOnSheetLabel = game.i18n.localize("dnd5e-spellpoints.use-spellpoints");

    let html_checkbox = '<div class="spEnable flexrow ">';
    html_checkbox += '<div class="no-edit"><i class="fas fa-magic"></i> ' + spellPointUseOnSheetLabel + "</div>";
    html_checkbox += '<label class="edit-allowed"><i class="fas fa-magic"></i>&nbsp;';
    html_checkbox += spellPointUseOnSheetLabel;
    html_checkbox +=
      '<input name="flags.dnd5espellpoints.enabled" ' +
      checked +
      ' class="spEnableInput visually-hidden" type="checkbox" value="1">';
    html_checkbox += ' <i class="spEnableCheck fas"></i>';
    html_checkbox += "</label></div>";
    $(".tab.features", html).prepend(html_checkbox);
  }
} /** END SpellPoint Class **/
