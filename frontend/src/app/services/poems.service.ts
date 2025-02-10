import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoemsService {
  private apiUrl = 'http://localhost:5000/poems';
  private Url = 'http://localhost:5000/poem';
  private baseUrl= 'http://localhost:5000';
  constructor(private http: HttpClient) {}
  getPoemById(id: number): Observable<any> {
    return this.http.get(`${this.Url}/${id}`);
  }
  
  
  getPoems(params: { page?: number; per_page?: number; user_id?: number; sort?: string }): Observable<any> {
    let queryParams = new HttpParams();

    if (params.page) queryParams = queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams = queryParams.set('per_page', params.per_page.toString());
    if (params.user_id) queryParams = queryParams.set('user_id', params.user_id.toString());
    if (params.sort) queryParams = queryParams.set('sort', params.sort);

    return this.http.get<any>(this.apiUrl, { params: queryParams });
  }

  getPoemsbyUser(userId: number, page: number = 1): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const url = `${this.apiUrl}?page=${page}&user_id=${userId}`;

    return this.http.get<any>(url, { headers });
  }
  

  createPoem(poemData: { title: string, description: string, content: string }): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(this.apiUrl, poemData, { headers }).pipe(
      catchError(error => {
        console.error('Error creando poema:', error);
        return throwError(() => new Error('No se pudo crear el poema.'));
      })
    );
  }

  updatePoem(poemId: number, updatedPoem: { title?: string, description?: string, content?: string }): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.put(`${this.Url}/${poemId}`, updatedPoem, { headers }).pipe(
      catchError(error => {
        console.error('Error actualizando el poema:', error);
        return throwError(() => new Error('No se pudo actualizar el poema.'));
      })
    );
  }

  deletePoem(poemId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.delete(`${this.Url}/${poemId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error eliminando el poema:', error);
        return throwError(() => new Error('No se pudo eliminar el poema.'));
      })
    );
  }
}

