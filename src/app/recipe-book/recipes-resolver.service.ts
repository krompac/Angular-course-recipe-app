import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {Observable} from 'rxjs';
import {PostService} from '../post.service';
import {RecipeService} from '../services/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
  constructor(private postService: PostService, private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    const recipes = this.recipeService.getRecipes();

    if (recipes.length == 0){
      return this.postService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
