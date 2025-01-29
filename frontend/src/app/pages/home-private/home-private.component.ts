import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PoemsService } from '../../services/poems.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-private',
  standalone: false,
  
  templateUrl: './home-private.component.html',
  styleUrl: './home-private.component.css'
})
export class HomePrivateComponent {
  username: string | null = null; // Nombre del usuario
  userId: number | null = null; // ID del usuario actual
  poems: any[] = []; // Lista de poemas original
  filteredPoems: any[] = []; // Lista de poemas filtrada para búsqueda

  constructor(private authService: AuthService, private poemsService: PoemsService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Obtiene el nombre de usuario desde el token
    this.userId = this.authService.getUserId(); // Obtiene el ID del usuario
    this.loadPoems();
  }

  goToDetail(poemId: number): void {
    this.router.navigate(['/poems', poemId]); // Redirige al detalle del poema con el id
  }

  goToProfile(): void {
    if (this.userId !== null) {
      this.router.navigate(['/profile', this.userId]); // Redirige al perfil del usuario con su ID
    } else {
      console.error('No se encontró un ID de usuario.');
    }
  }

  loadPoems(): void {
    this.poemsService.getPoems({ page: 1, per_page: 12 }).subscribe(
      (response) => {
        this.poems = response.items; // Lista original de poemas
        this.filteredPoems = this.poems; // Inicializamos la lista filtrada
      },
      (error) => {
        console.error('Error al cargar los poemas:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPoems = this.poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(query) ||
        poem.description.toLowerCase().includes(query)
    );
  }

  logout(): void {
    this.authService.logout();
    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '/login';
  }
}
