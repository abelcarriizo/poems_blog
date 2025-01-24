import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; // URL base para los endpoints del backend
  private tokenKey = 'token'; // Clave para almacenar el token en localStorage
  private jwtHelper = new JwtHelperService(); // Instancia para manejar JWT

  constructor(private http: HttpClient) {}

  /**
   * Verifica si el usuario está autenticado.
   * @returns true si el usuario está autenticado y el token no ha expirado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Obtiene el ID del usuario decodificando el token.
   * @returns El ID del usuario o null si no está disponible.
   */
  getUserId(): number | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.user_id || null; // Cambia "user_id" según tu token
    }
    return null;
  }

  /**
   * Obtiene el nombre de usuario decodificando el token.
   * @returns El nombre de usuario o null si no está disponible.
   */
  getUsername(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.username || null; // Cambia "username" según tu token
    }
    return null;
  }

  /**
   * Elimina el token del almacenamiento para cerrar sesión.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Envía datos de registro al backend.
   * @param data Datos del usuario para registrar.
   * @returns Observable con la respuesta del servidor.
   */
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  /**
   * Realiza el inicio de sesión enviando las credenciales al backend.
   * @param credentials Contiene el correo y contraseña del usuario.
   * @returns Observable con la respuesta del servidor.
   */ // Método para login de usuario
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Método para login de administrador
  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/admin`, credentials);
  }

  /**
   * Almacena el token JWT en el almacenamiento local.
   * @param token El token JWT devuelto por el backend.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token JWT almacenado.
   * @returns El token JWT o null si no está almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
