import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetFilialService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_filial/'; 
  constructor(private http: HttpClient) { }

  getFiliais(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}