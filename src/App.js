import React, { useState } from 'react';
import './App.css';

const App = () => {

  const [output, setOutput] = useState('Click submit to see the formatted recipe appear.');

  const [ingredients, setIngredients] = useState({
    salt: {
      text: '1 tsp Salt'
    },
    water: {
      text: '150 ml Water, very cold'
    },
    flour: {
      text: '455 g AP Flour, plus more for rolling out'
    },
    butter: {
      text: '300 g Butter, very cold, cut into 1 in pieces'
    }
  });

  const [procedure, setProcedure] = useState(
    "1. Dissolve the {salt} into the {water} and keep very cold until ready to use \n2. In a food processor, pulse the {flour} and {butter} together briefly until large crumbs are formed and some butter is no larger than pea - sized. \n3. Add the water and salt mixture to the flour and pulse for several seconds until the dough begins to come together in a ball but not smooth. Butter chunks should still be visible. \n4. Transfer to floured surface and divide dough into 2 equal balls. Shape each ball into a 1-inch thick disc. Wrap well in plastic and chill for 2 HOURS (or overnight.) \n5. Roll out until about 1/8-inch thick. Carefully transfer to a buttered pie pan. Chill for 30 MIN to achieve flaky crust before blind baking. \n6. Preheat oven to 375 F \n7. Line the pastry dough with parchment paper and fill with pie weights or dried beans. \n8. Bake for 25 MIN until surface is dull and pale. Remove parchment and weights and bake for another 2-3 MIN. \n9. Cool completely before filling."
  );
  
  const addMarkup = (text) => {
    // breakup text chunk into array using line breaks
    const arrProcedure = splitLines(text);
    const tempIngredients = { ...ingredients };
    // mark where the ingredients should appear
    setIngredients(createPositions(arrProcedure, tempIngredients));
    // put it all int order in one array with jsx
    const combinedRecipe = combineRecipe(arrProcedure);
    setOutput(renderOutput(combinedRecipe));
  };

  const renderOutput = (recipe) => {
    return recipe.map(line => line);
  };

  const removeBraces = (text) => {
    let outputText = text;
    if (outputText.includes('{')) {
      return removeBraces(outputText.replace('{', ''));
    } else if (outputText.includes('}')) {
      return removeBraces(outputText.replace('}', ''));
    } else {
      return outputText;
    }
  };

  const combineRecipe = (procedure) => {
    const newRecipe = [];
    for (let i = 0; i < procedure.length; i++) {
      for (const [, value] of Object.entries(ingredients)) {
        if (value.position === undefined) {
          value.position = 0;
        }
        if (value.position === i) {
          newRecipe.push(<div className="ingredient">{value.text}</div>);
        }
      }
      let newProcedureLine = removeBraces(procedure[i]);
      newRecipe.push(<div className="procedure">{newProcedureLine}</div>);
    }
    return newRecipe;
  };

  const createPositions = (procedure, ingredients) => {
    for (const [key] of Object.entries(ingredients)) {
      for (let i = 0; i < procedure.length; i++) {
        if (procedure[i].includes(`{${key}}`)) {
          // making sure the position hasn't already been set earlier in the procedure steps. We only want it to appear once when it is first mentioned
          if (ingredients[key].position === undefined) {
            ingredients[key].position = i;
          }
        }
      }
    }
    return ingredients;
  };

  const splitLines = (text) => {
    const split = text.split("\n");
    return(split);
  };

  return (
    <div className="App">
      <textarea rows="10"
        value={procedure}
        onChange={(e) => {
          setProcedure(e.target.value);
        }}
      ></textarea>
      <br />
      <button onClick={() => addMarkup(procedure)}>Submit</button>
      <div className="output-container">
        <div className="output">
          {output}
        </div>
      </div>
    </div>
  );
};

export default App;
