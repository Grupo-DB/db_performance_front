import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AtivoService {
  private apiUrl = 'http://localhost:8000/management/';

  constructor(private http: HttpClient) {}

  informacoes_avaliador(avaliador_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}avaliadores/${avaliador_id}/informacoes_avaliador/`);
  }
}