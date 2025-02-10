import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; 
  private tokenKey = 'token'; 
  private url = 'http://localhost:5000/user'; 
  private jwtHelper = new JwtHelperService(); 

  constructor(private http: HttpClient) {}


  isLoggedIn(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getUserId(): number | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Token decodificado:', decodedToken); // 🔍 Verificación
      return decodedToken?.id ? Number(decodedToken.id) : null;
    }
    return null;
  }
  
  getUsername(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.username || null; 
    }
    return null;
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('userId');
  }


  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/admin`, credentials).pipe(
      catchError(error => {
        console.error(" Error en la solicitud de adminLogin:", error);
        return throwError(() => new Error("Error en la autenticación del administrador"));
      })
    );
  }
  

  saveToken(token: string): void {
    console.log("Guardando token en sessionStorage:", token);
    sessionStorage.setItem(this.tokenKey, token);
  
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("Token decodificado:", decodedToken);
  
      const userId = decodedToken?.id || decodedToken?.sub;
      if (userId) {
        sessionStorage.setItem('userId', userId.toString());
        console.log("userId almacenado:", userId);
      } else {
        console.error('Error: userId no encontrado en el token');
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }
  
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUserData(): Observable<any> {
    const userId = this.getUserId();
    const token = sessionStorage.getItem('token'); 
  
    if (!token) {
      console.error('❌ No hay token disponible');
      return throwError(() => new Error('No hay token disponible.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get(`${this.url}/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('❌ Error obteniendo datos del usuario:', error);
        return throwError(() => new Error('No se pudo obtener la información del usuario.'));
      })
    );
  }
  
  uploadProfileImage(userId: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    return this.http.post<any>(`${this.baseUrl}/${userId}/upload-image`, formData);
  }
  
}
