import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetadoService {
  private apiUrl='http://172.50.10.79:8008/dre/linhas/calculosDre/'
  private orcadoUrl='http://172.50.10.79:8008/orcamento/orcamentosbase/calculosOrcado/'
  private despesasUrl='http://172.50.10.79:8008/orcamento/orcamentosbase/calculosDespesa/'
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
