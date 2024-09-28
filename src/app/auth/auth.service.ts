import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agent } from './agent.model';
import { expand, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false
  private token!: string | null
  private tokenTimer!: any
  private agentId!: string | null
  private authStatusListener = new Subject<boolean>()

  constructor(private http: HttpClient, private router: Router) { }


  getToken() {
    return this.token
  }

  getIsAuthenticated() {
    return this.isAuthenticated
  }

  getAgentId() {
    return this.agentId
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getAgentById(agentId: string): Observable<{ message: string, agent: { ime: string, prezime: string, telefon: string } }> {
    return this.http.get<{ message: string, agent: { ime: string, prezime: string, telefon: string } }>(
      `http://localhost:3000/zid/agents/${agentId}`
    );
  }


  createAgent(email: string, lozinka: string, ime: string, prezime: string, telefon: string) {

    const agent: Agent = {
      email: email,
      lozinka: lozinka,
      ime: ime, 
      prezime: prezime, 
      telefon: telefon
    }
    console.log(agent);
    this.http.post('http://localhost:3000/zid/agents/signup', agent)
      .subscribe(() => {
        this.router.navigate(['/login'])
      }, error => {
        this.authStatusListener.next(false)
      })
  }


  login(email: string, lozinka: string) {

    const loginData = {
      email: email,
      lozinka: lozinka
    }
    this.http.post<{message: string, token: string, expiresIn: number, agentId: string}>('http://localhost:3000/zid/agents/login', loginData)
      .subscribe(response => {
        const token = response.token
        this.token = token
        console.log(response.message);

        if (token) {
          const expiresInDuration = response.expiresIn

          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true
          this.agentId = response.agentId
          this.authStatusListener.next(true)

          const now = new Date()
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          

          this.saveAuthData(token, expirationDate, this.agentId)
          this.router.navigate(['/sell-prop-list'])
        }
      }, error => {
        this.authStatusListener.next(false)
      })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData()
    if (!authInfo) {
      return
    }
    const now = new Date() 
    const expiresIn = authInfo?.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInfo.token
      this.isAuthenticated = true
      this.agentId = authInfo.agentId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  logout() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.agentId = null
    this.router.navigate(['/sell-prop-list'])

  }


  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }


  private saveAuthData(token: string, expirationDate: Date, agentId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('agentId', agentId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('agentId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const agentId = localStorage.getItem('agentId')

    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      agentId: agentId
    }

  }











}
