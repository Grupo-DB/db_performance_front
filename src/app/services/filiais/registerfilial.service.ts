import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FilialResponse } from '../../types/filial-response';
import { Filial } from '../../pages/filial/filial.component';

@Injectable({
  providedIn: 'root'
})
export class FilialService {
  private apiUrl = 'http://172.50.10.11:8008/management/filiais/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerfilial(empresa: string, nome: string, cnpj: string, endereco: string, cidade: string, estado: string, codigo: string){
    return this.httpClient.post<FilialResponse>(this.apiUrl,{empresa,nome,cnpj,endereco,cidade,estado,codigo}).pipe(     
    );
  }
  getFiliais(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editFilial(id: number, dadosAtualizados: Partial<Filial>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteFilial(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }   
  getFiliaisByEmpresa(id: number): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byEmpresa/?empresa_id=${id}`);

  }
  getFilial(id: string) {
    return this.httpClient.get<any>(`http://172.50.10.11:8008/management/filiais/${id}`);
}
}