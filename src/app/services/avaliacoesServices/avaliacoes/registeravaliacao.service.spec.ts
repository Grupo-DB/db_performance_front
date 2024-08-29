import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AvaliacaoResponse } from '../../../types/avaliacoes/avaliacao-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/avaliacoes/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliacao(
    tipo: string, 
    avaliador: string,
    avaliado: string,
    periodo: string,
    perguntasRespostas: JSON,
    
  ){
    return this.httpClient.post<AvaliacaoResponse>(
      this.apiUrl,{
        tipo,
        avaliador,
        avaliado,
        periodo,
        //feedback,
        perguntasRespostas,
        
      }).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
