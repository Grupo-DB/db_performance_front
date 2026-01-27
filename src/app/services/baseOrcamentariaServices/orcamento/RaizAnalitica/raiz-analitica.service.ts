import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RaizAnalitica } from '../../../../pages/baseOrcamentaria/orcamentoBase/raiz-analitica/raiz-analitica.component';

@Injectable({
  providedIn: 'root'
})
export class RaizAnaliticaService {
  private apiUrl = 'https://managerdb.com.br/api/orcamento/raizesanaliticas/';
  private gestorUrl = 'https://managerdb.com.br/api/management/gestores/'
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getGestores(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.gestorUrl);
  }
  getRaizesAnaliticas():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  raizesFiltradas(filterValue: any){
    const url = `${this.apiUrl}${'byInicio'}/`;
    return this.httpClient.post<any>(url,{filterValue: filterValue});
  }
  registerRaizAnalitica(raizContabil:number,  gestor:string){
    return this.httpClient.post<any>(this.apiUrl,{raiz_contabil:raizContabil, gestor:gestor })
  }
  editRaiAnalitica(id: number, dadosAtualizados: Partial<RaizAnalitica>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteRaizAnalitica(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
}
