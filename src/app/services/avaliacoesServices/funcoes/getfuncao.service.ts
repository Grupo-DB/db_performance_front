import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetFuncaoService {
  private apiUrl = 'http://localhost:8000/management/get_funcao/'; 
  constructor(private http: HttpClient) { }

  getFuncaos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}