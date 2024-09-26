import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  @ViewChild('signupForm') signupForm!: NgForm;
  isLoading = false

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    
    if(form.invalid) {
      return
    }
    this.isLoading = true
    this.authService.createAgent(
      form.value.email, 
      form.value.lozinka, 
      form.value.ime, 
      form.value.prezime, 
      form.value.telefon
    )
  }


  test() {
    this.signupForm.form.patchValue({
      email: 'test@test.com',
      password: '123123',
      ime: 'test',
      prezime: 'test',
      telefon: '0606060551'
    })
  }





  

}
