import CONSTANTS from "../constants/constants";

export class TerreSelvaggeHelpers {
  static hoverNoteColor(note, hovered) {
    if (!game.settings.get(CONSTANTS.MODULE_ID, "enableHoverNote")) {
      return;
    }
    // Retrieve the Journal Entry related to the Note
    const journalId = note.document.entryId;
    if (!journalId) {
      return;
    }
    const journalEntry = game.journal.get(journalId);
    if (!journalEntry) {
      return;
    }
    const journalEntryPage = journalEntry ? journalEntry.pages.get(note.document.pageId) : null;
    if (!journalEntryPage) {
      return;
    }
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

    if (hovered) {
      // Save the original text for later restoration
      note.tooltip.originalText = note.tooltip.text;

      // Fetch the alignment flag
      const alignmentFlag = journalEntryPage.getFlag("monks-enhanced-journal", "alignment") || "Non Completato";

      // Append the flag content to the tooltip text
      note.tooltip.text += ` (${alignmentFlag})`;

      // Change tooltip fill color based on alignmentFlag
      if (alignmentFlag === "Completato") {
        note.tooltip.style.fill = "#007a00";
      } else {
        note.tooltip.style.fill = "#e50606";
      }
    } else {
      // Restore the original tooltip text when no longer hovering
      note.tooltip.text = note.tooltip.originalText;
    }
  }

  static renderJournalSheetAvamposto(app, html, data) {
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
}
