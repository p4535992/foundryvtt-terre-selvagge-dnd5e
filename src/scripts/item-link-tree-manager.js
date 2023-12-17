import CONSTANTS from "./constants/constants";
import { BeaverCraftingHelpers } from "./lib/beavers-crafting-helpers";
import { ItemPriceHelpers } from "./lib/item-price-helpers";
import { ItemLinkTreeHelpers } from "./lib/item-link-tree-helpers";
import { ItemLinkingHelpers } from "./lib/item-linking-helper";
import { error, log, warn } from "./lib/lib";
import { DaeHelpers } from "./lib/dae-helpers";

export class ItemLinkTreeManager {
  static _cleanLeafAndGem(name) {
    return name
      .replaceAll(CONSTANTS.SYMBOL_UPGRADE, "")
      .replaceAll(CONSTANTS.SYMBOL_GEM, "")
      .replaceAll(CONSTANTS.SYMBOL_LEAF, "")
      .trim();
  }

  static managePreAddLeafToItem(item, itemAdded) {
    const isCrafted = BeaverCraftingHelpers.isItemBeaverCrafted(item);
    if (!isCrafted) {
      warn(`Non puoi aggiungere la gemma perche' l'oggetto di destinazione non e' craftato`, true);
      return false;
    }
    const quantityItem = item.system.quantity;
    if (quantityItem !== 1) {
      warn(
        `Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione a una quantita' superiore a 1 o uguale a 0`,
        true
      );
      return false;
    }
    const isItemLinked = ItemLinkingHelpers.isItemLinked(item);
    if (!isItemLinked) {
      warn(`Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione non e' linkato`, true);
      return false;
    }
    const isItemLeaf = ItemLinkTreeHelpers.isItemLeaf(item);
    if (isItemLeaf && !game.user.isGM) {
      warn(`Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione e' una gemma/foglia`, true);
      return false;
    }

    const isFilterByItemTypeOk = ItemLinkTreeHelpers.isFilterByItemTypeOk(itemAdded, item.type);
    if (!isFilterByItemTypeOk) {
      warn(
        `Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione e' un tipo non supportato '${item.type}'`,
        true
      );
      return false;
    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item) ?? [];
    for (const leaf of leafs) {
      const itemLeaf = fromUuidSync(leaf.uuid);
      if (itemLeaf && itemLeaf.name === itemAdded.name) {
        warn(
          `Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione a gia' una gemma/foglia di quel tipo`,
          true
        );
        return false;
      }
    }

    if (!game.user.isGM) {
      const isItemAddedLinked = ItemLinkingHelpers.isItemLinked(itemAdded);
      if (!isItemAddedLinked) {
        warn(`Non puoi aggiungere la gemma/foglia perche' non e' linkata`, true);
        return false;
      }
      const quantityItemAdded = itemAdded.system.quantity;
      if (quantityItemAdded < 1) {
        warn(`Non puoi aggiungere la gemma/foglia perche' la quantita' e' uguale < 1`, true);
        return false;
      }
    }
    // Make this check only if is not a crystal
    if (!ItemLinkTreeHelpers.isItemLeafBySubType(itemAdded, "crystal")) {
      const isGemCanBeAdded = ItemLinkTreeManager.checkIfYouCanAddMoreGemsToItem(item);
      if (!isGemCanBeAdded) {
        warn(
          `Non puoi aggiungere la gemma/foglia perche' l'oggetto di destinazione non puo' contenere altre gemme/foglie!`,
          true
        );
        warn(`Hai raggiunto il numero massimo di gemme per l'arma '${item.name}'`, true);
        return false;
      }
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
    const actor = item.actor;
    if (!actor) {
      return;
    }

    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item) ?? [];

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_UPGRADE, "").trim();
    currentName = currentName.replaceAll(CONSTANTS.SYMBOL_UPGRADE_OLD, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_UPGRADE.repeat(leafs.length);
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
      if (itemAdded.system.quantity > 1) {
        log(`Update quantity item '${itemAdded.name}|${itemAdded.id}'`);
        await itemAdded.update({ "system.quantity": itemAdded.system.quantity - 1 });
      } else {
        if (ItemLinkTreeHelpers.isItemLeafByFeature(itemAdded, "upgrade")) {
          // DO NOTHING
        } else {
          log(`Delete item '${itemAdded.name}|${itemAdded.id}'`);
          await actor.deleteEmbeddedDocuments("Item", [itemAdded.id]);
        }
      }
    }

    // await DaeHelpers.fixTransferEffect(actor, item);
  }

  static async managePostRemoveLeafFromItem(item, itemRemoved) {
    const actor = item.actor;
    if (!actor) {
      return;
    }
    const leafs = ItemLinkTreeHelpers.getCollectionEffectAndBonus(item) ?? [];

    let currentName = item.name.replaceAll(CONSTANTS.SYMBOL_UPGRADE, "").trim();
    currentName = currentName.replaceAll(CONSTANTS.SYMBOL_UPGRADE_OLD, "").trim();
    currentName = currentName + " ";
    currentName += CONSTANTS.SYMBOL_UPGRADE.repeat(leafs.length);
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

  static checkIfYouCanAddMoreGemsToItem(item) {
    const leafs = ItemLinkTreeHelpers.getCollectionBySubType(item, ["", "gem", "leaf"]);
    const quantityOfGem = leafs.length ?? 0;
    const rarity = item.system.rarity ?? "";
    let canAddGem = false;
    switch (rarity) {
      case "common": {
        if (quantityOfGem < 1) {
          canAddGem = true;
        }
        break;
      }
      case "uncommon": {
        if (quantityOfGem < 1) {
          canAddGem = true;
        }
        break;
      }
      case "rare": {
        if (quantityOfGem < 2) {
          canAddGem = true;
        }
        break;
      }
      case "veryRare":
      case "veryrare": {
        if (quantityOfGem < 2) {
          canAddGem = true;
        }
        break;
      }
      case "legendary": {
        if (quantityOfGem < 3) {
          canAddGem = true;
        }
        break;
      }
      case "artifact": {
        if (quantityOfGem < 3) {
          canAddGem = true;
        }
        break;
      }
      default: {
        if (rarity) {
          warn(`No quantity of gems is check for rarity '${rarity}'`);
        }
        canAddGem = false;
        break;
      }
    }
    return canAddGem;
  }

  static managePreUpgradeAdditionalCost(actor, currentItem, itemUpgraded, options) {
    let currentValuePrice = getProperty(currentItem, `system.price.value`) ?? 0;
    let currentDenomPrice = getProperty(currentItem, `system.price.denomination`) ?? "gp";
    let currentValuePriceGp = ItemPriceHelpers.convertToGold(currentValuePrice, currentDenomPrice);

    let priceValueToRemove = getProperty(itemUpgraded, `system.price.value`) ?? 0;
    let priceDenomToRemove = getProperty(itemUpgraded, `system.price.denomination`) ?? "gp";
    let priceValueToRemoveGp = ItemPriceHelpers.convertToGold(priceValueToRemove, priceDenomToRemove);

    let newCurrentValuePriceGp = currentValuePriceGp - priceValueToRemoveGp;
    // If current item is mre precious of the new one...
    if (newCurrentValuePriceGp > 0) {
      newCurrentValuePriceGp = 0;
    } else {
      newCurrentValuePriceGp = Math.abs(newCurrentValuePriceGp);
    }
    return newCurrentValuePriceGp;
  }

  static managePreUpgrade(actor, currentItem, itemUpgraded, options) {
    let newCurrentValuePriceGp = ItemLinkTreeManager.managePreUpgradeAdditionalCost(actor, currentItem, itemUpgraded);

    if (newCurrentValuePriceGp > 0) {
      const result = game.modules.get("lazymoney").api.hasEnoughCurrencySync({
        actor: actor.uuid,
        currencyValue: newCurrentValuePriceGp,
        currencyDenom: "gp",
      });
      if (!result) {
        error(`Non hai abbastanza denaro per effettuare l'upgrade`, true);
        return false;
      }
    }
    return true;
  }

  static async managePostUpgrade(actor, currentItem, itemUpgraded, options) {
    let newCurrentValuePriceGp = ItemLinkTreeManager.managePreUpgradeAdditionalCost(
      actor,
      currentItem,
      itemUpgraded,
      options
    );

    if (newCurrentValuePriceGp > 0) {
      let hasEnoughMoney = ItemLinkTreeManager.managePreUpgrade(actor, currentItem, itemUpgraded, options);
      if (!hasEnoughMoney) {
        throw error(`Non hai abbastanza denaro per effettuare l'upgrade`, true);
      }
      game.modules.get("lazymoney").api.subtractCurrencySync({
        actor: actor.uuid,
        currencyValue: newCurrentValuePriceGp,
        currencyDenom: "gp",
      });
    }
  }
}
