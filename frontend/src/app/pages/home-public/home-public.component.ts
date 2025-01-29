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

  loadPoems(): void {
    this.poemsService.getPoems({ page: 1, per_page: 12 }).subscribe(
      (response) => {
        this.poems = response.items; // Almacena los poemas en la lista
      },
      (error) => {
        console.error('Error al cargar los poemas:', error);
      }
    );
  }

}
