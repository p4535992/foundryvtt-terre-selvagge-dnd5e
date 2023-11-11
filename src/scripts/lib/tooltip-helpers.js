import { ElementWrapper } from "../utility/ElementWrapper";

// Modify your myFunction to accept ids
window.ToolTipHelpersMyFunction = function (inputId, ulId) {
  var input, filter, ul, li, a, i;
  input = document.getElementById(inputId);
  filter = input.value.toUpperCase();
  ul = document.getElementById(ulId);
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    const txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
};

// document.head.insertAdjacentHTML('beforeend', containerStyle);
// const OLD_DRAW_TOOLTIP_NOTE = CONFIG.Note.objectClass.prototype._drawTooltip;
// CONFIG.Note.objectClass.prototype._drawTooltip = drawTooltip;

export class ToolTipHelpers {
  static noteCounter = 0; // Add this line at the top of your script or outside of the function

  static wrapElement(parser, note) {
    const journalType = getProperty(note?.entry, "flags.monks-enhanced-journal.pagetype") ?? "";
    const pageType =
      note?.entry?.pages?.contents.length > 0
        ? getProperty(note?.entry?.pages?.contents[0], "flags.monks-enhanced-journal.type")
        : "";
    const tipo = note.document.text;
    let tooltipClass;

    if (journalType === "quest" || pageType === "quest") {
      tooltipClass = "notetooltip3";
    } else if (journalType === "encounter" || pageType === "encounter") {
      tooltipClass = "notetooltip3";
    } else if (journalType === "journalentry" || pageType === "journalentry") {
      tooltipClass = "notetooltip2";
    } else {
      tooltipClass = "notetooltip3";
    }

    if (tipo && (tipo.includes("Bosco") || tipo.includes("Foresta") || tipo.includes("Pianura"))) {
      tooltipClass = "notetooltipBF";
    } else if (tipo && (tipo.includes("Montagna") || tipo.includes("Miniera"))) {
      tooltipClass = "notetooltipMM";
    } else if (tipo && tipo.includes("Palude")) {
      tooltipClass = "notetooltipP";
    }

    const container = $(
      `<aside class="terre-selvagge-dnd5e-${tooltipClass}" style="opacity: 0; display: none; user-select: all!important;"></aside>`
    )[0];

    // create wrapped element
    const wrappedElement = new ElementWrapper(container, parser, note);
    wrappedElement.anchorXY = 0;
    wrappedElement.visible = false;

    return wrappedElement;
  }

  //   static drawTooltip() {
  //     const journal = this.entry;
  //     const journalType = journal?.getFlag("monks-enhanced-journal", "pagetype");
  //     const pageType = journal?.pages.contents[0].getFlag("monks-enhanced-journal", "type");
  //     const parser =
  //       ToolTipHelpers.monksEnhancedParsing[pageType] ??
  //       ToolTipHelpers.monksEnhancedParsing[journalType] ??
  //       ToolTipHelpers.defaultParser(this);
  //     if (!parser) {
  //       return OLD_DRAW_TOOLTIP_NOTE.call(this);
  //     }
  //     // Create Element
  //     const wrappedEl = ToolTipHelpers.wrapElement(parser, this);
  //     if (!wrappedEl) return OLD_DRAW_TOOLTIP_NOTE.call(this);

  //     // Destroy any prior text
  //     if (this.tooltip) {
  //       this.removeChild(this.tooltip);
  //       this.tooltip = undefined;
  //     }

  //     const button = wrappedEl.target.querySelector("#showquest");

  //     if (button) button.addEventListener("onclick", async (e) => {});
  //     // Add child and return
  //     return (this.tooltip = this.addChild(wrappedEl));
  //   }

  static drawTooltipHandler(wrapped, ...args) {
    const note = this;
    const journal = this.entry;
    const journalType = getProperty(journal, "flags.monks-enhanced-journal.pagetype") ?? "";
    const pageType =
      journal?.pages?.contents.length > 0
        ? getProperty(journal?.pages?.contents[0], "flags.monks-enhanced-journal.type")
        : "";
    const parser =
      ToolTipHelpers.monksEnhancedParsing[pageType] ??
      ToolTipHelpers.monksEnhancedParsing[journalType] ??
      ToolTipHelpers.defaultParser;
    if (!parser) {
      //   return OLD_DRAW_TOOLTIP_NOTE.call(this);
      return wrapped(...args);
    }
    // Create Element
    const wrappedEl = ToolTipHelpers.wrapElement(parser, this);
    if (!wrappedEl) {
      // return OLD_DRAW_TOOLTIP_NOTE.call(this);
      return wrapped(...args);
    }
    // Destroy any prior text
    if (this.tooltip) {
      this.removeChild(this.tooltip);
      this.tooltip = undefined;
    }

    const button = wrappedEl.target.querySelector("#showquest");

    if (button) {
      button.addEventListener("onclick", async (e) => {});
    }
    // Add child and return
    return (this.tooltip = this.addChild(wrappedEl));
  }

  static defaultParser(note) {
    ToolTipHelpers.noteCounter++;

    const tipo = note.document.text;
    const page = note.entry.pages.contents[0];
    const rollTableUuid = getProperty(page, "flags.gatherer.table") ?? ""; // Assuming this is how you get the rolltable UUID
    const drawsUsed = getProperty(page, "flags.gatherer.drawsUsed") || 0;
    let toolCheck = getProperty(page, "flags.gatherer.toolCheck") || "";
    let toolDC = getProperty(page, "flags.gatherer.toolDC") || null;
    const systemAbil = getProperty(page, "flags.gatherer.systemAbil") || "Unknown Ability";
    const DC = getProperty(page, "flags.gatherer.DC") || "Unknown DC";

    // Use systemAbil if toolCheck is empty
    if (!toolCheck) {
      toolCheck = systemAbil;
    }

    // Use DC if toolDC is null
    if (toolDC === null) {
      toolDC = DC;
    }

    const drawsRemaining = 10 - drawsUsed;
    // Extract ID from UUID
    const rollTableId = rollTableUuid.split(".").pop();

    // Fetch the rolltable by its ID
    const rollTable = game.tables.get(rollTableId);

    let imgElements = "";

    // Loop through the results array to get the img and text
    if (rollTable && rollTable.results) {
      rollTable.results.forEach((result) => {
        imgElements += `
                <li>
                    <img src="${result.img}" title="Probabilita: ${result.weight}%" style="width: 35px; height: 35px; margin-right: 5px;">
                    <span>${result.text}</span>
                </li>
            `;
      });
    }
    const defaultPermission = note.entry.ownership.default;
    const isChecked = defaultPermission === 2;

    const inputId = `myInput-${ToolTipHelpers.noteCounter}`;
    const ulId = `myUL-${ToolTipHelpers.noteCounter}`;
    const checkboxId = `checkboxDefault-${ToolTipHelpers.noteCounter}`; // New checkbox ID

    const element = $(`
        <div>
            <h3 style="font-family: 'Dalelands';">Luogo - ${tipo}</h3>
            <div class="extra-info">
                <p>Raccolte rimanenti: ${drawsRemaining}</p>
                <p>Tool richiesto: ${toolCheck}</p>
                <p>Difficolta: ${toolDC}</p>
            </div>
            <div class="w3-container">
                <input style="background-color: white; color: black;" type="text" placeholder="Cerca..." id="${inputId}" onkeyup="ToolTipHelpersMyFunction('${inputId}', '${ulId}')">
                <ul class="w3-ul w3-margin-top" id="${ulId}" style="list-style: none; padding: 0; margin-top: 10px;">
                    ${imgElements}
                </ul>
                <p>Scoperto?<input id="${checkboxId}" type="checkbox" ${isChecked ? "checked" : ""}></p>
            </div>
        </div>
    `)[0];

    const checkboxDefault = element.querySelector(`#${checkboxId}`); // New checkbox query

    // New event listener for the checkbox
    checkboxDefault.addEventListener("click", async () => {
      const isChecked = checkboxDefault.checked;
      let update;

      if (isChecked) {
        update = {
          default: 2,
        };
      } else {
        update = {
          default: 0,
        };
      }

      await note.entry.update({
        permission: update,
      });
    });

    return element;
  }

  // static monksEnhancedParsingWrong(note, type) {
  //
  // }

  static monksEnhancedParsing = {
    quest: (note) => {
      const page = note.entry.pages.contents[0];
      const defaultPermission = note.entry.ownership.default;

      const isChecked = defaultPermission === 2; // Check if the default permission is OBSERVER (usually 2)
      const questStatus = page.getFlag("monks-enhanced-journal", "status") || "Status not available";
      const items = page?.getFlag("monks-enhanced-journal", "rewards")?.[0]?.items || [];
      let itemsList = "";
      if (items.length > 0) {
        itemsList += "<ul>";
        for (const item of items) {
          itemsList += `<li>${item.name}</li>`;
        }
        itemsList += "</ul>";
      } else {
        itemsList = "";
      }
      const currency = page?.getFlag("monks-enhanced-journal", "rewards")?.[0]?.currency || {};
      let rewards = "";
      for (const [key, value] of Object.entries(currency)) {
        if (value > 0) {
          const currencyName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize and pluralize
          rewards += `${value} ${currencyName} - `;
        }
      }
      rewards = rewards || "Non ce ricompensa";
      const element = $(`
<div>
  <div style="text-align: center;">
    <img src="${page.src}" style="width: 60px; height: 60px; object-fit: cover; border: none;">
  </div>
  <h2 style="text-align: center; font-family: 'Dalelands';">${page.name}</h2>
  ${page.text.content}
  <p>Rewards: ${rewards}</p>
  <p>${itemsList}</p>
  <h3>Stato: ${questStatus}</h3>
  <p>Scoperta?<input id="checkboxA" type="checkbox" ${isChecked ? "checked" : ""}></p>
</div>
`)[0];

      const checkboxA = element.querySelector("#checkboxA");

      checkboxA.addEventListener("click", async () => {
        const isChecked = checkboxA.checked;
        let update;

        if (isChecked) {
          // Set default ownership level to OBSERVER (usually 2)
          update = {
            default: 2, // Using 2 for OBSERVER level
          };
        } else {
          // Set default ownership level to NONE (usually 0)
          update = {
            default: 0, // Using 0 for NONE level
          };
        }

        // Update the journal entry (or note) with new default ownership level
        await note.entry.update({
          permission: update,
        }); // Replace 'note.entry' with your actual journal entry or note object
      });

      return element;
    },

    place: (note) => {
      const page = note.entry.pages.contents[0];
      const defaultPermission = note.entry.ownership.default; // Replace 'note.entry' with your actual journal entry or note object

      const isChecked = defaultPermission === 2; // Check if the default permission is OBSERVER (usually 2)

      const element = $(`
<div>
<div style="text-align: center;">
  <img src="${page.src}" style="width: 150px; object-fit: contain; border: none;">
</div>
<h2 style="text-align: center; font-family: 'Dalelands';">${page.name}</h2>
${page.text.content}
<p>Scoperta?<input id="checkboxA" type="checkbox" ${isChecked ? "checked" : ""}></p>
</div>
`)[0];
      const checkboxA = element.querySelector("#checkboxA");

      checkboxA.addEventListener("click", async () => {
        const isChecked = checkboxA.checked;
        let update;

        if (isChecked) {
          // Set default ownership level to OBSERVER (usually 2)
          update = {
            default: 2, // Using 2 for OBSERVER level
          };
        } else {
          // Set default ownership level to NONE (usually 0)
          update = {
            default: 0, // Using 0 for NONE level
          };
        }

        // Update the journal entry (or note) with new default ownership level
        await note.entry.update({
          permission: update,
        }); // Replace 'note.entry' with your actual journal entry or note object
      });

      return element;
    },
    organization: (note) => {
      const page = note.entry.pages.contents[0];
      const contentHTML = page.text.content;
      const regex = /(\d+)x @Compendium\[world\.ingredienticrafting\.(\w+)\]\{(.+?)\}/g;
      let match;
      let itemList = "";

      while ((match = regex.exec(contentHTML)) !== null) {
        const quantity = match[1];
        const itemName = match[3];
        itemList += `\n- ${quantity} ${itemName}`;
      }

      // Initialize an object to hold the counts of each unique itemName
      const itemCounts = {};

      // Iterate through each offering in the offerings array
      const offerings = page.flags["monks-enhanced-journal"].offerings || [];
      for (const offering of offerings) {
        // Iterate through each item in the items array
        const items = offering.items || [];
        for (const item of items) {
          const itemName = item.itemName;
          const qty = item.qty;

          // Update the count for this itemName
          itemCounts[itemName] = (itemCounts[itemName] || 0) + qty;
        }
      }

      // Initialize an object to hold the counts of each unique itemName for itemList
      const itemCountsFromList = {};

      // Parse itemList and populate itemCountsFromList
      const itemLines = itemList.split("\n").filter((line) => line.trim() !== "");
      for (const line of itemLines) {
        const [, qty, itemName] = line.match(/- (\d+) (.+)/);
        itemCountsFromList[itemName] = parseInt(qty, 10);
      }

      // Subtract aggregated item counts from itemCountsFromList
      for (const [itemName, qty] of Object.entries(itemCounts)) {
        if (itemCountsFromList[itemName] !== undefined) {
          itemCountsFromList[itemName] -= qty;
        }
      }
      let updatedItemList = "";
      for (const [itemName, qty] of Object.entries(itemCountsFromList)) {
        if (qty > 0) {
          // Only include items with positive quantities
          updatedItemList += `\n- ${qty} ${itemName}`;
        }
      }

      let missingItemsList = "";
      let missingItemsHeader = "";

      for (const [itemName, qty] of Object.entries(itemCountsFromList)) {
        if (qty > 0) {
          // Only include items that are still needed (positive quantities)
          if (missingItemsList === "") {
            missingItemsList = "<ul>"; // Initialize UL if you're about to add the first item
            missingItemsHeader = "Costi Mancanti: <br>";
          }
          missingItemsList += `<li>${qty} ${itemName}</li>`;
        }
      }

      if (missingItemsList !== "") {
        missingItemsList += "</ul>"; // Close UL if there are any items
      }

      const defaultPermission = note.entry.ownership.default; // Replace 'note.entry' with your actual journal entry or note object

      const isChecked = defaultPermission === 2; // Check if the default permission is OBSERVER (usually 2)
      const gmOnlyLine = game.user.isGM
        ? `<p style="all: initial;">Scoperta?<input id="checkboxavamposto" type="checkbox" ${
            isChecked ? "checked" : ""
          }></p>`
        : "";

      const element = $(`
<div>
<div style="text-align: center;">
  <!-- Display the thumbnail -->
  <img src="${page.src}" style="width: 100px; height: 100px; object-fit: contain; border: none;">
</div>
<h2 style="text-align: center; font-family: 'Dalelands';">${page.name}</h2>
<h3>${missingItemsHeader}${missingItemsList}</h3>
<h3>Stato: ${page.getFlag("monks-enhanced-journal", "alignment")}</h3>
${gmOnlyLine}
<button id="openJ">Open Avamposto</button>
</div>
`)[0];

      const button = element.querySelector("#openJ");
      button.addEventListener("click", () => game.MonksEnhancedJournal.openJournalEntry(note.entry));

      if (game.user.isGM) {
        const checkboxA = element.querySelector("#checkboxavamposto");

        checkboxA.addEventListener("click", async () => {
          const isChecked = checkboxA.checked;
          let update;

          if (isChecked) {
            update = {
              default: 2,
            };
          } else {
            update = {
              default: 0,
            };
          }

          await note.entry.update({
            permission: update,
          });
        });
      }

      return element;
    },

    encounter: (note) => {
      const page = note.entry.pages.contents[0];
      const defaultPermission = note.entry.ownership.default;
      const isChecked = defaultPermission === 2;
      const actors = page.flags["monks-enhanced-journal"].actors || [];

      let actorListHTML = "<ul>";
      for (const actor of actors) {
        actorListHTML += `
  <div style="display: flex; align-items: center;">
      <img src="${actor.img}" style="width: 46px; height: 46px; object-fit: contain; border: none; margin-right: 10px;">
      <span>${actor.name}</span>
  </div>
          `;
      }
      const checkboxId = `checkboxEncounter-${noteCounter}`;
      const element = $(`
          <div>
              <h2 style="font-family: 'Dalelands';">Incontri</h2>
              ${actorListHTML}
          <p>Scoperto?<input id="${checkboxId}" type="checkbox" ${isChecked ? "checked" : ""}></p>
          </div>
      `)[0];

      const checkboxEncounter = element.querySelector(`#${checkboxId}`); // New checkbox query

      // New event listener for the checkbox
      checkboxEncounter.addEventListener("click", async () => {
        const isChecked = checkboxEncounter.checked;
        let update;

        if (isChecked) {
          update = {
            default: 2,
          };
        } else {
          update = {
            default: 0,
          };
        }

        await note.entry.update({
          permission: update,
        });
      });

      return element;
    },

    journalentry: (note) => {
      const page = note.entry.pages.contents[0];
      const defaultPermission = note.entry.ownership.default; // Replace 'note.entry' with your actual journal entry or note object

      const isChecked = defaultPermission === 2; // Check if the default permission is OBSERVER (usually 2)

      const element = $(`
<div>
<div style="text-align: center;">
  <img src="${page.src}" style="width: 150px; object-fit: contain; border: none;">
</div>
<h2 style="text-align: center; font-family: 'Dalelands';">${page.name}</h2>
${page.text.content}
<p>Scoperta?<input id="checkboxK" type="checkbox" ${isChecked ? "checked" : ""}></p>
</div>
`)[0];
      const checkboxK = element.querySelector("#checkboxK");

      checkboxK.addEventListener("click", async () => {
        const isChecked = checkboxK.checked;
        let update;

        if (isChecked) {
          // Set default ownership level to OBSERVER (usually 2)
          update = {
            default: 2, // Using 2 for OBSERVER level
          };
        } else {
          // Set default ownership level to NONE (usually 0)
          update = {
            default: 0, // Using 0 for NONE level
          };
        }

        // Update the journal entry (or note) with new default ownership level
        await note.entry.update({
          permission: update,
        }); // Replace 'note.entry' with your actual journal entry or note object
      });

      return element;
    },
  };
}
