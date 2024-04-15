import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AreaResponse } from '../../types/area-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterAreaService {
  private apiUrl = 'http://localhost:8000/management/registerarea/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registercompany(nome: string, cnpj: string, endereco: string, cidade: string, estado: string, codigo: string){
    return this.httpClient.post<AreaResponse>(this.apiUrl,{nome,cnpj,endereco,cidade,estado,codigo}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}

