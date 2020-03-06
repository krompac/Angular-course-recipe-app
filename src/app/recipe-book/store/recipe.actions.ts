import {Action} from '@ngrx/store';
import {Recipe} from '../recipe.model';

export const ADD_RECIPE = '[Recipes] Add Recipe';
export const EDIT_RECIPE = '[Recipes] Edit Recipe';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';
export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const STORE_RECIPES = '[Recipes] Store Recipes';

export const FIREBASE_RECIPES_JSON = 'https://course-project-aa436.firebaseio.com/recipes.json';

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {}
}

export class EditRecipe implements Action {
  readonly type = EDIT_RECIPE;

  constructor(public payload: {recipe: Recipe, index: number}) {}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {}
}

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;
}

export type RecipeActions = AddRecipe | EditRecipe | DeleteRecipe | SetRecipes | FetchRecipes;
