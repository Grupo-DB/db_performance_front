import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PprService {
  private apiUrl = 'http://172.50.10.79:8008/ppr/realizado_ppr/'
  private apiRealizadoUrl = 'http://172.50.10.79:8008/ppr/realizado_matriz/'
  private orcadoUrl = 'http://172.50.10.79:8008/orcamento/orcamentosbase/calculosPpr/'
  constructor(
    private httpClient: HttpClient
  ) { }
  calcularRealizado(ccs: any, ano: number, periodo: any, filial: any): Observable<any> {
      return this.httpClient.post<any>(this.apiUrl, {
        ccs: ccs,
        ano: ano,
        periodo: periodo,
        filial: filial
      });
    }

    calcularCusto2(ano: number, periodo: any, filial: any): Observable<any> {
      return this.httpClient.post<any>(this.apiRealizadoUrl, {
        ano: ano,
        periodo: periodo,
        filial: filial
      });
    }

    calcularCusto( ano: any, periodo: any, filiais:any): Observable<any>{
      return this.httpClient.post<any>(this.apiRealizadoUrl, {ano:ano, periodo:periodo, filiais:filiais})
    }

    calcularOrcado(ano: any, periodo: any): Observable<any>{
      return this.httpClient.post<any>(this.orcadoUrl, {ano:ano, periodo:periodo})
  }
}