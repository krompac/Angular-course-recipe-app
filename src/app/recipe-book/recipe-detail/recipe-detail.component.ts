import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Store} from '@ngrx/store';

import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @Input() activeRecipe = new Recipe('Recipe Name', 'Description', 'Ingredients', []);
  index: number;
  sub: Subscription;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.pipe(map(
      (params: Params) => {
        this.index = +params['id'];
        return this.index;
      }), switchMap(() => this.store.select('recipes')), map(recipeState => recipeState.recipes))
      .subscribe(recipes => {
        this.activeRecipe = recipes[this.index];
        this.isLoading = false;
      });
  }

  addToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.activeRecipe.ingredients));
  }

  onEditClick() {
    this.router.navigate(['../', this.index, 'edit'], {relativeTo: this.route});
  }

  onRemoveClick() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.index));
    this.router.navigate(['recipes']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
