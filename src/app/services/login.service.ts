import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/management/token/';

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap((response: LoginResponse) => {
        console.log('Resposta da API:', response);
        if (response && response.access && response.refresh) {
          // Capturar os tokens da resposta da API
          const accessToken = response.access;
          const refreshToken = response.refresh;

          // Armazenar os tokens no localStorage
          localStorage.setItem('accessToken', JSON.stringify(accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
        } else {
          console.error('Tokens não encontrados na resposta da API.');
        }  
          this.router.navigate(['/welcome']);
      })
    );
  }
}

