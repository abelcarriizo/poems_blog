import { Component, OnInit } from '@angular/core';
import { PoemsService } from '../../services/poems.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-poems',
  standalone: false,
  templateUrl: './admin-poems.component.html',
  styleUrl: './admin-poems.component.css'
})
export class AdminPoemsComponent implements OnInit {
  poems: any[] = [];
  filteredPoems: any[] = [];
  selectedPoem: any = { id: null, title: '', description: '' };
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  modalInstance: any = null;

  constructor(
    private poemsService: PoemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPoems();
  }

  loadPoems(): void {
    const params = { 
      page: this.currentPage,
      per_page: this.itemsPerPage,
      sort: 'date_created'
    };

    this.poemsService.getPoems(params).subscribe(
      (response) => {
        console.log(' Respuesta de la API:', response);

        if (response && response.items) {
          this.poems = response.items;
          this.filteredPoems = [...this.poems]; 
          this.totalPages = response.pages || 1;
          console.log(' Lista de poemas:', this.poems);
        } else {
          console.error('⚠ Respuesta inesperada:', response);
          this.poems = [];
          this.filteredPoems = [];
        }
      },
      (error) => console.error(' Error al obtener los poemas:', error)
    );
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPoems = this.poems.filter(poem =>
      poem.title.toLowerCase().includes(query) || poem.description.toLowerCase().includes(query)
    );
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPoems();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPoems();
    }
  }

  // Abrir modal de edición
  openEditPoemModal(poem: any) {
    this.selectedPoem = { ...poem };
    const modalElement = document.getElementById('editPoemModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Guardar cambios en un poema
  updatePoem() {
    this.poemsService.updatePoem(this.selectedPoem.id, {
      title: this.selectedPoem.title,
      description: this.selectedPoem.description
    }).subscribe(() => {
      this.loadPoems();
      const modalElement = document.getElementById('editPoemModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }
    });
  }

  // Confirmar eliminación de un poema
  confirmDeletePoem(poemId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este poema?')) {
      this.deletePoem(poemId);
    }
  }

  // Eliminar un poema
  deletePoem(poemId: number) {
    this.poemsService.deletePoem(poemId).subscribe(
      () => {
        this.poems = this.poems.filter(poem => poem.id !== poemId);
        this.filteredPoems = this.filteredPoems.filter(poem => poem.id !== poemId);
        console.log(' Poema eliminado');
      },
      (error) => console.error(' Error al eliminar el poema:', error)
    );
  }  
  //Abre el modal con Bootstrap
  openModal(): void {
    const modalElement = document.getElementById('poemDetailModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }
  
  //Cierra el modal
  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

}