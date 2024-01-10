if (recipeData && recipeData.tests && recipeData.input) {
  // Retrieve the roll table called 'minerali'
  let rollTable = game.tables.getName("minerali");
  let cumulativeDcMod = 0;

  // Iterate over all roll table ingredients
  rollTable.results.forEach((rollTableIngredient) => {
    // Retrieve the custom name and dc modification value for the roll table ingredient
    let rollTableIngredientName = getProperty(rollTableIngredient, "flags.better-rolltables.brt-result-custom-name");
    let rollTableDcMod = getProperty(rollTableIngredient, "flags.better-rolltables.brt-dc-value");

    // Iterate over all input ingredients to check for matches with the roll table
    Object.values(recipeData.input).forEach((input) => {
      let inputIngredient = Object.values(input).find((i) => i !== null && i.name === rollTableIngredientName);
      if (inputIngredient && rollTableDcMod) {
        // If the input ingredient matches the roll table ingredient name, add the dc modification
        cumulativeDcMod += rollTableDcMod;
      }
    });
  });

  // Apply the cumulative dc modifications to all checks in the tests
  if (cumulativeDcMod > 0) {
    Object.keys(recipeData.tests.ands).forEach((andKey) => {
      let andClause = recipeData.tests.ands[andKey];
      Object.keys(andClause.ors).forEach((orKey) => {
        let orClause = andClause.ors[orKey];
        // Increase the check by the cumulative dc modification
        orClause.check += cumulativeDcMod;
      });
    });
  }

  console.log("All checks have been modified based on input ingredients.");
} else {
  console.error("recipeData, recipeData.tests, or recipeData.input is undefined or null");
}
