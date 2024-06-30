import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AreaResponse } from '../../types/area-response';
import { Area } from '../../pages/area/area.component';


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl = 'http://localhost:8000/management/areas/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerarea(nome: string, empresa: string, filial: string,){
    return this.httpClient.post<AreaResponse>(this.apiUrl,{nome,empresa,filial}).pipe(
    );
  }
  getAreas(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editArea(id: number, dadosAtualizados: Partial<Area>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteArea(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  getAreasByFilial(id: any): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}byFilial/?filial_id=${id}`);

  } 
}

