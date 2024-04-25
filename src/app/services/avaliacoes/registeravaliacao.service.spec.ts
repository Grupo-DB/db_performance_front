import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AvaliacaoResponse } from '../../types/avaliacao-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/registeravaliacao/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliacao(
    tipoavaliacao: string, 
    colaborador: string, 
    avaliador: string,
    formulario:string,
    data_avaliacao:Date,
    periodo: string,
    resposta:string,
    justificativa:string,
    nota: string,
    feedback: string,

  ){
    return this.httpClient.post<AvaliacaoResponse>(
      this.apiUrl,{
        tipoavaliacao,
        colaborador,
        avaliador,
        formulario,
        data_avaliacao,
        periodo,
        resposta,
        justificativa,
        nota,
        feedback,
      }).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
