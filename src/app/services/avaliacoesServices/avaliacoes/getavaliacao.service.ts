import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Avaliacao } from '../../../pages/avaliacoes/novaliacao/novaliacao.component';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private apiUrl = 'http://172.50.10.79:8008/management/avaliacoes/';
  private apiUrlfb = 'http://172.50.10.79:8008/management/';
  private filterUrl = 'http://172.50.10.79:8008/datacalc/filtrar-avaliacoes/';
  private filterLogadoUrl = 'http://172.50.10.79:8008/datacalc/filtrar-avaliacoes-logado/';
  private filterAvaliadosUrl = 'http://172.50.10.79:8008/datacalc/filtrar-avaliados/';
  private filterAvaliacoesPeriodoUrl = 'http://172.50.10.79:8008/datacalc/filtrar-avaliacoes-periodo/';
  private filterAvaliacoesAvaliadorPeriodoUrl = 'http://172.50.10.79:8008/datacalc/filtrar-avaliacoes-avaliador-periodo/';
  private apiAvUrl = 'http://172.50.10.79:8008/management/avaliacoes/minhas_avaliacoes/';
  private periodoUrl = 'http://172.50.10.79:8008/datacalc/get-periodos/';
  private tipoUrl = 'http://172.50.10.79:8008/datacalc/get-tipos/';
  private historicoUrl = 'http://172.50.10.79:8008/datacalc/filtrar-historico/';  

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
  getMinhasAvaliacoes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiAvUrl);
  }
  filterData(filters: any): Observable<any> {
    return this.http.post(this.filterUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  filterData2(filters: any): Observable<any> {
    return this.http.post(this.filterLogadoUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  filterDataAvaliados(filters: any): Observable<any> {
    return this.http.post(this.filterAvaliadosUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  filterDataAvaliacoesPeriodo(filters: any): Observable<any> {
    return this.http.post(this.filterAvaliacoesPeriodoUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  filterDataAvaliacoesAvaliadorPeriodo(filters: any): Observable<any> {
    return this.http.post(this.filterAvaliacoesAvaliadorPeriodoUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  filterHistorico(filters: any): Observable<any> {
    return this.http.post(this.historicoUrl, filters, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response)),
      catchError(this.handleError)
    );
  }
  getPeriodos(): Observable<any[]>{
    return this.http.get<any[]>(this.periodoUrl);
  }
  getTipos(): Observable<any[]>{
    return this.http.get<any[]>(this.tipoUrl);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

}
