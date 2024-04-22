import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { TipoContratoResponse } from '../../types/tipocontrato-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterTipoContratoService {
  private apiUrl = 'http://localhost:8000/management/registertipocontrato/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registertipocontrato(nome: string, empresa: string, filial: string,area:string,setor:string,cargo:string){
    return this.httpClient.post<TipoContratoResponse>(this.apiUrl,{nome,empresa,filial,area,setor,cargo}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}