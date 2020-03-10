import * as fromShoppingList from './shopping-list.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = fromShoppingList.ingredientAdapter.getSelectors();

export const selectIngredientState = createFeatureSelector<fromShoppingList.State>('shoppingList');

export const selectIngredientIds = createSelector(
  selectIngredientState,
  selectIds
);

export const selectIngredientEntities = createSelector(
  selectIngredientState,
  selectEntities
);

export const selectAllIngredients = createSelector(
  selectIngredientState,
  selectAll
);

export const selectTotalNumberOfIngredients = createSelector(
  selectIngredientState,
  selectTotal
);
