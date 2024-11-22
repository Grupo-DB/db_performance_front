import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RaizSintetica } from '../../../../pages/baseOrcamentaria/orcamentoBase/raiz-sintetica/raiz-sintetica.component';

@Injectable({
  providedIn: 'root'
})
export class RaizSinteticaService {
  private apiUrl = 'http://localhost:8000/orcamento/raizessinteticas/'
  constructor(
    private httpClient: HttpClient,
    private router: Router,) { }

    registerRaizSintetica(raizContabil:string,  cc: string){
      return this.httpClient.post<any>(this.apiUrl, {raiz_contabil: raizContabil, centro_custo:cc });
    }
    getRaizSintetica():Observable<any[]>{
      return this.httpClient.get<any[]>(this.apiUrl);
    }
    editRaizSintetica(id: number, dadosAtualizados: Partial<RaizSintetica>): Observable<any> {
      const url = `${this.apiUrl}${id}/`;
      return this.httpClient.patch(url, dadosAtualizados);
    }
    deleteRaizSintetica(id: number): Observable<any> {
      const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
    }
  }
