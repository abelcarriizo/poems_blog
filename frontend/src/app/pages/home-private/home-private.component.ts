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
  currentPage: number = 1; // Página actual
  totalPages: number = 1; // Total de páginas disponibles

  constructor(private authService: AuthService, private poemsService: PoemsService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Obtiene el nombre de usuario desde el token
    this.userId = this.authService.getUserId(); // Obtiene el ID del usuario
    this.loadPoems(); // Cargar los poemas
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

  loadPoems(page: number = 1): void {
    console.log(`🚀 Cargando poemas - Página: ${page}`);
  
    this.poemsService.getPoems({ page, per_page: 9 }).subscribe(
      (response) => {
        if (!response || !response.items) {
          console.error("⚠️ Respuesta inválida del servidor:", response);
          return;
        }
  
        console.log(`✅ Poemas cargados: ${response.items.length}, Página: ${page}`);
        this.poems = response.items;
        this.filteredPoems = this.poems;
        this.currentPage = response.current_page;
        this.totalPages = response.pages;
      },
      (error) => {
        console.error("❌ Error al cargar los poemas:", error);
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

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPoems(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.loadPoems(this.currentPage - 1);
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
  }
}
