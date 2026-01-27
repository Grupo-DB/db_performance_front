import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

export interface RegistrosResponse {
  registros: RegistroHoraExtra[];
  total_horas: number;
  quantidade_registros: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrosHsExtrasService {
  private apiUrl = 'https://managerdb.com.br/api/registroHoraExtra/registroHoraExtra/';

  constructor(private http: HttpClient) { }

  createRegistro(registro: RegistroHoraExtra): Observable<RegistroHoraExtra> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<RegistroHoraExtra>(this.apiUrl, registro, { headers });
  }

  getRegistros(filtros?: {
    colaborador?: string;
    responsavel?: string;
    filial?: number;
    ambiente?: number;
    mes?: number;
    ano?: number;
    data_inicial?: string;
    data_final?: string;
  }): Observable<RegistrosResponse> {
    let params = new HttpParams();
    
    if (filtros) {
      if (filtros.colaborador) {
        params = params.set('colaborador', filtros.colaborador);
      }
      if (filtros.responsavel) {
        params = params.set('responsavel', filtros.responsavel);
      }
      if (filtros.filial) {
        params = params.set('filial', filtros.filial.toString());
      }
      if (filtros.ambiente) {
        params = params.set('ambiente', filtros.ambiente.toString());
      }
      if (filtros.mes) {
        params = params.set('mes', filtros.mes.toString());
      }
      if (filtros.ano) {
        params = params.set('ano', filtros.ano.toString());
      }
      if (filtros.data_inicial) {
        params = params.set('data_inicial', filtros.data_inicial);
      }
      if (filtros.data_final) {
        params = params.set('data_final', filtros.data_final);
      }
    }
    
    return this.http.get<RegistrosResponse>(this.apiUrl, { params });
  }

  getRegistrosByColaborador(colaborador: string): Observable<RegistrosResponse> {
    return this.getRegistros({ colaborador });
  }

  getRegistroById(id: number): Observable<RegistroHoraExtra> {
    return this.http.get<RegistroHoraExtra>(`${this.apiUrl}${id}/`);
  }

  updateRegistro(id: number, registro: RegistroHoraExtra): Observable<RegistroHoraExtra> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.patch<RegistroHoraExtra>(`${this.apiUrl}${id}/`, registro, { headers });
  }

  deleteRegistro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
