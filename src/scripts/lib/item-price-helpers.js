export class ItemPriceHelpers {
  // https://oatcookies.neocities.org/dndmoney

  static I(str) {
    return Number.parseInt(str, 10);
  }
  static F(str) {
    return Number.parseFloat(str);
  }
  static N(value) {
    if (Number.isNaN(value)) {
      return 0;
    }
    return value;
  }

  static convertToGold(priceValue, priceDenom) {
    return ItemPriceHelpers.recalcItemPriceValue(priceValue, priceDenom).gold;
  }

  static convertToSilver(priceValue, priceDenom) {
    return ItemPriceHelpers.recalcItemPriceValue(priceValue, priceDenom).silver;
  }

  static convertToCopper(priceValue, priceDenom) {
    return ItemPriceHelpers.recalcItemPriceValue(priceValue, priceDenom).copper;
  }

  static recalcItemPriceValue(priceValue, priceDenom) {
    let copper = 0;
    let silver = 0;
    let gold = 0;
    let electrum = 0;
    let platinum = 0;

    if (priceDenom === "cp") {
      copper = ItemPriceHelpers.N(ItemPriceHelpers.F(priceValue));
    }
    if (priceDenom === "sp") {
      silver = ItemPriceHelpers.N(ItemPriceHelpers.F(priceValue));
    }
    if (priceDenom === "gp") {
      gold = ItemPriceHelpers.N(ItemPriceHelpers.F(priceValue));
    }
    if (priceDenom === "ep") {
      electrum = ItemPriceHelpers.N(ItemPriceHelpers.F(priceValue));
    }
    if (priceDenom === "pp") {
      platinum = ItemPriceHelpers.N(ItemPriceHelpers.F(priceValue));
    }
    const pennies = copper + 10 * silver + 50 * electrum + 100 * gold + 1000 * platinum;
    return ItemPriceHelpers.recalc_pennies(pennies);
  }

  static recalc_pennies(pennies) {
    // const pennies = N(F(getvalue("pennies")));
    const copper = pennies % 10;
    const silver = ((pennies - copper) % 100) / 10;
    const gold = (pennies - copper - 10 * silver) / 100;
    //console.log(copper, silver, gold, pennies, pennies-copper);
    return {
      gold: gold,
      silver: silver,
      copper: copper,
    };
  }

  static retrieveAllCurrencyOfActorInGP(actor) {
    let copper = actor.system.currency.cp ?? 0;
    let silver = actor.system.currency.sp ?? 0;
    let gold = actor.system.currency.gp ?? 0;
    let electrum = actor.system.currency.ep ?? 0;
    let platinum = actor.system.currency.pp ?? 0;

    let totalGP = 0;
    totalGP += copper / 100;
    totalGP += silver / 10;
    totalGP += gold;
    totalGP += electrum / 2;
    totalGP += platinum * 10;

    return totalGP;
  }
}
