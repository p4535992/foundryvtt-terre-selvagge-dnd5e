import { log } from "./lib/lib";

export function setPriceToZeroIfObjectIsNotCreatedByGM(doc, createData, options, user) {
  if (!game.user.isGM) {
    log(`setPriceToZeroIfObjectIsNotCreatedByGM for item '${createData.name}' on actor '${doc.actor?.name}'`);
    if (!createData.name || createData.name.includes("(Copy)") || createData.name.startsWith("New ")) {
      doc.updateSource({ "system.price.value": 0 });
    }
  }
}
