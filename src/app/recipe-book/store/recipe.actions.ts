import {createAction, props} from '@ngrx/store';
import {Recipe} from '../recipe.model';
import {Update} from '@ngrx/entity';

export const ADD_RECIPE = '[Recipes] Add Recipe';
export const EDIT_RECIPE = '[Recipes] Edit Recipe';
export const DELETE_RECIPE = '[Recipes] Delete Recipe';
export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const STORE_RECIPES = '[Recipes] Store Recipes';

export const FIREBASE_RECIPES_JSON = 'https://course-project-aa436.firebaseio.com/recipes.json';

export const addRecipe = createAction(ADD_RECIPE, props<{recipe: Recipe}>());
export const editRecipe = createAction(EDIT_RECIPE, props<{recipe: Update<Recipe>}>());
export const deleteRecipe = createAction(DELETE_RECIPE, props<{id: number}>());
export const setRecipes = createAction(SET_RECIPES, props<{recipes: Recipe[]}>());
export const fetchRecipes = createAction(FETCH_RECIPES);
export const storeRecipes = createAction(STORE_RECIPES);
