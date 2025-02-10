import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectedUser: any = {}; 
  poems: any[] = [];
  filteredPoems: any[] = [];
  ratings: any[] = [];
  filteredRatings: any[] = [];
  viewing: string = 'poems';
  selectedPoem: any = { id: null, title: '', description: '' };
  selectedRating: any = { id: null, stars: 1, comment: '' };
  poemToDelete: number | null = null;
  ratingToDelete: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private poemsService: PoemsService,
    private ratingsService: RatingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      
      if (userId) {
        console.log(`Cargando perfil del usuario con ID: ${userId}`);
        this.getUserProfileById(Number(userId));
      } else {
        console.log("Cargando perfil del usuario logueado.");
        this.getLoggedUserProfile();
      }
    });
  }

  getLoggedUserProfile(): void {
    this.authService.getUserData().subscribe(
      (data) => {
        console.log("Usuario logueado:", data);
        this.selectedUser = { ...data };
        this.loadUserPoems();
        this.loadUserRatings();
      },
      (error) => console.error('Error obteniendo datos del usuario logueado:', error)
    );
  }

  getUserProfileById(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (data) => {
        console.log("Usuario seleccionado:", data);
        this.selectedUser = { ...data };
        this.loadUserPoems();
        this.loadUserRatings();
      },
      (error) => console.error('Error obteniendo datos del usuario seleccionado:', error)
    );
  }

  loadUserPoems(): void {
    if (!this.selectedUser.id) return;

    this.poemsService.getPoemsbyUser(this.selectedUser.id).subscribe(
      (response) => {
        this.poems = response.items;
        this.filteredPoems = [...this.poems];
      },
      (error) => console.error('Error obteniendo los poemas:', error)
    );
  }

  loadUserRatings(): void {
    if (!this.selectedUser.id) return;

    this.ratingsService.getRatingsByUserId(this.selectedUser.id).subscribe(
      (data) => {
        this.ratings = Array.isArray(data) ? data : [];
        this.filteredRatings = [...this.ratings];
      },
      (error) => console.error('Error obteniendo ratings:', error)
    );
  }

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

  viewPoems(): void {
    this.viewing = 'poems';
  }

  viewRatings(): void {
    this.viewing = 'ratings';
  }

  openEditPoemModal(poem: any): void {
    this.selectedPoem = { ...poem };
    const modal = new bootstrap.Modal(document.getElementById('editPoemModal')!);
    modal.show();
  }

  openEditRatingModal(rating: any): void {
    this.selectedRating = { ...rating };
    const modal = new bootstrap.Modal(document.getElementById('editRatingModal')!);
    modal.show();
  }

  updatePoem(): void {
    this.poemsService.updatePoem(this.selectedPoem.id, this.selectedPoem).subscribe(() => {
      alert("✅ Poema actualizado correctamente");
      this.loadUserPoems();
      this.closeModal('editPoemModal');
    });
  }

  updateRating(): void {
    this.ratingsService.updateRating(this.selectedRating.id, this.selectedRating).subscribe(() => {
      alert("✅ Rating actualizado correctamente");
      this.loadUserRatings();
      this.closeModal('editRatingModal');
    });
  }

  confirmDeletePoem(poemId: number): void {
    this.poemToDelete = poemId;
    if (confirm("¿Estás seguro de que quieres eliminar este poema?")) {
      this.deletePoem();
    }
  }

  deletePoem(): void {
    if (this.poemToDelete !== null) {
      this.poemsService.deletePoem(this.poemToDelete).subscribe(() => {
        this.poems = this.poems.filter(poem => poem.id !== this.poemToDelete);
        alert("🗑 Poema eliminado correctamente");
        this.poemToDelete = null;
      });
    }
  }

  confirmDeleteRating(ratingId: number): void {
    this.ratingToDelete = ratingId;
    if (confirm("¿Estás seguro de que quieres eliminar este rating?")) {
      this.deleteRating();
    }
  }

  deleteRating(): void {
    if (this.ratingToDelete !== null) {
      this.ratingsService.deleteRating(this.ratingToDelete).subscribe(() => {
        this.ratings = this.ratings.filter(rating => rating.id !== this.ratingToDelete);
        alert("🗑 Rating eliminado correctamente");
        this.ratingToDelete = null;
      });
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  getUserImage(): string {
    return this.selectedUser?.image_url ? `http://localhost:5000${this.selectedUser.image_url}` : 'assets/default-profile.png';
  }
}
