### Terre Selvagge - Corruzione Dnd5e

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-ts-corruzione-dnd5e/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fts-corruzione-dnd5e&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=ts-corruzione-dnd5e)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-ts-corruzione-dnd5e%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-ts-corruzione-dnd5e%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fts-corruzione-dnd5e%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/ts-corruzione-dnd5e/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-ts-corruzione-dnd5e/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/ts-corruzione-dnd5e/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/ts-corruzione-dnd5e/)

### If you want to buy me a coffee [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/p4535992)

A personal module for manage a custom resource called "Corruzione"

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-ts-corruzione-dnd5e/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.


## Known issue

# API

The api is reachable from the variable `game.modules.get('ts-corruzione-dnd5e').api` or from the socket libary `socketLib` on the variable `game.modules.get('ts-corruzione-dnd5e').socket` if present and active.

#### retrieveAndApplyBonuses({item: uuid|Item, type:string, name?:string, image?:string, suffix?:string}):void ⇒ <code>Promise&lt;void&gt;</code>

Recupera gli item presenti su un attore, di un certo tipo (e.g. weapon) dall'attore corrente e permette di selzionare uno degli item su cui settare uno degli effetti del modulo babonus sull'arma scelta.
In pratica applica un bonus di babonus all'item scelto.

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or Item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |
| type | <code>string</code> | The type of the item to choose (background,backpack,base,class,consumable,equipment,feat,loot,spell,subclass,tool,weapon) | |
| name | <code>string</code> | OPTIONAL: The new name of the item | |
| image | <code>string</code> | OPTIONAL: The path to the new image of the item | |
| suffix | <code>string</code> | OPTIONAL: Applied a suffix on the name of the item | |

**Example**:

```
game.modules.get('ts-corruzione-dnd5e').api.retrieveAndApplyBonuses({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5",
    type: "weapon"
})

```

# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

## npm build scripts

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build-watch

`build-watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build-watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-ts-corruzione-dnd5e/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!
