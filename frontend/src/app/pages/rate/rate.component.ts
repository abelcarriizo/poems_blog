import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rate',
  standalone: false,
  
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent {
  @Input() poem: any; // El poema a calificar
  userComment: string = ''; // Comentario del usuario

  saveComment() {
    if (this.userComment.trim()) {
      console.log('Comentario guardado:', this.userComment);
      // Lógica para enviar el comentario al backend o actualizar la vista
      alert('Comentario guardado con éxito.');
      this.userComment = ''; // Limpia el campo de texto
    } else {
      alert('Por favor, escribe un comentario.');
    }
  }
}
