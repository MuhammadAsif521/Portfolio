import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://your-backend-url.com/send-email'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  sendEmail(emailData: EmailData): Observable<any> {
    return this.http.post(this.apiUrl, emailData);
  }
}