import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-poem-detail',
  standalone: false,
  templateUrl: './poem-detail.component.html',
  styleUrls: ['./poem-detail.component.css']
})
export class PoemDetailComponent implements OnInit {
  poem: any = null; // Almacena los detalles del poema
  ratings: any[] = []; // Almacena los ratings asociados al poema
  hoverRating: number = 0; 
  averageRating: number = 0; 
  isAdmin: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private poemsService: PoemsService,
    private ratingsService: RatingsService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const poemId = this.route.snapshot.paramMap.get('id');
    if (poemId) {
      this.loadPoemDetails(+poemId); 
      this.loadPoemRatings(+poemId); 
    }
  }

  goToRate(): void {
    if (this.poem && this.poem.id) {
      this.router.navigate(['/rate', this.poem.id]); 
    } else {
      console.error('Error: No se pudo obtener el ID del poema.');
    }
  }
  
  loadPoemDetails(id: number): void {
    this.poemsService.getPoemById(id).subscribe(
      (poem) => {
        this.poem = poem;
      },
      (error) => {
        console.error('Error al cargar el poema:', error);
      }
    );
  }

  calculateAverageRating(): void {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.ratings.reduce((total, rating) => total + rating.stars, 0);
    this.averageRating = parseFloat((sum / this.ratings.length).toFixed(2));
  }

  loadPoemRatings(id: number): void {
    this.ratingsService.getRatingsByPoemId(id).subscribe(
      (response) => {
        this.ratings = response.items;
      },
      (error) => {
        console.error('Error al cargar los ratings:', error);
      }
    );
  }
}