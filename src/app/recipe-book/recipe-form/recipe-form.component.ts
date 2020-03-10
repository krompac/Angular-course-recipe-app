import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../shared/ingredient.model';
import {Store} from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as RecipeSelectors from '../store/recipe.selectors';

import {Subscription} from 'rxjs';
import {Update} from '@ngrx/entity';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  editMode = false;
  recipeToEdit: Recipe;
  imagePath: string;
  editForm: FormGroup;
  selectedRecipeIndex: number = -1;
  numberOfRecipes: number;
  sub: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.route.params.pipe(map(
      (params: Params) => {
        this.selectedRecipeIndex = +params['id'];
        this.editMode = this.selectedRecipeIndex !== undefined && !isNaN(this.selectedRecipeIndex);

        this.editForm = new FormGroup({
          id: new FormControl(new Date().getUTCMilliseconds()),
          name: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
          imagePath: new FormControl('https://icon-library.net/images/add-image-icon-png/add-image-icon-png-14.jpg',
            [Validators.required]),
          ingredients: new FormArray([])
        });

        return params;
      }
    ), switchMap(() =>
      this.store.select(RecipeSelectors.selectAllRecipes))).subscribe(recipes => {
      if (this.editMode) {
        this.recipeToEdit = recipes[this.selectedRecipeIndex];
        this.populateForm();
      }

      this.numberOfRecipes = recipes.length - 1;
    })
  }

  private populateForm() {
    if (this.recipeToEdit.ingredients && this.recipeToEdit.ingredients.length > 0) {
      this.recipeToEdit.ingredients.forEach((value: Ingredient) =>
        (this.editForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup(value.id, value.name, value.amount)));
    }

    if (this.recipeToEdit.imagePath) {
      this.imagePath = this.recipeToEdit.imagePath;
    }

    this.editForm.patchValue(
      {
        id: this.recipeToEdit.id,
        name: this.recipeToEdit.name,
        description: this.recipeToEdit.description,
        imagePath: this.imagePath
      }
    );
  }

  private createIngredientFormGroup(id: number, name: string, amount: number) : FormGroup {
    return new FormGroup({
        id: new FormControl(id),
        name: new FormControl(name, Validators.required),
        amount: new FormControl(amount, [Validators.required, Validators.pattern('^[1-9]+[0-9]*')])
      }
    )
  }

  onSubmit() {
    const recipe: Recipe = this.editForm.value;

    if (this.editMode) {
      const recipeEdit: Update<Recipe> = {
        id: recipe.id,
        changes: {...recipe}
      };

      this.store.dispatch(RecipeActions.editRecipe({recipe: recipeEdit}));
      this.onCancel();
    } else {
      this.store.dispatch(RecipeActions.addRecipe({recipe}));
      this.router.navigate(['../recipes', this.numberOfRecipes]);
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (this.editForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup(new Date().getUTCMilliseconds(),'', 0));
  }

  onRemoveIngredient(index: number) {
    (this.editForm.get('ingredients') as FormArray).removeAt(index);
  }

  get ingredientsControls() {
    return (this.editForm.get('ingredients') as FormArray).controls;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
