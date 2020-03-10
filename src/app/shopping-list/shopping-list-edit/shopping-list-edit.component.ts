import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import {Update} from '@ngrx/entity';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html'
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientForm', {static: false}) ingredientForm: NgForm;
  @Input() editStarted: Subject<Ingredient>;
  editMode = false;
  editItemId: number;
  subscription: Subscription;
  selectedIngredient: Ingredient = null;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.subscription = this.editStarted.subscribe((ingredient: Ingredient) => {
      if (ingredient) {
        this.editMode = true;
        this.selectedIngredient = ingredient;
        this.editItemId = ingredient.id;

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
      const editIngredient: Update<Ingredient> = {
        id: this.editItemId,
        changes: {...ingredient}
      };

      this.store.dispatch(ShoppingListActions.updateIngredient({ingredient: editIngredient}))
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ingredient}))
    }

    this.onClear();
  }

  onClear() {
    this.ingredientForm.reset();

    this.editMode = false;
    this.editItemId = -1;
    this.selectedIngredient = null;

    this.editStarted.next(null);
  }

  deleteIngredient() {
    this.store.dispatch(ShoppingListActions.deleteIngredient({id: this.editItemId}));
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
