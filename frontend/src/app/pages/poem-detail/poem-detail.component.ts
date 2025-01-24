import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoemsService } from '../../services/poems.service';

@Component({
  selector: 'app-poem-detail',
  standalone: false,
  
  templateUrl: './poem-detail.component.html',
  styleUrls: ['./poem-detail.component.css']
})
export class PoemDetailComponent implements OnInit {
  poem: any;

  constructor(
    private route: ActivatedRoute,
    private poemsService: PoemsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadPoem(id);
    } else {
      console.error('El ID del poema no es válido.');
    }
  }

  loadPoem(id: number): void {
    this.poemsService.getPoemById(id).subscribe(
      (response) => {
        this.poem = response;
      },
      (error) => {
        console.error('Error al cargar el poema:', error);
      }
    );
  }
}
