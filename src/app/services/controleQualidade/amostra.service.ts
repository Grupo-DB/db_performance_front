import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private imageUrl = 'http://localhost:8000/amostra/amostraImagem/';
  private produtoUrl = 'http://localhost:8000/amostra/produto/';
  private sequencialUrl = 'http://localhost:8000/amostra/amostra/proximo-sequencial/';
  private representatividadeUrl = 'http://localhost:8000/cal/representatividade/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
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
  registerTipoAmostra(nome: string, natureza: string, material: string){
    return this.http.post<TipoAmostra>(this.tipoAmostraUrl,{ nome: nome, natureza: natureza, material: material });
  }



  ///upload imagens
  // ...existing code...

uploadImagens(amostraId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.amostraUrl}${amostraId}/upload_images/`, formData);
}

getImagensAmostra(amostraId: number): Observable<any> {
  return this.http.get(`${this.amostraUrl}${amostraId}/get_images/`);
}
deleteImagem(amostraId: number, imageId: number): Observable<any> {
  return this.http.delete(`${this.amostraUrl}${amostraId}/delete_image/${imageId}/`);
}

atualizarDescricaoImagem(imagemId: number, descricao: string): Observable<any> {
  return this.http.patch(`${this.imageUrl}${imagemId}/`, { descricao });
}

// ...existing code...

  //////////Produtos
  getProdutos(): Observable<any>{
    return this.http.get<any[]>(this.produtoUrl);
  }

  getProdutosPorMaterial(materialNome: string): Observable<any[]> {
  const nomeEncoded = encodeURIComponent(materialNome);
  return this.http.get<any[]>(`${this.produtoUrl}produtos-por-material/${nomeEncoded}/`);
}

  getTiposAmostraPorMaterial(materialNome: string): Observable<any[]> {
    const nomeEncoded = encodeURIComponent(materialNome);
    return this.http.get<any[]>(`${this.tipoAmostraUrl}tipos-por-material/${nomeEncoded}/`);
  }

  editProduto(id: number, dadosAtualizados: Partial<Produto>): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.patch<any>(url, dadosAtualizados);
  }
  deleteProduto(id: number): Observable<any>{
    const url = `${this.produtoUrl}${id}/`;
    return this.http.delete(url);
  }
  registerProduto(nome:string, registroEmpresa: string, registroProduto: string, material: string, codDb: string): Observable<Produto> {
    return this.http.post<Produto>(this.produtoUrl,{ nome:nome, registro_empresa: registroEmpresa, registro_produto: registroProduto, material: material, cod_db: codDb })
  }

  //////////Amostras
  getAmostras(): Observable<any>{
    return this.http.get<any[]>(this.amostraUrl);
  }
  getAmostrasSemOrdem(): Observable<any> {
    const url = `${this.amostraUrl}sem_ordem/`;
    return this.http.get<any[]>(url);
  }
  getAmostraById(amostraId: number): Observable<any> {
  const url = `${this.amostraUrl}${amostraId}/`;
  return this.http.get(url, this.httpOptions);
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
    material: any,
    finalidade: any,
    numeroSac: any,
    dataEnvio: any,
    destinoEnvio: any,
    dataRecebimento: any,
    reter: any,
    registroEp: any,
    registroProduto: any,
    numeroLote: any,
    dataColeta: any,
    dataEntrada: any,
    numero: any,
    tipoAmostra: any,
    subtipo: any,
    produtoAmostra: any,
    codDb: any,
    periodoHora: any,
    periodoTurno: any,
    tipoAmostragem: any,
    localColeta: any,
    fornecedor: any,
    representatividadeLote: any,
    identificacaoComplementar: any,
    complemento: any,
    observacoes: any,
    ordem: any,
    expressa: any,
    digitador: any,
    status: any,
  )
  {
    return this.http.post<Amostra>(this.amostraUrl, {
      material: material,
      finalidade: finalidade,
      numero_sac: numeroSac,
      data_envio: dataEnvio,
      destino_envio: destinoEnvio,
      data_recebida: dataRecebimento,
      reter: reter,
      registro_ep: registroEp,
      registro_produto: registroProduto,
      numero_lote: numeroLote, 
      data_coleta: dataColeta,
      data_entrada: dataEntrada,
      numero: numero,
      tipo_amostra: tipoAmostra,
      subtipo: subtipo,
      produto_amostra: produtoAmostra,
      cod_db: codDb,
      periodo_hora: periodoHora,
      periodo_turno: periodoTurno,
      tipo_amostragem: tipoAmostragem,
      local_coleta: localColeta,
      fornecedor: fornecedor,
      representatividade_lote: representatividadeLote,
      identificacao_complementar: identificacaoComplementar,
      complemento: complemento,
      observacoes: observacoes,
      ordem: ordem,
      expressa: expressa, 
      digitador: digitador,
      status: status
    });
  }

  // Método específico para registrar amostra expressa
  registerAmostraExpressa(dadosAmostraExpressa: any): Observable<Amostra> {
    return this.http.post<Amostra>(this.amostraUrl, {
      // Dados da amostra
      data_coleta: dadosAmostraExpressa.dataColeta,
      data_entrada: dadosAmostraExpressa.dataEntrada,
      material: dadosAmostraExpressa.material,
      numero: dadosAmostraExpressa.numero,
      tipo_amostra: dadosAmostraExpressa.tipoAmostra,
      subtipo: dadosAmostraExpressa.subtipo,
      produto_amostra: dadosAmostraExpressa.produtoAmostra,
      cod_db: dadosAmostraExpressa.codDb,
      periodo_hora: dadosAmostraExpressa.periodoHora,
      periodo_turno: dadosAmostraExpressa.periodoTurno,
      tipo_amostragem: dadosAmostraExpressa.tipoAmostragem,
      local_coleta: dadosAmostraExpressa.localColeta,
      fornecedor: dadosAmostraExpressa.fornecedor,
      representatividade_lote: dadosAmostraExpressa.representatividadeLote,
      identificacao_complementar: dadosAmostraExpressa.identificacaoComplementar,
      complemento: dadosAmostraExpressa.complemento,
      ordem: dadosAmostraExpressa.numeroOrdem,
      digitador: dadosAmostraExpressa.digitador,
      status: dadosAmostraExpressa.status,
      
      // Campos específicos para expressa
      tipo_ordem: dadosAmostraExpressa.tipoOrdem || 'EXPRESSA',
      prioridade: dadosAmostraExpressa.prioridade || 'ALTA',
      data_abertura: dadosAmostraExpressa.dataAbertura,
      classificacao: dadosAmostraExpressa.classificacao,
      responsavel: dadosAmostraExpressa.responsavel,
      
      // Arrays de ensaios e cálculos selecionados
      ensaios_selecionados: dadosAmostraExpressa.ensaiosSelecionados || [],
      calculos_selecionados: dadosAmostraExpressa.calculosSelecionados || []
    });
  }

   updateAmostra(amostraId: number, dadosAtualizacao: any): Observable<any> {
    const url = `${this.amostraUrl}${amostraId}/`;
    return this.http.patch(url, dadosAtualizacao, this.httpOptions);
  }

  associarAmostraAOrdem(amostraId: number, ordemId: number): Observable<any> {
    const url = `${this.amostraUrl}${amostraId}/`;
    return this.http.patch(url, { ordem: ordemId }, this.httpOptions);
  }

  getProximoSequencial(materialId: number): Observable<number> {
    // Ajuste a URL para o endpoint correto da sua API
    return this.http.get<number>(`${this.sequencialUrl}${materialId}/`);
  }

 getProximoSequencialPorNome(materialNome: string): Observable<number> {
  return this.http.get<number>(`${this.amostraUrl}proximo-sequencial-nome/${encodeURIComponent(materialNome)}/`);
}

  //////////Representatividade
  getRrepresentatividade(data: any){
    return this.http.post<any>(this.representatividadeUrl, {data: data});
  }

}