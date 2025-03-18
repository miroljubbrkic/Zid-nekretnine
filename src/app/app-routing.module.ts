import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellPropListComponent } from './props/sell-props/sell-prop-list/sell-prop-list.component';
import { SellPropFormComponent } from './props/sell-props/sell-prop-form/sell-prop-form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard';
import { SellPropDetailComponent } from './props/sell-props/sell-prop-detail/sell-prop-detail.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AgentFormComponent } from './agents/agent-form/agent-form.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'moji-oglasi', component: SellPropListComponent, canActivate: [AuthGuard]},
  {path: 'uredi-agenta', component: AgentFormComponent, canActivate: [AuthGuard]},
  {path: 'oglasi-za-prodaju', component: SellPropListComponent},
  {path: 'kreiraj-oglas', component: SellPropFormComponent, canActivate: [AuthGuard]},
  {path: 'oglasi-za-prodaju/izmena/:propId', component: SellPropFormComponent, canActivate: [AuthGuard]},
  {path: 'oglasi-za-prodaju/:id', component: SellPropDetailComponent},
  {path: 'prijava', component: LoginComponent},
  {path: 'registracija', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
