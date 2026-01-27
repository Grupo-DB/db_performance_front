import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetadoService {
  private apiUrl='https://managerdb.com.br/api/dre/linhas/calculosDre/'
  private orcadoUrl='https://managerdb.com.br/api/orcamento/orcamentosbase/calculosOrcado/'
  private despesasUrl='https://managerdb.com.br/api/orcamento/orcamentosbase/calculosDespesa/'
  constructor(private http: HttpClient) { }

  getCalculodDre(ano:number, periodo: number): Observable<any>{
    return this.http.post(this.apiUrl,{ano:ano, periodo:periodo})
  }
  getCalculosdOrcado(ano:number, periodo:number): Observable<any>{
    return this.http.post(this.orcadoUrl,{ano:ano, periodo:periodo})
  }
  getCalculosdDespesa(ano:number, periodo:number): Observable<any>{
    return this.http.post(this.despesasUrl,{ano:ano, periodo:periodo})
  }
}
