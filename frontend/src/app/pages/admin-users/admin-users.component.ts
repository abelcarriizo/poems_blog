import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  userId: number | null = null;
  user: any = {};
  

  constructor(private userService: UserService,
     private router: Router, 
     private authService:AuthService,
     private route: ActivatedRoute) {}

     ngOnInit(): void {
      this.loadUsers();
    
      const paramUserId = this.route.snapshot.paramMap.get('userId');
    
      if (paramUserId) {
        this.userId = +paramUserId;
      } else {
        this.userId = this.authService.getUserId(); 
      }
    
      console.log(" Usuario seleccionado:", this.userId);
    
      if (this.userId) {
        this.loadUserData();
      }
    }
    

  // Cargar usuarios con paginación
  loadUsers(): void {
    this.userService.getUsers(this.currentPage).subscribe(
      (response) => {
        console.log('Usuarios recibidos:', response);
  
        this.users = response.items || [];  
        this.filteredUsers = this.users;
        
        this.totalPages = response.pages || 1; 
  
        console.log(` Página actual: ${this.currentPage} / ${this.totalPages}`);
  
        if (this.users.length === 0) {
          console.warn("⚠ No se encontraron usuarios en esta página.");
        }
      },
      (error) => console.error(' Error al obtener usuarios:', error)
    );
  }
  
  loadUserData(): void {
    this.userService.getUserById(this.userId!).subscribe(
      (data) => {
        console.log("Datos del usuario cargados:", data);
        this.user = data;
      },
      (error) => console.error(" Error al obtener datos del usuario:", error)
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
    console.log(`🔍 Redirigiendo a /settings/${userId}`);
    this.router.navigate([`/settings/${userId}`]);
    }
    
  
}
