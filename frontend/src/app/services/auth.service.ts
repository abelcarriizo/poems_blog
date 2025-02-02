import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth'; // URL base para los endpoints del backend
  private tokenKey = 'token'; // Clave para almacenar el token en localStorage
  private url = 'http://localhost:5000/user'; 
  private jwtHelper = new JwtHelperService(); // Instancia para manejar JWT

  constructor(private http: HttpClient) {}

  /**
   * Verifica si el usuario está autenticado.
   * @returns true si el usuario está autenticado y el token no ha expirado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    const token = sessionStorage.getItem(this.tokenKey);
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Obtiene el ID del usuario decodificando el token.
   * @returns El ID del usuario o null si no está disponible.
   */
  getUserId(): number | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Token decodificado:', decodedToken); // 🔍 Verificación
      return decodedToken?.id ? Number(decodedToken.id) : null;
    }
    return null;
  }
  

  /**
   * Obtiene el nombre de usuario decodificando el token.
   * @returns El nombre de usuario o null si no está disponible.
   */
  getUsername(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.username || null; // Cambia "username" según tu token
    }
    return null;
  }

  /**
   * Elimina el token y el ID del usuario del sessionStorage para cerrar sesión.
   */
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('userId');
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
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  /**
   * Realiza el inicio de sesión para administradores.
   * @param credentials Contiene el correo y contraseña del administrador.
   * @returns Observable con la respuesta del servidor.
   */
  adminLogin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/admin`, credentials).pipe(
      catchError(error => {
        console.error("❌ Error en la solicitud de adminLogin:", error);
        return throwError(() => new Error("Error en la autenticación del administrador"));
      })
    );
  }
  

  /**
   * Almacena el token JWT y el ID del usuario en sessionStorage.
   * @param token El token JWT devuelto por el backend.
   */
  saveToken(token: string): void {
    console.log("🔹 Guardando token en sessionStorage:", token);
    sessionStorage.setItem(this.tokenKey, token);
  
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("🔍 Token decodificado:", decodedToken);
  
      const userId = decodedToken?.id || decodedToken?.sub;
      if (userId) {
        sessionStorage.setItem('userId', userId.toString());
        console.log("✅ userId almacenado:", userId);
      } else {
        console.error('❌ Error: userId no encontrado en el token');
      }
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }
  
  
  
  /**
   * Obtiene el token JWT almacenado en sessionStorage.
   * @returns El token JWT o null si no está almacenado.
   */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getUserData(): Observable<any> {
    const userId = this.getUserId();
    const token = sessionStorage.getItem('token');  // 🔹 Obtener el token JWT
  
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
