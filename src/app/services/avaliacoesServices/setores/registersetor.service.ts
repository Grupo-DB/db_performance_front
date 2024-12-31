import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SetorResponse } from '../../../types/avaliacoes/setor-response';
import { Setor } from '../../../pages/avaliacoes/setor/setor.component';


@Injectable({
  providedIn: 'root'
})
export class SetorService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/setores/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registersetor(nome: string, empresa: string, filial: string,area:string){
    return this.httpClient.post<SetorResponse>(this.apiUrl,{nome,empresa,filial,area}).pipe(
    );
  }
  getSetores(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editSetor(id: number, dadosAtualizados: Partial<Setor>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteSetor(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  getSetorByArea(id: any): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byArea/?area_id=${id}`);

  }   
}