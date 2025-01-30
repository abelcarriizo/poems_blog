import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,

  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  poems: any[] = [];
  filteredPoems: any[] = [];
  ratings: any[] = [];
  viewing: string = 'poems';
  userId: number | null = null; 
  selectedPoem: any = { id: null, title: '', description: '' };
  selectedRating: any = { id: null, stars: 1, comment: '' };

  constructor(
    private authService: AuthService,
    private poemsService: PoemsService,
    private ratingsService: RatingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.userId = this.authService.getUserId();
    console.log('🆔 User ID:', this.userId); 
    
    if (this.userId) {
      this.loadUserRatings();  // 🔹 Llamar sin parámetros
    } else {
      console.error('❌ No se encontró el ID del usuario.');
    }
  
  }

  getUserProfile(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserData().subscribe(
      (data) => {
        this.user = data;
        this.loadUserPoems(userId);
        this.loadUserRatings();
      },
      (error) => console.error('❌ Error al obtener datos del usuario:', error)
    );
  }

  loadUserPoems(userId: number): void {
    this.poemsService.getPoemsByUser(userId).subscribe(
      (response) => {
        console.log('📜 Respuesta de la API:', response);
        this.poems = response.items; // 👈 Extrae el array de 'items'
      },
      (error) => {
        console.error('❌ Error obteniendo los poemas:', error);
      }
    );
    
  }    

  loadUserRatings(): void {
    if (!this.userId) {
      console.error('❌ No se encontró el ID del usuario.');
      return;
    }

    this.ratingsService.getRatingsByUserId(this.userId).subscribe(
      (data) => {
        console.log('📊 Ratings recibidos:', data);
        this.ratings = Array.isArray(data) ? data : [];
      },
      (error) => {
        console.error('❌ Error obteniendo ratings:', error);
        this.ratings = [];
      }
    );
  
  }
  
  
  viewPoems() {
    this.viewing = 'poems';
    const userId = this.authService.getUserId();
    if (userId) this.loadUserPoems(userId);
  }

  viewRatings() {
    this.viewing = 'ratings';
    const userId = this.authService.getUserId();
    if (userId) this.loadUserRatings();
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPoems = this.poems.filter(poem =>
      poem.title.toLowerCase().includes(query) || poem.description.toLowerCase().includes(query)
    );
  }

  editPoem(poem: any): void {
    console.log('📝 Editando poema:', poem);
  }

  deletePoem(poemId: number): void {
    this.poemsService.deletePoem(poemId).subscribe(
      () => {
        this.poems = this.poems.filter(poem => poem.id !== poemId);
        this.filteredPoems = this.filteredPoems.filter(poem => poem.id !== poemId);
        console.log('🗑 Poema eliminado');
      },
      (error) => console.error('❌ Error al eliminar el poema:', error)
    );
  }

  editRating(rating: any): void {
    console.log('📝 Editando rating:', rating);
  }

  deleteRating(ratingId: number): void {
    this.ratingsService.deleteRating(ratingId).subscribe(
      () => {
        this.ratings = this.ratings.filter(rating => rating.id !== ratingId);
        console.log('🗑 Rating eliminado');
      },
      (error) => console.error('❌ Error al eliminar el rating:', error)
    );
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
  
}
