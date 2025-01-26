import { Component, OnInit } from '@angular/core';
import { PoemsService } from '../../services/poems.service';

@Component({
  selector: 'app-home-public',
  standalone: false,
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.css']
})
export class HomePublicComponent implements OnInit {
  poems: any[] = []; // Lista de poemas

  constructor(private poemsService: PoemsService) {}

  ngOnInit(): void {
    this.loadPoems();
  }

  loadPoems(): void {
    this.poemsService.getPoems({ page: 1, per_page: 12 }).subscribe(
      (response) => {
        this.poems = response.items; // Almacena los poemas en la lista
      },
      (error) => {
        console.error('Error al cargar los poemas:', error);
      }
    );
  }

}
