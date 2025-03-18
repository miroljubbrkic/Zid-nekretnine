import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  agentIsAuthenticated = false
  levoDugme = 'Kupi'
  private authListenerSub!: Subscription

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.agentIsAuthenticated = this.authService.getIsAuthenticated()
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.agentIsAuthenticated = isAuthenticated
    })
    if (this.agentIsAuthenticated) {
      this.levoDugme = "Prodaj"
    }
  }

  onLogout() {
    this.authService.logout()
  }
  
  
  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe()
  }

}
