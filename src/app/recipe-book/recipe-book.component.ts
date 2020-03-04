import {Component, OnInit} from '@angular/core';
import {Recipe} from './recipe.model';
import {RecipeService} from '../services/recipe.service';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html'
})
export class RecipeBookComponent implements OnInit {

  ngOnInit() {
  }
}
