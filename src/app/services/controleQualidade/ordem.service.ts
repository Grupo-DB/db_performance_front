import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ordem } from '../../pages/controleQualidade/ordem/ordem.component';
import { Expressa } from '../../pages/controleQualidade/expressa/expressa.component';

@Injectable({
  providedIn: 'root'
})
export class OrdemService {
  private ordemUrl = 'http://localhost:8000/ordem/ordem/';
  private expressaUrl = 'http://localhost:8000/ordem/expressa/';

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

///-------------------------ORDEM EXPRESSA----------------------------
  getExpresssas(): Observable<any>{
    return this.httpClient.get<any[]>(this.expressaUrl);
  }

  getProximoNumeroExpressa(): Observable<number> {
  return this.httpClient.get<{numero: number}>(`${this.expressaUrl}proximo-numero/`)
    .pipe(map(res => res.numero));
}

  editExpressa(id:number, dadosAtualizados: Partial<Expressa>): Observable<any>{
    const url = `${this.expressaUrl}${id}/`;
    return this.httpClient.patch<any>(url, dadosAtualizados);
  }

  deleteExpressa(id: number): Observable<any> {
    const url = `${this.expressaUrl}${id}/`;
    return this.httpClient.delete(url);
  }

  registerExpressa(
    data: any, 
    numero: number,
    ensaios: number[], // Array de IDs dos ensaios
    calculos_ensaio: number[], // Array de IDs dos cálculos
    responsavel: string, 
    digitador: string, 
    classificacao: string
  ){
    const payload = {
      data: data,
      numero: numero,
      ensaios: ensaios,
      calculos_ensaio: calculos_ensaio,
      responsavel: responsavel,
      digitador: digitador,
      classificacao: classificacao
    };
    
    console.log('📤 Payload enviado para registerExpressa:', payload);
    
    return this.httpClient.post<Expressa>(this.expressaUrl, payload);
  }

  /**
   * Atualiza ensaios e cálculos de uma ordem expressa existente
   */
  atualizarEnsaiosCalculosExpressa(ordemId: number, ensaiosIds: number[], calculosIds: number[]): Observable<any> {
    const url = `${this.expressaUrl}${ordemId}/`;
    const payload = {
      ensaios: ensaiosIds,
      calculos_ensaio: calculosIds
    };
    
    console.log('📤 Atualizando ordem expressa:', {
      ordemId,
      ensaiosIds,
      calculosIds,
      url,
      payload
    });
    
    return this.httpClient.patch<any>(url, payload);
  }

}  
