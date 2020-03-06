import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../../services/recipe.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Ingredient} from '../../shared/ingredient.model';

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
  ingredientIndex: number = -1;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.ingredientIndex = +params['id'];
        this.editMode = params['id'] !== undefined;

        this.editForm = new FormGroup({
          name: new FormControl(null, Validators.required),
          description: new FormControl(null, Validators.required),
          imagePath: new FormControl('https://icon-library.net/images/add-image-icon-png/add-image-icon-png-14.jpg',
            [Validators.required]),
          ingredients: new FormArray([])
        });

        if (this.editMode) {
          this.populateForm();
        }
      }
    )
  }

  private populateForm() {
    this.recipeToEdit = this.recipeService.getRecipe(this.ingredientIndex);

    if (this.recipeToEdit.ingredients && this.recipeToEdit.ingredients.length > 0) {
      this.recipeToEdit.ingredients.forEach((value: Ingredient) => {
        (this.editForm.get('ingredients') as FormArray).push(this.createIngredientFormGroup(value.name, value.amount));
      });
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
      this.recipeService.editRecipe(this.ingredientIndex, recipe);
      this.onCancel();
    } else {
      this.recipeService.addRecipe(recipe);
      this.router.navigate(['recipes/' + (this.recipeService.getLength() - 1)])
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
