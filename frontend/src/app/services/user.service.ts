import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private url = 'http://localhost:5000/user';

  constructor(private http: HttpClient, private authservice: AuthService) {}
   // Obtener usuarios con paginación
   getUsers(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  uploadUserImage(userId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/upload-image`, formData);
  }

}
