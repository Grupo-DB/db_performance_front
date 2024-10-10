import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CargoResponse } from '../../../types/avaliacoes/cargo-response';
import { Cargo } from '../../../pages/avaliacoes/cargo/cargo.component';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private apiUrl = 'http://172.50.10.79:8008/management/cargos/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registercargo(nome: string, empresa: string, filial: string,area:string,setor:string,ambiente:string){
    return this.httpClient.post<CargoResponse>(this.apiUrl,{nome,empresa,filial,area,setor,ambiente}).pipe(
    );
  }
  getCargos(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editCargo(id: number, dadosAtualizados: Partial<Cargo>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteCargo(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  getCargosByAmbientes(id: any): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byAmbiente/?ambiente_id=${id}`);

  }    
}