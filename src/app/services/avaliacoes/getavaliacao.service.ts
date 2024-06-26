import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../../pages/novaliacao/novaliacao.component';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private apiUrl = 'http://172.50.10.11:8008/management/avaliacoes/';
  private apiUrlfb = 'http://172.50.10.11:8008/management/';  
  constructor(private http: HttpClient) { }

  getAvaliacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  updateFeedback(avaliacaoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${avaliacaoId}/update_feedback/`, {});
  }
  getMeusAvaliadosSemAvaliacao(periodo: string, tipoAvaliacaoId:number): Observable<any> {
    return this.http.get(`${this.apiUrl}meus_avaliados_sem_avaliacao/`, {
      params: { periodo,  tipoAvaliacao: tipoAvaliacaoId.toString()  }
    });
  }
  getAvaliacao(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }
  editAvaliacao(id: number, dadosAtualizados: Partial<Avaliacao>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch(url,dadosAtualizados);
  }
}
