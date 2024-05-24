import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AvaliacaoResponse } from '../../types/avaliacao-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/avaliacoes/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliacao(
    tipoavaliacao: number, 
    avaliador: string,
    avaliado: string,
    periodo: string,
    perguntasRespostas: JSON,
    feedback: string
  ){
    return this.httpClient.post<AvaliacaoResponse>(
      this.apiUrl,{
        tipoavaliacao,
        avaliador,
        avaliado,
        periodo,
        perguntasRespostas,
        feedback
      }).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
