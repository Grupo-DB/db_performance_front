import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { RegisterCompanyResponse } from '../../../types/avaliacoes/registercompany-response';
import { Empresa } from '../../../pages/avaliacoes/registercompany/registercompany.component';

@Injectable({
  providedIn: 'root'
})
export class RegisterCompanyService {
  private apiUrl = 'https://managerdb.com.br/api/management/empresas/';
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
  getEmpresa(id: string) {
    return this.httpClient.get<any>(`https://managerdb.com.br/api/management/empresas/${id}`);
  }
}