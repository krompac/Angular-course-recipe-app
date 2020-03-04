import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {IngredientService} from '../../services/ingredient.service';
import {ActivatedRoute, Params, Route, Router} from '@angular/router';
import {RecipeService} from '../../services/recipe.service';
import {PostService} from '../../post.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  @Input() activeRecipe = new Recipe('Recipe Name', 'Description', 'Ingredients', []);
  id: number;

  constructor(private ingredientService: IngredientService, private route: ActivatedRoute, private recipeService: RecipeService,
              private router: Router, private postService: PostService) { }

  ngOnInit() {
    // const id = +this.route.snapshot.params['id'];
    // this.activeRecipe = this.recipeService.getRecipe(id);

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.activeRecipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  addToShoppingList() {
    this.ingredientService.addIngredients(this.activeRecipe.ingredients);
  }

  onEditClick() {
    // this.router.navigate(['edit'], {relativeTo: this.route});
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onRemoveClick() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
