import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustoproducaoService {
  private apiUrl = 'http://172.50.10.79:8008/custoproducao/custoproducao/';
  private calcUrl = 'http://172.50.10.79:8008/custoproducao/custoproducao/calculosCustoProducao/';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
  registerCustoProducao(
    produto: any,
    ccPai: any,
    fabrica: number,
    periodo: number,
    ano: number,
    quantidade: number
  ){
    return this.http.post<any>(this.apiUrl, {
      produto: produto,
      centro_custo_pai: ccPai,
      fabrica: fabrica,
      periodo: periodo,
      ano: ano,
      quantidade: quantidade
    })
  }
  getCustoProducao():Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  getCustoProducaoDetalhes(id: any): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<any>(
      url
    );
  }
  editCustoProducao(id: number, dadosAtualizados: any): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch(url, dadosAtualizados);
  }
  deleteCustoProducao(id:number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url);
  }
  createLinhas(linhas: any[]): Observable<any> {
    return this.http.post(this.apiUrl, linhas);
  }
  getResultados(ano: number, periodo: number): Observable<any>{
    return this.http.post(this.calcUrl, {ano: ano, periodo: periodo});
  }
}
