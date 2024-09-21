import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellPropListComponent } from './props/sell-props/sell-prop-list/sell-prop-list.component';
import { SellPropFormComponent } from './props/sell-props/sell-prop-form/sell-prop-form.component';

const routes: Routes = [
  {path: 'sell-prop-list', component: SellPropListComponent},
  {path: 'sell-prop-create', component: SellPropFormComponent},
  {path: 'sell-prop-edit/:propId', component: SellPropFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
