import CONSTANTS from "../constants/constants";

export class TerreSelvaggeHelpers {
  static showSettingsDialog() {
    // Function to show the dialog

    let currentSettings = JSON.parse(game.settings.get("myModule", "hoverNoteSettings"));
    let content = `<div id="form">
      ${Object.keys(currentSettings)
        .map(
          (key, index) => `
          <div class="form-group">
              <input type="text" name="label" value="${key}">
              <input type="text" name="path" value="${currentSettings[key]}" id="path-${index}">
              <button type="button" class="filepicker" data-target="path-${index}">Browse</button>
              <button class="delete">Delete</button>
          </div>`
        )
        .join("")}
      </div>
      <p><button id="addNew">Add New</button></p>`;

    new Dialog({
      title: "Hover Note Settings",
      content,
      buttons: {
        save: {
          label: "Save",
          callback: async (html) => {
            let newSettings = {};
            html.find(".form-group").each((i, el) => {
              let $el = $(el);
              let label = $el.find("input[name='label']").val();
              let path = $el.find("input[name='path']").val();
              newSettings[label] = path;
            });
            await game.settings.set("myModule", "hoverNoteSettings", JSON.stringify(newSettings));
          },
        },
      },
      default: "save",
      render: (html) => {
        html.find(".filepicker").click(async (ev) => {
          let target = $(ev.currentTarget).data("target");
          new FilePicker({
            type: "image",
            callback: (path) => {
              html.find(`#${target}`).val(path);
            },
          }).browse();
        });

        // Add new fields dynamically
        html.off("click", "#addNew").on("click", "#addNew", function () {
          let newIndex = $("#form .form-group").length;
          $("#form").append(`<div class="form-group">
                <input type="text" name="label" value="New Label">
                <input type="text" name="path" value="New Path" id="path-${newIndex}">
                <button type="button" class="filepicker" data-target="path-${newIndex}">Browse</button>
                <button class="delete">Delete</button>
            </div>`);
        });

        // Remove any previous click event handlers on '.delete'
        html.off("click", ".delete").on("click", ".delete", function () {
          $(this).closest(".form-group").remove();
        });

        // Delete a field
        html.on("click", ".delete", function () {
          $(this).closest(".form-group").remove();
        });
      },
    }).render(true);
  }

  static async hoverNoteBySettings(note, hovered) {
    const currentSettings = JSON.parse(game.settings.get(CONSTANTS.MODULE_ID, "hoverNoteSettings"));
    const tooltipText = note.document.text;
    let iconPath = "";

    for (const [label, path] of Object.entries(currentSettings)) {
      if (tooltipText.startsWith(label)) {
        iconPath = path;
        break;
      }
    }

    if (iconPath) {
      note.document.update({ icon: iconPath });
    }
  }

  static async hoverNoteColor(note, hovered) {
    if (!game.settings.get(CONSTANTS.MODULE_ID, "enableHoverNote")) {
      return;
    }
    // Retrieve the Journal Entry related to the Note
    const journalId = note.document.entryId;
    const journalEntry = game.journal.get(journalId);
    const journalEntryPage = journalEntry ? journalEntry.pages.get(note.document.pageId) : null;

    // If we couldn't find a corresponding journal entry or the name doesn't start with "Avamposto", set default styles and exit
    if (!journalEntry || !journalEntryPage || !journalEntry.name.startsWith("Avamposto")) {
      note.tooltip.style.fill = "#000000";
      note.tooltip.style.fontFamily = "Dalelands";
      note.tooltip.style.fontSize = "16px";
      note.tooltip.style.textAlign = "center";
      note.tooltip.style.align = "center";
      note.tooltip.style.stroke = "#ffffff";
      return;
    }

    if (!note.tooltip.originalText) {
      note.tooltip.originalText = note.tooltip.text;
    }

    if (hovered) {
      // Fetch the alignment flag
      const alignmentFlag = journalEntryPage.getFlag("monks-enhanced-journal", "alignment") || "Non Completato";

      // Extract compendium items from the journal entry content
      const contentHTML = journalEntryPage.data.text.content;
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
      const offerings = journalEntryPage.data.flags["monks-enhanced-journal"].offerings || [];
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

      // Generate the updated itemList
      let updatedItemList = "";
      for (const [itemName, qty] of Object.entries(itemCountsFromList)) {
        if (qty > 0) {
          // Only include items with positive quantities
          updatedItemList += `\n- ${qty} ${itemName}`;
        }
      }

      // Check if all items are at 0
      const allItemsZero = Object.values(itemCountsFromList).every((qty) => qty === 0);

      // Prepare the final tooltip text
      let finalTooltipText = note.tooltip.originalText;

      // Change the alignment flag to "Completato" if all items are at 0
      if (allItemsZero) {
        finalTooltipText += " (Completato)";
        note.tooltip.style.fill = "#007a00";
        note.document.update({ "texture.src": "Tiles/SquarePins/Tower.webp" });

        // Update the journal entry flag to "Completato"
        await journalEntryPage.setFlag("monks-enhanced-journal", "alignment", "Completato");
      } else {
        finalTooltipText += ` (${alignmentFlag})`;

        // Append the updated item list only if alignment is not "Completato"
        if (alignmentFlag !== "Completato") {
          finalTooltipText += updatedItemList;
        }

        note.tooltip.style.fill = "#e50606";
        note.document.update({ "texture.src": "Tiles/POI/RegionIconsMapPack/IsometricRegionIcons/Ruins.png" });
      }

      // Update the tooltip text
      note.tooltip.text = finalTooltipText;
    } else {
      // Restore the original tooltip text when no longer hovering
      note.tooltip.text = note.tooltip.originalText;
    }
  }

  static renderItemSheetLockAndKeyNoText(app, html, data) {
    // Find the element containing the tab's title
    const titleElement = html.find(".item.list-row[data-tab='LocknKey']");

    // Remove the text from the title element
    titleElement
      .contents()
      .filter(function () {
        return this.nodeType === 3; // Node.TEXT_NODE
      })
      .remove();

    // Alternatively, you can also do it like this:
    // titleElement.html('<i class="fas fa-key"></i>');
  }

  static async renderJournalSheetAvamposto(app, html, data) {
    // Debugging line to inspect 'data'
    console.log("Data:", data);

    // Check if the journal name starts with "Avamposto"
    if (data.title.startsWith("Avamposto")) {
      // Delay the changes to ensure the form elements are rendered
      setTimeout(() => {
        // Find the "Alignment" label and change it to "Stato"
        const alignmentLabel = html.find("label:contains('Alignment')");
        if (alignmentLabel.length > 0) {
          alignmentLabel.text("Stato");
        }

        // Hide the "Notes" and "Relationships" tabs
        html.find("a.item[data-tab='notes']").hide();
        html.find("a.item[data-tab='relationships']").hide();

        // Translate the "Description" tab into "Descrizione"
        const descriptionTab = html.find("a.item[data-tab='description']");
        if (descriptionTab.length > 0) {
          descriptionTab.text("Descrizione");
        }

        // Translate the "Offerings" tab into "Ricostruzione"
        const offeringsTab = html.find("a.item[data-tab='offerings']");
        if (offeringsTab.length > 0) {
          offeringsTab.text("Ricostruzione");
        }

        // Replace input with select for "Stato"
        const alignmentInput = html.find("input[name='flags.monks-enhanced-journal.alignment']");
        const currentValue = alignmentInput.val() || "Non Completato"; // default value
        if (alignmentInput.length > 0) {
          const selectElement = `
          <select name="flags.monks-enhanced-journal.alignment">
            <option value="Completato" ${currentValue === "Completato" ? "selected" : ""}>Completato</option>
            <option value="Non Completato" ${
              currentValue === "Non Completato" ? "selected" : ""
            }>Non Completato</option>
          </select>
        `;
          alignmentInput.replaceWith(selectElement);
        }

        // Remove the Location form-group
        const locationLabel = html.find("label:contains('Location')");
        if (locationLabel.length > 0) {
          locationLabel.closest(".form-group").remove();
        }

        // Blur the image if the alignment is "Non Completato"
        const profileImage = html.find(".profile");
        if (currentValue === "Non Completato") {
          profileImage.css("filter", "blur(5px)");
        } else {
          profileImage.css("filter", "");
        }
      }, 100); // 100ms delay
    }
  }
}
