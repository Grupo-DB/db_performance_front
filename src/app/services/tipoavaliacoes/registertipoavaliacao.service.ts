import { Injectable } from '@angular/core';
import { TipoAvaliacaoResponse } from '../../types/tipoavaliacao-response';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TipoAvaliacao } from '../../pages/tipoavaliacao/tipoavaliacao.component';

@Injectable({
  providedIn: 'root'
})
export class TipoAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/tipoavaliacoes/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registertipoavaliacao(nome: string, formulario:string,){
    return this.httpClient.post(this.apiUrl,{nome,formulario}).pipe(
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
  registerassociacao(tipoavaliacao: number, avaliado_id: number){
    
    const url = `${this.apiUrl}${tipoavaliacao}/add_avaliado/`;
    return this.httpClient.post(url,{tipoavaliacao,avaliado_id}).pipe(

    );
  }
  carregarTipoAvaliacao(userId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}user/${userId}/`);
  }
}
