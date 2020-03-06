import {Injectable} from '@angular/core';
import {Recipe} from './recipe-book/recipe.model';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {RecipeService} from './services/recipe.service';

import * as RecipeActions from './recipe-book/store/recipe.actions';
import * as fromApp from './store/app.reducer';
import {Store} from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) { }

  storeRecipes() {
    this.store.select('recipes').pipe(
      map(state => state.recipes),
      switchMap(recipes => this.http.put('https://course-project-aa436.firebaseio.com/recipes.json', recipes)))
      .subscribe(data => console.log(data));
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>('https://course-project-aa436.firebaseio.com/recipes.json')
        .pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })
    }), tap(recipes => {
      this.store.dispatch(new RecipeActions.SetRecipes(recipes));
    }));
  }

  deleteRecipes() {
    this.http.delete('https://course-project-a9ddc.firebaseio.com/recipes.json').subscribe();
  }
}
