import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('signupForm') signupForm!: NgForm;
  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createAgent(
      form.value.email,
      form.value.lozinka,
      form.value.ime,
      form.value.prezime,
      form.value.telefon // No need to modify the phone number format here
    );
  }

  test() {
    this.signupForm.form.patchValue({
      email: 'test@test.com',
      lozinka: '123123',
      ime: 'test',
      prezime: 'test',
      telefon: '+381606060551'
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
