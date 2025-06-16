import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ordem } from '../../pages/controleQualidade/ordem/ordem.component';

@Injectable({
  providedIn: 'root'
})
export class OrdemService {
  private ordemUrl = 'http://172.50.10.79:8008/ordem/ordem/';

  constructor(
    private httpClient: HttpClient
  ) { }

  getOrdens(): Observable<any>{
    return this.httpClient.get<any[]>(this.ordemUrl);
  }

  editOrdens(id:number, dadosAtualizados: Partial<Ordem>): Observable<any>{
    const url = `${this.ordemUrl}${id}/`;
    return this.httpClient.patch<any>(url, dadosAtualizados);
  }

  deleteOrdem(id: number): Observable<any> {
    const url = `${this.ordemUrl}${id}/`;
    return this.httpClient.delete(url);
  }

  registerOrdem(data: any, numero: number, planoAnalise: any, responsavel: string, digitador: string, classificacao: string){
    return this.httpClient.post<Ordem>(this.ordemUrl, {
      data: data,
      numero: numero,
      plano_analise: planoAnalise,
      responsavel: responsavel,
      digitador: digitador,
      classificacao: classificacao
    });
  }

  //Numeracao de ordens
  getProximoNumero(): Observable<number> {
  return this.httpClient.get<{numero: number}>(`${this.ordemUrl}proximo-numero/`)
    .pipe(map(res => res.numero));
}
  /////HISTORICO DE ORDENS

  getHistoricoOrdens(ordemId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.ordemUrl}${ordemId}historico/`);
  }

}
