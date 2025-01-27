import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/management/get_users/'; 
  private apiUrl2 = 'http://localhost:8000/management/email/'; 
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
  sendEmail(subject: string, recipient_list: string,message: string,): Observable<any> {
    const emailData = { subject, message, recipient_list };
    return this.http.post(this.apiUrl2, emailData);
  }
}
