import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class IngredientService {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Potatoes', 10)
  ];
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  constructor() {
  }

  getIngredient(id: number) {
    return this.ingredients.slice(id, id + 1)[0];
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(value => this.ingredients.push(value));
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  editIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  delete(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}
