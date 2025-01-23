import { Component, Input } from '@angular/core';
import { PoemsService } from '../../services/poems.service';

@Component({
  selector: 'app-poems-list',
  standalone: false,
  
  templateUrl: './poems-list.component.html',
  styleUrl: './poems-list.component.css'
})
export class PoemsListComponent {
 @Input() userId: number | null = null;
  poems: any[] = [];
  currentPage = 1;
  totalPages = 1;
  filteredPoems: any[] = []; // Poemas filtrados

  constructor(private poemsService: PoemsService) {}

  ngOnInit(): void {
    this.loadPoems();
  }

  loadPoems(): void {
    const params: any = {
      page: this.currentPage,
    };
    if (this.userId) {
      params.user_id = this.userId;
    }

    this.poemsService.getPoems(params).subscribe(
      (data) => {
        this.poems = data.items;
        this.currentPage = data.current_page;
        this.totalPages = data.pages;
      },
      (error) => {
        console.error('Error al cargar los poemas:', error);
      }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPoems();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPoems();
    }
  }
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPoems = this.poems.filter((poem) =>
      poem.title.toLowerCase().includes(query) || // Filtra por título
      poem.description.toLowerCase().includes(query) // Filtra por descripción
    );
  }
}
