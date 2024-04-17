import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { CargoResponse } from '../../types/cargo-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterCargoService {
  private apiUrl = 'http://localhost:8000/management/registercargo/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registercargo(nome: string, empresa: string, filial: string,area:string,setor:string){
    return this.httpClient.post<CargoResponse>(this.apiUrl,{nome,empresa,filial,area,setor}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}