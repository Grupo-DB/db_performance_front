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

  getCalculodDre(): Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }
  getCalculosdOrcado(): Observable<any>{
    return this.http.get<any[]>(this.orcadoUrl)
  }
  getCalculosdDespesa(): Observable<any>{
    return this.http.get<any[]>(this.despesasUrl)
  }
}
