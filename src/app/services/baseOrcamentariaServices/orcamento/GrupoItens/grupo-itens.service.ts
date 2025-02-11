import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GrupoItens } from '../../../../pages/baseOrcamentaria/orcamentoBase/grupo-itens/grupo-itens.component';

@Injectable({
  providedIn: 'root'
})
export class GrupoItensService {
  private apiUrl = 'http://172.50.10.79:8008/orcamento/grupositens/'
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  registerGrupoItens(
    codigo:string, 
    nomeCompleto: string, 
    nivel1: string,
    nivel2: string,
    nivel3: string,
    nivel4: string,
    nivel5: string,
    nivel6: string,
    nivel7: string,
    gestor: string
  ){
    return this.httpClient.post<any>(this.apiUrl, {
      codigo: codigo,
      nome_completo: nomeCompleto,
      nivel_1: nivel1,
      nivel_2: nivel2,
      nivel_3: nivel3,
      nivel_4: nivel4,
      nivel_5: nivel5,
      nivel_6: nivel6,
      nivel_7: nivel7,
      gestor: gestor
    })
  }
  getGruposItens():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
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
