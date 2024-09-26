import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  agentIsAuthenticated = false
  private authListenerSub!: Subscription

  constructor(private authService: AuthService) {}
  
  
  ngOnInit(): void {
    this.agentIsAuthenticated = this.authService.getIsAuthenticated()
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated
    })
  }

  onLogout() {
    this.authService.logout()
  }
  
  
  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe()
  }

}
