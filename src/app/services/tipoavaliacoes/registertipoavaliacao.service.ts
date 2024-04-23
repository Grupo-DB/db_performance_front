import { Injectable } from '@angular/core';
import { TipoAvaliacaoResponse } from '../../types/tipoavaliacao-response';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterTipoAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/registertipoavaliacao/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registertipoavaliacao(nome: string){
    return this.httpClient.post<TipoAvaliacaoResponse>(this.apiUrl,{nome,}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }  
}
