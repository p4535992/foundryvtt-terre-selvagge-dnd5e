import CONSTANTS from "../constants/constants";
import { error, info, log, warn } from "./lib";
import { PoppersJsHelpers } from "./poppers-js-helpers";

export class TerreSelvaggeHelpers {
  // static showSettingsDialog() {
  //   // Function to show the dialog

  //   let currentSettings = JSON.parse(game.settings.get(CONSTANTS.MODULE_ID, "hoverNoteSettings"));
  //   let content = `<div id="form">
  //     ${Object.keys(currentSettings)
  //       .map(
  //         (key, index) => `
  //         <div class="form-group">
  //             <input type="text" name="label" value="${key}">
  //             <input type="text" name="path" value="${currentSettings[key]}" id="path-${index}">
  //             <button type="button" class="filepicker" data-target="path-${index}">Browse</button>
  //             <button class="delete">Delete</button>
  //         </div>`
  //       )
  //       .join("")}
  //     </div>
  //     <p><button id="addNew">Add New</button></p>`;

  //   new Dialog({
  //     title: "Hover Note Settings",
  //     content,
  //     buttons: {
  //       save: {
  //         label: "Save",
  //         callback: async (html) => {
  //           let newSettings = {};
  //           html.find(".form-group").each((i, el) => {
  //             let $el = $(el);
  //             let label = $el.find("input[name='label']").val();
  //             let path = $el.find("input[name='path']").val();
  //             newSettings[label] = path;
  //           });
  //           await game.settings.set(CONSTANTS.MODULE_ID, "hoverNoteSettings", JSON.stringify(newSettings));
  //         },
  //       },
  //     },
  //     default: "save",
  //     render: (html) => {
  //       html.find(".filepicker").click(async (ev) => {
  //         let target = $(ev.currentTarget).data("target");
  //         new FilePicker({
  //           type: "image",
  //           callback: (path) => {
  //             html.find(`#${target}`).val(path);
  //           },
  //         }).browse();
  //       });

  //       // Add new fields dynamically
  //       html.off("click", "#addNew").on("click", "#addNew", function () {
  //         let newIndex = $("#form .form-group").length;
  //         $("#form").append(`<div class="form-group">
  //               <input type="text" name="label" value="New Label">
  //               <input type="text" name="path" value="New Path" id="path-${newIndex}">
  //               <button type="button" class="filepicker" data-target="path-${newIndex}">Browse</button>
  //               <button class="delete">Delete</button>
  //           </div>`);
  //       });

  //       // Remove any previous click event handlers on '.delete'
  //       html.off("click", ".delete").on("click", ".delete", function () {
  //         $(this).closest(".form-group").remove();
  //       });

  //       // Delete a field
  //       html.on("click", ".delete", function () {
  //         $(this).closest(".form-group").remove();
  //       });
  //     },
  //   }).render(true);
  // }

  static async hoverNoteBySettings(note, hovered) {
    // const currentSettings = JSON.parse(game.settings.get(CONSTANTS.MODULE_ID, "hoverNoteSettings"));
    const currentSettings = game.settings.get(CONSTANTS.MODULE_ID, "nameRollTableMapNotes");
    const rollTableMapNotes = game.tables.getName(currentSettings);
    if (!rollTableMapNotes) {
      warn(`No roll table for map notes found with name '${currentSettings}'`, true);
      return;
    }
    const results = rollTableMapNotes.results.contents ?? [];
    const tooltipText = note.document.text;
    let iconPath = "";

    for (const res of results) {
      if (res.text === tooltipText) {
        iconPath = res.img;
        break;
      }
    }

    if (iconPath) {
      if (iconPath !== note.document.texture.src) {
        note.document.update({ icon: iconPath });
      }
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
    log("Data:", data);

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

  static async renderChatMessageAnimatedSpells(message, html, data) {
    if (message.flags.dnd5e && message.flags.dnd5e.use.type === "spell") {
      const spellId = await fromUuid(message.flags.dnd5e.use.itemUuid);
      let spellDescription = spellId ? spellId.system.description.value : "";
      const spellName = spellId.name; // message.flavor ? message.flavor.toLowerCase().replace(/\s+/g, "") : "";
      const spellNameB = spellName ? spellName : "";

      // Sanitize spellDescription
      const sanitizedDescription = spellDescription
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/@Compendium\[[^\]]+\]\{([^}]+)\}/g, "<strong>$1</strong>")
        .replace(/@spell\[([^\]]+)\]/g, "<strong>$1</strong>")
        .replace(/\[\[\/r (\d+)d(\d+)\]\]/g, "<strong>$1d$2</strong>");

      const sanitizedName = spellName.toLowerCase().trim().replace(/\s+/g, "");

      const imgURL = `spellsanimations/${sanitizedName}.gif`;
      info(`Animation url '${imgURL}'`, false);
      try {
        const response = await fetch(imgURL);
        if (response.status === 200) {
          const tooltipContent = `
      <span style='font-family:Fondamento; font-size:24px; text-align:center; color:#2E1E0F; font-weight: bold; text-transform: uppercase;'>${spellNameB}</span>
      <hr class='side'>
      ${sanitizedDescription}
    `;

          const imgContainer = `
            <div style="overflow: hidden; height: 320px; margin-top: -30px;">
              <img style="border-radius: 8px; transform: scale(0.8); transform-origin: top; position: relative; bottom: -30px;" src="${imgURL}" data-tooltip="${tooltipContent}" data-tooltip-class="mybloodytooltip">
            </div>
          `;

          const cardContent = html.find(".card-content");
          if (cardContent.length > 0) {
            cardContent.append(imgContainer);
          }

          // Find the card-header and replace its content
          const cardHeader = html.find(".card-header");
          if (cardHeader.length > 0) {
            cardHeader.html(
              `<span style='font-family:Fondamento; font-size:20px; text-align:center; color:#2E1E0F; font-weight: bold; text-transform: uppercase;'>${spellNameB}</span>`
            );
          }
        }
      } catch (e) {
        error(`Failed to load image: ${imgURL}`, e);
      }
    }
  }

  static createRecipeBadge(element, item) {
    const recipes = TerreSelvaggeHelpers._getItemRecipes(item);
    if (recipes.length > 0) {
      const badgeHtml = `
        <span class="terre-selvagge-badgematerial3" data-tidy-render-scheme="handlebars" title="Craftable Recipes">Recipes</span>
      `;
      element.insertAdjacentHTML("beforeend", badgeHtml);

      const badge = element.querySelector(".terre-selvagge-badgematerial3");

      const tooltipContent = TerreSelvaggeHelpers._generateTooltipContentRecipes(recipes);
      PoppersJsHelpers.tippyTooltip(badge, {
        content: tooltipContent,
        interactive: true,
        zIndex: 9999,
        placement: "right",
        allowHTML: true,
        onShown: (instance) => {
          instance.popper.querySelectorAll(".recipe-output").forEach((r) => {
            r.addEventListener("click", async (event) => {
              event.preventDefault();
              const uuid = event.currentTarget.dataset.uuid;
              const item = await fromUuid(uuid);
              if (item) {
                item.sheet.render(true);
                instance.hide();
              }
            });
          });
        },
      });
    }
  }

  static _generateTooltipContentRecipes(recipes) {
    return recipes
      .map(
        (r) => `
      <div>
        <img src="${r.img}" style="width: 20px; height: 20px; margin-right: 5px;">
        <a class="recipe-output" data-uuid="${r.output}">${r.name}</a>
      </div>
    `
      )
      .join("");
  }

  static _getItemRecipes(item) {
    const recipes = game.items.filter((i) => i.getFlag("beavers-crafting", "subtype")?.toLowerCase() === "recipe");
    const itemRecipes = recipes.filter((r) => {
      const recipe = r.getFlag("beavers-crafting", "recipe");
      for (const list of Object.values(recipe.input)) {
        for (const input of Object.values(list)) {
          // Replace isSame comparison with name comparison
          if (item.name.toLowerCase() === input.name.toLowerCase()) {
            return true;
          }
        }
      }
      return false;
    });
    return itemRecipes.map((r) => ({
      id: r.id,
      img: Object.values(r.getFlag("beavers-crafting", "recipe").output)
        .flatMap((i) => Object.values(i))
        .find((o) => true)?.img,
      name: r.name,
      output: Object.values(r.getFlag("beavers-crafting", "recipe").output)
        .flatMap((i) => Object.values(i))
        .find((o) => o.type !== "RollTable")?.uuid,
    }));
  }
}
