import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  navigateToPoems() {
    this.router.navigate(['/homepublic']); // Cambia 'poems' a la ruta deseada
  }
  register() {
    this.router.navigate(['/register']); // Cambia 'poems' a la ruta deseada
  }
  login() {
    this.router.navigate(['/login']); // Cambia 'poems' a la ruta deseada
  }

}
