import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurvaService {
  private realizadoUrl = 'http://localhost:8000/curva/calculos_realizados_curva/'
  private orcadoUrl = 'http://localhost:8000/orcamento/orcamentosbase/agrupamentosPorAno/'
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  calcularRealizado(ano: number, periodo: any, filial: any): Observable<any> {
    return this.httpClient.post<any>(this.realizadoUrl, {
      ano: ano,
      periodo: periodo,
      filial: filial
    });
  }
  getGarficoOrcamento(ano: number, meses: any, filial: any): Observable<any> {
    return this.httpClient.get<any>(`${this.orcadoUrl}?ano=${ano}&periodo=${meses}&filial=${filial}`);
  }
}
