import { Component } from '@angular/core';
import { PoemsService } from '../../services/poems.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-poem',
  standalone: false,
  
  templateUrl: './create-poem.component.html',
  styleUrl: './create-poem.component.css'
})
export class CreatePoemComponent {
  title: string = '';
  genre: string = '';
  description: string = '';
  content: string = '';
  userId: number | null = null;

  constructor(
    private poemsService: PoemsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      alert('Debes iniciar sesión para crear un poema.');
      this.router.navigate(['/login']);
    }
  }

  savePoem(): void {
    if (!this.title || !this.genre || !this.description || !this.content) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const poemData = {
      title: this.title,
      genre: this.genre,
      description: this.description,
      content: this.content,
      author_id: this.userId
    };

    this.poemsService.createPoem(poemData).subscribe(
      () => {
        alert('Poema guardado con éxito');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error al guardar el poema:', error);
        alert('Hubo un error al guardar tu poema.');
      }
    );
  }
}
