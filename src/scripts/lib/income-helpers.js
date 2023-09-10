import { error, warn, log, getItem, info, is_lazy_number } from "./lib";

export class IncomeHelpers {
  static async calculateIncomeFroAll(folderUuid, applyNewCurrency) {
    const folderObject = await fromUuid(folderUuid);
    if (!folderObject) {
      warn(`No folder found for the reference '${folderUuid}'`, true);
      return;
    }
    for (const voice of folderObject.contents) {
      const details = calculateIncomeForAJournalActor(voice);
      log(`Details:` + details);
    }
  }

  static async calculateIncomeForAPlayerJournalActor(journalPersonUuid) {
    const journalPerson = await fromUuid(journalPersonUuid);
    if (getProperty(journalPerson, `flags["monks-enhanced-journal"].pagetype`) === "person") {
      const pages = journalPerson.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const actorJournalPage = await fromUuid(pages[0].uuid);
      if (!actorJournalPage) {
        warn(`No journal person page is been found it for the reference '${journalPerson}'`, true);
        return;
      }
      const actorJ = actorJournalPage.value.flags["monks-enhanced-journal"]?.actor;
      if (!actorJ) {
        warn(`No actor is present for the reference '${journalPerson}'`, true);
        return;
      }
      const placesJ = getProperty(actorJournalPage, `flags["monks-enhanced-journal"].relationships`)?.filter((e) => {
        return e.type === "place";
      });
      const incomeObj = {};
      for (const placeJRel of placesJ) {
        const place = await fromUuid(placeJRel.uuid);
        if (!place) {
          warn(`No journal person page is been found it for the reference '${placeJRel.uuid}'`, true);
          continue;
        }
        const incomeCustomPlaceJ = is_lazy_number(placeJRel.relationship) ? parseInt(placeJRel.relationship) : 0;

        incomeObj[placeJRel.id] = {
          name: placeJRel.name,
          customIncome: incomeCustomPlaceJ,
          details: IncomeHelpers.calculateIncomeForAJournalPlace(place.uuid),
        };
      }

      return incomeObj;
    } else {
      warn(`This journal person is not a type 'person' for the reference '${journalPerson}'`, true);
      return;
    }
  }

  static async calculateIncomeForAJournalPlace(journalPlaceUuid, actorJ) {
    const journalPlace = await fromUuid(journalPlaceUuid);
    if (!journalPlace) {
      warn(`No journal person page is been found it for the reference '${journalPlaceUuid}'`, true);
      return;
    }
    if (getProperty(journalPlace, `flags["monks-enhanced-journal"].pagetype`) === "place") {
      const pages = journalPlace.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const placeJournalPage = await fromUuid(pages[0].uuid);
      if (!placeJournalPage) {
        warn(`No journal place page is been found it for the reference '${journalPlace}'`, true);
        return;
      }
      const attributesPlaceJ = getProperty(placeJournalPage, `flags["monks-enhanced-journal"].attributes`);
      const incomePlaceJ = is_lazy_number(attributesPlaceJ?.income?.value) ? parseInt(attributesPlaceJ?.income) : 0;
      const upkeepPlaceJ = is_lazy_number(attributesPlaceJ?.upkeep?.value) ? parseInt(attributesPlaceJ?.upkeep) : 0;
      const personsJ = getProperty(placeJournalPage, `flags["monks-enhanced-journal"].relationships`)?.filter((e) => {
        return (
          e.type === "person" &&
          (e.relationship === actorJ.id || e.relationship === actorJ.name || e.relationship === actorJ.uuid)
        );
      });
      const arrWorkersRelActor = [];
      for (const personJRel of personsJ) {
        const journalPerson = await fromUuid(personJRel.uuid);
        if (!journalPerson) {
          warn(`No journal person page is been found it for the reference '${personJRel.uuid}'`, true);
          continue;
        }
        const pages = journalPerson.pages;
        // MJE TYPE ARE ONE ONLY PAGE JOURNAL
        const personJournalPage = await fromUuid(pages[0].uuid);
        if (!personJournalPage) {
          warn(`No journal person page is been found it for the reference '${personJRel}'`, true);
          continue;
        }
        const attributesPersonJ = getProperty(personJournalPage, `flags["monks-enhanced-journal"].attributes`);
        const costoPersonJ = is_lazy_number(attributesPersonJ?.costo?.value) ? parseInt(attributesPersonJ?.costo) : 0;
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
    } else {
      warn(`This journal place is not a type 'person' for the reference '${journalPlace}'`, true);
      return;
    }
  }
}
