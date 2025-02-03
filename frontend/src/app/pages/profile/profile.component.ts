import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  poems: any[] = [];
  filteredPoems: any[] = [];  // Para la búsqueda de poemas
  ratings: any[] = [];
  filteredRatings: any[] = [];  // Para la búsqueda de ratings
  viewing: string = 'poems';
  selectedPoem: any = { id: null, title: '', description: '' };
  selectedRating: any = { id: null, stars: 1, comment: '' };
  poemToDelete: number | null = null;
  ratingToDelete: number | null = null;

  constructor(
    private authService: AuthService,
    private poemsService: PoemsService,
    private ratingsService: RatingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.authService.getUserData().subscribe(
      (data) => {
        this.user = data;
        this.loadUserPoems();
        this.loadUserRatings();
      },
      (error) => console.error('Error obteniendo datos del usuario:', error)
    );
  }
  loadUserPoems(): void {
    this.poemsService.getPoemsbyUser(this.user.id).subscribe(
      (response) => {
        this.poems = response.items;
        this.filteredPoems = this.poems; // Inicializa el filtrado con todos los poemas
      },
      (error) => console.error('Error obteniendo los poemas:', error)
    );
  }

  loadUserRatings(): void {
    this.ratingsService.getRatingsByUserId(this.user.id).subscribe(
      (data) => {
        this.ratings = Array.isArray(data) ? data : [];
        this.filteredRatings = this.ratings; // Inicializa el filtrado con todos los ratings
      },
      (error) => console.error('Error obteniendo ratings:', error)
    );
  }

  /**
   * 🔍 Filtro de búsqueda para poemas y ratings
   */
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.viewing === 'poems') {
      this.filteredPoems = this.poems.filter(poem =>
        poem.title.toLowerCase().includes(query) || poem.description.toLowerCase().includes(query)
      );
    } else {
      this.filteredRatings = this.ratings.filter(rating =>
        rating.comment.toLowerCase().includes(query)
      );
    }
  }

  /**
   * 🔄 Cambia la vista a poemas
   */
  viewPoems(): void {
    this.viewing = 'poems';
    this.filteredPoems = [...this.poems];
  }

  /**
   * 🔄 Cambia la vista a ratings
   */
  viewRatings(): void {
    this.viewing = 'ratings';
    this.filteredRatings = [...this.ratings];
  }

  /**
   * ✏️ Abre el modal de edición de poemas
   */
  openEditPoemModal(poem: any): void {
    this.selectedPoem = { ...poem };
    const modal = new bootstrap.Modal(document.getElementById('editPoemModal')!);
    modal.show();
  }

  /**
   * ✏️ Abre el modal de edición de ratings
   */
  openEditRatingModal(rating: any): void {
    this.selectedRating = { ...rating };
    const modal = new bootstrap.Modal(document.getElementById('editRatingModal')!);
    modal.show();
  }

  /**
   * 💾 Guarda los cambios en el poema editado
   */
  updatePoem(): void {
    this.poemsService.updatePoem(this.selectedPoem.id, this.selectedPoem).subscribe(() => {
      alert("✅ Poema actualizado correctamente");
      this.loadUserPoems();
      this.closeModal('editPoemModal');
    });
  }

  /**
   * 💾 Guarda los cambios en el rating editado
   */
  updateRating(): void {
    this.ratingsService.updateRating(this.selectedRating.id, this.selectedRating).subscribe(() => {
      alert("✅ Rating actualizado correctamente");
      this.loadUserRatings();
      this.closeModal('editRatingModal');
    });
  }

  /**
   * 🗑️ Muestra confirmación antes de eliminar un poema
   */
  confirmDeletePoem(poemId: number): void {
    this.poemToDelete = poemId;
    if (confirm("¿Estás seguro de que quieres eliminar este poema?")) {
      this.deletePoem();
    }
  }

  /**
   * 🗑️ Elimina el poema seleccionado
   */
  deletePoem(): void {
    if (this.poemToDelete !== null) {
      this.poemsService.deletePoem(this.poemToDelete).subscribe(() => {
        this.poems = this.poems.filter(poem => poem.id !== this.poemToDelete);
        alert("🗑 Poema eliminado correctamente");
        this.poemToDelete = null;
      });
    }
  }

  /**
   * 🗑️ Muestra confirmación antes de eliminar un rating
   */
  confirmDeleteRating(ratingId: number): void {
    this.ratingToDelete = ratingId;
    if (confirm("¿Estás seguro de que quieres eliminar este rating?")) {
      this.deleteRating();
    }
  }

  /**
   * 🗑️ Elimina el rating seleccionado
   */
  deleteRating(): void {
    if (this.ratingToDelete !== null) {
      this.ratingsService.deleteRating(this.ratingToDelete).subscribe(() => {
        this.ratings = this.ratings.filter(rating => rating.id !== this.ratingToDelete);
        alert("🗑 Rating eliminado correctamente");
        this.ratingToDelete = null;
      });
    }
  }

  /**
   * ❌ Cierra un modal usando Bootstrap
   */
  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  /**
   * 🖼️ Retorna la imagen del usuario
   */
  getUserImage(): string {
    return this.user?.image_url ? `http://localhost:5000${this.user.image_url}` : 'assets/default-profile.png';
  }
}