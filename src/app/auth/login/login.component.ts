import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;
  isLoading = false


  constructor(public authService: AuthService) {}



  onLogin(form: NgForm) {
    
    if(form.invalid) {
      return
    }
    this.isLoading = true
    this.authService.login(form.value.email, form.value.lozinka)


  }

  test() {
    this.loginForm.form.patchValue({
      email: 'test@test.com',
      lozinka: '123123'
    })
  }

}
