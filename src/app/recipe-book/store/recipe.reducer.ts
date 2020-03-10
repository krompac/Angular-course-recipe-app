import {Recipe} from '../recipe.model';

import * as RecipeActions from './recipe.actions';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

export interface State extends EntityState<Recipe>{}

export const recipeAdapter = createEntityAdapter<Recipe>();

const initialState: State = recipeAdapter.getInitialState();

const recipeReducer = createReducer(initialState,
  on(RecipeActions.addRecipe, ((state, {recipe}) => recipeAdapter.addOne(recipe, state))),
  on(RecipeActions.editRecipe, ((state, {recipe}) => recipeAdapter.updateOne(recipe, state))),
  on(RecipeActions.deleteRecipe, ((state, {id}) => recipeAdapter.removeOne(id, state))),
  on(RecipeActions.setRecipes, ((state, {recipes}) => recipeAdapter.addMany(recipes, state)))
);

export function reducer(state: State, action: Action) {
  return recipeReducer(state, action);
}
