import {NgModule} from '@angular/core';
import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingListEditComponent} from './shopping-list-edit/shopping-list-edit.component';
import {RouterModule, Routes} from '@angular/router';
import {IngredientResolverService} from './ingredient-resolver.service';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
  {path: '', component: ShoppingListComponent, resolve: {'ingredients': IngredientResolverService}}
];

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class ShoppingListModule {

}
