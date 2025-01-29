import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoemsService } from '../../services/poems.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rate',
  standalone: false,

  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {
  poem: any = null; // Ahora sí se define poem
  poemId: number | null = null;
  userComment: string = '';
  rating: number = 5; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poemService: PoemsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.poemId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.poemId) {
      this.loadPoemDetails(this.poemId);
    } else {
      console.error('Error: ID de poema no encontrado en la URL');
    }
  }

  loadPoemDetails(id: number): void {
    this.poemService.getPoemById(id).subscribe(
      (data) => {
        this.poem = data;
      },
      (error) => console.error('Error al cargar el poema:', error)
    );
  }

  saveComment(): void {
    if (this.poemId && this.userComment.trim()) {
      const newRating = {
        poem_id: this.poemId,
        stars: this.rating,
        comment: this.userComment
      };
  
      const token = sessionStorage.getItem('token'); // Obtener token del almacenamiento
  
      if (!token) {
        alert('Error: No estás autenticado. Inicia sesión primero.');
        return;
      }
  
      const headers = { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      };
  
      console.log('Enviando comentario con token:', token); // Debug
  
      this.http.post('http://localhost:5000/ratings', newRating, { headers }).subscribe(
        response => {
          console.log('Comentario guardado con éxito:', response);
          this.router.navigate(['/poem', this.poemId]); 
        },
        error => {
          console.error('Error al guardar el comentario:', error);
          alert(`Error al guardar: ${error.statusText}`);
        }
      );
    } else {
      alert('Por favor, escribe un comentario antes de guardar.');
    }
  }}