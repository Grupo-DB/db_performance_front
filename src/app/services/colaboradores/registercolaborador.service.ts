import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { ColaboradorResponse } from '../../types/colaborador-response';
import { Colaborador } from '../../pages/colaborador/colaborador.component';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8000/management/colaboradores/';
  private urlme= 'http://localhost:8000/management/avaliadores/';
  private calcUrl = 'http://localhost:8000/datacalc/total-colaboradores/';
  private filterUrl = 'http://localhost:8000/datacalc/filtrar-colaboradores/';
  private baseCalcUrl = 'http://localhost:8000/datacalc/';

  constructor(private  httpClient: HttpClient, private router: Router) { }
   
    registercolaborador(formData: FormData) {
      return this.httpClient.post<ColaboradorResponse>(this.apiUrl, formData).pipe(
      );
    }
    getColaboradores(): Observable<any[]>{
      return this.httpClient.get<any[]>(this.apiUrl);  
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
