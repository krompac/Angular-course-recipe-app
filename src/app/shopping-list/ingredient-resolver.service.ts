import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Ingredient} from '../shared/ingredient.model';
import {Observable} from 'rxjs';
import {IngredientService} from '../services/ingredient.service';
import {Injectable} from '@angular/core';

@Injectable()
export class IngredientResolverService implements Resolve<Ingredient[]> {
  constructor(private ingredientService: IngredientService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Ingredient[]> | Promise<Ingredient[]> | Ingredient[] {
      return this.ingredientService.getIngredients();
  }
}
