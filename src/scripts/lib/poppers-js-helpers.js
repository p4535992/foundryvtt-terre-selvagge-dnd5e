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

  static _defaultOnShowCallback = (instance) => {};

  static tippyTooltip(
    htmlElement,
    {
      content = "",
      allowHTML = true,
      placement = "right",
      zIndex = 9999,
      interactive = true,
      onShow = PoppersJsHelpers._defaultOnShowCallback,
    }
  ) {
    tippy(htmlElement, {
      content: content, // Tooltip text
      allowHTML: allowHTML,
      placement: placement,
      zIndex: zIndex,
      interactive: interactive,
      onShow: onShow,
    });
  }
}
