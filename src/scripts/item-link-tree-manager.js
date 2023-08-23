import CONSTANTS from "./constants/constants";
import { BeaverCraftingHelpers } from "./lib/beavers-crafting-helpers";
import { ItemPriceHelpers } from "./lib/item-price-helpers";
import { ItemLinkTreeHelpers } from "./lib/item-link-tree-helpers";
import { ItemLinkingHelpers } from "./lib/item-linking-helper";
import { checkIfYouCanAddMoreGemsToItem, log, warn } from "./lib/lib";

export class ItemLinkTreeManager {
  static managePreAddLeafToItem(item, itemAdded) {
    const isCrafted = BeaverCraftingHelpers.isItemBeaverCrafted(item);
    if (!isCrafted) {
      warn(`Non puoi aggiungere la gemma perche' l'oggetto di destinazione non e' craftato`, true);
      return false;
    }
    const isItemLinked = ItemLinkingHelpers.isItemLinked(item);
    if (!isItemLinked) {
      warn(`Non puoi aggiungere la gemma perche' l'oggetto di destinazione non e' linkato`, true);
      return false;
    }
    const isItemAddedLinked = ItemLinkingHelpers.isItemLinked(itemAdded);
    if (!isItemAddedLinked) {
      warn(`Non puoi aggiungere la gemma perche' non e' linkata`, true);
      return false;
    }
    const isGemCanBeAdded = checkIfYouCanAddMoreGemsToItem(item);
    if (!isGemCanBeAdded) {
      warn(`Non puoi aggiungere la gemma perche' l'oggetto di destinazione non puo' contenere altre gemme!`, true);
      warn(`Hai raggiunto il numero massimo di gemme per l'arma '${item.name}'`, true);
      return false;
    }

    // if (!game.user.isGM) {
    //   const shouldAddLeaf = await Dialog.confirm({
    //     title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialog.warning.areyousuretoadd.name`),
    //     content: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialog.warning.areyousuretoadd.hint`),
    //   });

    //   if (!shouldAddLeaf) {
    //     return false;
    //   }
    // }

    return true;
  }

  static async managePreRemoveLeafFromItem(item, itemRemoved) {
    // NOTHING FOR NOW
  }

  static async managePostAddLeafToItem(item, itemAdded) {
    const customType = getProperty(itemAdded, `flags.item-link-tree.customType`) ?? "";
    // const prefix = getProperty(itemAdded, `flags.item-link-tree.prefix`) ?? "";
    // const suffix = getProperty(itemAdded, `flags.item-link-tree.suffix`) ?? "";

    if (customType === "bonus" || customType === "effectAndBonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToAdd = game.modules.get("babonus").api.getCollection(itemAdded) ?? [];
      if (bonusesToAdd.size > 0) {
        for (const bonusToAdd of bonusesToAdd) {
          let foundedBonus = false;
          for (const bonus of bonuses) {
            if (bonus.name === bonusToAdd.name) {
              foundedBonus = true;
              break;
            }
          }
          if (!foundedBonus) {
            log(`Aggiunto bonus '${bonusToAdd.name}'`, true);
            await game.modules.get("babonus").api.embedBabonus(item, bonusToAdd);
          }
        }
      }
    }
    if (customType === "effect" || customType === "effectAndBonus") {
      const effects = item.effects ?? [];
      const effectsToAdd = itemAdded.effects ?? [];
      if (effectsToAdd.size > 0) {
        for (const effectToAdd of effectsToAdd) {
          let foundedEffect = false;
          for (const effect of effects) {
            if (effect.name === effectToAdd.name) {
              foundedEffect = true;
              break;
            }
          }
          if (!foundedEffect) {
            log(`Aggiunto effect '${effectToAdd.name}'`, true);
            const effectData = effectToAdd.toObject();
            setProperty(effectData, `origin`, item.uuid);
            setProperty(effectData, `flags.core.sourceId`, item.uuid);
            await item.createEmbeddedDocuments("ActiveEffect", [effectData]);
          }
        }
      }
    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item);

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_DIAMOND, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_DIAMOND.repeat(leafs.length);
    currentName = currentName.trim();

    let currentValuePrice = getProperty(item, `system.price.value`) ?? 0;
    let currentDenomPrice = getProperty(item, `system.price.denomination`) ?? "gp";
    let currentValuePriceGp = ItemPriceHelpers.convertToGold(currentValuePrice, currentDenomPrice);

    let priceValueToAdd = getProperty(itemAdded, `system.price.value`) ?? 0;
    let priceDenomToAdd = getProperty(itemAdded, `system.price.denomination`) ?? "gp";
    let priceValueToAddGp = ItemPriceHelpers.convertToGold(priceValueToAdd, priceDenomToAdd);

    let newCurrentValuePriceGp = currentValuePriceGp + priceValueToAddGp;
    if (newCurrentValuePriceGp < 0) {
      newCurrentValuePriceGp = 0;
    }
    await item.update({
      name: currentName,
      "system.price.value": newCurrentValuePriceGp,
      "system.price.denomination": "gp",
    });

    if (itemAdded.actor instanceof CONFIG.Actor.documentClass) {
      const actor = itemAdded.actor;
      log(`Rimosso item '${itemAdded.name}'`, true);
      await actor.deleteEmbeddedDocuments("Item", [itemAdded.id]);
    }
  }

  static async managePostRemoveLeafFromItem(item, itemRemoved) {
    const customType = getProperty(itemRemoved, `flags.item-link-tree.customType`) ?? "";
    // const prefix = getProperty(itemRemoved, `flags.item-link-tree.prefix`) ?? "";
    // const suffix = getProperty(itemRemoved, `flags.item-link-tree.suffix`) ?? "";

    if (customType === "bonus" || customType === "effectAndBonus") {
      const bonuses = game.modules.get("babonus").api.getCollection(item) ?? [];
      const bonusesToRemove = game.modules.get("babonus").api.getCollection(itemRemoved) ?? [];
      if (bonusesToRemove.size > 0) {
        for (const bonusToRemove of bonusesToRemove) {
          for (const bonus of bonuses) {
            if (bonus.name === bonusToRemove.name) {
              log(`Rimosso bonus '${bonus.name}'`, true);
              await game.modules.get("babonus").api.deleteBonus(item, bonus.id);
            }
          }
        }
      }
    }
    if (customType === "effect" || customType === "effectAndBonus") {
      const effects = item.effects ?? [];
      const effectsToRemove = itemRemoved.effects ?? [];
      if (effectsToRemove.size > 0) {
        for (const effectToRemove of effectsToRemove) {
          for (const effect of effects) {
            if (effect.name === effectToRemove.name) {
              log(`Rimosso effect '${effect.name}'`, true);
              await item.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
            }
          }
        }
      }
    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item);

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_DIAMOND, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_DIAMOND.repeat(leafs.length);
    currentName = currentName.trim();

    let currentValuePrice = getProperty(item, `system.price.value`) ?? 0;
    let currentDenomPrice = getProperty(item, `system.price.denomination`) ?? "gp";
    let currentValuePriceGp = ItemPriceHelpers.convertToGold(currentValuePrice, currentDenomPrice);

    let priceValueToRemove = getProperty(itemRemoved, `system.price.value`) ?? 0;
    let priceDenomToRemove = getProperty(itemRemoved, `system.price.denomination`) ?? "gp";
    let priceValueToRemoveGp = ItemPriceHelpers.convertToGold(priceValueToRemove, priceDenomToRemove);

    let newCurrentValuePriceGp = currentValuePriceGp - priceValueToRemoveGp;
    if (newCurrentValuePriceGp < 0) {
      newCurrentValuePriceGp = 0;
    }
    await item.update({
      name: currentName,
      "system.price.value": newCurrentValuePriceGp,
      "system.price.denomination": "gp",
    });
  }
}
