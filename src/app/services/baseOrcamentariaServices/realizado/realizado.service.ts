import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealizadoService {
  private apiUrl = 'http://localhost:8000/realizado/realizado/'
  constructor(
    private httpClient: HttpClient
  ) { }
  getRealizados():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);
  }
}
