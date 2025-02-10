import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar usuarios con paginación
  loadUsers(): void {
    this.userService.getUsers(this.currentPage).subscribe(
      (response) => {
        console.log('👥 Usuarios recibidos:', response);
  
        this.users = response.items || [];  // Asegurar que los datos se carguen bien
        this.filteredUsers = this.users;
        
        this.totalPages = response.pages || 1; // Usar "pages" en vez de "totalPages"
  
        console.log(`📄 Página actual: ${this.currentPage} / ${this.totalPages}`);
  
        if (this.users.length === 0) {
          console.warn("⚠ No se encontraron usuarios en esta página.");
        }
      },
      (error) => console.error('❌ Error al obtener usuarios:', error)
    );
  }
  
  
  

  // Filtrar usuarios en la búsqueda
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(query)
    );
  }

  
  // Cambiar de página
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }
  viewUserProfile(userId: number): void {
    console.log(`🔍 Redirigiendo a /profile/${userId}`);
    this.router.navigate([`/profile/${userId}`]);
  }
  
}
