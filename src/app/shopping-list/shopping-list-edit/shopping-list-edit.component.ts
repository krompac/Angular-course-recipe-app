import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html'
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientForm', {static: false}) ingredientForm: NgForm;
  editMode = false;
  editedItemIndex: number;
  subscription: Subscription;
  selectedIngredient: Ingredient = null;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.selectedIngredient = stateData.editedIngredient;
        this.editedItemIndex = stateData.editedIngredientIndex;

        this.ingredientForm.form.setValue({
          name: this.selectedIngredient.name,
          amount: this.selectedIngredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit() {
    const name = this.ingredientForm.value['name'];
    const amount = this.ingredientForm.value['amount'];
    const ingredient = new Ingredient(name, Number(amount));

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient))
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient))
    }

    this.onClear();
  }

  onClear() {
    this.ingredientForm.reset();

    this.editMode = false;
    this.editedItemIndex = -1;
    this.selectedIngredient = null;

    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  deleteIngredient() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }
}
