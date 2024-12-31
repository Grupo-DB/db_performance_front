import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTipoAvaliacaoService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/get_tipoavaliacao/'; 
  constructor(private http: HttpClient) { }

  getTipoavaliacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
