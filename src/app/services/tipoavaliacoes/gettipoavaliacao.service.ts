import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTipoAvalicaoService {
  private apiUrl = 'http://localhost:8000/management/get_tipoavaliacao/'; 
  constructor(private http: HttpClient) { }

  getTipoavaliacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
