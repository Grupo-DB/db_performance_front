import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TipoContratoResponse } from '../../../types/avaliacoes/tipocontrato-response';
import { TipoContrato } from '../../../pages/avaliacoes/tipocontrato/tipocontrato.component';

@Injectable({
  providedIn: 'root'
})
export class TipoContratoService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/tipocontratos/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registertipocontrato(nome: string, empresa: string, filial: string,area:string,setor:string,cargo:string,ambiente:string){
    return this.httpClient.post<TipoContratoResponse>(this.apiUrl,{nome,empresa,filial,area,setor,cargo,ambiente}).pipe(
    );
  }
  getTiposContratos(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editTipoContrato(id: number, dadosAtualizados: Partial<TipoContrato>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteTipoContrato(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  } 
  getTiposContratosByCargo(id: number): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byCargo/?cargo_id=${id}`);

  }   
}