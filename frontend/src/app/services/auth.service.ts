import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; // Cambia esto si tu backend tiene otro endpoint base
  private tokenKey = 'token'; // Clave para almacenar el token en localStorage
  private jwtHelper = new JwtHelperService(); // Inicializamos el JwtHelperService

  constructor(private http: HttpClient) {} // Inyectamos HttpClient para manejar solicitudes

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey); // Obtenemos el token del almacenamiento
    return !!token && !this.jwtHelper.isTokenExpired(token); // Verificamos si el token existe y no ha expirado
  }

  getUserId(): number | null {
    const token = localStorage.getItem(this.tokenKey); // Obtenemos el token
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decodificamos el token
      return decodedToken?.user_id || null; // Devolvemos el user_id o null si no existe
    }
    return null; // Devolvemos null si no hay token
  }

  getUsername(): string | null {
    const token = localStorage.getItem(this.tokenKey); // Obtenemos el token
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token); // Decodificamos el token
      return decodedToken?.username || null; // Devolvemos el username o null si no existe
    }
    return null; // Devolvemos null si no hay token
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey); // Eliminamos el token del almacenamiento
  }

  register(data: any): Observable<any> {
    // Enviamos los datos al endpoint de registro
    return this.http.post(`${this.baseUrl}/register`, data, {
      headers: { 'Content-Type': 'application/json' }, // Especificamos que enviamos datos en formato JSON
    });
  }
}
