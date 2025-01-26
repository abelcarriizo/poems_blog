import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoemsService {
  private apiUrl = 'http://localhost:5000/poems';
  private Url = 'http://localhost:5000/poem';

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
}
