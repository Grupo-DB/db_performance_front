import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CentroCustoPai } from '../../../../pages/baseOrcamentaria/orcamentoBase/centrocustopai/centrocustopai.component';

@Injectable({
  providedIn: 'root'
})
export class CentrocustopaiService {
  private apiUrl = 'http://localhost:8000/orcamento/centroscustopai/';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  registerCentroCustoPai(nome: string, empresa: string, filial: string, area: string, ambiente: string, setor: string){
    return this.httpClient.post<any>(this.apiUrl, {nome: nome, empresa: empresa, filial: filial, area: area, ambiente: ambiente, setor: setor});
  }
  getCentrosCustoPai():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  getCentrosCustoPaiDetalhes(id: any):Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiUrl}${id}/`);
  }
  editCentroCustoPai(id: number, dadosAtualizados: Partial<CentroCustoPai>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados); 
  }
  deleteCentroCustoPai(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
}
