import {Ingredient} from '../../shared/ingredient.model';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import * as ShoppingListActions from './shopping-list.actions';

export interface State extends EntityState<Ingredient>{}

export const ingredientAdapter = createEntityAdapter<Ingredient>();

export const initialState: State = ingredientAdapter.getInitialState();

const shoppingListReducer = createReducer(initialState,
  on(ShoppingListActions.addIngredient, (state, {ingredient}) => ingredientAdapter.addOne(ingredient, state)),
  on(ShoppingListActions.addIngredients, ((state, {ingredients}) => ingredientAdapter.addAll(ingredients, state))),
  on(ShoppingListActions.deleteIngredient, ((state, {id}) => ingredientAdapter.removeOne(id, state))),
  on(ShoppingListActions.updateIngredient, (state, {ingredient}) => ingredientAdapter.updateOne(ingredient, state)));

export function reducer(state: State, action: Action) {
  return shoppingListReducer(state, action);
}
