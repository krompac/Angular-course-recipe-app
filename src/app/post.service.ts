import { Injectable } from '@angular/core';
import {Recipe} from './recipe-book/recipe.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {RecipeService} from './services/recipe.service';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://course-project-aa436.firebaseio.com/recipes.json', recipes)
      .subscribe(data => {
        console.log(data);
      });
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>('https://course-project-aa436.firebaseio.com/recipes.json')
        .pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      })
    }), tap(recipes => {
      this.recipeService.overrideRecipes(recipes);
    }));
  }

  deleteRecipes() {
    this.http.delete('https://course-project-a9ddc.firebaseio.com/recipes.json').subscribe();
  }
}
