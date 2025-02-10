import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rate',
  standalone: false,
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
})
export class RateComponent implements OnInit {
  poem: any = null;
  poemId: number | null = null;
  userComment: string = '';
  rating: number = 5;
  userId: number | null = null;
  hoverRating: number = 0; 
  ratings: any[] = []; // Lista de ratings
  averageRating: number = 0; // Promedio calculado en el frontend

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poemService: PoemsService,
    private ratingsService: RatingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.poemId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      console.error('Usuario no autenticado');
      alert('Debes iniciar sesión para calificar un poema.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.poemId) {
      this.loadPoemDetails(this.poemId);
    } else {
      console.error('Error: ID de poema no encontrado en la URL');
    }
  }
  setRating(star: number): void {
    this.rating = star; // Establece la calificación seleccionada
    console.log(` Rating seleccionado: ${this.rating} estrellas`);
  }

  
  loadPoemDetails(id: number): void {
    this.poemService.getPoemById(id).subscribe(
      (data) => {
        this.poem = data;
      },
      (error) => console.error(' Error al cargar el poema:', error)
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
  saveComment(): void {
    if (!this.poemId || !this.userId) {
      console.error('Error: No se encontró el ID del poema o del usuario.');
      return;
    }

    if (!this.rating || this.rating < 1 || this.rating > 5) {
      console.error('Error: Selecciona una calificación entre 1 y 5.');
      alert('Selecciona una calificación válida (1-5 estrellas).');
      return;
    }

    console.log(`Enviando rating para el poema ${this.poemId} con ${this.rating} estrellas...`);

    this.ratingsService.createRating(this.poemId, this.userId, this.rating, this.userComment).subscribe(
      (response) => {
        console.log('Rating enviado correctamente:', response);
        alert('Tu calificación ha sido enviada.');
        this.router.navigate(['/poems', this.poemId]);
      },
      (error) => {
        console.error('Error al enviar el rating:', error);
        alert('Hubo un error al enviar tu calificación.');
      }
    );
  }
}
