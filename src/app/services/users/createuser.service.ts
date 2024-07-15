import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { CreateuserResponse } from '../../types/createuser-response.type';
import { tap } from 'rxjs';

import { LoginService } from '../login/login.service';

 @Injectable({
   providedIn: 'root',

 })


export class CreateuserService {
  private apiUrl = 'http://172.50.10.79:8008/management/create_user/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  

  createuser(first_name: string, last_name: string, username: string, password: string,confirmPassword:string, funcao:string,){
    return this.httpClient.post<CreateuserResponse>(this.apiUrl,{first_name,last_name,username, password,confirmPassword,funcao,}).pipe(
      tap(() => {
        // Redirecionar para a página desejada após o login
        this.router.navigate(['/dashboard']);
      })
    );
  }
}         