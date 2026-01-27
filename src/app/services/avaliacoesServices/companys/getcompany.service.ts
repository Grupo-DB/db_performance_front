import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCompanyService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_company/'; 
  constructor(private http: HttpClient) { }

  getCompanys(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}