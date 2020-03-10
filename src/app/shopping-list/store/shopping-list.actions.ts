import {createAction, props} from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';
import { Update } from '@ngrx/entity';

const ADD_INGREDIENT = '[Shopping list] Add Ingredient';
const ADD_INGREDIENTS = '[Shopping list] Add Ingredients';
const UPDATE_INGREDIENT = '[Shopping list] Update Ingredient';
const DELETE_INGREDIENT = '[Shopping list] Delete Ingredient';

export const addIngredient = createAction(ADD_INGREDIENT, props<{ingredient: Ingredient}>());
export const addIngredients = createAction(ADD_INGREDIENTS, props<{ingredients: Ingredient[]}>());
export const updateIngredient = createAction(UPDATE_INGREDIENT, props<{ingredient: Update<Ingredient>}>());
export const deleteIngredient = createAction(DELETE_INGREDIENT, props<{id: number}>());

