import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod';
import { Message, Project } from '../interfaces/core.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiKey;
  private http = inject(HttpClient)
  
  // ============================
  // Projects 
  // ============================

  getProjects(): Observable<{ success: boolean; projects: Project[] }> {
    return this.http.get<{ success: boolean; projects: Project[] }>(
      `${this.baseUrl}/projects`
    );
  }

  getProjectById(id: string): Observable<{ success: boolean; project: Project }> {
    return this.http.get<{ success: boolean; project: Project }>(
      `${this.baseUrl}/projects/${id}`
    );
  }

  // ============================
  // Messages 
  // ============================

  sendMessage(payload : Message): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages`, payload);
  }
}
