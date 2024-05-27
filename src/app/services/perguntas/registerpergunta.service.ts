import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { PerguntaResponse } from '../../types/pergunta-response';
import { Pergunta } from '../../pages/pergunta/pergunta.component';



@Injectable({
  providedIn: 'root'
})
export class PerguntaService {
  private apiUrl = 'http://localhost:8000/management/perguntas/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerpergunta(texto: string,legenda:Text){
    return this.httpClient.post<PerguntaResponse>(this.apiUrl,{texto,legenda}).pipe(
    );
  }
  getPerguntas(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);   
  }
  editPergunta(id: number, dadosAtualizados: Partial<Pergunta>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deletePergunta(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
}   
}