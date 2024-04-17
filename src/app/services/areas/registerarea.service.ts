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

  registerarea(nome: string, empresa: string, filial: string,){
    return this.httpClient.post<AreaResponse>(this.apiUrl,{nome,empresa,filial}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}

