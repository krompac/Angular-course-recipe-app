import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGaurd} from '../auth/auth.gaurd';
import {RecipeBookComponent} from './recipe-book.component';
import {RecipeFormComponent} from './recipe-form/recipe-form.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipesResolverService} from './recipes-resolver.service';

const routes: Routes = [
  {path: '', canActivate: [AuthGaurd], component: RecipeBookComponent, children: [
      {path: 'new', component: RecipeFormComponent},
      {path: ':id', component: RecipeDetailComponent, resolve: {RecipesResolverService}},
      {path: ':id/edit', component: RecipeFormComponent, resolve: {RecipesResolverService}}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}
