import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoAmostra } from '../../pages/controleQualidade/tipo-amostra/tipo-amostra.component';
import { Produto } from '../../pages/baseOrcamentaria/dre/produto/produto.component';

@Injectable({
  providedIn: 'root'
})
export class AmostraService {
  private tipoAmostraUrl = 'http://localhost:8000/amostra/tipoAmostra/';
  private amostraUrl = 'http://localhost:8000/amostra/amostra/';
  private produtoUrl = 'http://localhost:8000/amostra/produto/';
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

}