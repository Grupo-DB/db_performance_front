import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ambiente } from '../../pages/ambiente/ambiente.component';

@Injectable({
  providedIn: 'root'
})
export class AmbienteService {
  private apiUrl = 'http://172.50.10.11:8008/management/ambientes/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerAmbiente(nome:string, empresa: string, filial: string, area: string, setor: string){
    return this.httpClient.post(this.apiUrl,{empresa,filial,area,setor,nome}).pipe(     
    );
  }
  getAmbientes(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editAmbiente(id: number, dadosAtualizados: Partial<Ambiente>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteAmbiente(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  } 
  getAmbientesBySetor(id: number): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}bySetor/?setor_id=${id}`);

  }  
}