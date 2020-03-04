import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './auth-interceptor.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    RouterModule.forChild([{path: '', component: AuthComponent}]),
    HttpClientModule,
    SharedModule
  ],
  exports: [RouterModule],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}]
})
export class AuthModule {

}
