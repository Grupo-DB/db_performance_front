import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrcamentoBase } from '../../../../pages/baseOrcamentaria/orcamentoBase/orcamento-base/orcamento-base.component';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoBaseService {
  private apiUrl = 'http://localhost:8000/orcamento/orcamentosbase/'
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }
  registerOrcamentoBase(
    ano: Date,
    ccPai: string,
    cc: string,
    gestor: string,
    empresa: string,
    filial: string,
    area: string,
    setor: string,
    ambiente: string,
    raizSintetica: string,
    raizSinteticaDesc: string,
    raizAnalitica: string,
    raizAnaliticaDesc: string,
    contaContabil: string,
    contaContabilDesc: string,
    raizContabilGrupo: string,
    raizContabilGrupoDesc: string,
    recorrencia: string,
    mensalTipo: string,
    mesEspecifico: string,
    mesesRecorrentes: string,
    suplementacao: string,
    baseOrcamento: string,
    idBase: string,
    valor: string
  ){
    return this.httpClient.post<any>(this.apiUrl, {
      ano: ano,
      centro_de_custo_pai: ccPai,
      centro_custo_nome: cc,
      gestor: gestor,
      empresa: empresa,
      filial: filial,
      area: area,
      setor: setor,
      ambiente: ambiente,
      raiz_sintetica: raizSintetica,
      raiz_sintetica_desc: raizSinteticaDesc,
      raiz_analitica: raizAnalitica,
      raiz_analitica_desc: raizAnaliticaDesc,
      conta_contabil: contaContabil,
      conta_contabil_descricao: contaContabilDesc,
      raiz_contabil_grupo: raizContabilGrupo,
      raiz_contabil_grupo_desc: raizContabilGrupoDesc,
      recorrencia: recorrencia,
      mensal_tipo: mensalTipo,
      mes_especifico: mesEspecifico,
      meses_recorrentes: mesesRecorrentes,
      suplementacao: suplementacao,
      base_orcamento: baseOrcamento,
      id_base: idBase,
      valor: valor,
    })
  }
  getOrcamentosBases():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  editOrcamentoBase(id: number, dadosAtualizados: Partial<OrcamentoBase>): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteOrcamentoBase(id:number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
}
