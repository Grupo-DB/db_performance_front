import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistroHoraExtra {
  id?: number;
  colaborador: string;
  data: string;
  hora_inicial: string;
  hora_final: string;
  horas: number;
  motivo?: string;
  responsavel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrosHsExtrasService {
  private apiUrl = 'http://172.50.10.79:8008/registroHoraExtra/registroHoraExtra/';

  constructor(private http: HttpClient) { }

  createRegistro(registro: RegistroHoraExtra): Observable<RegistroHoraExtra> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<RegistroHoraExtra>(this.apiUrl, registro, { headers });
  }

  getRegistros(): Observable<RegistroHoraExtra[]> {
    return this.http.get<RegistroHoraExtra[]>(this.apiUrl);
  }

  getRegistroById(id: number): Observable<RegistroHoraExtra> {
    return this.http.get<RegistroHoraExtra>(`${this.apiUrl}${id}/`);
  }

  updateRegistro(id: number, registro: RegistroHoraExtra): Observable<RegistroHoraExtra> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<RegistroHoraExtra>(`${this.apiUrl}${id}/`, registro, { headers });
  }

  deleteRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
