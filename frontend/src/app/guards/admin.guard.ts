import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // Verifica que el claim role sea 'admin'
        if (decodedToken && decodedToken.role === 'admin') {
          return true;
        } else {
          // Redirige a una ruta de acceso denegado o similar
          this.router.navigate(['/**']);
          return false;
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
        this.router.navigate(['/**']);
        return false;
      }
    } else {
      // Si no hay token, redirige al login u otra página
      this.router.navigate(['/login']);
      return false;
    }
  }
}
