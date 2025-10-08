import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Analise } from '../../pages/controleQualidade/analise/analise.component';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private analiseUrl = 'http://localhost:8000/analise/analise/';
  private parecerUrl = 'http://localhost:8000/analise/chat/completions/';
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
    
    // Adicionar dados principais
    if (payload.Produto) promptString += `Produto: "${payload.Produto}"\n`;
    if (payload.Tipo) promptString += `Tipo: "${payload.Tipo}"\n`;
    if (payload.Subtipo) promptString += `Subtipo: "${payload.Subtipo}"\n`;
    
    promptString += "\nEnsaios e Cálculos:\n";
    
    // Adicionar todos os outros campos
    Object.keys(payload).forEach(chave => {
      if (chave !== 'Produto' && chave !== 'Tipo' && chave !== 'Subtipo') {
        promptString += `${chave}: ${payload[chave]}\n`;
      }
    });
    
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
  const url = `http://localhost:8000/analise/analise/resultados-anteriores/`;
  
  // Corpo da requisição POST
  const body = {
    calculo: calculoDescricao,
    ensaioIds: ensaioIds,
    limit: limit
  };
  
  return this.httpClient.post<any[]>(url, body);
}

getResultadosAnterioresEnsaios(ensaioDescricao: string, ensaioIds: number[], limit: number = 5): Observable<any[]> {
  const url = `http://localhost:8000/analise/analise/resultados-anteriores/`;
  
  // Corpo da requisição POST
  const body = {
    ensaio_nome: ensaioDescricao,
    ensaioIds: ensaioIds,
    limit: limit
  };
  
  return this.httpClient.post<any[]>(url, body);
}
  
}
