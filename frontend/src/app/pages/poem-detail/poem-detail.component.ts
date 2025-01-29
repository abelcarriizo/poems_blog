import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoemsService } from '../../services/poems.service';
import { RatingsService } from '../../services/rating.service';

@Component({
  selector: 'app-poem-detail',
  standalone: false,
  templateUrl: './poem-detail.component.html',
  styleUrls: ['./poem-detail.component.css']
})
export class PoemDetailComponent implements OnInit {
  poem: any = null; // Almacena los detalles del poema
  ratings: any[] = []; // Almacena los ratings asociados al poema

  constructor(
    private route: ActivatedRoute,
    private poemsService: PoemsService,
    private ratingsService: RatingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del poema desde la URL
    const poemId = this.route.snapshot.paramMap.get('id');
    if (poemId) {
      this.loadPoemDetails(+poemId); // Convertir el ID a número y cargar detalles
      this.loadPoemRatings(+poemId); // Cargar los ratings del poema
    }
  }
  goToRate(): void {
    if (this.poem && this.poem.id) {
      this.router.navigate(['/rate', this.poem.id]); // Redirige a la ruta correcta
    } else {
      console.error('Error: No se pudo obtener el ID del poema.');
    }
  }
  
  loadPoemDetails(id: number): void {
    // Llamar al servicio para obtener los detalles del poema
    this.poemsService.getPoemById(id).subscribe(
      (poem) => {
        this.poem = poem; // Almacenar los detalles en la variable
      },
      (error) => {
        console.error('Error al cargar el poema:', error);
      }
    );
  }

  loadPoemRatings(id: number): void {
    // Llamar al servicio para obtener los ratings asociados al poema
    this.ratingsService.getRatingsByPoemId(id).subscribe(
      (response) => {
        this.ratings = response.items; // Almacenar los ratings
      },
      (error) => {
        console.error('Error al cargar los ratings:', error);
      }
    );
  }
}
