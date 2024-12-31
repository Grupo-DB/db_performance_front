// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// //import { LoginResponse } from '../../types/login-response.type';
// import { catchError, map, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';

// interface LoginResponse {
//   access: string;
//   refresh: string;
//   primeiro_acesso: boolean;
// }


// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {
//   private apiUrl = 'http://172.50.10.11:8008/management/token/';
//   private currentUserSubject: BehaviorSubject<any>;
//   public currentUser: Observable<any>;

//   constructor(private httpClient: HttpClient, private router: Router,) {
//     this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
//     this.currentUser = this.currentUserSubject.asObservable();
//    }

//   login(username: string, password: string) {
//     return this.httpClient.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
//       tap((response: LoginResponse) => {
//         console.log('Resposta da API:', response);
//         if (response && response.access && response.refresh) {
//           // Capturar os tokens da resposta da API
//           const accessToken = response.access;
//           const refreshToken = response.refresh;

//           // Armazenar os tokens no localStorage
//           localStorage.setItem('accessToken', JSON.stringify(accessToken));
//           localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

//           // Verificar se é o primeiro acesso
//           if (response.primeiro_acesso) {
//             this.router.navigate(['/resetps']);
//           } 
//         } else {
//           console.error('Tokens não encontrados na resposta da API.');
//         }
//       })
//     );
//   }

 
//   updatePasswordFirstLogin(newPassword: string): Observable<any> {
//   return this.httpClient.post('http://http://172.50.10.79:8008/management/update-password-first-login/', { new_password: newPassword });
//   }

//   getUserId(): number | null {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       // Decodificar o token JWT manualmente
//       const base64Url = accessToken.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const decodedToken = JSON.parse(atob(base64));
      
//       if (decodedToken && decodedToken.user_id) {
//         return decodedToken.user_id;
//       }
//     }
//     return null;
//   }

//   logout() {
//     // Remover tokens de autenticação e qualquer outra informação relevante do armazenamento local
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     // Redirecionar para a página de login
//     this.router.navigate(['']);
//   }

//   // Outras funções de autenticação, como login, verificar se está autenticado, etc.


// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  access: string;
  refresh: string;
  primeiro_acesso: boolean;
  groups: string[];  // Adiciona os grupos à interface
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/token/';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  

  constructor(private httpClient: HttpClient, private router: Router) {
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap((response: LoginResponse) => {
        console.log('Resposta da API:', response);
        if (response && response.access && response.refresh) {
          // Capturar os tokens e grupos da resposta da API
          const accessToken = response.access;
          const refreshToken = response.refresh;
          const groups = response.groups;

          // Armazenar os tokens e grupos no localStorage
          localStorage.setItem('accessToken', JSON.stringify(accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
          localStorage.setItem('userGroups', JSON.stringify(groups));

          // Atualizar o currentUserSubject
          this.currentUserSubject.next(response);

          // Verificar se é o primeiro acesso
          if (response.primeiro_acesso) {
            this.router.navigate(['/resetps']);
          } 
        } else {
          console.error('Tokens não encontrados na resposta da API.');
        }
      })
    );
  }

  updatePasswordFirstLogin(newPassword: string): Observable<any> {
    return this.httpClient.post('http://http://172.50.10.79:8008/management/update-password-first-login/', { new_password: newPassword });
  }

  getUserId(): number | null {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Decodificar o token JWT manualmente
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      
      if (decodedToken && decodedToken.user_id) {
        return decodedToken.user_id;
      }
    }
    return null;
  }

  logout() {
    // Remover tokens de autenticação e qualquer outra informação relevante do armazenamento local
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userGroups');
    this.currentUserSubject.next(null);
    // Redirecionar para a página de login
    this.router.navigate(['']);
  }

  hasGroup(group: string): boolean {
    const userGroupsString = localStorage.getItem('userGroups');
    if (userGroupsString) {
      const userGroups = JSON.parse(userGroupsString);
      return userGroups.includes(group);
    }
    return false;
  }


  hasAnyGroup(groups: string[]): boolean {
    const userGroupsString = localStorage.getItem('userGroups');
    if (userGroupsString) {
      const userGroups = JSON.parse(userGroupsString);
      return groups.some(group => userGroups.includes(group));
    }
    return false;
  }


}


// else {
//   this.router.navigate(['/welcome/inicial']);
// }

