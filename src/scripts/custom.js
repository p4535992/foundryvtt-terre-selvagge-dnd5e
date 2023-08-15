import CONSTANTS from "./constants/constants";
import { log, rollFormulaWithActorASync, rollFormulaWithActorSync } from "./lib/lib";

export function setPriceToZeroIfObjectIsNotPreCreatedByGM(doc, createData, options, user) {
  if (!game.user.isGM) {
    const actor = doc.actor;
    log(`setPriceToZeroIfObjectIsNotPreCreatedByGM for item '${createData.name}' on actor '${actor?.name}'`);
    if (
      !createData.name ||
      createData.name.includes("(Copy)") ||
      createData.name.includes("(Copia)") ||
      createData.name.startsWith("New ")
    ) {
      doc.updateSource({
        "system.price.value": 0,
      });
    }
  }
}

export function setPriceToZeroIfObjectIsNotCreatedByGM(item, updates, isDifferent) {
  if (!game.user.isGM) {
    const actor = item.parent;
    log(`setPriceToZeroIfObjectIsNotCreatedByGM for item '${createData.name}' on actor '${actor?.name}'`);
    if (!item.name || item.name.includes("(Copy)") || item.name.includes("(Copia)") || item.name.startsWith("New ")) {
      if (getProperty(item, "system.price.value") >= 0) {
        item.update({
          "system.price.value": 0,
          "flags.item-linking.isLinked": null,
        });
      }
    }
  }
}

/**
 * in pratica, siccome il crafting e' importante, i pg devono avere proficiency nei tools per usarli. e io volevo che fosse cosi. ma mi hanno chiesto se gentilmente si potesse craftare anche senza proficiency nei tools
 * allora siamo arrivati ad un compromesso.. possono usare tutti i tools, ma se non hanno proficiency beccano un malus anche (non solo l'assenza della proficiency)
 * che se devono fare cose stupidine con CD 8 gli va pure bene..
 * ma se devono fare cose con CD20.. quel -2 li fa pensare due volte prima di provarci
 */
export function applyCustomRuleForCraftingItemsWithoutProficiency(actor, itemData, type) {
  // Proficiencies : itemData.data.prof = "2"
  // Half Proficiencies : itemData.data.prof = "1"
  // Expertise : itemData.data.prof = "4"
  // No Proficiency : itemData.data.prof = is a object

  const prof = itemData.data.prof;
  const isNotProficient = prof !== "2" && prof !== "1" && prof !== "3" && prof !== "4" && prof.hasProficiency != null;

  if (isNotProficient) {
    const parts = duplicate(itemData.parts);

    log(`applyCustomRuleForCraftingItemsWithoutProficiency for item '${itemData.flavor}' on actor '${actor?.name}'`);
    const negativeEffectFormula = game.settings.get(CONSTANTS.MODULE_ID, "formulaCraftingToolNoProf") ?? "-2";
    const resultNegativeEffect = rollFormulaWithActorSync(negativeEffectFormula, actor);
    parts.push(resultNegativeEffect);

    foundry.utils.setProperty(itemData, "parts", parts);
  }

  // parts = duplicate(args[1].parts)

  // //parts: (5) ['@mod', '@abilityCheckBonus', '@prof', '@toolBonus', '@checkBonus']

  // //parts[0] is the @mod used for the Tool Roll, change it by using whatever, eg: "@abilities.str.mod + @abilities.con.value - 15"

  // //parts[1] is the abilityCheckBonus, which you set in the settings menu from the small cog on the side of the actual Ability score on the character sheet

  // //parts[2] is the proficiency modifier.

  // //parts[3] is the Tool Bonus from the Tool settings

  // //parts[4] is the Global Ability Check Bonus

  // //parts[0] and parts[1] will always be shown on the resulted card even when they are "0", which is annoying me.
  // //The rest will be dropped if "0".

  // //And a small example

  // parts[0] = "@abilities.str.mod" //this will change the mod used
  // parts = parts.concat("1") // this will add a generic +1 at the end of the parts
  // foundry.utils.setProperty(args[1],"parts",parts)
}
