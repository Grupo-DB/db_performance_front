import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CentroCusto } from '../../../../pages/baseOrcamentaria/orcamentoBase/centrocusto/centrocusto.component';

@Injectable({
  providedIn: 'root'
})
export class CentrocustoService {
  private apiUrl = 'https://managerdb.com.br/api/orcamento/centroscusto/';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }
  registerCentroCusto(codigo: string, nome: string, ccPai: number, gestor: number){
    return this.httpClient.post<any>(this.apiUrl, { codigo: codigo, nome: nome, cc_pai: ccPai, gestor: gestor });
  }
  getCentroCusto():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  getCentroCustoDetalhe(id: any):Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}${id}/`);
  }
  getCentroCustoByCcPai(id: any): Observable<any[]>{
      return this.httpClient.get<any>(`${this.apiUrl}byCcPai/?cc_pai_id=${id}`);
  }
  getMeusCentrosCusto(): Observable<any[]>{
    return this.httpClient.get<any>(`${this.apiUrl}meusCcs/`);
  }
  editCentroCusto(id: number, dadosAtualizados: Partial<CentroCusto>):Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteCentroCusto(id: number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
}
