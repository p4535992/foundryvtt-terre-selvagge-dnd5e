// CONFIGURATION
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

const addItem = async (actor, item) => {
  const oldItem = actor.items.contents.find((i) => i.name === item.name && i.getFlag("beavers-crafting", "status"));
  if (oldItem) {
    await oldItem.update({ "system.quantity": oldItem.system.quantity + 1 });
  } else {
    const data = item.toObject();
    data.flags["beavers-crafting"] = { status: "updated" };
    await actor.createEmbeddedDocuments("Item", [data]);
  }
};

// ------------------------------------ //
// Arguments of the macro
// actor: Actor
// gem: Item
// type: 'armor' | 'weapon'
// target_bonus: number

export async function retrieveSuperiorItemAndReplaceOnActor(actor, gem, type, target_bonus) {
  // Type checking
  if (!(actor instanceof CONFIG.Actor.documentClass)) {
    return ui.notifications.error(`Invalid actor`);
  }

  // Type checking
  if (!(gem instanceof CONFIG.Item.documentClass)) {
    return ui.notifications.error(`Invalid gem`);
  }

  if (!(type in COMPENDIUM)) {
    return ui.notifications.error(`The macro was called with an invalid argument "type": ${type}`);
  }

  if (!(target_bonus > 0)) {
    return ui.notifications.error(`The macro was called with an invalid argument "target_bonus": ${target_bonus}`);
  }

  const base_bonus = target_bonus - 1;

  // ------------------------------------ //
  const compendiums = COMPENDIUM[type]?.map((pack) => game.packs.contents.find((p) => p.metadata.label === pack));

  // Asserting every compendium exists
  if (compendiums.some((c) => c === undefined)) {
    const name = COMPENDIUM[type][compendiums.indexOf(undefined)];
    return ui.notifications.error(`Compendium not found: ${name}`);
  }

  // ------------------------------------ //
  const promisesDocuments = compendiums.map((c) => c.getDocuments());
  const compendiumItems = (await Promise.all(promisesDocuments)).flat();

  const rgx = new RegExp(`(.+) \\+${target_bonus}`);
  const itemsList = compendiumItems
    .map((i) => {
      const match = i.name.match(rgx);
      if (!match) return;
      return [match[1] + (base_bonus === 0 ? "" : ` +${base_bonus}`), i];
    })
    .filter(Boolean);
  const mappedItems = Object.fromEntries(itemsList);
  const itemKeys = Object.keys(mappedItems);

  // ------------------------------------ //
  const upgradeableItems = actor.items.contents.filter(
    (i) => itemKeys.includes(i.name) && i.getFlag("beavers-crafting", "status")
  );

  if (upgradeableItems.length === 0) {
    return ui.notifications.error(`${actor.name} does not have any upgradeable ${type}`);
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
            return ui.notifications.error(`Could not find the item to upgrade`);
          }
          if (gem.system.quantity < 1 || gem.parent !== actor) {
            return ui.notifications.error(`Could not find ${gem.name} to upgrade`);
          }
          const targetItem = mappedItems[item.name];

          await removeItem(item);
          await removeItem(gem);
          await addItem(actor, mappedItems[item.name]);

          ui.notifications.info(`Item upgraded with success! ${item.name} -> ${targetItem.name}`);
          ChatMessage.create({
            content: `<b>${actor.name}</b> inserted a <b>${gem.name}</b> and upgraded 1 <b>${item.name}</b> into a <b>${targetItem.name}</b>`,
          });
        },
      },
    },
    default: "yes",
  }).render(true);
}
