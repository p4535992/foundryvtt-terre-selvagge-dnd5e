import CONSTANTS from "../constants/constants";

export class CleanerSheetTitleBarHelpers {
  static registerCleanerSheetTitleBarHandler() {
    if (game.settings.get(CONSTANTS.MODULE_ID, "collapse-navbars")) {
      CleanerSheetTitleBarHelpers.handlePopout();
      Hooks.on("renderApplication", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderDocumentSheet", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderActorSheet", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderJournalSheet", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderItemSheet", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderRollTableConfig", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderSidebarTab", CleanerSheetTitleBarHelpers.eventHandler);
      Hooks.on("renderFormApplication", CleanerSheetTitleBarHelpers.eventHandler);
    }
  }

  static removeTextFromButton(element) {
    if (element.title === undefined || element.title.trim() === "") element.title = element.innerText?.trim();

    // Maestro compatibility hack
    if (element.className === "hype-track" || element.className === "item-track") {
      element.getElementsByTagName("span")[0]?.remove();
      return;
    }

    const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT);
    let node = undefined;
    while ((node = nodeIterator.nextNode())) {
      element.removeChild(node);
    }
  }

  static cleanDocumentHeader(app, html) {
    if (html === undefined) return;

    // When using PopOut! module, button text is reset when you pop window in.
    // In this case, html is just form and not all window. So, we find parent window to get header section
    const header =
      "form".localeCompare(html[0].tagName, undefined, { sensitivity: "base" }) === 0
        ? html[0].parentElement.parentElement
        : html[0];

    const windowHeader = header.querySelector("header.window-header");
    if (windowHeader === null || windowHeader === undefined) return;

    setTimeout(() => {
      const headerButtons = windowHeader.querySelectorAll("a");
      if (
        headerButtons === null ||
        headerButtons === undefined ||
        (Array.isArray(headerButtons) && !headerButtons.length)
      )
        return;

      for (let headerButton of headerButtons) {
        CleanerSheetTitleBarHelpers.removeTextFromButton(headerButton);
      }
    }, 100);
  }

  static cleanSheetTabs(app, html) {
    if (!(app instanceof TokenConfig) || !html || !game.settings.get(CONSTANTS.MODULE_ID, "collapse-navbars")) return;

    const navs = html[0].querySelectorAll(".window-content nav.tabs");
    if (navs === null || navs === undefined) return;

    setTimeout(() => {
      for (let nav of navs) {
        const tabs = nav.querySelectorAll("a.item");
        if (tabs === null || tabs === undefined || (Array.isArray(tabs) && !tabs.length)) return;

        for (let tab of tabs) {
          CleanerSheetTitleBarHelpers.removeTextFromButton(tab);
        }
        $(nav).css("justify-content", "center");
      }
      app.setPosition(app.position);
    }, 100);
  }

  static cleanPoppedDocumentHeader(app, poppedWindow) {
    if (poppedWindow === undefined) return;
    CleanerSheetTitleBarHelpers.cleanDocumentHeader(app, $(poppedWindow));
  }

  static handlePopout() {
    if (game.modules.get("popout")) {
      Hooks.on("PopOut:loaded", CleanerSheetTitleBarHelpers.cleanPoppedDocumentHeader);
    }
  }

  static eventHandler(app, html) {
    CleanerSheetTitleBarHelpers.cleanDocumentHeader(app, html);
    CleanerSheetTitleBarHelpers.cleanSheetTabs(app, html);
  }
}
