import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoEnsaio } from '../../pages/controleQualidade/tipo-ensaio/tipo-ensaio.component';
import { CalculoEnsaio } from '../../pages/controleQualidade/calculo-ensaio/calculo-ensaio.component';
import { Ensaio } from '../../pages/controleQualidade/ensaio/ensaio.component';
import { Plano } from '../../pages/controleQualidade/plano/plano.component';
import { Variavel } from '../../pages/controleQualidade/variavel/variavel.component';

@Injectable({
  providedIn: 'root'
})
export class EnsaioService {
  private apiUrl = 'http://localhost:8000/ensaio/tipos_ensaio/';
  private apiUrlEnsaio = 'http://localhost:8000/ensaio/ensaio/';
  private apiUrlVariaveisEnsaio = 'http://localhost:8000/ensaio/variavel/';
  private apiUrlCalculoEnsaio = 'http://localhost:8000/calculosEnsaio/calculoEnsaio/';
  private apiUrlPlano = 'http://localhost:8000/plano/planoAnalise/';
  constructor(
    private http: HttpClient,
  ) { }

  //tipos de ensaio
  getTiposEnsaio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  editTipoEnsaio(id: number, dadosAtualizados: Partial<TipoEnsaio>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch(url, dadosAtualizados); 
  }
  deleteTipoEnsaio(id: number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url);
  }
  registerTipoEnsaio(nome: string){
    return this.http.post<TipoEnsaio>(this.apiUrl, { nome: nome });
  }
  //Ensaios
  getEnsaios(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrlEnsaio);
  }
  editEnsaio(id: number, dadosAtualizados: Partial<Ensaio>): Observable<any> {
    const url = `${this.apiUrlEnsaio}${id}/`;
    return this.http.patch(url, dadosAtualizados); 
  }
  deleteEnsaio(id: number): Observable<any>{
    const url = `${this.apiUrlEnsaio}${id}/`;
    return this.http.delete(url);
  }
  registerEnsaio(descricao: string, responsavel: string, valor: number, tipoEnsaio: any, tempoPrevisto: any, variavel: any, funcao: any){
    return this.http.post<Ensaio>(this.apiUrlEnsaio, { descricao: descricao, responsavel: responsavel, valor: valor, tipo_ensaio: tipoEnsaio, tempo_previsto: tempoPrevisto, variavel: variavel, funcao: funcao });
  }

  //Calculo Ensaio
  getCalculoEnsaio(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrlCalculoEnsaio);
  }
  editCalculoEnsaio(id: number, dadosAtualizados: Partial<CalculoEnsaio>): Observable<any> {
    const url = `${this.apiUrlCalculoEnsaio}${id}/`;
    return this.http.patch(url, dadosAtualizados); 
  }

  deleteCalculoEnsaio(id: number): Observable<any>{
    const url = `${this.apiUrlCalculoEnsaio}${id}/`;
    return this.http.delete(url);
  }
  registerCalculoEnsaio(descricao: string, funcao: any, ensaios: any, responsavel: string, valor: number){
    return this.http.post<CalculoEnsaio>(this.apiUrlCalculoEnsaio, { descricao: descricao, funcao: funcao, ensaios: ensaios, responsavel: responsavel, valor: valor });
  }

  //Plano de analise
  getPlanoAnalise(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrlPlano);
  }
  editPlanoAnalise(id: number, dadosAtualizados: Partial<Plano>): Observable<any> {
    const url = `${this.apiUrlPlano}${id}/`;
    return this.http.patch(url, dadosAtualizados); 
  }
  deletePlanoAnalise(id: number): Observable<any>{
    const url = `${this.apiUrlPlano}${id}/`;
    return this.http.delete(url);
  }
  registerPlanoAnalise(descricao: string, ensaios: any, calculosEnsaio: any){
    return this.http.post<Plano>(this.apiUrlPlano, { descricao: descricao, ensaios: ensaios, calculos_ensaio: calculosEnsaio });
  }

//Variáveis de ensaios
  getVariaveis(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlVariaveisEnsaio);
  }
  editVariavel(id: number, dadosAtualizados: Partial<Variavel>): Observable<any> {
    const url = `${this.apiUrlVariaveisEnsaio}${id}/`;
    return this.http.patch(url, dadosAtualizados); 
  }
  deleteVariavel(id: number): Observable<any>{
    const url = `${this.apiUrlVariaveisEnsaio}${id}/`;
    return this.http.delete(url);
  }
  registerVariavel(nome: string, valor: any){
    return this.http.post<Variavel>(this.apiUrlVariaveisEnsaio, { nome: nome, valor: valor });
  }

}
