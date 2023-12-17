export class DaeHelpers {
  static isDaeModuleActive() {
    return game.modules.get("dae")?.active;
  }

  static async transferEffectsFromItemToItem(itemWherePutTheEffects, itemWithTheEffects) {
    const effects = itemWithTheEffects.effects ?? [];
    if (effects && effects.contents?.length > 0) {
      await itemWherePutTheEffects.createEmbeddedDocuments("ActiveEffect", effects.contents);
    }
  }

  static async fixTransferEffect(actor, item) {
    if (DaeHelpers.isDaeModuleActive()) {
      await game.modules.get("dae").api.fixTransferEffect(actor, item);
    }
  }

  static transferEffectToActor(actor, effect) {
    return CONFIG.ActiveEffect.documentClass.create(
      {
        ...effect.toObject(),
        origin: effect.parent.uuid,
      },
      { parent: actor }
    );
  }

  static transferEffectDataToActor(actor, effectData) {
    return CONFIG.ActiveEffect.documentClass.create(
      {
        ...effectData,
        origin: effectData.origin,
      },
      { parent: actor }
    );
  }
}
