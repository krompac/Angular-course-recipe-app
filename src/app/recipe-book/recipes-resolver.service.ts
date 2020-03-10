import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {Observable, of} from 'rxjs';

import * as RecipeActions from './store/recipe.actions';
import * as fromApp from '../store/app.reducer';
import * as RecipeSelectors from './store/recipe.selectors';

import {Store} from '@ngrx/store';
import {map, switchMap, take} from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    return this.store.select(RecipeSelectors.selectAllRecipes).pipe(take(1 ),
      switchMap(recipes => {
          if (recipes.length == 0) {
            this.store.dispatch(RecipeActions.fetchRecipes());
            return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
          } else {
            return of(recipes);
          }}
        ));
    }
}
