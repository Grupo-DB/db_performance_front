import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ColaboradorResponse } from '../../../types/avaliacoes/colaborador-response';
import { Colaborador } from '../../../pages/avaliacoes/colaborador/colaborador.component';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'https://managerdb.com.br/api/management/colaboradores/';
  private urlme= 'https://managerdb.com.br/api/management/avaliadores/';
  private calcUrl = 'https://managerdb.com.br/api/datacalc/total-colaboradores/';
  private filterUrl = 'https://managerdb.com.br/api/datacalc/filtrar-colaboradores/';
  private baseCalcUrl = 'https://managerdb.com.br/api/datacalc/';

  constructor(private  httpClient: HttpClient, private router: Router) { }
   
    registercolaborador(formData: FormData) {
      return this.httpClient.post<ColaboradorResponse>(this.apiUrl, formData).pipe(
      );
    }
    getColaboradores(): Observable<any[]>{
      return this.httpClient.get<any[]>(this.apiUrl);  
    }
    getColaboradoresByAmbiente(ambienteId: number): Observable<any[]> {
      const url = `${this.apiUrl}byAmbiente/?ambiente_id=${ambienteId}`;
      return this.httpClient.get<any[]>(url);  
    }
    editColaborador(id: number, dadosAtualizados: Partial<Colaborador>): Observable<any> {
      const url = `${this.apiUrl}${id}/`;
      return this.httpClient.patch(url, dadosAtualizados);
    }
    deleteColaborador(id: number): Observable<any> {
      const url = `${this.apiUrl}${id}/`;
      return this.httpClient.delete(url);
    }
    updateColaboradorImage(id: number, formDataImg: FormData): Observable<any> {
      const url = `${this.apiUrl}${id}/`;
      return this.httpClient.patch(url, formDataImg);
    }
    getAvaliador(): Observable<any> {
      return this.httpClient.get(`${this.urlme}me/`);
    }
    getColaboradorInfo(): Observable<any> {
      return this.httpClient.get(`${this.apiUrl}meInfo/`);
    }
    getTotalColaboradores():Observable<any>{
      return this.httpClient.get<any>(this.calcUrl);
    }
    getColaborador(id: number): Observable<any> {
      return this.httpClient.get<any>(`${this.apiUrl}${id}/`);
    }
    filterData(filters: any): Observable<any> {
      return this.httpClient.post(this.filterUrl, filters, { responseType: 'text' }).pipe(
        map(response => JSON.parse(response)),
        catchError(this.handleError)
      );
    }
    private handleError(error: HttpErrorResponse) {
      console.error('An error occurred:', error);
      return throwError(error);
    }
    getFilters(): Observable<any> {
      return this.httpClient.get<any>(`${this.baseCalcUrl}get_filters/`);
    }
  }
