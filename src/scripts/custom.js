import { log } from "./lib/lib";

export function setPriceToZeroIfObjectIsNotPreCreatedByGM(doc, createData, options, user) {
  if (!game.user.isGM) {
    const actor = doc.actor;
    log(`setPriceToZeroIfObjectIsNotPreCreatedByGM for item '${createData.name}' on actor '${actor?.name}'`);
    if (!createData.name || createData.name.includes("(Copy)") || createData.name.startsWith("New ")) {
      doc.updateSource({ "system.price.value": 0 });
    }
  }
}

export function setPriceToZeroIfObjectIsNotCreatedByGM(item, updates, isDifferent) {
  if (!game.user.isGM) {
    const actor = item.parent;
    log(`setPriceToZeroIfObjectIsNotCreatedByGM for item '${createData.name}' on actor '${actor?.name}'`);
    if (!item.name || item.name.includes("(Copy)") || item.name.startsWith("New ")) {
      if (getProperty(item, "system.price.value") >= 0) {
        item.update({ "system.price.value": 0 });
      }
    }
  }
}
