export class CssHelpers {
  static applyGMStyle() {
    if (game.user.isGM) {
      $("[data-tab=settings]").find("[data-action=modules]").css("display", "block!important");
      $("[data-tab=settings]").find("[data-action=players]").css("display", "block!important");
      $("[data-tab=settings]").find("[data-action=configure]").css("display", "block!important");

      // $("body.change-windows #context-menu").css("display", "block!important");

      // $(".trait-selector").css("display", "block!important");

      // $(".dnd5e.sheet.actor.character.cb5es #context-menu ")
      //   .css("display", "block!important")
      //   .css("width", "200px");

      // $("a.configure-sheet").css("display", "block!important");
      // $("a.header-button.control.configure-token").css("display", "block!important");

      Hooks.on("renderActorSheet", (app, html, appData) => {
        $(html).find(".trait-selector").css("display", "block!important");
        $(html).find(".trait-selector").show();

        $(".trait-selector").css("display", "block!important");
        $(".trait-selector").show();
        // if($(".trait-selector").length > 0) {
        //   $(".trait-selector")[0].style.display = "block!important";
        // }

        $(html).find("a.configure-sheet").css("display", "block!important");
        $(html).find("a.configure-sheet").show();

        $("a.configure-sheet").css("display", "block!important");
        $("a.configure-sheet").show();
        // if($("a.configure-sheet").length > 0) {
        //   $("a.configure-sheet")[0].style.display = "block!important";
        // }

        $(html).find("a.header-button.control.configure-token").css("display", "block!important");
        $(html).find("a.header-button.control.configure-token").show();

        $("a.header-button.control.configure-token").css("display", "block!important");
        $("a.header-button.control.configure-token").show();
        // if($("a.header-button.control.configure-token").length >  0) {
        //   $("a.header-button.control.configure-token")[0].style.display = "block!important";
        // }

        $(html)
          .find(".dnd5e.sheet.actor.character.cb5es #context-menu")
          .css("display", "block!important")
          .css("width", "200px");
        $(html).find(".dnd5e.sheet.actor.character.cb5es #context-menu").show();

        $(".dnd5e.sheet.actor.character.cb5es #context-menu").css("display", "block!important").css("width", "200px");
        $(".dnd5e.sheet.actor.character.cb5es #context-menu").show();
        // if($(".dnd5e.sheet.actor.character.cb5es #context-menu").length >  0) {
        //   $(".dnd5e.sheet.actor.character.cb5es #context-menu")[0].style.display = "block!important";
        //   $(".dnd5e.sheet.actor.character.cb5es #context-menu")[0].style.width = "200px";
        // }
      });

      Hooks.on("renderItemSheet", (app, html, appData) => {
        $(html).find(".trait-selector").css("display", "block!important");
        $(html).find(".trait-selector").show();

        $(".trait-selector").css("display", "block!important");
        $(".trait-selector").show();
        // if($(".trait-selector").length > 0) {
        //   $(".trait-selector")[0].style.display = "block!important";
        // }

        $(html).find("a.configure-sheet").css("display", "block!important");
        $(html).find("a.configure-sheet").show();

        $("a.configure-sheet").css("display", "block!important");
        $("a.configure-sheet").show();
        // if($("a.configure-sheet").length > 0) {
        //   $("a.configure-sheet")[0].style.display = "block!important";
        // }

        $(html).find("a.header-button.control.configure-token").css("display", "block!important");
        $(html).find("a.header-button.control.configure-token").show();

        $("a.header-button.control.configure-token").css("display", "block!important");
        $("a.header-button.control.configure-token").show();
        // if($("a.header-button.control.configure-token").length >  0) {
        //   $("a.header-button.control.configure-token")[0].style.display = "block!important";
        // }
      });
    }
  }
}

// #settings-game [data-action="modules"]  {
//     display:  block!important;
// }
// #settings-game [data-action="players"]  {
//     display:  block!important;
// }
// #settings-game [data-action="configure"]  {
//     display:  block!important;
// }
// body.change-windows #context-menu  {
//     display:  block!important;
// }
// .trait-selector {
//     display: block!important;
// }
// .dnd5e.sheet.actor.character.cb5es #context-menu  {
//     display: block!important;
//     width:  200px;
// }
// a.configure-sheet,a.header-button.control.configure-token  {
//     display:  block!important;
// }
