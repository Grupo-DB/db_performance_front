import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAvaliacaoService {
  private apiUrl = 'http://localhost:8000/management/get_avaliacao/'; 
  constructor(private http: HttpClient) { }

  getAvaliacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
