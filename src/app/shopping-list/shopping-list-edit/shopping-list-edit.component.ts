import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {IngredientService} from '../../services/ingredient.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

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

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.subscription = this.ingredientService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.selectedIngredient = this.ingredientService.getIngredient(index);

        this.ingredientForm.form.setValue({
          name: this.selectedIngredient.name,
          amount: this.selectedIngredient.amount
        });
      }
    )
  }

  onSubmit() {
    const name = this.ingredientForm.value['name'];
    const amount = this.ingredientForm.value['amount'];
    const ingredient = new Ingredient(name, Number(amount));

    if (this.editMode) {
      this.ingredientService.editIngredient(this.editedItemIndex, ingredient);
    } else {
      this.ingredientService.addIngredient(ingredient);
    }

    this.onClear();
  }

  onClear() {
    this.ingredientForm.reset();

    this.editMode = false;
    this.editedItemIndex = -1;
    this.selectedIngredient = null;
  }

  deleteIngredient() {
    this.ingredientService.delete(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
