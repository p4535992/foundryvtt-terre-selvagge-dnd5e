import CONSTANTS from "../constants/constants";
import { ItemPriceHelpers } from "./item-price-helpers";
import { error, warn, log, info, is_lazy_number, stringIsUuid } from "./lib";

export class IncomeHelpers {
  static async retrieveDetailsIncomeForActor(actorUuid) {
    const folderUuid = game.settings.get(CONSTANTS.MODULE_ID, `specificFolderJournalPersonsIncome`);
    const folderObject = await fromUuid(folderUuid);
    if (!folderObject) {
      warn(`00 No folder found for the reference '${folderUuid}'`);
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
        warn(`01 This journal person is not a type 'person' for the reference '${journalPerson}'`);
        continue;
      }
      const pages = journalPerson.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const actorJournalPage = await fromUuid(pages.contents[0].uuid);
      if (!actorJournalPage) {
        warn(`02 No journal person page is been found it for the reference '${journalPerson}'`);
        continue;
      }
      const actorJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.actor`);
      if (!actorJ) {
        warn(`03 No actor is present for the reference '${journalPerson}'`);
        continue;
      }
      if (actorJ.uuid === actorUuid) {
        const details = await IncomeHelpers.calculateIncomeForAPlayerJournalActor(journalPerson);
        log(`100 Details:` + JSON.stringify(details));
        resultObj[details.actorUuid] = details;
        break;
      }
    }

    await IncomeHelpers.prepareChatCard(actorUuid, resultObj[actorUuid], true);

    return resultObj;
  }

  static async retrieveDetailsIncomeForAllActorOnFolder() {
    const folderUuid = game.settings.get(CONSTANTS.MODULE_ID, `specificFolderJournalPersonsIncome`);
    const folderObject = await fromUuid(folderUuid);
    if (!folderObject) {
      warn(`04 No folder found for the reference '${folderUuid}'`);
      return;
    }
    const persons = folderObject.contents.filter((e) => {
      const journalPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return journalPersonType === "person";
    });
    const resultObj = {};
    for (const voice of persons) {
      const journalActor = stringIsUuid(voice) ? await fromUuid(voice) : await fromUuid(voice.uuid);
      const details = await IncomeHelpers.calculateIncomeForAPlayerJournalActor(journalActor);
      if (details) {
        log(`101 Details:` + JSON.stringify(details));
        resultObj[details.actorUuid] = details;
        await IncomeHelpers.prepareChatCard(details.actorUuid, resultObj[details.actorUuid], true);
      } else {
        warn(`102 Non sono riuscito a calcolare l'income per '${journalActor.name}'`);
      }
    }
    return resultObj;
  }

  static async calculateIncomeForAPlayerJournalActor(journalPersonUuid) {
    const journalPerson = stringIsUuid(journalPersonUuid)
      ? await fromUuid(journalPersonUuid)
      : await fromUuid(journalPersonUuid.uuid);
    if (!journalPerson) {
      warn(`05 No journal person page is been found it for the reference '${journalPlaceUuid}'`);
      return;
    }
    const journalPersonType = journalPerson.type
      ? journalPerson.type
      : getProperty(journalPerson, `flags.monks-enhanced-journal.pagetype`);
    if (journalPersonType != "person") {
      warn(`06 This journal person is not a type 'person' for the reference '${journalPersonUuid}'`);
      return;
    }
    const pages = journalPerson.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const actorJournalPage = await fromUuid(pages.contents[0].uuid);
    if (!actorJournalPage) {
      warn(`07 No journal person page is been found it for the reference '${journalPerson}'`);
      return;
    }
    const actorJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.actor`);
    if (!actorJ) {
      warn(`08 No actor is present for the reference '${journalPerson}'`);
      return;
    }

    // START RECUPERO BANCA
    const bancaPersonJ = getProperty(actorJournalPage, `flags.monks-enhanced-journal.relationships`)?.filter((e) => {
      const bancaPersonType = e.type ? e.type : getProperty(e, `flags.monks-enhanced-journal.pagetype`);
      return bancaPersonType === "person" && String(e.relationship)?.toLowerCase() === "banca";
    });
    if (!bancaPersonJ || bancaPersonJ.length <= 0) {
      warn(`09 No journal person for banca page is been found it for the reference '${actorJournalPage}'`);
      return;
    }

    // NOTA: ONLY ONE BANK AT THE TIME CAN BE PRESENT
    const bancaPersonJWithPages = await fromUuid(bancaPersonJ[0].uuid);
    if (!bancaPersonJWithPages) {
      warn(`09 No journal person for banca page is been found it for the reference '${actorJournalPage}'`);
      return;
    }
    const bancaPages = bancaPersonJWithPages.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const actorBancaJournalPage = await fromUuid(bancaPages.contents[0].uuid);
    if (!actorBancaJournalPage) {
      warn(`09 No journal person page for banca  is been found it for the reference '${bancaPersonJWithPages}'`);
      return;
    }
    const actorBancaJ = getProperty(actorBancaJournalPage, `flags.monks-enhanced-journal.actor`);
    if (!actorBancaJ) {
      warn(`09 No actor banca is present for the reference '${actorBancaJournalPage}'`);
      return;
    }

    const actorBanca = await fromUuid(actorBancaJ.uuid);
    if (!actorBanca) {
      warn(`09 No actor banca is present for the reference '${actorBancaJ}'`);
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
        warn(`09 No journal person page is been found it for the reference '${placeJRel.uuid}'`);
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

    return {
      actorUuid: actorJ.uuid,
      actorName: actorJ.name,
      actorBancaUuid: actorBanca.uuid,
      actorBancaName: actorBanca.name,
      places: incomes,
    };
  }

  static async calculateIncomeForAJournalPlace(journalPlaceUuid, actorJ) {
    const journalPlace = stringIsUuid(journalPlaceUuid)
      ? await fromUuid(journalPlaceUuid)
      : await fromUuid(journalPlaceUuid.uuid);
    if (!journalPlace) {
      warn(`10 No journal place page is been found it for the reference '${journalPlaceUuid}'`);
      return;
    }
    const actor = stringIsUuid(actorJ) ? await fromUuid(actorJ) : await fromUuid(actorJ.uuid);
    if (!actor) {
      warn(`11 No actor is been found it for the reference '${actorJ}'`);
      return;
    }
    const journalPlaceType = journalPlace.type
      ? journalPlace.type
      : getProperty(journalPlace, `flags.monks-enhanced-journal.pagetype`);
    if (journalPlaceType !== "place") {
      warn(`12 This journal place is not a type 'person' for the reference '${journalPlace}'`);
      return;
    }
    const pages = journalPlace.pages;
    // MJE TYPE ARE ONE ONLY PAGE JOURNAL
    const placeJournalPage = await fromUuid(pages.contents[0].uuid);
    if (!placeJournalPage) {
      warn(`13 No journal place page is been found it for the reference '${journalPlace}'`);
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
        warn(`14 No journal person page is been found it for the reference '${personJRel.uuid}'`);
        continue;
      }
      const pages = journalPerson.pages;
      // MJE TYPE ARE ONE ONLY PAGE JOURNAL
      const personJournalPage = await fromUuid(pages.contents[0].uuid);
      if (!personJournalPage) {
        warn(`15 No journal person page is been found it for the reference '${personJRel}'`);
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
    for (const place of details.places) {
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

  static async prepareChatCard(actorP, details, showApplyDialog) {
    function colorSetter(number, low, high) {
      if (number <= low) return `color:red;`;
      if (number >= high) return `color:green;`;
      return ``;
    }

    function average(nums) {
      return nums.reduce((a, b) => a + b) / nums.length;
    }

    if (!details) {
      warn(`17.2 No details is present for the reference`);
      return;
    }

    const actor = stringIsUuid(actorP.uuid ? actorP.uuid : actorP) ? await fromUuid(actorP) : actorP;
    if (!actor) {
      warn(`18 No actor is present for the reference '${actorP}'`);
      return;
    }
    if (!details.actorBancaUuid) {
      warn(`18.1 No actor banca is present for the reference '${details}'`);
      return;
    }
    const actorBanca = stringIsUuid(details.actorBancaUuid.uuid ? details.actorBancaUuid.uuid : details.actorBancaUuid)
      ? await fromUuid(details.actorBancaUuid)
      : details.actorBancaUuid;
    if (!actorBanca) {
      warn(`18.2 No actor banca is present for the reference '${details.actorBancaUuid}'`);
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
        <th colspan="${total_header + 1}"><b>${actor.name} (Banca: ${actorBanca.name})</b></th>
    </tr>
    <tr>
      <th colspan="${total_header + 1}">Total gold on banca: ${actorBancaGp}</th>
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

    for (const place of details.places) {
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
    let isPoor = totalIncome < 0 ? actorBancaGp < totalIncome * -1 : false;

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
        isPoor ? "La banca non ha abbastanza soldi" : "La banca ha abbastanza soldi"
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

    let contentFinal = ``;
    if (isInActive) {
      let finalWarn = `<span style="color:green; font-weight: bold; border-bottom:1px solid #000; border-top:1px solid #000;">${"Il giocatore e' in attivo"}</span>`;
      contentFinal = finalWarn;
    } else {
      let finalWarn = `<span style="${
        isPoor ? "color:red;" : "color:green;"
      } font-weight: bold; border-top:1px solid #000;">${
        isPoor ? "La banca non ha abbastanza soldi" : "La banca ha abbastanza soldi"
      }</span>`;

      contentFinal = finalWarn;
    }

    if (showApplyDialog) {
      const shouldApplyTheCurrencyUpdated = await Dialog.confirm({
        title: `Ti torna tutto ? Sei sicuro di voler applicare la differenza  ?`,
        content: `<b>${contentFinal}</b><br>Sei sicuro di voler togliere i soldi alla banca <b>'${actorBanca.name}'</b> collegata all'attore <b>'${actor.name}'</b>, se i soldi in banca saranno inferiori alle spese la sottrazzione si fermera' e nessuna currency sarà tolta`,
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
}
