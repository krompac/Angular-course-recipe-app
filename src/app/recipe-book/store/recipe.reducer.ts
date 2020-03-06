import {Recipe} from '../recipe.model';

import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeReducer(state: State = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };

    case RecipeActions.EDIT_RECIPE:
      const recipe = state.recipes[action.payload.index];
      const updatedRecipe = {...recipe, ...action.payload.recipe};

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return  {
        ...state,
        recipes: updatedRecipes
      };

    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes].filter((value, index) => index !== action.payload)
      };

    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      };

    default:
      return state;
  }
}
