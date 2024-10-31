import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAvaliadorService {
  private apiUrl = 'http://localhost:8000/management/get_avaliador/';
  private colaboradorUrl = 'http://localhost:8000/management/get_colaborador/';  // URL para obter dados do colaborador

  constructor(private http: HttpClient) { }

  getAvaliadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // getNomeColaborador(idAvaliador: number): Observable<string> {
  //   return this.http.get<string>(this.apiUrl + idAvaliador);
  // }
 
}