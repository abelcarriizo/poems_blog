import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corregido: "styleUrls" en plural
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Redirige a la vista pública de poemas
   */
  navigateToPoems() {
    this.router.navigate(['/dashboard']); 
  }

  /**
   * Inicia sesión del usuario normal
   */
  login() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.saveSession(response.access_token);
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']); // Redirigir al home privado
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        alert('Credenciales inválidas.');
      }
    });
  }

  /**
   * Inicia sesión como administrador
   */
  adminLogin() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.saveSession(response.access_token);
          alert('Inicio de sesión como administrador exitoso');
          this.router.navigate(['/admin-dashboard']); // Redirigir al dashboard de admin
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión como administrador:', err);
        alert('Credenciales inválidas.');
      }
    });
  }

  /**
   * Guarda el token y extrae el userId desde el JWT
   */
  private saveSession(token: string) {
    sessionStorage.setItem('token', token);
    const decodedToken = this.jwtHelper.decodeToken(token);
    if (decodedToken?.user_id) {
      sessionStorage.setItem('userId', decodedToken.user_id.toString());
    }
  }
}
