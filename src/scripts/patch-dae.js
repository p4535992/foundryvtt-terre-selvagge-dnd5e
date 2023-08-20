import CONSTANTS from "./constants/constants";
import { debug, isEmptyObject, warn } from "./lib/lib";

export function patchDAECreateActiveEffect(effect, _config, _userId) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "patchDAE")) {
    return;
  }
  debug("Patch DAE CreateActiveEffect");
  if (effect.parent instanceof Item && effect.parent.parent instanceof Actor) {
    const item = effect.parent;
    const actor = effect.parent.parent;
    let isAlreadyOnActor = false;
    for (const effectPresent of actor.effects) {
      if (effectPresent.origin === item.uuid && effectPresent.name === effect.name) {
        isAlreadyOnActor = true;
        break;
      }
    }
    if (!isAlreadyOnActor) {
      debug("Attempting to Transfer an effect to an Actor", { effectUuid: effect.uuid, actor: item.parent });
      return CONFIG.ActiveEffect.documentClass.create(
        {
          ...effect.toObject(),
          origin: effect.parent.uuid,
        },
        { parent: item.parent }
      );
    }
    return;
  }
}

export async function patchDAEDeleteActiveEffect(effect, _config, _userId) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "patchDAE")) {
    return;
  }
  debug("Patch DAE DeleteActiveEffect");
  if (effect.parent instanceof Item && effect.parent.parent instanceof Actor) {
    const item = effect.parent;
    const actor = effect.parent.parent;
    for (const effectToDelete of actor.effects) {
      if (effectToDelete.origin === item.uuid && effectToDelete.name === effect.name) {
        debug(`Deleted effect ${effectToDelete.name}|${effectToDelete.id}`);
        effectToDelete.delete();
      }
    }
  }
}

export async function patchDAEUpdateActiveEffect(effect, _config, _userId) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "patchDAE")) {
    return;
  }
  debug("Patch DAE UpdateActiveEffect");
  if (effect.parent instanceof Item && effect.parent.parent instanceof Actor) {
    const item = effect.parent;
    const actor = effect.parent.parent;
    let isAlreadyOnActor = false;
    for (const effectPresent of actor.effects) {
      if (effectPresent.origin === item.uuid && effectPresent.name === effect.name) {
        isAlreadyOnActor = true;
        break;
      }
    }
    if (!isAlreadyOnActor) {
      debug("Attempting to Transfer an effect to an Actor", { effectUuid: effect.uuid, actor: item.parent });
      // return await CONFIG.ActiveEffect.documentClass.create(
      //   {
      //     ...effect.toObject(),
      //     origin: effect.parent.uuid,
      //   },
      //   { parent: item.parent }
      // );
    }
    return;
  }
}

// export function patchDAEPreCreateActiveEffect(activeEffect, _config, _userId) {
//   warn("Patch DAE PreCreateActiveEffect");
//   patchActiveEffect(activeEffect);
// }

// export function patchDAEPreUpdateActiveEffect(activeEffect, _config, _userId) {
//   warn("Patch DAE PreUpdateActiveEffect");
//   patchActiveEffect(activeEffect);
// }

// PERCHE' CAZZO NON FUNZIONA ????
function patchActiveEffect(activeEffect) {
  if (!activeEffect.flags?.core?.statusId) {
    if (isEmptyObject(activeEffect.flags?.core)) {
      setProperty(activeEffect, `flags.core`, {});
    }
    activeEffect.flags.core.statusId = activeEffect.flags?.core?.statusId ?? "";
  }
  if (activeEffect.flags?.core?.statusId && (!activeEffect.statuses || activeEffect.statuses.length === 0)) {
    activeEffect.statuses = [activeEffect.flags.core.statusId];
    delete activeEffect.flags.core.statusId;
  } else {
    if (!activeEffect.statuses || activeEffect.statuses.length === 0) {
      activeEffect.statuses = [];
    }
  }
  if (!activeEffect.flags?.core?.sourceId) {
    if (isEmptyObject(activeEffect.flags?.core)) {
      setProperty(activeEffect, `flags.core`, {});
    }
    activeEffect.flags.core.sourceId = activeEffect.flags?.core?.sourceId ?? activeEffect.uuid;
  }
}

function onManageActiveEffect(effect, action = "transfer") {
  if (effect.parent instanceof Item && effect.parent.parent instanceof Actor) {
    const item = effect.parent;
    debug("Attempting to Transfer an effect to an Actor" + { effectUuid: effect.uuid, actor: item.parent });
    return CONFIG.ActiveEffect.documentClass.create(
      {
        ...effect.toObject(),
        origin: effect.parent.uuid,
      },
      { parent: item.parent }
    );
  }
  // if (action === "create") {
  //     let name = item.name ?? game.i18n.localize("DND5E.EffectNew");
  //     let i = 0;
  //     while (item.effects.some((ef) => ef.name === name)) {
  //     i += 1;
  //     name = (item.name ?? game.i18n.localize("DND5E.EffectNew")) + ` ${i}`;
  //     }
  //     return item.createEmbeddedDocuments("ActiveEffect", [
  //     {
  //         name,
  //         icon: item.img ?? "icons/svg/aura.svg",
  //         origin: item.uuid,
  //         "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
  //         transfer: li.dataset.effectType === "passive",
  //         disabled: li.dataset.effectType === "inactive",
  //     },
  //     ]);
  // } else if (action === "transfer" && item.parent instanceof Actor) {
  //     debug("Attempting to Transfer an effect to an Actor", { effectUuid: effect.uuid, actor: item.parent });
  //     return CONFIG.ActiveEffect.documentClass.create(
  //     {
  //         ...effect.toObject(),
  //         origin: effect.parent.uuid,
  //     },
  //     { parent: item.parent }
  //     );
  // } else {
  //     // CONFIG.ActiveEffect.documentClass.onManageActiveEffect(event, owner);
  // }
}
