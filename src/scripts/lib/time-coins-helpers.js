export class TimeCoinsHelpers {
  // // Target Actor Folders
  // ACTOR_FOLDERS = ['Pool'];
  // ADD_QTD = 1;
  // TIME_COIN_DATA = (await fromUuid('Compendium.world.prodottifiniti.Item.kRCfy16NbjWDmmZN'))?.toObject();

  static async giveTimeCoins(actorFoldername, addQuantita, uuidItemTimeCoinOnCompendium) {
    const ACTOR_FOLDERS = [actorFoldername] ?? ["Pool"];
    const ADD_QTD = addQuantita ?? 1;
    const TIME_COIN_DATA = (await fromUuid(uuidItemTimeCoinOnCompendium))?.toObject();
    // ------------------------------------ //
    if (!TIME_COIN_DATA) {
      ui.notifications.error("Could not find Time Coin data");
      return;
    }
    TIME_COIN_DATA.system.quantity = ADD_QTD;

    // ------------------------------------ //
    const ACTORS = ACTOR_FOLDERS.map((name) => game.folders.getName(name))
      .filter((f) => f.type === "Actor")
      .map((f) => f.contents)
      .flat();
    if (ACTORS.length === 0) {
      ui.notifications.info(`No actors were found in the Actors Directory`);
      return;
    }
    ui.notifications.info(`Adding Time Coins to <b>${ACTORS.length}</b> actors... please wait`);

    // ------------------------------------ //
    let total = 0;
    for (const actor of ACTORS) {
      const item = actor.items.getName("Time Coin");
      if (item) {
        await item.update({ "system.quantity": item.system.quantity + ADD_QTD });
      } else await actor.createEmbeddedDocuments("Item", [TIME_COIN_DATA]);
      total += ADD_QTD;
    }

    ui.notifications.info(`Added ${total} Time Coins`);
  }
}
