import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { FilialResponse } from '../../types/filial-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterFilialService {
  private apiUrl = 'http://localhost:8000/management/registerfilial/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerfilial(empresa: string, nome: string, cnpj: string, endereco: string, cidade: string, estado: string, codigo: string){
    return this.httpClient.post<FilialResponse>(this.apiUrl,{empresa,nome,cnpj,endereco,cidade,estado,codigo}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
