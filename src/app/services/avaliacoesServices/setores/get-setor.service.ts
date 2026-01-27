import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetSetorService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_setor/'; 
  constructor(private http: HttpClient) { }

  getSetores(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}