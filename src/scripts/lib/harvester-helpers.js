import { info, error, warn } from "./lib";

export class HarvesterHelpers {
  //   static async updateHarvesterQuantityByRegEx() {
  //     function containsNumbers(str) {
  //       return /\d/.test(str);
  //     }
  //     const key = "harvester.harvest";
  //     const items = await game.packs.get(key).getDocuments();
  //     const updates = items.reduce((acc, i) => {
  //       if (!containsNumbers(i.name)) {
  //         return acc;
  //       }
  //       var numStr = i.name.replace(/\D/g, "");
  //       var num = parseInt(numStr);
  //       var arrNames = i.name.split("(");
  //       var newName = arrNames?.length > 0 ? arrNames[0] : i.name;

  //       return {
  //         _id: i.id,
  //         name: newName.trim(),
  //         "system.quantity": num,
  //         "system.price.value": Math.round(i.system.price.value / num),
  //         "system.weight": Math.round(i.system.weight / num),
  //       };
  //     }, []);
  //     await Item.updateDocuments(updates, { pack: key });
  //   }

  static async updateHarvesterQuantityByRegExOnFolder(uuidFolder) {
    const folder = await fromUuid(uuidFolder);
    if (!folder) {
      warn(`No folder founded with uuid :` + uuid);
      return;
    }
    function containsNumbers(str) {
      return /\d/.test(str);
    }
    const updates = folder.contents
      .filter((currentValue, index, array) => {
        if (containsNumbers(currentValue.name)) {
          return true;
        }
        return false;
      })
      .map((i) => {
        var nameTmp = i.name;
        if (nameTmp.includes("1d")) {
          nameTmp = nameTmp.replace("1d", "");
        }
        if (!containsNumbers(nameTmp)) {
          return i;
        }
        var numStr = nameTmp.match(/\d+/)[0]; //nameTmp.replace(/\D/g, "");
        var num = parseInt(numStr);
        var arrNames = nameTmp.replace(numStr, "").split("(");
        var newName = arrNames?.length > 0 ? arrNames[0] : nameTmp;

        var newItem = mergeObject(i, {
          // _id: i.id,
          name: newName.trim(),
          "system.quantity": num,
          "system.price.value": Math.round(i.system.price.value / num),
          "system.weight": Math.round(i.system.weight / num),
        });
        return newItem;
      }, []);

    // Foundry has some problem ....
    info("Stai aggiornando un numero di coumenti pari a :" + updates.length, true);
    const chunkSize = 1;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      if (containsNumbers(chunk[0].name)) {
        error("[" + i + "] Update: " + chunk[0].name, true);
      } else {
        await Item.updateDocuments(chunk);
      }
    }
    warn("COMPLETATO AGIORNAMENTO");
  }

  static async updateHarvesterQuantityByRegExOnCompendium(packToExportKey) {
    function containsNumbers(str) {
      return /\d/.test(str);
    }
    const key = "harvester.harvest";
    const items = await game.packs.get(key).getDocuments();
    const updates = items
      .filter((currentValue, index, array) => {
        if (containsNumbers(currentValue.name)) {
          return true;
        }
        return false;
      })
      .map((i) => {
        var nameTmp = i.name;
        if (nameTmp.includes("1d")) {
          nameTmp = nameTmp.replace("1d", "");
        }
        if (!containsNumbers(nameTmp)) {
          return i;
        }
        var numStr = nameTmp.match(/\d+/)[0]; //nameTmp.replace(/\D/g, "");
        var num = parseInt(numStr);
        var arrNames = nameTmp.replace(numStr, "").split("(");
        var newName = arrNames?.length > 0 ? arrNames[0] : nameTmp;

        var newItem = mergeObject(i, {
          name: newName.trim(),
          "system.quantity": num,
          "system.price.value": Math.round(i.system.price.value / num),
          "system.weight": Math.round(i.system.weight / num),
        });
        return newItem;
      }, []);

    // Foundry has some problem ....
    info("Stai aggiornando un numero di coumenti pari a :" + updates.length, true);
    const chunkSize = 1;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      if (containsNumbers(chunk[0].name)) {
        error("[" + i + "] Update: " + chunk[0].name, true);
      } else {
        await Item.updateDocuments(chunk, { pack: packToExportKey });
      }
    }
    warn("COMPLETATO AGIORNAMENTO");
  }
}
