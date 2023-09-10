The api is reachable from the variable `game.modules.get('terre-selvagge-dnd5e').api` or from the socket libary `socketLib` on the variable `game.modules.get('terre-selvagge-dnd5e').socket` if present and active.

#### retrieveAndApplyBonuses({item: uuid|Item, type:string, name?:string, image?:string, prefix?:string, suffix?:string}):void ⇒ <code>Promise&lt;void&gt;</code>

Recupera gli item presenti su un attore, di un certo tipo (e.g. weapon) dall'attore corrente e permette di selezionare uno degli item su cui settare uno degli effetti del modulo babonus sull'arma scelta.
In pratica applica un bonus di babonus all'item scelto.

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |
| type | <code>string</code> | The type of the item to choose (background,backpack,base,class,consumable,equipment,feat,loot,spell,subclass,tool,weapon) | |
| name | <code>string</code> | OPTIONAL: The new name of the item | |
| image | <code>string</code> | OPTIONAL: The path to the new image of the item | |
| prefix | <code>string</code> | OPTIONAL: Applied a prefix on the name of the item | |
| suffix | <code>string</code> | OPTIONAL: Applied a suffix on the name of the item | |

**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.retrieveAndApplyBonuses({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5",
    type: "weapon"
})

```

#### retrieveSuperiorItemAndReplaceOnActor({item: uuid|Item, type:string, target_bonus:number, name?:string, image?:string, prefix?:string, suffix?:string}):void ⇒ <code>Promise&lt;void&gt;</code>

Recupera un'oggetto "superiore" dell'oggetto corrente usando come riferimento il nome dell'oggetto linkato ad esso e non l'oggetto stesso.
Una macro che sostituisce ad esempio Longsword +1, to Longsword +2

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |
| type | <code>string</code> | The type of the item to choose (armor,weapon) | The type is linked to a compendium check the map below|
| target_bonus | <code>number</code> | The target bonus, if you want upgrade a +1 item use the value 2, if you want to upgrade a item +2 use 3 | Remember the name checked during the retrieve of the weapon is the one of the linked item on the compendium not the name on the current item |
| name | <code>string</code> | OPTIONAL: The new name of the item | |
| image | <code>string</code> | OPTIONAL: The path to the new image of the item | |
| prefix | <code>string</code> | OPTIONAL: Applied a prefix on the name of the item | |
| suffix | <code>string</code> | OPTIONAL: Applied a suffix on the name of the item | |

**The map type<->compendium**

```
const COMPENDIUM = {
  armor: ["ArmaturePG"],
  weapon: ["ArmiPG"],
};
```

**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.retrieveSuperiorItemAndReplaceOnActor({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5",
    type: "weapon",
    target_bonus: 3
})

```


#### deleteAllBonusFromItem({item: uuid|Item}):void ⇒ <code>Promise&lt;void&gt;</code>

Rimuovi tutti i bonus dall'oggetto selezionato

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |


**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.deleteAllBonusFromItem({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5"
})

```

#### setItemAsBeaverCrafted({item: uuid|Item}):void ⇒ <code>Promise&lt;void&gt;</code>

Rendi un'oggetto "beaver craftato" aggiungendo i flags appositi , "created" se il flag è assente "updated" se gia' presente con il valore "created"

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |


**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.setItemAsBeaverCrafted({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5"
})
```

#### unsetItemAsBeaverCrafted({item: uuid|Item}):void ⇒ <code>Promise&lt;void&gt;</code>

Rimuovi i flags del "beaver craftato" rendendo l'oggetto craftato non craftato

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |


**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.unsetItemAsBeaverCrafted({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5"
})

```

#### createScroll({item: uuid|Item}):void ⇒ <code>Promise&lt;void&gt;</code>

Crea uno scroll con valori predefiniti a partire da un'item.
I valori predefiniti sono:

- timeToken = "Time Coin";
- label = "Scribe Scroll";
- feats = [{ name: "", price: 0.5 }];
- spellComponents =  { "Arcane Sword": { h: ["Miniature Platinum Sword (250 gp)"] }, Augury: { h: ["Specially Marked Tokens (25 gp)"] ... }

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |


**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.createScroll({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5"
})

```

#### createScrollWithParams({item: uuid|Item, spellComponents: Object, feats: Object, label: string, timeToken:string}):void ⇒ <code>Promise&lt;void&gt;</code>

Crea uno scroll con valori espliciti a partire da un'item.

**Returns**: <code>Promise&lt;void&gt;</code> - Return nothing

| Param | Type | Description | Note |
| --- | --- | --- | --- |
| item | <code>uuid of the item or item</code> | The uuid of the item or the item object himself | If you use the module 'Item Macro' the variable value is 'item' |

TODO

**Example**:

```
game.modules.get('terre-selvagge-dnd5e').api.createScrollWithParams({
    item: "Actor.7bm6EK8jnopnGRS4.Item.kowQq6PhIxid2ei5",
    timeToken: "Time Coin",
    label: "Scribe Scroll",
    feats: [{ name: "", price: 0.5 }],
    spellComponents:  { "Arcane Sword": { h: ["Miniature Platinum Sword (250 gp)"] }, Augury: { h: ["Specially Marked Tokens (25 gp)"] ... }
})
```

### Altri esempi

```
game.modules.get('terre-selvagge-dnd5e').api.giveTimeCoins("Pool", 1, "Compendium.world.prodottifiniti.Item.kRCfy16NbjWDmmZN");
```

```
game.modules.get('terre-selvagge-dnd5e').api.updateHarvesterQuantityByRegExOnFolder("Folder.kRCfy16NbjWDmmZN");
```

```
game.modules.get('terre-selvagge-dnd5e').api.retrieveDetailsIncomeForActor({uuid: "Actor.yYmgTUEKN2or5YKe"})
```