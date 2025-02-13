import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiUrl = 'http://localhost:5000'; 

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }

    // Si la petición es protegida y el usuario tiene token
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }

  // Determina si la solicitud es a un endpoint público
  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      `${this.apiUrl}/auth/login`,
      `${this.apiUrl}/auth/register`,
      `${this.apiUrl}/homepublic`,
      `${this.apiUrl}/home`
    ];

    return publicEndpoints.some(endpoint => url.startsWith(endpoint));
  }
}
