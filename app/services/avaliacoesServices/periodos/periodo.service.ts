import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private apiUrl = 'https://managerdb.com.br/api/datacalc/periodo/';

  constructor(private http: HttpClient) {}

  getPeriodo(): Observable<{ dataInicio: string, dataFim: string }> {
    return this.http.get<{ dataInicio: string, dataFim: string }>(this.apiUrl);
  }

  setPeriodo(data: { dataInicio: string, dataFim: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}


