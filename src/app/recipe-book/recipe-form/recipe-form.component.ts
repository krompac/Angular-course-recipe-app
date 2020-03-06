import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../shared/ingredient.model';
import {Store} from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  editMode = false;
  recipeToEdit: Recipe;
  imagePath: string;
  editForm: FormGroup;
  selectedRecipeIndex: number = -1;
  numberOfRecipes: number;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>,
              private router: Router) { }

  ngOnInit() {
    this.route.params.pipe(map(
      (params: Params) => {
        this.selectedRecipeIndex = +params['id'];
        this.editMode = params['id'] !== undefined;

        this.editForm = new FormGroup({
          name: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
          imagePath: new FormControl('https://icon-library.net/images/add-image-icon-png/add-image-icon-png-14.jpg',
            [Validators.required]),
          ingredients: new FormArray([])
        });

        return params;
      }
    ), switchMap(() =>
      this.store.select('recipes').pipe(map(state => state.recipes))
    )).subscribe(recipes => {
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
        (this.editForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup(value.name, value.amount)));
    }

    if (this.recipeToEdit.imagePath) {
      this.imagePath = this.recipeToEdit.imagePath;
    }

    this.editForm.patchValue(
      {
        name: this.recipeToEdit.name,
        description: this.recipeToEdit.description,
        imagePath: this.imagePath
      }
    );
  }

  private createIngredientFormGroup(name: string, amount: number) : FormGroup {
    return new FormGroup({
        name: new FormControl(name, Validators.required),
        amount: new FormControl(amount, [Validators.required, Validators.pattern('^[1-9]+[0-9]*')])
      }
    )
  }

  onSubmit() {
    const recipe = this.editForm.value;

    if (this.editMode) {
      this.store.dispatch(new RecipeActions.EditRecipe({recipe: recipe, index: this.selectedRecipeIndex}));
      this.onCancel();
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(recipe));
      console.log('i am here');
      this.router.navigate(['../recipes', this.numberOfRecipes]);
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (this.editForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup('', 0));
  }

  onRemoveIngredient(index: number) {
    (this.editForm.get('ingredients') as FormArray).removeAt(index);
  }

  get ingredientsControls() {
    return (this.editForm.get('ingredients') as FormArray).controls;
  }
}
