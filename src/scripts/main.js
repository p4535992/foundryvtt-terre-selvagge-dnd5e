import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
import { Corruzione } from "./corruzione.js";
import {
  applyCustomRuleForCraftingItemsWithoutProficiency,
  enableNoteOnCanvasInit,
  patchForNoteWithMacroWheelModule,
  patchStrangeEditableItem,
  printMacroWithoutAuthor,
  setPriceToZeroIfObjectIsNotCreatedByGM,
} from "./custom.js";
import { setItemLinkingColor } from "./item-color-linking.js";
import { ItemLinkTreeManager } from "./item-link-tree-manager.js";
// import { CleanerSheetTitleBarHelpers } from "./lib/cleaner-sheet-title-bar-helpers.js";
import { CssHelpers } from "./lib/css-helpers.js";
import { CustomCharacterSheetSectionsHelpers } from "./lib/custom-character-sheet-sections-helpers.js";
import { warn, error, log } from "./lib/lib.js";
import { LockersHelpers } from "./lib/locker-helpers.js";
import { ScrollHelpers } from "./lib/scroll-helpers.js";
import { TerreSelvaggeHelpers } from "./lib/terre-selvagge-helpers.js";
import { ToolTipHelpers } from "./lib/tooltip-helpers.js";
import { PoppersJsHelpers } from "./lib/poppers-js-helpers.js";
import { ItemTagsHelpers } from "./lib/item-tags-helpers.js";
import { BeaverCraftingHelpers } from "./lib/beavers-crafting-helpers.js";
import { ItemLinkingHelpers } from "./lib/item-linking-helper.js";
export let invPlusActive = false;
export let itemContainerActive = false;
export let dfredsConvenientEffectsActive = false;
export let invMidiQol = false;
export let dfQualityLifeActive = false;
export let daeActive = false;
export let backPackManagerActive = false;
export let babonusActive = false;
export let itemLinkModuleActive = false;

export const initHooks = async () => {
  // Hooks.once("socketlib.ready", registerSocket);
  // registerSocket();

  invPlusActive = game.modules.get(CONSTANTS.INVENTORY_PLUS_MODULE_NAME)?.active;
  invMidiQol = game.modules.get(CONSTANTS.MIDI_QOL_MODULE_NAME)?.active;
  itemContainerActive = game.modules.get(CONSTANTS.ITEM_COLLECTION_MODULE_NAME)?.active;
  dfredsConvenientEffectsActive = game.modules.get(CONSTANTS.DFREDS_CONVENIENT_EFFECTS_MODULE_NAME)?.active;
  dfQualityLifeActive = game.modules.get(CONSTANTS.DF_QUALITY_OF_LIFE_MODULE_NAME)?.active;
  daeActive = game.modules.get(CONSTANTS.DAE_MODULE_NAME)?.active;
  backPackManagerActive = game.modules.get(CONSTANTS.BACKPACK_MANAGER_MODULE_NAME)?.active;
  babonusActive = game.modules.get(CONSTANTS.BABONUS_MODULE_NAME)?.active;
  itemLinkModuleActive = game.modules.get("item-linking")?.active;
};

export const setupHooks = async () => {
  // Set api
  game.modules.get(CONSTANTS.MODULE_ID).api = API;
};

export const readyHooks = () => {
  CssHelpers.applyGMStyle();
  // CleanerSheetTitleBarHelpers.registerCleanerSheetTitleBarHandler();
  libWrapper.register(
    CONSTANTS.MODULE_ID,
    "CONFIG.Actor.sheetClasses.character['dnd5e.ActorSheet5eCharacter'].cls.prototype.getData",
    CustomCharacterSheetSectionsHelpers.customSectionGetData,
    "WRAPPER"
  );

  if (game.settings.get(CONSTANTS.MODULE_ID, "patchTooltipHelper")) {
    libWrapper.register(
      CONSTANTS.MODULE_ID,
      "CONFIG.Note.objectClass.prototype._drawTooltip",
      ToolTipHelpers.drawTooltipHandler,
      "MIXED"
    );
  }

  Hooks.on("renderActorSheet5eCharacter", (app, html, appData) => {
    CustomCharacterSheetSectionsHelpers.renderActorSheet5eCharacterHandler(app, html, appData);
  });

  // RIMOSSA HA FATTO IL SUO LAVORO  printMacroWithoutAuthor();

  //// Hooks.on("updateActor", (actor, updates, data) => {
  ////   Corruzione.calculateCorruzione(actor, updates, data);
  //// });

  Hooks.on("renderActorSheet5e", (app, html, data) => {
    Corruzione.managePrimaryResourceCorruzione(app, html, data);
    setItemLinkingColor(app, html, data);
    patchStrangeEditableItem(app, html, data);
  });

  Hooks.on("preCreateItem", (doc, createData, options, user) => {
    // setPriceToZeroIfObjectIsNotPreCreatedByGM(doc, createData, options, user);
  });

  Hooks.on("createItem", (item, updates, isDifferent) => {
    setPriceToZeroIfObjectIsNotCreatedByGM(item, updates, isDifferent);
  });

  Hooks.on("dnd5e.preRollToolCheck", (actor, itemData, type) => {
    applyCustomRuleForCraftingItemsWithoutProficiency(actor, itemData, type);
  });

  Hooks.on("dnd5e.getItemContextOptions", (item, options) => {
    ScrollHelpers.createScrollContextVoice(item, options);
  });

  //   /**
  //  * A hook event that fires when an item is used, after the measured template has been created if one is needed.
  //  * @function dnd5e.useItem
  //  * @memberof hookEvents
  //  * @param {Item5e} item                                Item being used.
  //  * @param {ItemUseConfiguration} config                Configuration data for the roll.
  //  * @param {ItemUseOptions} options                     Additional options for configuring item usage.
  //  * @param {MeasuredTemplateDocument[]|null} templates  The measured templates if they were created.
  //  */
  //   Hooks.on("dnd5e.useItem", (item, config, options, templates) => {

  //   });

  //     /**
  //    * A hook event that fires before an item usage is configured.
  //    * @function dnd5e.preUseItem
  //    * @memberof hookEvents
  //    * @param {Item5e} item                  Item being used.
  //    * @param {ItemUseConfiguration} config  Configuration data for the item usage being prepared.
  //    * @param {ItemUseOptions} options       Additional options used for configuring item usage.
  //    * @returns {boolean}                    Explicitly return `false` to prevent item from being used.
  //    */
  //    Hooks.on("dnd5e.preUseItem", (item, config, options) => {

  //    });

  Hooks.on("item-link-tree.preAddLeafToItem", (item, itemAdded) => {
    let isOkTmp = ItemLinkTreeManager.managePreAddLeafToItem(item, itemAdded);
    return isOkTmp;
  });

  Hooks.on("item-link-tree.preRemoveLeafFromItem", (item, itemRemoved) => {
    let isOkTmp = ItemLinkTreeManager.managePreRemoveLeafFromItem(item, itemRemoved);
    return isOkTmp;
  });

  Hooks.on("item-link-tree.postAddLeafToItem", async (item, itemAdded) => {
    await ItemLinkTreeManager.managePostAddLeafToItem(item, itemAdded);
  });

  Hooks.on("item-link-tree.postRemoveLeafFromItem", async (item, itemRemoved) => {
    await ItemLinkTreeManager.managePostRemoveLeafFromItem(item, itemRemoved);
  });

  Hooks.on("item-link-tree.preUpgradeAdditionalCost", (actor, currentItem, itemUpgraded, options) => {
    let isOkTmp = ItemLinkTreeManager.managePreUpgradeAdditionalCost(actor, currentItem, itemUpgraded, options);
    setProperty(options, `additionalCost`, isOkTmp);
  });

  Hooks.on("item-link-tree.preUpgrade", (actor, currentItem, itemUpgraded, options) => {
    let isOkTmp = ItemLinkTreeManager.managePreUpgrade(actor, currentItem, itemUpgraded, options);
    return isOkTmp;
  });

  Hooks.on("item-link-tree.postUpgrade", async (actor, currentItem, itemUpgraded, options) => {
    await ItemLinkTreeManager.managePostUpgrade(actor, currentItem, itemUpgraded, options);
  });

  //   Hooks.on("renderTidy5eItemSheet", async (app, html, data) => {

  //   });

  Object.keys(CONFIG.Item.sheetClasses).forEach((itemType) => {
    Object.keys(CONFIG.Item.sheetClasses[itemType]).forEach((key) => {
      let sheet = key.split(".")[1];
      try {
        Hooks.on("render" + sheet, (app, html, data) => {
          log(`Launch render for ${"render" + sheet}`);
          LockersHelpers.lockItemSheetQuantity(app, html, data);
          LockersHelpers.lockItemSheetWeight(app, html, data);
          LockersHelpers.lockItemSheetPrice(app, html, data);
          LockersHelpers.lockItemSheetEquippedForLeaf(app, html, data);
        });
      } catch (e) {
        error(`Error render for ${"render" + sheet}`);
        throw error(e, true);
      }
    });
  });

  Object.keys(CONFIG.Actor.sheetClasses).forEach((itemType) => {
    Object.keys(CONFIG.Actor.sheetClasses[itemType]).forEach((key) => {
      let sheet = key.split(".")[1];
      try {
        Hooks.on("render" + sheet, (app, html, data) => {
          log(`Launch render for ${"render" + sheet}`);
          LockersHelpers.lockActorSheetQuantity(app, html, data);
          LockersHelpers.lockActorSheetEquipped(app, html, data);
        });
      } catch (e) {
        error(`Error render for ${"render" + sheet}`);
        throw error(e, true);
      }
    });
  });

  Hooks.on("canvasInit", function () {
    enableNoteOnCanvasInit();
  });

  Hooks.on("hoverNote", (note, hovered) => {
    patchForNoteWithMacroWheelModule(note, hovered);
    TerreSelvaggeHelpers.hoverNoteBySettings(note, hovered);
  });

  Hooks.on("dnd5e.createScrollFromSpell", (spell, spellScrollData) => {
    ScrollHelpers.doNotCreateASpellScrollIfYouAreNotGMV2(spell, spellScrollData);
  });

  Hooks.on("renderJournalSheet", (app, html, data) => {
    TerreSelvaggeHelpers.renderJournalSheetAvamposto(app, html, data);
  });

  Hooks.on("renderItemSheet", (app, html, data) => {
    TerreSelvaggeHelpers.renderItemSheetLockAndKeyNoText(app, html, data);
  });

  Hooks.on("renderChatMessage", async (message, html, data) => {
    TerreSelvaggeHelpers.renderChatMessageAnimatedSpells(message, html, data);
  });
};

// /** spell launch dialog **/
// Hooks.on("renderAbilityUseDialog", async (dialog, html, formData) => {
//   Corruzione.checkDialogCorruzione(dialog, html, formData);
// });

// Hooks.on("updateItem", Corruzione.calculateCorruzione);
// Hooks.on("createItem", Corruzione.calculateCorruzione);

// Hooks.on("dnd5e.preItemUsageConsumption", (item, consume, options, update) => {
//   Corruzione.castSpell(item, consume, options, update);
// });

// Hooks.on("preCreateActiveEffect", (activeEffect, _config, _userId) => {
//   patchDAEPreCreateActiveEffect(activeEffect, _config, _userId);
// });

// Hooks.on("preUpdateActiveEffect", (activeEffect, _config, _userId) => {
//   patchDAEPreUpdateActiveEffect(activeEffect, _config, _userId);
// });

// Hooks.on("createActiveEffect", async (activeEffect, _config, _userId) => {
//   await patchDAECreateActiveEffect(activeEffect, _config, _userId);
// });

// Hooks.on("deleteActiveEffect", async (activeEffect, _config, _userId) => {
//   await patchDAEDeleteActiveEffect(activeEffect, _config, _userId);
// });

// Hooks.on("updateActiveEffect", async (activeEffect, _config, _userId) => {
//   await patchDAEUpdateActiveEffect(activeEffect, _config, _userId);
// });

Hooks.on("tidy5e-sheet.renderActorSheet", (app, html, data) => {
  async function main() {
    // items = $(html)[0].querySelectorAll(`[data-tab-contents-for="inventory"] [data-tidy-item-table-row]`);
    const items = html.querySelectorAll(`[data-tab-contents-for="inventory"] [data-tidy-item-table-row]`);
    for (let row of items) {
      const itemId = row.getAttribute("data-item-id");
      const item = data.actor.items.get(itemId);

      let htmlItemTags = "";
      let htmlItemLinking = "";
      let htmlBeaverCrafting = "";

      if (ItemTagsHelpers.isItemTagsModuleActive()) {
        const itemTags = item.flags?.["item-tags"]?.tags;
        if (itemTags && itemTags.length > 0) {
          if (ItemTags.Check(item, itemTags, "includeOR")) {
            const tagToHTML = {
              adamant: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Adamant" style="background-color: purple;">AD</span>`,
              steel: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Steel" style="background-color: steelblue;">ST</span>`,
              gold: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Gold" style="background-color: gold;">AU</span>`,
              silver: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Silver" style="background-color: silver;">AG</span>`,
              darksteel: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Darksteel" style="background-color: black;">DS</span>`,
              firesteel: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Firesteel" style="background-color: orange;">FS</span>`,
              icesteel: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Icesteel" style="background-color: lightblue;">IS</span>`,
              mithril: `<span class="terre-selvagge-material-badge" data-tidy-render-scheme="handlebars" title="Mithril" style="background-color: mauve;">MT</span>`,
            };

            for (const tag of itemTags) {
              if (tagToHTML[tag]) {
                htmlItemTags += tagToHTML[tag];
              }
            }
          }
        }
      }
      TerreSelvaggeHelpers.createRecipeBadge(row.querySelector(".item-table-cell.primary"), item);
      //down
      // NOTE: This is trasnfered on the item-link-tree
      /*
      const itemLeafs = API.getCollection(item);
      if (itemLeafs && itemLeafs.length > 0) {
        // Create a green badge with a '+' symbol
        const leafBadgeHtml = `<span class="terre-selvagge-material-badge2" data-tidy-render-scheme="handlebars">+</span>`;
        const primaryCell = row.querySelector(".item-table-cell.primary");
        primaryCell.insertAdjacentHTML("beforeend", leafBadgeHtml);

        // Find the newly added .terre-selvagge-material-badge2 element
        const leafBadge = primaryCell.querySelector(".terre-selvagge-material-badge2");

        // Build the tooltip content
        let tooltipContent = '<div style="text-align: center;">';
        for (const leaf of itemLeafs) {
          if (await ItemLinkTreeHelpers.isApplyImagesActive(leaf)) {
            tooltipContent += `
              <div style="margin-bottom: 10px;">
                <img src="${leaf.img}" alt="${leaf.name}" style="width: 50px; height: 50px;">
                <p><strong>${leaf.name}</strong></p>
                <p>${leaf.shortDescriptionLink}</p>
              </div>`;
          }
        }
        tooltipContent += "</div>";

        // Initialize Tippy.js tooltip for the badge
        PoppersJsHelpers.tippyTooltip(leafBadge, {
          content: tooltipContent,
          interactive: true,
          zIndex: 9999,
          placement: "right",
          allowHTML: true,
        });
      }
      */
      //up
      if (BeaverCraftingHelpers.isBeaverCraftingModuleActive()) {
        const isCrafted = BeaverCraftingHelpers.isItemBeaverCrafted(item);
        if (isCrafted) {
          htmlBeaverCrafting = `<img src="${CONSTANTS.IMAGES.IS_BEAVER_CRAFTED}" style="border: none; margin-right: 5px;" data-tidy-render-scheme="handlebars" title="Item Crafted" />`;
        }
      }

      if (htmlItemTags !== "") {
        const primaryCell = row.querySelector(".item-table-cell.primary");
        primaryCell.insertAdjacentHTML("afterend", htmlItemTags);

        const badges = primaryCell.parentNode.querySelectorAll(".terre-selvagge-material-badge");
        badges.forEach((badge) => {
          const materialName = badge.getAttribute("title").toLowerCase(); // Convert title to lowercase for the image filename
          const tooltipContent = `
            <div style="text-align: center;">
              <img src="Tiles/Assets/iconeTS/TSitems/${materialName}.webp" alt="${materialName}" style="width: 150px; height: 150px;">
              <p>${badge.getAttribute("title")}</p>
            </div>
          `;
          PoppersJsHelpers.tippyTooltip(badge, {
            content: tooltipContent,
            interactive: true,
            zIndex: 9999,
            placement: "right",
            allowHTML: true,
          });
        });
      }

      if (ItemLinkingHelpers.isItemLinkingModuleActive()) {
        const isLinked = ItemLinkingHelpers.isItemLinked(item);
        const linkedIcon = isLinked ? CONSTANTS.IMAGES.IS_LINKED : CONSTANTS.IMAGES.IS_BROKEN_LINK;
        const tooltipText = isLinked ? "Item Linked" : "Item Not Linked";
        htmlItemLinking = `<img src="${linkedIcon}" style="border: none; margin-right: 5px;" data-tidy-render-scheme="handlebars" title="${tooltipText}" />`;
      }

      // After elements are added to the DOM
      if (htmlItemLinking !== "") {
        const primaryCell = row.querySelector(".item-table-cell.primary");
        primaryCell.insertAdjacentHTML("beforebegin", htmlItemLinking);
      }

      if (htmlBeaverCrafting !== "") {
        const primaryCell = row.querySelector(".item-table-cell.primary");
        primaryCell.insertAdjacentHTML("beforeend", htmlBeaverCrafting);
        const craftedImage = primaryCell.querySelector(`img[src*='${CONSTANTS.IMAGES.IS_BEAVER_CRAFTED}']`);
        if (craftedImage) {
          // Add a Tippy tooltip for the "crafted" image
          PoppersJsHelpers.tippyTooltip(craftedImage, {
            content: "Item Craftato", // Tooltip text
            allowHTML: true,
            placement: "right",
            zIndex: 9999,
            interactive: true,
            onShow(instance) {
              // Retrieve the crafted by actor's name and image
              const craftedBy = BeaverCraftingHelpers.itemBeaverCraftedBy(item);
              // const actorImageUrl = findActorImageByName(craftedBy);
              const actor = game.actors.contents.find(
                (a) => a.name === craftedBy && a.img !== "icons/svg/item-bag.svg"
              );
              const actorImageUrl = actor ? actor.prototypeToken.texture.src : null;

              if (actorImageUrl) {
                const craftedByActorImage = `<img src="${actorImageUrl}" style="max-width: 90px; height: auto; display: block; margin: 8px auto;"> Crafted by ${craftedBy}`;

                // Set the tooltip content to the craftedByActorImage
                instance.setContent(craftedByActorImage);
              }
            },
          });
        }
      }
    }
  }
  // Ensure Tippy.js is loaded before running the main code
  // PoppersJsHelpers.ensureTippyLoaded(main);
  main();
});
