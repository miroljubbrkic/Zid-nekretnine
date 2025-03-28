import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('loginForm') loginForm!: NgForm;
  isLoading = false
  private authStatusSub!: Subscription


  constructor(public authService: AuthService) {}


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false
    })
  }



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

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }

}
