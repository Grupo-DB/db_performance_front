import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurvaService {
  private realizadoUrl = 'http://localhost:8000/curva/calculos_realizados_curva/'
  private meuRealizadoUrl = 'http://localhost:8000/curva/meus_calculos_cc_curva/'
  private meuRealizadoGpUrl = 'http://localhost:8000/curva/meus_calculos_gp_curva/'
  private orcadoUrl = 'http://localhost:8000/orcamento/orcamentosbase/agrupamentosPorAno/'
  private meuOrcadoUrl = 'http://localhost:8000/orcamento/orcamentosbase/meusAgrupamentosPorAno/'
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

  calcularMeuRealizadoGp(ano: number, periodo: any, filial: any, grupos_itens: any): Observable<any> {
    return this.httpClient.post<any>(this.meuRealizadoGpUrl, {
      ano: ano,
      periodo: periodo,
      filial: filial,
      grupos_itens: grupos_itens
    });
  }

  calcularMeuRealizadoCc(ano: number, periodo: any, filial: any, ccsPai: any): Observable<any> {
    return this.httpClient.post<any>(this.meuRealizadoUrl, {
      ano: ano,
      periodo: periodo,
      filial: filial,
      ccs_pai: ccsPai
    });
  }


  getGarficoOrcamento(ano: number, meses: any, filial: any): Observable<any> {
    return this.httpClient.get<any>(`${this.orcadoUrl}?ano=${ano}&periodo=${meses}&filial=${filial}`);
  }

  getGarficoMeuOrcamentoGp(ano: number, meses: any, filial: any, grupos_itens: any): Observable<any> {
    return this.httpClient.get<any>(`${this.meuOrcadoUrl}?ano=${ano}&periodo=${meses}&filial=${filial}&grupos_itens=${grupos_itens}`);
  }

  getGarficoMeuOrcamentoCc(ano: number, meses: any, filial: any, ccsPai: any): Observable<any> {
    return this.httpClient.get<any>(`${this.meuOrcadoUrl}?ano=${ano}&periodo=${meses}&filial=${filial}&ccs_pai=${ccsPai}`);
  }

}
