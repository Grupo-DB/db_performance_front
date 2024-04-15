import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAreaService {
  private apiUrl = 'http://localhost:8000/management/get_area/'; 
  constructor(private http: HttpClient) { }

  getAreas(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
