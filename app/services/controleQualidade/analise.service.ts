import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Analise } from '../../pages/controleQualidade/analise/analise.component';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private analiseUrl = 'https://managerdb.com.br/api/analise/analise/';
  private parecerUrl = 'https://managerdb.com.br/api/analise/chat/completions/';
  private mediasEnsaiosUrl = 'https://managerdb.com.br/api/analise/analiseEnsaio/medias-ensaios-por-periodo/';
  private mediasCalculosUrl = 'https://managerdb.com.br/api/analise/analiseCalculo/medias-por-periodo/';
  private acompanhamentoUrl = 'https://managerdb.com.br/api/analise/analiseEnsaio/tempo-por-analise/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private httpClient: HttpClient
  ) { }

  getAnalises(): Observable<any>{
    return this.httpClient.get<any[]>(this.analiseUrl);   
  }
  analisesCalcs(): Observable<any>{
    const url = `${this.analiseUrl}calcs/`;
    return this.httpClient.get<any[]>(url);
  }
  getAnalisesAbertas(): Observable<any>{
    const url = `${this.analiseUrl}abertas/`;
    return this.httpClient.get<any[]>(url);   
  }
  getAnalisesFechadas(): Observable<any>{
    const url = `${this.analiseUrl}fechadas/`;
    return this.httpClient.get<any[]>(url);   
  }
  getAnaliseById(id: number): Observable<Analise> {
    const url = `${this.analiseUrl}${id}/`;
    return this.httpClient.get<Analise>(url);
  }



  editAnaliseSuperficial(id: number, dadosAtualizados: Partial<any>): Observable<any>{
    const url = `${this.analiseUrl}${id}/`;
    return this.httpClient.patch<any>(url, dadosAtualizados);
  }


  editAnalise(id: number, dadosAtualizados: Partial<Analise>): Observable<any>{
    const url = `${this.analiseUrl}${id}/`;
    return this.httpClient.patch<any>(url, dadosAtualizados);
  }
  registerAnalise(amostra: any, estado: string){
    return this.httpClient.post<Analise>(this.analiseUrl, { amostra: amostra, estado: estado });
  }
  /////////////-----------------Ações individuais para ANALISES -----------------------------------------------

  finalizarAnalise(analiseId: number): Observable<any> {
    return this.httpClient.post(`${this.analiseUrl}${analiseId}/update_finalizada/`, {});
  }
  reabrirAnalise(analiseId: number): Observable<any> {
    return this.httpClient.post(`${this.analiseUrl}${analiseId}/update_aberta/`, {});
  }
  laudoAnalise(analiseId: number): Observable<any> {
    return this.httpClient.post(`${this.analiseUrl}${analiseId}/update_laudo/`, {});
  }
  aprovarAnalise(analiseId: number): Observable<any> {
    return this.httpClient.post(`${this.analiseUrl}${analiseId}/update_aprovada/`, {});
  }
  //////
  //EMITIR PARECER
  emitirParecer(payload: any): Observable<any> {
    // Converter payload para string formatada
    let promptString = "";
    
    // Adicionar dados principais do produto
    if (payload.Produto) promptString += `Produto: "${payload.Produto}"\n`;
    if (payload.Tipo) promptString += `Tipo: "${payload.Tipo}"\n`;
    if (payload.Subtipo) promptString += `Subtipo: "${payload.Subtipo}"\n\n`;
    
    // Adicionar ficha técnica separadamente
    if (payload['Ficha Técnica']) {
      promptString += `Ficha Técnica:\n${payload['Ficha Técnica']}\n\n`;
    }
    
    // Adicionar resultados separadamente
    if (payload.Resultados) {
      promptString += `Resultados:\n${payload.Resultados}\n`;
    } else {
      // Fallback: adicionar outros campos como resultados
      const outrosCampos = Object.keys(payload).filter(chave => 
        !['Produto', 'Tipo', 'Subtipo', 'Ficha Técnica', 'Resultados'].includes(chave)
      );
      
      if (outrosCampos.length > 0) {
        promptString += "Resultados:\n";
        outrosCampos.forEach(chave => {
          promptString += `${chave}: ${payload[chave]}\n`;
        });
      }
    }
    
    console.log('Prompt final:', promptString);
    
    return this.httpClient.post<any>(this.parecerUrl, { prompt: promptString });
  }
  ////////////////////////////////-------------------------------------------------------------
  registerAnaliseComOrdem(amostraId: number, ordemId: number, estado: string): Observable<any> {
  const payload = {
    amostra: amostraId,
    ordem: ordemId,
    estado: estado
  };
   
  return this.httpClient.post(`${this.analiseUrl}`, payload, this.httpOptions);
}

  registerAnaliseResultados(id: number, payload: Partial<Analise>): Observable<any> {
    const url = `${this.analiseUrl}${id}/`;
    return this.httpClient.patch<any>(url, payload);
  }
  deleteAnalise(id: number): Observable<any>{
    const url = `${this.analiseUrl}${id}/`;
    return this.httpClient.delete(url);
  }

  //---------------------RESULTADOS---------------------

  getResultadosAnteriores(calculoDescricao: string, ensaioIds: number[], limit: number = 5): Observable<any[]> {
    const url = `https://managerdb.com.br/api/analise/analise/resultados-anteriores/`;
    
    // Corpo da requisição POST
    const body = {
      calculo: calculoDescricao,
      ensaioIds: ensaioIds,
      limit: limit
    };
    
    return this.httpClient.post<any[]>(url, body);
  }

  getResultadosAnterioresEnsaios(ensaioDescricao: string, ensaioIds: number[], limit: number = 5): Observable<any[]> {
    const url = `https://managerdb.com.br/api/analise/analise/resultados-anteriores/`;
    
    // Corpo da requisição POST
    const body = {
      ensaio_nome: ensaioDescricao,
      ensaioIds: ensaioIds,
      limit: limit
    };
    
    return this.httpClient.post<any[]>(url, body);
  }
  //=================================MEDIAS POR PERIODO =====================================//////////
  getMediasEnsaiosPorPeriodo(ensaios: any,produtos: any,inicio: string, fim: string): Observable<any[]> {
    const url = this.mediasEnsaiosUrl;
    const body = {
      ensaios_ids: ensaios,
      produto_ids: produtos,
      data_inicio: inicio,
      data_fim: fim
    };
    return this.httpClient.post<any[]>(url, body);
  }

  getMediasCalculosPorPeriodo(calculos: any,produtos: any,inicio: string, fim: string): Observable<any[]> {
    const url = this.mediasCalculosUrl;
    const body = {
      calculos_descricoes: calculos,
      produto_ids: produtos,
      data_inicio: inicio,
      data_fim: fim
    };
    return this.httpClient.post<any[]>(url, body);
  }
//---------------------------------------------------FIM----------------------------------------------

//------------------------Metodos para o acompanhamento de deslizamento ------------------------------
  salvarDeslizamento(analiseId: number, dados: any): Observable<any> {
    const url = `${this.analiseUrl}${analiseId}/`;
    return this.httpClient.patch<any>(url, { deslizamento: dados });
  }
//------------------------Metodos para o acompanhamento de tempo ------------------------------

  getAcompanhamentoTempoPorAnalise(
    data_inicial: string,
    data_final: string,
    locais_coleta: string[],
    apenas_finalizadas: boolean,
    laboratorio: string
  ): Observable<any> {
    const url = this.acompanhamentoUrl;
    const body = {
      data_inicial: data_inicial,
      data_final: data_final,
      locais_coleta: locais_coleta,
      apenas_finalizadas: apenas_finalizadas,
      laboratorio: laboratorio
    };
    return this.httpClient.post<any>(url, body);
  }
  getAnaliseAgrupada(
    data_inicial: string,
    data_final: string,
    agrupar_por: string,
    laboratorio: string = ''
  ): Observable<any> {
    const url = 'https://managerdb.com.br/api/analise/analiseEnsaio/tempo-por-analise/';
    const body: any = {
      data_inicial: data_inicial,
      data_final: data_final,
      agrupar_por: agrupar_por
    };
    
    // Adicionar laboratório ao body apenas se não estiver vazio
    if (laboratorio) {
      body.laboratorio = laboratorio;
    }
    
    return this.httpClient.post<any>(url, body);
  }
}
