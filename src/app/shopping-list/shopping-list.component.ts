import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {Ingredient} from '../shared/ingredient.model';

import * as fromApp from '../store/app.reducer';
import * as ShoppingListSelectors from './store/shopping-list.selectors';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  ingredientSub: Subscription;
  editStarted = new Subject<Ingredient>();

  constructor(private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.ingredientSub  = this.store.select(ShoppingListSelectors.selectAllIngredients)
      .subscribe(ingredients => this.ingredients = ingredients);
  }

  editItem(index: number) {
    this.editStarted.next(this.ingredients[index]);
  }

  ngOnDestroy() {
    this.ingredientSub.unsubscribe();
  }

}
