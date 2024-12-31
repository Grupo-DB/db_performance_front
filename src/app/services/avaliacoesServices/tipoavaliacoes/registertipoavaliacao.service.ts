import { Injectable } from '@angular/core';
import { TipoAvaliacaoResponse } from '../../../types/avaliacoes/tipoavaliacao-response';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TipoAvaliacao } from '../../../pages/avaliacoes/tipoavaliacao/tipoavaliacao.component';

@Injectable({
  providedIn: 'root'
})
export class TipoAvaliacaoService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/tipoavaliacoes/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registertipoavaliacao(nome: string){
    return this.httpClient.post(this.apiUrl,{nome}).pipe(
    );
  }
  getTipoAvaliacaos(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editTipoAvaliacao(id: number, dadosAtualizados: Partial<TipoAvaliacao>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteTipoAValiacao(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  } 

  carregarTipoAvaliacao(userId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}user/${userId}/`);
  }
}
