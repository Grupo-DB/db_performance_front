import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { RegisterCompanyResponse } from '../../types/registercompany-response';
import { Empresa } from '../../pages/registercompany/registercompany.component';

@Injectable({
  providedIn: 'root'
})
export class RegisterCompanyService {
  private apiUrl = 'http://localhost:8000/management/empresas/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registercompany(nome: string, cnpj: string, endereco: string, cidade: string, estado: string, codigo: string){
    return this.httpClient.post<RegisterCompanyResponse>(this.apiUrl,{nome,cnpj,endereco,cidade,estado,codigo}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }
  getCompanys(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editCompany(id: number, dadosAtualizados: Partial<Empresa>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteCompany(id: number): Observable<any> {
  const url = `${this.apiUrl}${id}/`;
  return this.httpClient.delete(url);
  }
}