import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Obtener el token desde sessionStorage
    const authRequired = this.requiresAuth(req.url);

    if (token && authRequired) {
      // Clonar la solicitud y agregar el encabezado Authorization con el token
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    // Si la solicitud no requiere autenticación, continuar sin modificarla
    return next.handle(req);
  }

  /**
   * Determina si la solicitud requiere autenticación o no.
   * @param url La URL de la solicitud
   * @returns true si la solicitud debe incluir el token, false si no lo necesita
   */
  private requiresAuth(url: string): boolean {
    const openEndpoints = [
      '/auth/login',
      '/auth/register',
      '/homepublic'
    ];

    return !openEndpoints.some(endpoint => url.includes(endpoint));
  }
}
