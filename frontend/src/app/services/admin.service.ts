import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/admin'; // URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtiene las estadísticas generales (Usuarios, Poemas, Ratings, Admins)
   */
  getAdminStats(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.baseUrl}/stats`, { headers });
  }

}
