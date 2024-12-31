import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AvaliadorResponse } from '../../../types/avaliacoes/avaliador-response';
import { Avaliador } from '../../../pages/avaliacoes/avaliador/avaliador.component';

@Injectable({
  providedIn: 'root'
})
export class AvaliadorService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/avaliadores/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliador(colaborador_ptr:number,usuario_id: number,){
    const url = `${this.apiUrl}${colaborador_ptr}/transformar_em_avaliador/`;
    return this.httpClient.post(url,{colaborador_ptr,usuario_id}).pipe(
    );
  }
  getAvaliadores(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editAvaliador(id: number, dadosAtualizados: Partial<Avaliador>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteAvaliador(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  registerassociacao(avaliador: number, avaliado_id: number){
    
    const url = `${this.apiUrl}${avaliador}/add_avaliado/`;
    return this.httpClient.post(url,{avaliador,avaliado_id}).pipe(

    );
  }
  removeAvaliado(avaliadorId: number, avaliadoId: number): Observable<Avaliador> {
    return this.httpClient.post<Avaliador>(`${this.apiUrl}${avaliadorId}/remove_avaliado/`, { avaliado_id: avaliadoId });
    }
  
}