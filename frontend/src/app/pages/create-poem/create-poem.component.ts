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
  poem = {
    title: '',
    genre: '',
    description: '',
    content: ''
  };

  message: string = '';
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

  savePoem() {
    if (!this.poem.title || !this.poem.content || !this.poem.genre) {
      alert('⚠️ El título, el contenido y el género son obligatorios.');
      return;
    }

    const poemData = {
      ...this.poem,
      author_id: this.userId // Asegurarse de enviar el autor
    };

    this.poemsService.createPoem(poemData).subscribe({
      next: (response) => {
        console.log('✅ Poema creado:', response);
        alert('✅ Poema creado exitosamente.');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.status === 403) {
          alert('❌ Debes calificar al menos 5 poemas antes de poder crear uno.');
        } else {
          console.error('❌ Error:', error);
          alert(error.message || '❌ No se pudo crear el poema.');
        }
      }
    });
  }
}
