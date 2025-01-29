import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  navigateToPoems() {
    this.router.navigate(['/homepublic']); 
  }
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access_token);
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']); // Redirigir al home privado
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        alert('Credenciales inválidas.');
      }
    });
  }

  adminLogin() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.access_token);
        alert('Inicio de sesión como administrador exitoso');
        this.router.navigate(['/admin-dashboard']); // Redirigir al dashboard de admin
      },
      error: (err) => {
        console.error('Error al iniciar sesión como administrador:', err);
        alert('Credenciales inválidas.');
      }
    });
  }
}
