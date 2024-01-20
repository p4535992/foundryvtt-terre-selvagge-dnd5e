export class PoppersJsHelpers {
  /**
   * Function to load a script dynamically
   * @param {*} url
   * @returns
   */
  static loadScript(url) {
    return new Promise((resolve, reject) => {
      if (!document.querySelector(`script[src="${url}"]`)) {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  /**
   * Function to check and load Tippy.js
   * @param {*} callback
   */
  static ensureTippyLoaded(callback) {
    if (typeof tippy === "undefined") {
      PoppersJsHelpers.loadScript("https://unpkg.com/@popperjs/core@2")
        .then(() => {
          return PoppersJsHelpers.loadScript("https://unpkg.com/tippy.js@6");
        })
        .then((loaded) => {
          if (loaded) {
            console.log("Tippy.js and other dependencies loaded successfully.");
            callback(); // Call the callback function after Tippy.js is loaded
          } else {
            console.error("Failed to load Tippy.js and/or its dependencies.");
          }
        })
        .catch((error) => {
          console.error(`Error loading Tippy.js or Vanilla Tilt.js: ${error}`);
        });
    } else {
      console.log("Tippy.js is already loaded.");
      callback(); // Tippy.js is already loaded, so call the callback directly
    }
  }

  static tippyTooltip(
    htmlElement,
    {
      // CUSTOM
      allowHTML = true,
      placement = "right",
      interactive = true,
      // STANDARD
      appendTo = function () {
        return document.body;
      },
      aria = { content: "auto", expanded: "auto" },
      delay = 0,
      duration = [300, 250],
      getReferenceClientRect = null,
      hideOnClick = true,
      ignoreAttributes = false,
      // interactive = false,
      interactiveBorder = 2,
      interactiveDebounce = 0,
      moveTransition = "",
      offset = [0, 10],
      onAfterUpdate = function () {},
      onBeforeUpdate = function () {},
      onCreate = function () {},
      onDestroy = function () {},
      onHidden = function () {},
      onHide = function () {},
      onMount = function () {},
      onShow = function () {},
      onShown = function () {},
      onTrigger = function () {},
      onUntrigger = function () {},
      onClickOutside = function () {},
      // placement = "top",
      plugins = [],
      popperOptions = {},
      render = null,
      showOnCreate = false,
      touch = true,
      trigger = "mouseenter focus",
      triggerTarget = null,

      animateFill = false,
      followCursor = false,
      inlinePositioning = false,
      sticky = false,

      // allowHTML = false,
      animation = "fade",
      arrow = true,
      content = "",
      inertia = false,
      maxWidth = 350,
      role = "tooltip",
      theme = "",
      zIndex = 9999,
    }
  ) {
    tippy(htmlElement, {
      content: content, // Tooltip text
      allowHTML: allowHTML,
      placement: placement,
      zIndex: zIndex,
      interactive: interactive,
      onShow: onShow,
      onShown: onShown,
    });
  }
}
