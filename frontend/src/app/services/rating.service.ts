import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private baseUrl = 'http://localhost:5000/ratings';
  private apiUrl = 'http://localhost:5000/rating';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getRatings(params: { page: number; per_page: number; sort?: string }) {
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }
  

  getRatingsByPoemId(poemId: number, page: number = 1): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get(`${this.baseUrl}?page=${page}&poem_id=${poemId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error obteniendo ratings:', error);
        return throwError(() => new Error('No se pudieron cargar las calificaciones.'));
      })
    );
  }

  createRating(poemId: number, userId: number, stars: number, comment: string): Observable<any> {
    const body = { poem_id: poemId, author_id: userId, stars, comment };

    return this.http.post(this.baseUrl, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      catchError(error => {
        console.error('Error al crear el rating:', error);
        return throwError(() => new Error('No se pudo enviar la calificación.'));
      })
    );
  }

  updateRating(ratingId: number, ratingData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return this.http.put(`${this.baseUrl}/${ratingId}`, ratingData, { headers }).pipe(
      catchError(error => {
        console.error('Error actualizando rating:', error);
        return throwError(() => new Error('No se pudo actualizar la calificación.'));
      })
    );
  }
  
  getRatingsByUserId(userId: number, page: number = 1): Observable<any[]> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return this.http.get(`${this.baseUrl}?page=${page}&user_id=${userId}`, { headers }).pipe(
      map((response: any) => response.items || []),
      catchError(error => {
        console.error('Error obteniendo ratings:', error);
        return throwError(() => new Error('No se pudieron cargar las calificaciones.'));
      })
    );
  }
  
  deleteRating(ratingId: number): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return this.http.delete(`${this.apiUrl}/${ratingId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error eliminando rating:', error);
        return throwError(() => new Error('No se pudo eliminar la calificación.'));
      })
    );
  }
  
}
