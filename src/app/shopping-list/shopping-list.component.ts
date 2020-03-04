import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<fromShoppingList.State>;

  constructor(private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {

  }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  editItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
