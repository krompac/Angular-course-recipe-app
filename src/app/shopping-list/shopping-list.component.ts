import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {IngredientService} from '../services/ingredient.service';
import {ActivatedRoute, Data} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(private ingredientService: IngredientService, private route: ActivatedRoute,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) {

  }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  editItem(id: number) {
    this.ingredientService.startedEditing.next(id);
  }
}
