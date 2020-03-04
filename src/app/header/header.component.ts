import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {AuthService} from '../auth/auth.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private postService: PostService, private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authData => authData.user)).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.postService.storeRecipes();
  }

  onFetchData() {
    this.postService.fetchRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
