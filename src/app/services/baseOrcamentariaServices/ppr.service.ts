import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PprService {
  private apiUrl = 'http://localhost:8000/ppr/realizado_ppr/'
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

    calcularCusto(ano: number, periodo: any, filial: any): Observable<any> {
      return this.httpClient.post<any>(this.apiUrl, {
        ano: ano,
        periodo: periodo,
        filial: filial
      });
    }
    
}
