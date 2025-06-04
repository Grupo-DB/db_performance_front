import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoAmostra } from '../../pages/controleQualidade/tipo-amostra/tipo-amostra.component';
import { Produto } from '../../pages/baseOrcamentaria/dre/produto/produto.component';
import { Amostra } from '../../pages/controleQualidade/amostra/amostra.component';

@Injectable({
  providedIn: 'root'
})
export class AmostraService {
  private tipoAmostraUrl = 'http://localhost:8000/amostra/tipoAmostra/';
  private amostraUrl = 'http://localhost:8000/amostra/amostra/';
  private produtoUrl = 'http://localhost:8000/amostra/produto/';
  private sequencialUrl = 'http://localhost:8000/amostra/amostra/proximo-sequencial/';
  private representatividadeUrl = 'http://localhost:8000/cal/representatividade/';
  constructor(
    private http: HttpClient
  ) { }

  ///////Tipos de Amostra
  getTiposAmostra(): Observable<any>{
    return this.http.get<any[]>(this.tipoAmostraUrl);
  }
  editTipoAmostra(id: number, dadosAtualizados: Partial<TipoAmostra>): Observable<any>{
    const url = `${this.tipoAmostraUrl}${id}/`;
    return this.http.patch<any>(url, dadosAtualizados);
  }
  deleteTipoAmostra(id: number): Observable<any>{
    const url = `${this.tipoAmostraUrl}${id}/`;
    return this.http.delete(url);
  }
  registerTipoAmostra(nome: string, natureza: string){
    return this.http.post<TipoAmostra>(this.tipoAmostraUrl,{ nome: nome, natureza: natureza });
  }

  //////////Produtos
  getProdutos(): Observable<any>{
    return this.http.get<any[]>(this.produtoUrl);
  }
  editProduto(id: number, dadosAtualizados: Partial<Produto>): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.patch<any>(url, dadosAtualizados);
  }
  deleteProduto(id: number): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.delete(url);
  }
  registerProduto(nome:string, registroEmpresa: string, registroProduto: string){
    return this.http.post<Produto>(this.produtoUrl,{ nome:nome, registro_empresa: registroEmpresa, registro_produto: registroProduto })
  }

  //////////Amostras
  getAmostras(): Observable<any>{
    return this.http.get<any[]>(this.amostraUrl);
  }
  editAmostra(id: number, dadosAtualizados: Partial<Amostra>): Observable<any>{
    const url = `${this.amostraUrl}${id}/`;
    return this.http.patch<any>(url, dadosAtualizados);
  }
  deleteAmostra(id: number): Observable<any>{
    const url = `${this.amostraUrl}${id}/`;
    return this.http.delete(url);
  }
  registerAmostra(
    dataColeta: any,
    dataEntrada: any,
    material: any,
    numero: any,
    tipoAmostra: any,
    subtipo: any,
    produtoAmostra: any,
    periodoHora: any,
    periodoTurno: any,
    tipoAmostragem: any,
    localColeta: any,
    representatividadeLote: any,
    identificacaoComplementar: any,
    complemento: any,
    ordem: any,
    digitador: any,
    status: any,
  )
  {
    return this.http.post<Amostra>(this.amostraUrl, { 
      data_coleta: dataColeta,
      data_entrada: dataEntrada,
      material: material,
      numero: numero,
      tipo_amostra: tipoAmostra,
      subtipo: subtipo,
      produto_amostra: produtoAmostra,
      periodo_hora: periodoHora,
      periodo_turno: periodoTurno,
      tipo_amostragem: tipoAmostragem,
      local_coleta: localColeta,
      representatividade_lote: representatividadeLote,
      identificacao_complementar: identificacaoComplementar,
      complemento: complemento,
      ordem: ordem,
      digitador: digitador,
      status: status
    });
  }

  getProximoSequencial(materialId: number): Observable<number> {
    // Ajuste a URL para o endpoint correto da sua API
    return this.http.get<number>(`${this.sequencialUrl}${materialId}/`);
  }

  //////////Representatividade
  getRrepresentatividade(data: any){
    return this.http.post<any>(this.representatividadeUrl, {data: data});
  }

}