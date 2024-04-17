import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { SetorResponse } from '../../types/setor-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterSetorService {
  private apiUrl = 'http://localhost:8000/management/registersetor/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registersetor(nome: string, empresa: string, filial: string,area:string){
    return this.httpClient.post<SetorResponse>(this.apiUrl,{nome,empresa,filial,area}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}