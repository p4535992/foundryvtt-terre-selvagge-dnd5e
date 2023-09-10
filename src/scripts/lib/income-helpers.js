import CONSTANTS from "../constants/constants";
import { error, warn, log, getItem, info, is_lazy_number, stringIsUuid } from "./lib";

export class IncomeHelpers {
  static async retrieveDetailsIncomeForActor(actorUuid) {
    const folderUuid = game.settings.get(CONSTANTS.MODULE_ID, `specificFolderJournalPersonsIncome`);
    const folderObject = await fromUuid(folderUuid);
    if (!folderObject) {
      warn(`00 No folder found for the reference '${folderUuid}'`, true);
      return;
    }
    const persons = folderObject.contents.filter((e) => {
      const journalPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return journalPersonType === "person";
    });
    for (const voice of persons) {
      const journalPerson = stringIsUuid(voice) ? await fromUuid(voice) : await fromUuid(voice.uuid);
      const journalPersonType = journalPerson.type
        ? journalPerson.type
        : getProperty(journalPerson, `flags.monks-enhanced-journal.pagetype`);
      if (journalPersonType != "person") {
        warn(`01 This journal person is not a type 'person' for the reference '${journalPerson}'`, true);
        continue;
      }
      const pages = journalPerson.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const actorJournalPage = await fromUuid(pages.contents[0].uuid);
      if (!actorJournalPage) {
        warn(`02 No journal person page is been found it for the reference '${journalPerson}'`, true);
        continue;
      }
      const actorJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.actor`);
      if (!actorJ) {
        warn(`03 No actor is present for the reference '${journalPerson}'`, true);
        continue;
      }
      if (actorJ.uuid === actorUuid) {
        const details = await IncomeHelpers.calculateIncomeForAPlayerJournalActor(journalPerson);
        log(`100 Details:` + JSON.stringify(details));
        break;
      }
    }
  }

  static async calculateIncomeForAllPlayerJournalActor() {
    const folderUuid = game.settings.get(CONSTANTS.MODULE_ID, `specificFolderJournalPersonsIncome`);
    const folderObject = await fromUuid(folderUuid);
    if (!folderObject) {
      warn(`04 No folder found for the reference '${folderUuid}'`, true);
      return;
    }
    const persons = folderObject.contents.filter((e) => {
      const journalPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return journalPersonType === "person";
    });
    const all = [];
    for (const voice of persons) {
      const journalActor = stringIsUuid(voice) ? await fromUuid(voice) : await fromUuid(voice.uuid);
      const details = IncomeHelpers.calculateIncomeForAPlayerJournalActor(journalActor);
      log(`101 Details:` + JSON.stringify(details));
      all.push(details);
    }
    return all;
  }

  static async calculateIncomeForAPlayerJournalActor(journalPersonUuid) {
    const journalPerson = stringIsUuid(journalPersonUuid)
      ? await fromUuid(journalPersonUuid)
      : await fromUuid(journalPersonUuid.uuid);
    if (!journalPerson) {
      warn(`05 No journal person page is been found it for the reference '${journalPlaceUuid}'`, true);
      return;
    }
    const journalPersonType = journalPerson.type
      ? journalPerson.type
      : getProperty(journalPerson, `flags.monks-enhanced-journal.pagetype`);
    if (journalPersonType != "person") {
      warn(`06 This journal person is not a type 'person' for the reference '${journalPersonUuid}'`, true);
      return;
    }
    const pages = journalPerson.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const actorJournalPage = await fromUuid(pages.contents[0].uuid);
    if (!actorJournalPage) {
      warn(`07 No journal person page is been found it for the reference '${journalPerson}'`, true);
      return;
    }
    const actorJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.actor`);
    if (!actorJ) {
      warn(`08 No actor is present for the reference '${journalPerson}'`, true);
      return;
    }
    const placesJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.relationships`)?.filter((e) => {
      const journalPlaceType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return journalPlaceType === "place";
    });
    const incomes = [];
    for (const placeJRel of placesJ) {
      const place = stringIsUuid(placeJRel) ? await fromUuid(placeJRel) : await fromUuid(placeJRel.uuid);
      if (!place) {
        warn(`09 No journal person page is been found it for the reference '${placeJRel.uuid}'`, true);
        continue;
      }
      const incomeCustomPlaceJ = is_lazy_number(placeJRel.relationship) ? parseInt(placeJRel.relationship) : 0;
      const details = await IncomeHelpers.calculateIncomeForAJournalPlace(place, actorJ);

      incomes.push({
        name: placeJRel.name,
        id: placeJRel.id,
        uuid: placeJRel.uuid,
        customIncome: incomeCustomPlaceJ,
        details: details,
      });
    }

    return incomes;
  }

  static async calculateIncomeForAJournalPlace(journalPlaceUuid, actorJ) {
    const journalPlace = stringIsUuid(journalPlaceUuid)
      ? await fromUuid(journalPlaceUuid)
      : await fromUuid(journalPlaceUuid.uuid);
    if (!journalPlace) {
      warn(`10 No journal place page is been found it for the reference '${journalPlaceUuid}'`, true);
      return;
    }
    const actor = stringIsUuid(actorJ) ? await fromUuid(actorJ) : await fromUuid(actorJ.uuid);
    if (!actor) {
      warn(`11 No actor is been found it for the reference '${actorJ}'`, true);
      return;
    }
    const journalPlaceType = journalPlace.type
      ? journalPlace.type
      : getProperty(journalPlace, `flags.monks-enhanced-journal.pagetype`);
    if (journalPlaceType !== "place") {
      warn(`12 This journal place is not a type 'person' for the reference '${journalPlace}'`, true);
      return;
    }
    const pages = journalPlace.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const placeJournalPage = await fromUuid(pages.contents[0].uuid);
    if (!placeJournalPage) {
      warn(`13 No journal place page is been found it for the reference '${journalPlace}'`, true);
      return;
    }
    const attributesPlaceJ = getProperty(placeJournalPage, `flags.monks-enhanced-journal.attributes`);
    const incomePlaceJ = is_lazy_number(attributesPlaceJ?.income?.value)
      ? parseInt(attributesPlaceJ?.income?.value)
      : 0;
    const upkeepPlaceJ = is_lazy_number(attributesPlaceJ?.upkeep?.value)
      ? parseInt(attributesPlaceJ?.upkeep?.value)
      : 0;
    const personsJ = getProperty(placeJournalPage, `flags.monks-enhanced-journal.relationships`)?.filter((e) => {
      const journalPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return (
        journalPersonType === "person" &&
        (e.relationship === actor.id || e.relationship === actor.name || e.relationship === actor.uuid)
      );
    });
    const arrWorkersRelActor = [];
    for (const personJRel of personsJ) {
      const journalPerson = stringIsUuid(personJRel) ? await fromUuid(personJRel) : await fromUuid(personJRel.uuid);
      if (!journalPerson) {
        warn(`14 No journal person page is been found it for the reference '${personJRel.uuid}'`, true);
        continue;
      }
      const pages = journalPerson.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const personJournalPage = await fromUuid(pages.contents[0].uuid);
      if (!personJournalPage) {
        warn(`15 No journal person page is been found it for the reference '${personJRel}'`, true);
        continue;
      }
      const attributesPersonJ = getProperty(personJournalPage, `flags.monks-enhanced-journal.attributes`);
      const costoPersonJ = is_lazy_number(attributesPersonJ?.costo?.value)
        ? parseInt(attributesPersonJ?.costo?.value)
        : 0;
      arrWorkersRelActor.push({
        name: journalPerson.name,
        id: journalPerson.id,
        uuid: journalPerson.uuid,
        costo: costoPersonJ,
      });
    }

    return {
      name: journalPlace.name,
      id: journalPlace.id,
      uuid: journalPlace.uuid,
      income: incomePlaceJ,
      upkeep: upkeepPlaceJ,
      workers: arrWorkersRelActor,
    };
  }
}
