import * as fromRecipe from './recipe.reducer';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectRecipeState = createFeatureSelector<fromRecipe.State>('recipes');

export const selectAllRecipes = createSelector(selectRecipeState, fromRecipe.recipeAdapter.getSelectors().selectAll);
