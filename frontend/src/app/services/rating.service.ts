import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingsService {
  private baseUrl = 'http://localhost:5000/ratings';

  constructor(private http: HttpClient) {}

  getRatingsByPoemId(poemId: number, page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&poem_id=${poemId}`);
  }
}
