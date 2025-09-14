import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiKey;
  private http = inject(HttpClient)
  
  // ============================
  // Projects 
  // ============================

  getProjects(params?: { page?: number; limit?: number; status?: string; technology?: string }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.baseUrl}/projects`, { params: httpParams });
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects/${id}`);
  }

  // ============================
  // Messages 
  // ============================

  sendMessage(payload: { name: string; email: string; subject?: string; message: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/messages`, payload);
  }
}
