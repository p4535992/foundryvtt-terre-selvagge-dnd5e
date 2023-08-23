// CONFIGURATION

import { BeaverCraftingHelpers } from "./lib/beavers-crafting-helpers";
import { ItemLinkingHelpers } from "./lib/item-linking-helper";
import { error, getItem, log, warn } from "./lib/lib";

// Insert here the list of compendiums names for every macro "type"
const COMPENDIUM = {
  armor: ["ArmaturePG"],
  weapon: ["ArmiPG"],
};

const removeItem = async (item) => {
  const modify = item.system.quantity > 1;
  if (modify) {
    await item.update({ "system.quantity": item.system.quantity - 1 });
  } else {
    await item.delete();
  }
};

const addItem = async (actor, item, currentName, currentImage) => {
  const oldItem = actor.items.contents.find((i) => {
    // MOD 4535992
    // return i.name === item.name && i.getFlag("beavers-crafting", "status");
    return i.name === currentName && BeaverCraftingHelpers.isItemBeaverCrafted(i);
  });
  if (oldItem) {
    await oldItem.update({ "system.quantity": oldItem.system.quantity + 1 });
  } else {
    const data = item.toObject();
    data.flags["beavers-crafting"] = { status: "updated" };
    // MOD 4535992
    data.name = currentName;
    data.img = currentImage;

    await actor.createEmbeddedDocuments("Item", [data]);
  }
};

// ------------------------------------ //
// Arguments of the macro
// actor: Actor
// gem: Item
// type: 'armor' | 'weapon'
// target_bonus: number

export async function retrieveSuperiorItemAndReplaceOnActor(gem, type, target_bonus, itemNewName, itemNewImage, itemNewPrefix ,itemNewSuffix) {

  gem = getItem(gem);
  // Type checking
  if (!(gem instanceof CONFIG.Item.documentClass)) {
    throw error(`Invalid gem`, true);
  }

  const actor = gem.actor;
  if (!actor) {
    throw error(`${game.user.name} please at least select a actor`, true);
  }

    // Type checking
    if (!(actor instanceof CONFIG.Actor.documentClass)) {
        throw error(`Invalid actor`, true);
    }

  if (!(type in COMPENDIUM)) {
    throw error(`The macro was called with an invalid argument "type": ${type}`, true);
  }

  if (!(target_bonus > 0)) {
    throw error(`The macro was called with an invalid argument "target_bonus": ${target_bonus}`, true);
  }

  const base_bonus = target_bonus - 1;

  // ------------------------------------ //
  const compendiums = COMPENDIUM[type]?.map((pack) => {
    return game.packs.contents.find((p) => p.metadata.label === pack)
  });

  // Asserting every compendium exists
  if (compendiums.some((c) => c === undefined)) {
    const name = COMPENDIUM[type][compendiums.indexOf(undefined)];
    throw error(`Compendium not found: ${name}`, true);
  }

  // ------------------------------------ //
  const promisesDocuments = compendiums.map((c) => c.getDocuments());
  const compendiumItems = (await Promise.all(promisesDocuments)).flat();

  const rgx = new RegExp(`(.+) \\+${target_bonus}`);
  const itemsList = compendiumItems
    .map((i) => {
      // MOD 4535992
      //const match = i.name.match(rgx);
        if(!ItemLinkingHelpers.isItemLinked(i)) {
            // warn(`The item ${i.name}|${i.uuid} is not linked`);
            return false;
        }
        const baseItem = retrieveLinkedItem(i);
        if(!baseItem) {
            // warn(`The item ${i.name}|${i.uuid} is linked but not item is founded`);
            return false;
        }
      const match = baseItem.name.match(rgx);
      if (!match) {
        return;
      }
      return [match[1] + (base_bonus === 0 ? "" : ` +${base_bonus}`), i];
    })
    .filter(Boolean);
  const mappedItems = Object.fromEntries(itemsList);
  const itemKeys = Object.keys(mappedItems);

  // ------------------------------------ //
  const upgradeableItems = actor.items.contents.filter(
    (i) => {
        // MOD 4535992
        //return itemKeys.includes(i.name) && i.getFlag("beavers-crafting", "status")
        if(!ItemLinkingHelpers.isItemLinked(i)) {
            // warn(`The item ${i.name}|${i.uuid} is not linked`);
            return false;
        }
        const baseItem = retrieveLinkedItem(i);
        if(!baseItem) {
            // warn(`The item ${i.name}|${i.uuid} is linked but not item is founded`);
            return false;
        }
        return itemKeys.includes(baseItem.name);
    }
  );

  if (upgradeableItems.length === 0) {
    throw error(`${actor.name} does not have any upgradeable ${type}`, true);
  }

  // ------------------------------------ //

  // ------------------------------------ //
  const content = /*html*/ `
    <form autocomplete="off">
        <div>
            Select an ${type} to upgrade.
        </div>
        <hr/>
        <div class="form-group">
            <label>Item</label>
            <select id="item" name="item">
            {{#each upgradeableItems}}
                <option value="{{_id}}">{{name}}</option>
            {{/each}}
            </select>
        </div>
        <div class="form-group">
            <label>Cost</label>
            <span>1 ${gem.name}</span>
        </div>
    </form>
`;

  new Dialog({
    title: `${actor.name}: Upgrade ${type.titleCase()} ${target_bonus}`,
    content: Handlebars.compile(content)({
      upgradeableItems,
    }),
    buttons: {
      yes: {
        icon: `<i class="fas fa-hand-holding-medical"></i>`,
        label: "Insert Gem",
        callback: async (html) => {
          const item = actor.items.get(html.find("#item")[0].value);
          if (!item) {
            throw error(`Could not find the item to upgrade`,true);
          }
          if (gem.system.quantity < 1 || gem.parent !== actor) {
            throw error(`Could not find ${gem.name} to upgrade`,true);
          }
          const targetItem = mappedItems[item.name];

          let currentName = manageNewName(weaponMain.name, itemNewName, itemNewPrefix ,itemNewSuffix);
          let currentImage = weaponMain.img;
          if (itemNewImage) {
            currentImage = itemNewImage;
          }
          await addItem(actor, targetItem, currentName, currentImage);

          await removeItem(item);
          await removeItem(gem);

          log(`Item upgraded with success! ${item.name} -> ${targetItem.name}`);
          ChatMessage.create({
            content: `<b>${actor.name}</b> inserted a <b>${gem.name}</b> and upgraded 1 <b>${item.name}</b> into a <b>${targetItem.name}</b>`,
          });
        },
      },
    },
    default: "yes",
  }).render(true);
}
