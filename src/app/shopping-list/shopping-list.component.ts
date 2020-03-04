import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListEditComponent} from './shopping-list-edit/shopping-list-edit.component';
import {IngredientService} from '../services/ingredient.service';
import {ActivatedRoute, Data} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoggingService} from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  activatedSub: Subscription;

  constructor(private ingredientService: IngredientService, private route: ActivatedRoute, private loggingService: LoggingService) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: Data) => {
        this.ingredients = data['ingredients'];
      }
    );

    this.activatedSub = this.ingredientService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );

    this.loggingService.printLog('Hello from ShoppingListComponent');
  }

  editItem(id: number) {
    this.ingredientService.startedEditing.next(id);
  }

  ngOnDestroy(): void {
    this.activatedSub.unsubscribe();
  }
}
