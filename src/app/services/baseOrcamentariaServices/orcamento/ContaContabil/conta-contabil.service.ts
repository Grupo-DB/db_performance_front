import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContaContabil } from '../../../../pages/baseOrcamentaria/orcamentoBase/conta-contabil/conta-contabil.component';

@Injectable({
  providedIn: 'root'
})
export class ContaContabilService {
  private apiUrl = 'http://http://172.50.10.79:8008/orcamento/contascontabeis/'
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }
  registerContaContabil(
    nivel1Conta: string,
    nivel1Nome: string,
    nivel2Conta: string,
    nivel2Nome: string,
    nivel3Conta: string,
    nivel3Nome: string,
    nivel4Conta: string,
    nivel4Nome: string,
    nivel5Conta: string,
    nivel5Nome: string,
    nivelAnaliticoConta: string,
    nivelAnaliticoNome: string,
  ){
  return this.httpClient.post<any>(this.apiUrl,{
      nivel_1_conta: nivel1Conta,
      nivel_1_nome: nivel1Nome,
      nivel_2_conta: nivel2Conta,
      nivel_2_nome: nivel2Nome,
      nivel_3_conta: nivel3Conta,
      nivel_3_nome: nivel3Nome,
      nivel_4_conta: nivel4Conta,
      nivel_4_nome: nivel4Nome,
      nivel_5_conta: nivel5Conta,
      nivel_5_nome: nivel5Nome,
      nivel_analitico_conta: nivelAnaliticoConta,
      nivel_analitico_nome: nivelAnaliticoNome
  })
  }

  getContaContabil():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  getContaContabilByOb(nivel_analitico_conta: any):Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}byOb/?nivel_analitico_conta=${nivel_analitico_conta}`)
  }
  editContaContabil(id: number, dadosAtualizados: Partial<ContaContabil>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteContaContabil(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }

}
