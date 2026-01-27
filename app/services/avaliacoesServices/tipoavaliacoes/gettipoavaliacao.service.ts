import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTipoAvaliacaoService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_tipoavaliacao/'; 
  constructor(private http: HttpClient) { }

  getTipoavaliacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
