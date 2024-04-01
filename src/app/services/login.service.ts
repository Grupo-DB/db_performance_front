import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/auth/apilogin/'; 
  constructor(private httpClient: HttpClient, private router: Router) { }

  login(username: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl,{username, password}).pipe(
      tap(() => {
        // Redirecionar para a página desejada após o login
        this.router.navigate(['/dashboard']);
      })
    );     
  }
}

