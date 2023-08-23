import EffectHelpers from "./effect-helpers";

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitions {
  constructor() {
    this._effectHelpers = new EffectHelpers();

    this._flagPrefix = "midi-qol";
    if (game.modules.get("wire")?.active) {
      this._flagPrefix = "wire";
    }
  }

  initialize() {
    this._all = [...this._corruzione];
  }

  /**
   * Get all effects
   *
   * @returns {ActiveEffect[]} all the effects
   */
  get all() {
    return [...this._all];
  }

  /**
   * Get all the corruzione effects
   *
   * @returns {ActiveEffect[]} all the corruzione effects
   */
  get corruzione() {
    return (
      this._corruzione ?? [
        this._c1,
        this._c2,
        this._c3,
        this._c4,
        this._c5,
        this._c6,
        this._c7,
        this._c8,
        this._c9,
        this._c10,
        this._c11,
        this._c12,
        this._c13,
        this._c14,
        this._c15,
        this._c16,
        this._c17,
        this._c18,
        this._c19,
        this._c20,
        this._c21,
        this._c22,
        this._c23,
        this._c24
      ]
    );
  }

  /* Condition Effects */
  get _c1() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.skill.ste",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Tosse. Il personaggio sviluppa una tosse cronica e incontrollabile, si ha svantaggio alle prove di Stealth</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Tosse",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: "#ce1fe5",
      transfer: true,
      statuses: ["Convenient Effect: C1 Tosse"],
    });
  }

  get _c2() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Compulsivo. Il personaggio diventerà compulsivo secondo il volere del DM, dall'ordinare il bottino, al pulirsi completamente dopo uno scontro. Il riposo breve dura 1h e mezza.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Compulsivo",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Compulsivo"],
    });
  }
  get _c3() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.check.str",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Piaghe sanguinanti. Il personaggio ha delle piaghe che gli impediscono di mostrare la sua vera forza. Ha svantaggio nelle skill basate sulla Forza.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Piaghe Sanguinanti",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Piaghe Sanguinanti"],
    });
  }
  get _c4() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.skill.prc",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description: "<p>Allucinazioni. Il personaggio ha svantaggio nei check di percezione</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Allucinazioni",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Allucinazioni"],
    });
  }
  get _c5() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Accumulatore. Il personaggio accumulerà ogni cosa di poco valore trovata lungo il viaggio, fino al massimo del peso trasportabile</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Accumulatore",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Accumulatore"],
    });
  }
  get _c6() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.skill.ins",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Fiducioso. Il personaggio diventa troppo fiducioso nel prossimo. Si ha svantaggio nelle prove di intuizione.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Fiducioso",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Fiducioso"],
    });
  }
  get _c7() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Avventato. Il personaggio diventa più avventato, ogni primo attacco fatto all'inizio di un combattimento ha vantaggio contro il personaggio.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Avventato",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Avventato"],
    });
  }
  get _c8() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.skill.per",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Puzzo di marcio. Il personaggio inizia a puzzare come di carne in decomposizione. Ha svantaggio ai check di persuasione.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Puzzo di Marcio",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Puzzo di Marcio"],
    });
  }
  get _c9() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Fobia leggera. Il personaggio diventa fobico nei confronti di un determinato tipo di creature, iniziando ogni scontro con lo status Spaventato per il primo turno</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Green_Thumb.webp",
      name: "C1 Fobia Leggera",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C1 Fobia Leggera"],
    });
  }
  get _c10() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Decadimento morale. Il personaggio cambia la sua visione del mondo in maniera più pessimistica e oscura. Spostamento dell'allineamento verso il malvaglio</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Decadimento Morale",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Decadimento Morale"],
    });
  }
  get _c11() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.check.int",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Sbadato. Il personaggio diventa sbadato e la sua mente si annebbia facilmente. Ha svantaggio nei check su Intelligenza</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Sbadato",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Sbadato"],
    });
  }
  get _c12() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.dnd5e.initiativeDisadv",
          mode: 0,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Nervoso. Il personaggio diventa facilmente spaventabile. Ha svantaggio nei check di Iniziativa</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Nervoso",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Nervoso"],
    });
  }
  get _c13() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.check.dex",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Articolazioni marce. Il personaggio ha le articolazioni in disfacimento. Ha svantaggio nei check su Destrezza.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Articolazioni Marce",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Articolazioni Marce"],
    });
  }
  get _c14() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Parassiti interni. Il personaggio ha dei parassiti all'interno del suo corpo che lo consumano da dentro. Ogni volta che si usano Dadi vita per recuperare Punti ferita, questi sono dimezzati.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Parassiti Interni",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Parassiti Interni"],
    });
  }
  get _c15() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Fatica cronica. Il personaggio si affatica facilmente. Se il combattimento è durato almeno un minuto e non compie un riposo breve subito, prenderà un punto di affaticamento.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Fatica Cronica",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Fatica Cronica"],
    });
  }
  get _c16() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Moderatamente fobico. Il personaggio ha sviluppato una fobia nei confronti di un tipo di creature. In uno scontro, all'inizio del primo turno farà un TS su Saggezza (CD 10+ punti corruzione) in caso di fallimento sarà Spaventato per 1 minuto.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Red_Thumb.webp",
      name: "C2 Moderatamente Fobico",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C2 Moderatamente Fobico"],
    });
  }
  get _c17() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.save.dex",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "flags.midi-qol.disadvantage.ability.check.dex",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Schiena deformata. Il personaggio ha la schiena contorta. Ha svantaggio ai check di Destrezza e ai TS su Destrezza.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Schiena Deformata",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Schiena Deformata"],
    });
  }
  get _c18() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Omicida. Il personaggio è animato da uno spirito omicida nei confronti degli indifesi. Se un nemico o compagno è Incapacitato, il personaggio dovrà spendere il suo movimento in quella direzione e cercare di colpirlo.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Omicida",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Omicida"],
    });
  }
  get _c19() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.save.cha",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "flags.midi-qol.disadvantage.ability.check.cha",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Pelle avvizzita. Il personaggio ha la pelle tirata contro le ossa sembrano un orrore terrificante. Ha svantaggio ai check di Carisma e ai TS su Carisma.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Pelle Avvizzita",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Pelle Avvizzita"],
    });
  }
  get _c20() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Paranoico. Il personaggio non considera nessuno amichevole e nessuno lo considera amichevole al fine di Incantesimi o Abilità. Può bersagliare solo se stesso per Magie e Abilità.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Paranoico",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Paranoico"],
    });
  }
  get _c21() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.traits.dr.value",
          mode: 0,
          value: "healing",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Marchio Maledetto. Il personaggio ha un marchio nero sulla sua anima. Ogni Punto ferita guadagnato tramite incantesimi è dimezzato.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Marchio Maledetto",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Marchio Maledetto"],
    });
  }
  get _c22() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "flags.midi-qol.disadvantage.ability.save.wis",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "flags.midi-qol.disadvantage.ability.check.wis",
          mode: 2,
          value: "1",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Volontà rotta. Il personaggio ha la volontà a pezzi e la mente vulnerabile. Ha svantaggio nei check di Saggezza e nei TS di Saggezza.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Volonta Rotta",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Volonta Rotta"],
    });
  }
  get _c23() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "ATL.detectionModes.basicSight.range",
          mode: 2,
          value: "60",
          priority: 20,
        },
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Occhi di Ombra. Il personaggio ha degli occhi dalla sclera nera e le pupille sono come piccole fiamme verdi. Guadagna 60 ft di Scurovisione e Sensibilità alla luce del sole. Tutti gli attacchi, i check di percezione e qualsiasi cosa richeida l'ausilio della vista sono effettuati con svantaggio in piena luce solare.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Occhi Di Ombra",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Occhi Di Ombra"],
    });
  }
  get _c24() {
    return this._effectHelpers.createActiveEffect({
      changes: [
        {
          key: "system.resources.primary.value",
          mode: 2,
          value: "1",
          priority: 20,
        },
      ],
      description:
        "<p>Gravemente fobico. Il personaggio è fobico nei confronti di un tipo di creatura. All'inizio del primo round di combattimento è spaventato da tali creature e deve compire un TS su saggezza (CD 10+ Punti corruzione) Con un fallimento il personaggio è Stordito, può ripetere il tiro alla fine di ogni suo turno.</p>",
      disabled: false,
      duration: {
        rounds: null,
        seconds: null,
        turns: null,
        startTime: null,
        combat: null,
        startRound: null,
        startTurn: null,
      },
      flags: {
        "dfreds-convenient-effects": {
          isConvenient: true,
          isDynamic: false,
          isViewable: true,
          nestedEffects: [],
          subEffects: [],
        },
        "times-up": {
          isPassive: false,
        },
        dae: {
          selfTarget: false,
          selfTargetAlways: false,
          stackable: "noneName",
          showIcon: false,
          durationExpression: "",
          macroRepeat: "none",
          specialDuration: [],
        },
        ActiveAuras: {
          isAura: false,
          aura: "None",
          radius: "",
          alignment: "",
          type: "",
          ignoreSelf: false,
          height: false,
          hidden: false,
          displayTemp: false,
          hostile: false,
          onlyOnce: false,
        },
      },
      icon: "modules/jb2a_patreon/Library/4th_Level/Black_Tentacles/BlackTentacles_01_Dark_Purple_Thumb.webp",
      name: "C3 Gravemente Fobico",
      origin: "Item.6ZleUUk5rfaYA6ip",
      tint: null,
      transfer: false,
      statuses: ["Convenient Effect: C3 Gravemente Fobico"],
    });
  }
}
