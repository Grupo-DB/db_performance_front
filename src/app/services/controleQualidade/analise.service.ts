import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Analise } from '../../pages/controleQualidade/analise/analise.component';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private analiseUrl = 'http://localhost:8000/analise/analise/';
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

  registerAnaliseComOrdem(amostraId: number, ordemId: number, estado: string): Observable<any> {
  const payload = {
    amostra: amostraId,
    ordem: ordemId,
    estado: estado
  };
  
  console.log('📤 Enviando payload para criar análise:', payload);
  
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

}
