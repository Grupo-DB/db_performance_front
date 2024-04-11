import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { RegisterCompanyResponse } from '../types/registercompany-response';
@Injectable({
  providedIn: 'root'
})
export class RegisterCompanyService {
  private apiUrl = 'http://localhost:8000/management/registercompany/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registercompany(nome: string, cnpj: string, endereco: string, cidade: string, estado: string, codigo: string){
    return this.httpClient.post<RegisterCompanyResponse>(this.apiUrl,{nome,cnpj,endereco,cidade,estado,codigo}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
