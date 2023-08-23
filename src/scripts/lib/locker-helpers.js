export class LockersHelpers {

    static lockItemSheetQuantity(app, html, data) {
        if(!game.user.isGM) {
            for (const elem of html.find("input[name^='system.quantity']")) {
                elem.setAttribute("readonly", true);
            }
        }
    }

    static lockItemSheetWeight(app, html, data) {
        if(!game.user.isGM) {
            for (const elem of html.find("input[name^='system.weight']")) {
                elem.setAttribute("readonly", true);
            }
        }
    }

    static lockItemSheetPrice(app, html, data) {
        if(!game.user.isGM) {
            for (const elem of html.find("input[name^='system.price.value']")) {
                elem.setAttribute("readonly", true);
            }
            for (const elem of html.find("select[name^='system.price.denomination']")) {
                elem.setAttribute("disabled", true);
            }
        }
    }

    // static lockItemSheetDescription(app, html, data) {
    //     if(!game.user.isGM) {
    //         for (const elem of html.find("input[name^='system.price.value']")) {
    //             elem.setAttribute("readonly", true);
    //         }
    //         for (const elem of html.find("select[name^='system.price.denomination']")) {
    //             elem.setAttribute("disabled", true);
    //         }
    //     }
    // }
}
