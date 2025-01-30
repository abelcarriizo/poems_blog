import { Component, OnInit } from '@angular/core';
import { PoemsService } from '../../services/poems.service';

@Component({
  selector: 'app-home-public',
  standalone: false,
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.css']
})
export class HomePublicComponent implements OnInit {
  poems: any[] = []; // Lista de poemas
  filteredPoems: any[] = []; // Lista de poemas filtrada para búsqueda
  currentPage: number = 1; // Página actual
  totalPages: number = 1; // Total de páginas disponibles

  constructor(private poemsService: PoemsService) {}

  ngOnInit(): void {
    this.loadPoems();
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
}
