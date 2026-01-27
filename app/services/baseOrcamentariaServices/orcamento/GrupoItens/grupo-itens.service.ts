import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GrupoItens } from '../../../../pages/baseOrcamentaria/orcamentoBase/grupo-itens/grupo-itens.component';

@Injectable({
  providedIn: 'root'
})
export class GrupoItensService {
  private apiUrl = 'https://managerdb.com.br/api/orcamento/grupositens/'
  private apiRealizadoUrl = 'https://managerdb.com.br/api/grupoitens/calculos_realizados_grupo_itens/'
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  registerGrupoItens(
    codigo:string, 
    nomeCompleto: string, 
    gestor: string
  ){
    return this.httpClient.post<any>(this.apiUrl, {
      codigo: codigo,
      nome_completo: nomeCompleto,
      gestor: gestor
    })
  }
  getGruposItens():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
  getGrupoItensByGestor(id: any): Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiUrl}byGestor/?gestor_id=${id}`);
  }
  getMeusGruposItens():Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiUrl}meusGrupos/`);
  }
  getGrupoItensDetalhes(id: any): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.get<any>(
      url
    );
  }
  calcularOrcamentoRealizado(grupoItens: any, ccs: any, filiais:any, periodo: any, ano: any): Observable<any>{
    return this.httpClient.post<any>(this.apiRealizadoUrl, {
      grupo_itens: grupoItens,
      ccs: ccs,
      filiais: filiais,
      periodo: periodo,
      ano: ano
    })
}
  editGrupoItens(id: number, dadosAtualizados: Partial<GrupoItens>): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteGrupoItens(id:number): Observable<any>{
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
}
