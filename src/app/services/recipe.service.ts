import {EventEmitter, Injectable} from '@angular/core';
import {Recipe} from '../recipe-book/recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe('Test two', 'Another description', 'https://cdn.pixabay.com' +
  //     '/photo/2016/06/15/19/09/food-1459693_960_720.jpg', []),
  //   new Recipe('Test recipe', 'This is simply a test', 'https://www.foodiecrush.com/wp-content/uploads/2018/10' +
  //     '/Pork-Schnitzel-foodiecrush.com-016.jpg', [
  //     new Ingredient('Meat', 1),
  //     new Ingredient('French fries', 20)
  //   ])
  // ];
  //
  private recipes: Recipe[] = [];

  recipesChanged = new Subject<void>();

  getRecipes() {
    return this.recipes.slice();
  }

  getLength() {
    return this.recipes.length;
  }

  getRecipe(id: number) {
    return this.recipes.slice(id, id + 1)[0];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next();
  }

  editRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next();
  }

  overrideRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next();
  }
}
