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

  static async updateHarvesterQuantityByRegEx(packToExportKey) {
    function containsNumbers(str) {
      return /\d/.test(str);
    }
    const key = "harvester.harvest";
    const items = await game.packs.get(key).getDocuments();
    const updates = items.map((i) => {
      if (!containsNumbers(i.name)) {
        return i;
      }
      var numStr = i.name.match(/\d+/)[0]; //i.name.replace(/\D/g, "");
      var num = parseInt(numStr);
      var arrNames = i.name.replace(numStr, "").split("(");
      var newName = arrNames?.length > 0 ? arrNames[0] : i.name;

      var newItem = mergeObject(i, {
        // _id: i.id,
        name: newName.trim(),
        "system.quantity": num,
        "system.price.value": Math.round(i.system.price.value / num),
        "system.weight": Math.round(i.system.weight / num),
      });
      return newItem;
      //   return {
      //     _id: i.id,
      //     name: newName.trim(),
      //     "system.quantity": num,
      //     "system.price.value": Math.round(i.system.price.value / num),
      //     "system.weight": Math.round(i.system.weight/num)
      //   };
    }, []);

    // Foundry has some problem ....
    const chunkSize = 100;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      await Item.createDocuments(chunk, { pack: packToExportKey });
    }
    // await Item.createDocuments(updates, { pack: packToExportKey });
  }
}
