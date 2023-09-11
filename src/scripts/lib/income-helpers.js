import CONSTANTS from "../constants/constants";
import { ItemPriceHelpers } from "./item-price-helpers";
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

    const resultObj = {};
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
        resultObj[actorJ.uuid] = details;
        break;
      }
    }

    await IncomeHelpers.prepareChatCard(actorUuid, resultObj[actorUuid]);

    return resultObj;
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

    // START RECUPERO BANCA
    const bancaPersonJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.relationships`)?.filter((e) => {
      const bancaPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return bancaPersonType === "person" && String(e.relationship)?.toLowerCase() === "banca";
    });
    if (!bancaPersonJ) {
      warn(`09 No journal person for banca page is been found it for the reference '${actorJournalPage}'`, true);
      return;
    }
    const bancaPages = bancaPersonJ.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const actorBancaJournalPage = await fromUuid(bancaPages.contents[0].uuid);
    if (!actorBancaJournalPage) {
      warn(`09 No journal person page for banca  is been found it for the reference '${bancaPersonJ}'`, true);
      return;
    }
    const actorBancaJ = getProperty(actorBancaJournalPage, `flags.monks-enhanced-journal.actor`);
    if (!actorBancaJ) {
      warn(`09 No actor banca is present for the reference '${actorBancaJournalPage}'`, true);
      return;
    }

    const actorBanca = await fromUuid(actorBancaJ.uuid);
    if (!actorBanca) {
      warn(`09 No actor banca is present for the reference '${actorBancaJ}'`, true);
      return;
    }
    // END RECUPERO BANCA

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
        actor: actorJ.uuid,
        actorBanca: actorBanca.uuid,
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

  static async calculateTotalFromDetails(details) {
    let totalIncome = 0;
    for (const place of details) {
      let namePlace = place.name;
      let customIncome = place.customIncome;

      totalIncome = totalIncome + customIncome;

      let placeIncome = place.details.income;
      let placeUpkeep = 0 - place.details.upkeep;

      totalIncome = totalIncome + placeIncome;
      totalIncome = totalIncome + placeUpkeep;

      for (const worker of place.details.workers) {
        const workerName = worker.name;
        const workerCosto = 0 - worker.costo;

        totalIncome = totalIncome + workerCosto;
      }
    }

    return totalIncome;
  }

  /*
  [
    {
        "name": "Scuola",
        "id": "UQibzl5E4XrZpWdx",
        "uuid": "JournalEntry.UQibzl5E4XrZpWdx",
        "customIncome": -40,
        "actorBanca": "Actor.tyerueve23"
        "details": {
            "name": "Scuola",
            "id": "UQibzl5E4XrZpWdx",
            "uuid": "JournalEntry.UQibzl5E4XrZpWdx",
            "income": 0,
            "upkeep": 0,
            "workers": [
                {
                    "name": "Jia, Insegnante",
                    "id": "jnRZjl4XljYLSKui",
                    "uuid": "JournalEntry.jnRZjl4XljYLSKui",
                    "costo": 30
                },
                {
                    "name": "Lydia, Insegnante",
                    "id": "Y4X3skMFXh2wUKKZ",
                    "uuid": "JournalEntry.Y4X3skMFXh2wUKKZ",
                    "costo": 30
                }
            ]
        }
    },
    {
        "name": "Boutique",
        "id": "CbPeeyPQlI5iK9Hv",
        "uuid": "JournalEntry.CbPeeyPQlI5iK9Hv",
        "customIncome": -10,
        "details": {
            "name": "Boutique",
            "id": "CbPeeyPQlI5iK9Hv",
            "uuid": "JournalEntry.CbPeeyPQlI5iK9Hv",
            "income": 225,
            "upkeep": 0,
            "workers": []
        }
    }
]
*/
  static async prepareChatCard(actorP, details) {
    function colorSetter(number, low, high) {
      if (number <= low) return `color:red;`;
      if (number >= high) return `color:green;`;
      return ``;
    }

    function average(nums) {
      return nums.reduce((a, b) => a + b) / nums.length;
    }

    const actor = stringIsUuid(actorP.uuid ? actorP.uuid : actorP) ? await fromUuid(actorP) : actorP;
    if (!actor) {
      warn(`18 No actor is present for the reference '${actorP}'`, true);
      return;
    }
    const actorBanca = stringIsUuid(details.actorBanca.uuid ? details.actorBanca.uuid : details.actorBanca)
      ? await fromUuid(details.actorBanca)
      : details.actorBanca;
    if (!actorBanca) {
      warn(`18 No actor banca is present for the reference '${details.actorBanca}'`, true);
      return;
    }
    if (!details) {
      warn(`19 No details is present for the reference '${actorP}'`, true);
      return;
    }

    // const detailsForActor = IncomeHelpers.retrieveDetailsIncomeForActor(actor.uuid);
    // const details = detailsForActor[actor.uuid];

    let actorBancaGp = ItemPriceHelpers.retrieveAllCurrencyOfActorInGP(actorBanca);
    let statString = `Calcolo dell'income`;
    let total_header = 4; // Place + Worker + Income + Cost

    let content = `
    <table style="text-align:center">
    <tr>
        <th colspan="${total_header + 1}">Actor: ${actor.name} (Banca: ${actorBanca.name})</th>
    </tr>
    <tr>
      <th colspan="${total_header + 1}">Total gold on banca: ${actorBancaGp})</th>
    </tr>
    <tr style="border-bottom:1px solid #000">
        <th colspan="${total_header + 1}">${statString}</th>
    </tr>
    <tr style="border-bottom:1px solid #000">
        <th>Place</th>
        <th>Worker</th>
        <th>Income</th>
        <th>Cost</th>
        <th style ="border-left:1px solid #000">Total</th>
    </tr>`;

    let return_value = content;

    for (const place of details) {
      let namePlace = place.name;
      let customIncome = place.customIncome;
      let rowOnlyPlaceCustomIncome = `<tr>
            <td>${namePlace}</td>
            <td>${actor.name}</td>
            <td style="${colorSetter(customIncome, 0, 0)}">${customIncome}</td>
            <td></td>
            <td style="${colorSetter(customIncome, 0, 0)} border-left:1px solid #000;">${customIncome}</td>
        </tr>`;

      return_value = return_value + rowOnlyPlaceCustomIncome;

      let placeIncome = place.details.income;
      let placeUpkeep = 0 - place.details.upkeep;

      let rowOnlyPlace = `<tr>
            <td>${namePlace}</td>
            <td></td>
            <td style="${colorSetter(placeIncome, 0, 0)}">${placeIncome}</td>
            <td style="${colorSetter(placeUpkeep, 0, 0)}">${placeUpkeep}</td>
            <td style="${colorSetter(placeIncome - placeUpkeep, 0, 0)} border-left:1px solid #000;">${
        placeIncome + placeUpkeep
      }</td>
        </tr>`;

      return_value = return_value + rowOnlyPlace;

      for (const worker of place.details.workers) {
        const workerName = worker.name;
        const workerCosto = 0 - worker.costo;

        let rowOnlyWorker = `<tr>
                <td>${namePlace}</td>
                <td>${workerName}</td>
                <td></td>
                <td style="${colorSetter(workerCosto, 0, 0)}">${workerCosto}</td>
                <td style="${colorSetter(workerCosto, 0, 0)} border-left:1px solid #000;">${workerCosto}</td>
            </tr>`;

        return_value = return_value + rowOnlyWorker;
      }

      let separatorRow = `<tr style="border-bottom:1px solid #000"><td></td></tr>`;
      return_value = return_value + separatorRow;
    }

    const totalIncome = await IncomeHelpers.calculateTotalFromDetails(details);

    let finalSum = `<tr>
        <td colspan="${total_header}" style="border-top:1px solid #000;"> Sum : </td>
        <td style="${colorSetter(
          totalIncome,
          0,
          0
        )} border-left:1px solid #000; border-top:1px solid #000;">${totalIncome}</td>
    </tr>`;

    return_value = return_value + finalSum;

    let isInActive = totalIncome >= 0;
    let isPoor = totalIncome < 0 ? actorBancaGp < totalIncome : false;

    if (isInActive) {
      let finalWarn = `<tr>
            <td colspan="${
              total_header + 1
            }" style="color:green; font-weight: bold; border-bottom:1px solid #000; border-top:1px solid #000;">${"Il giocatore e' in attivo"}</td>
        </tr>`;

      return_value = return_value + finalWarn;
    } else {
      let finalWarn = `<tr>
            <td colspan="${total_header + 1}" style="${
        isPoor ? "color:red;" : "color:green;"
      } font-weight: bold; border-top:1px solid #000;">${
        isPoor ? "Il giocatore non ha abbastanza soldi" : "Il giocatore ha abbastanza soldi"
      }</td>
        </tr>`;

      return_value = return_value + finalWarn;
    }

    // let applyWarn = `
    // <tr><td colspan="${total_header + 1}" style="font-weight: bold;">
    //     ${"Inserisci l'uuid dell'attore sul dialogo della macro di applicazione se tutto ti torna"}</td>
    // </tr>
    // <tr><td colspan="${total_header + 1}" style="font-weight: bold; border-bottom:1px solid #000;">
    //     ${actor.uuid}</td>
    // </tr>
    // `;

    // return_value = return_value + applyWarn;

    return_value = return_value + `</table>`;

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      whisper: game.users.filter((u) => u.isGM).map((u) => u.id),
      content: return_value,
    };
    ChatMessage.create(chatData, {});

    const shouldApplyTheCurrencyUpdated = await Dialog.confirm({
      title: `Ti torna tutto ? Sei sicuro di voler applicare la differenza  ?`,
      content: `Sei sicuro di voler togliere i soldi alla banca '${actorBanca.name}' collegata all'attore '${actor.name}', se i soldi in banca saranno inferiori alle spese la sottrazzione si fermera' ad avere 0 currency`,
    });

    if (shouldApplyTheCurrencyUpdated) {
      if (totalIncome < 0) {
        game.modules.get("lazymoney").api.subtractCurrency({
          actor: actorBanca.uuid,
          currencyValue: totalIncome,
          currencyDenom: "gp",
        });
      } else {
        game.modules.get("lazymoney").api.addCurrency({
          actor: actorBanca.uuid,
          currencyValue: totalIncome,
          currencyDenom: "gp",
        });
      }
    }
  }
}