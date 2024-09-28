import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellPropListComponent } from './props/sell-props/sell-prop-list/sell-prop-list.component';
import { SellPropFormComponent } from './props/sell-props/sell-prop-form/sell-prop-form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard';
import { SellPropDetailComponent } from './props/sell-props/sell-prop-detail/sell-prop-detail.component';

const routes: Routes = [
  {path: 'sell-prop-list', component: SellPropListComponent},
  {path: 'sell-prop-create', component: SellPropFormComponent, canActivate: [AuthGuard]},
  {path: 'sell-prop-edit/:propId', component: SellPropFormComponent, canActivate: [AuthGuard]},
  { path: 'sell-prop/:id', component: SellPropDetailComponent },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
