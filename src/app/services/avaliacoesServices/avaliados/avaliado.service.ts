import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AvaliadoResponse } from '../../../types/avaliacoes/avaliado-response';

@Injectable({
  providedIn: 'root'
})
export class AvaliadoService {
  private apiAvUrl = 'http://172.50.10.79:8008/management/avaliadores/meus_avaliados/';
  private apiUrl = 'http://172.50.10.79:8008/management/avaliados/';
  private apiUrlsa = 'http://172.50.10.79:8008/management/';
  private apiUrlAV = 'http://172.50.10.79:8008/management/avaliacoes/'
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliado(colaborador_ptr:number,formulario_id: number,  ){
    const url = `${this.apiUrl}${colaborador_ptr}/transformar_em_avaliado/`;
    return this.httpClient.post(url,{colaborador_ptr,formulario_id}).pipe(
    );   
  }
  getMeusAvaliados(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiAvUrl);
  }  
  getAvaliados(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  } 
   // Método para obter um avaliado específico pelo ID
   getAvaliado(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}${id}/`);
  } 
  getAvaliadosByTipoAvaliacao(tipoAvaliacaoId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}byTipoAvaliacao/`, { params: { tipoAvaliacao: tipoAvaliacaoId.toString() } });
  }
  getAvaliadosByAvaliador(id: any): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byAvaliador/?avaliador_id=${id}`);
  }
  getMeusAvaliadosSemAvaliacao(periodo: string,): Observable<any> {
    return this.httpClient.get(`${this.apiUrlAV}meus_avaliados_sem_avaliacao/`, {
      params: { periodo }
    });
  } 
}
