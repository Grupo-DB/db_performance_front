import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AvaliacaoResponse } from '../../../types/avaliacoes/avaliacao-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterAvaliacaoService {
  private apiUrl = 'http://172.50.10.79:8008/management/registeravaliacao/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliacao(
    nome: string, 
    tipoavaliacao: string, 
    colaborador: string,
    avaliador:string,
    formulario:string,
    data_avaliacao:Date,
    feedback:string
  ){
    return this.httpClient.post<AvaliacaoResponse>(this.apiUrl,{nome,tipoavaliacao,colaborador,avaliador,formulario,data_avaliacao,feedback}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
