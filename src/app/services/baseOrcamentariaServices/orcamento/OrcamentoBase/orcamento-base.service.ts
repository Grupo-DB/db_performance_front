import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrcamentoBase } from '../../../../pages/baseOrcamentaria/orcamentoBase/orcamento-base/orcamento-base.component';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoBaseService {
  private apiUrl = 'http://172.50.10.79:8008/orcamento/orcamentosbase/'
  private apiRealizadoUrl = 'http://172.50.10.79:8008/realizado/realizado/'

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
    raizAnaliticaCod: string,
    contaContabil: string,
    contaContabilDesc: string,
    raizContabilGrupoDesc: string,
    periodicidade: string,
    mensalTipo: string,
    mesEspecifico: string,
    mesesRecorrentes: string,
    suplementacao: string,
    baseOrcamento: string,
    idBase: string,
    valor: string,
    tipoCusto: string,
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
      raiz_analitica_cod: raizAnaliticaCod,
      conta_contabil: contaContabil,
      conta_contabil_descricao: contaContabilDesc,
      raiz_contabil_grupo_desc: raizContabilGrupoDesc,
      periodicidade: periodicidade,
      mensal_tipo: mensalTipo,
      mes_especifico: mesEspecifico,
      meses_recorrentes: mesesRecorrentes,
      suplementacao: suplementacao,
      base_orcamento: baseOrcamento,
      id_base: idBase,
      valor: valor,
      tipo_custo: tipoCusto
    })
  }
  getOrcamentosBases():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  getOrcamentoBaseDetalhe(id: any): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}${id}/`);
  }
  getOrcamentoBaseByCcPai(id: any, ano: any, filiais:any): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}byCcPai/?centro_de_custo_pai_id=${id}&ano=${ano}&filial=${filiais}`)
  }
  calculosTotais(ano: any, filiais:any): Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl}total/?ano=${ano}&filial=${filiais}`)
  }
  editOrcamentoBase(id: number, dadosAtualizados: Partial<OrcamentoBase>): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteOrcamentoBase(id:number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  aplicarDissidio(porcentagem: number){
    const dissidioUrl = 'http://172.50.10.79:8008/orcamento/aplicarDissidio/';
    return this.httpClient.post<any>(dissidioUrl, {porcentagem:porcentagem})
  }
  calcularOrcamentoRealizado(ccs: any, ano: any, filiais:any): Observable<any>{
    return this.httpClient.post<any>(this.apiRealizadoUrl, {ccs:ccs, ano:ano, filiais:filiais})
  }
}
