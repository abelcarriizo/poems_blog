import { Component, OnInit } from '@angular/core';
import { RatingsService } from '../../services/rating.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin-ratings',
  standalone: false,
  templateUrl: './admin-ratings.component.html',
  styleUrls: ['./admin-ratings.component.css']
})
export class AdminRatingsComponent implements OnInit {
  ratings: any[] = [];
  filteredRatings: any[] = [];
  selectedRating: any = { id: null, stars: 1, comment: '' };
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  modalInstance: any = null;
  constructor(
    private ratingsService: RatingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    const params = { 
      page: this.currentPage,
      per_page: this.itemsPerPage,
      sort: 'date_created'
    };

    this.ratingsService.getRatings(params).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);

        if (response && response.items) {
          this.ratings = response.items;
          this.filteredRatings = [...this.ratings];  
          console.log('Ratings cargados:', this.ratings);
        } else {
          console.error('⚠ Respuesta inesperada:', response);
          this.ratings = [];
          this.filteredRatings = [];
        }
      },
      (error) => console.error('Error al obtener los ratings:', error)
    );
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredRatings = this.ratings.filter(rating =>
      rating.comment.toLowerCase().includes(query)
    );
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRatings();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRatings();
    }
  }

  openEditRatingModal(rating: any) {
    this.selectedRating = { ...rating };
    const modal = new bootstrap.Modal(document.getElementById('editRatingModal')!);
    modal.show();
  }

  updateRating() {
    this.ratingsService.updateRating(this.selectedRating.id, this.selectedRating).subscribe(() => {
      this.loadRatings();
      const modal = bootstrap.Modal.getInstance(document.getElementById('editRatingModal')!);
      modal?.hide();
    });
  }

  confirmDeleteRating(ratingId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este rating?')) {
      this.deleteRating(ratingId);
    }
  }

  deleteRating(ratingId: number) {
    this.ratingsService.deleteRating(ratingId).subscribe(
      () => {
        this.ratings = this.ratings.filter(rating => rating.id !== ratingId);
        this.filteredRatings = this.filteredRatings.filter(rating => rating.id !== ratingId);
        console.log('Rating eliminado');
      },
      (error) => console.error('Error al eliminar el rating:', error)
    );
  }
    //Abre el modal con los detalles del rating
    viewRatingDetail(ratingId: number): void {
      console.log(`Cargando detalles del rating con ID: ${ratingId}`);
      this.ratingsService.getRatingsByPoemId(ratingId).subscribe(
        (rating) => {
          this.selectedRating = rating.items ? rating.items[0] : rating; 
          this.openModal('ratingDetailModal');
        },
        (error) => console.error('Error al obtener detalles del rating:', error)
      );
    }
  
    //Abre el modal con Bootstrap
    openModal(modalId: string): void {
      const modalElement = document.getElementById(modalId);
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
