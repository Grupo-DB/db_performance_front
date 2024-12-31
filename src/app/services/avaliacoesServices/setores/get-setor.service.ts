import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetSetorService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/get_setor/'; 
  constructor(private http: HttpClient) { }

  getSetores(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}