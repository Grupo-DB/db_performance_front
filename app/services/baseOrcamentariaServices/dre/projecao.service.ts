import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projecao } from '../../../pages/baseOrcamentaria/dre/projecao/projecao.component';
import { Produto } from '../../../pages/baseOrcamentaria/dre/produto/produto.component';

@Injectable({
  providedIn: 'root',
})
export class ProjecaoService {
  private apiUrl = 'https://managerdb.com.br/api/dre/linhas/';
  private produtoUrl = 'https://managerdb.com.br/api/dre/produtos/';

  constructor(private http: HttpClient) {}

  getLinhas(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  createLinhas(linhas: any[]): Observable<any> {
    return this.http.post(this.apiUrl, linhas);
  }
  editLinha(id: number, dadosAtualizados: Partial<Projecao>):Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.patch(url, dadosAtualizados)
  }
  deleteLinha(id: number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.http.delete(url);
  }
  //**  PRODUTOS */
  createProduto(nome: string, aliquota: any){
    return this.http.post<any>(this.produtoUrl, { nome: nome, aliquota:aliquota })
  }
  getProdutos(): Observable<any[]>{
    return this.http.get<any[]>(this.produtoUrl);
  }
  editProduto(id: number, dadosAtualizados: Partial<Produto>): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.patch(url, dadosAtualizados)
  }
  deleteProduto(id: number): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.delete(url);
  }
  getProdutosDetalhes(id: any):Observable<any[]>{
    return this.http.get<any[]>(`${this.produtoUrl}${id}/`);
  }
}
