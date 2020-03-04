import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../../services/recipe.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';

import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  @Input() activeRecipe = new Recipe('Recipe Name', 'Description', 'Ingredients', []);
  id: number;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.activeRecipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  addToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.activeRecipe.ingredients));
  }

  onEditClick() {
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onRemoveClick() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
