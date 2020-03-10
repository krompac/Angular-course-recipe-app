import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../recipe.model';
import {Store} from '@ngrx/store';

import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import * as RecipeSelectors from './recipe.selectors';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(RecipeActions.FIREBASE_RECIPES_JSON).pipe(map(recipes => {
        if (!recipes) {
          recipes = [];
        } else {
          recipes.forEach(recipe => recipe.ingredients = recipe.ingredients ? recipe.ingredients : [])
        }

        return RecipeActions.setRecipes({recipes: recipes});
      }));
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select(RecipeSelectors.selectAllRecipes)),
    map(([data, recipeState]) => recipeState),
    switchMap(recipes => this.http.put(RecipeActions.FIREBASE_RECIPES_JSON, recipes))
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {
  }
}
