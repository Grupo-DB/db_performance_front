import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ColaboradorResponse } from '../../types/colaborador-response';
import { Colaborador } from '../../pages/colaborador/colaborador.component';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8000/management/colaboradores/';
  private urlme= 'http://localhost:8000/management/avaliadores/';
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
    
  }
