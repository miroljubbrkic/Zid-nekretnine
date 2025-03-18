import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SellPropListComponent } from './props/sell-props/sell-prop-list/sell-prop-list.component';
import { RentPropListComponent } from './props/rent-props/rent-prop-list/rent-prop-list.component';
import { RentPropFormComponent } from './props/rent-props/rent-prop-form/rent-prop-form.component';
import { SellPropFormComponent } from './props/sell-props/sell-prop-form/sell-prop-form.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './angular-material.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { SellPropDetailComponent } from './props/sell-props/sell-prop-detail/sell-prop-detail.component';
import { ImageDialogComponent } from './props/image-dialog/image-dialog.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AgentFormComponent } from './agents/agent-form/agent-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SellPropListComponent,
    SellPropFormComponent,
    RentPropListComponent,
    RentPropFormComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    SellPropDetailComponent,
    ImageDialogComponent,
    LandingPageComponent,
    AgentFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
