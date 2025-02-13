import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RatingsService } from '../../services/rating.service';
import { PoemsService } from '../../services/poems.service';

@Component({
  selector: 'app-user-settings',
  standalone: false,
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  userId: number | null = null;
  user: any = {
    name: '',
    lastName: '',
    username: '',
    gender: '',
    email: '',
    password: '',
    description: '',
    image_url: ''
  };
  poems: any[] = [];
  ratings: any[] = [];
  selectedFile: File | null = null;
  userImageUrl: string = 'static/uploads/default-profile.png';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private ratingsService: RatingsService,
    private poemsService: PoemsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    // Intentar obtener el userId de la URL
    const paramUserId = this.router.url.split('/settings/')[1];
  
    if (paramUserId) {
      this.userId = Number(paramUserId);
      console.log(`Usuario seleccionado desde la URL: ${this.userId}`);
    } else {
      this.userId = this.authService.getUserId(); // Si no hay parámetro, usa el usuario logueado
      console.log(`Usando userId del usuario logueado: ${this.userId}`);
    }
  
    if (this.userId) {
      console.log(`Cargando datos para userId: ${this.userId}`);
      this.loadUserData();
    } else {
      console.error('No se encontró userId válido.');
      this.router.navigate(['/login']);
    }
  }
  
  resetUserData(): void {
    this.user = {}; 
    this.poems = [];
    this.ratings = [];
    this.selectedFile = null;
    this.userImageUrl = 'static/uploads/default-profile.png';
    this.cdRef.detectChanges(); 
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.userService.getUserById(this.userId).subscribe(
      (data) => {
        this.user = data;
        this.updateUserImage();
        this.loadUserPoems();
        this.loadUserRatings();
      },
      (error) => console.error('Error al cargar usuario:', error)
    );
  }

  loadUserPoems(): void {
    if (!this.userId) {
      console.error("No se encontró el ID del usuario para cargar los poemas.");
      return;
    }
    this.poemsService.getPoemsbyUser(this.userId).subscribe(
      (response) => {
        console.log("Poemas cargados:", response.items);
        this.poems = response.items;
      },
      (error) => console.error('Error obteniendo los poemas:', error)
    );
  }

  loadUserRatings(): void {
    if (!this.userId) {
      console.error(" No se encontró el ID del usuario para cargar los ratings.");
      return;
    }
    this.ratingsService.getRatingsByUserId(this.userId).subscribe(
      (data) => {
        console.log("Ratings cargados:", data);
        this.ratings = Array.isArray(data) ? data : [];
      },
      (error) => console.error('Error obteniendo ratings:', error)
    );
  }

  saveUserInfo(): void {
    this.userService.updateUser(this.userId!, this.user).subscribe(
      () => alert('Datos actualizados con éxito.'),
      (error) => console.error('Error al actualizar:', error)
    );
  }

  saveDescription(): void {
    this.userService.updateUser(this.userId!, { descripcion: this.user.descripcion }).subscribe(
      () => alert('Descripción guardada.'),
      (error) => console.error('Error al actualizar la descripción:', error)
    );
  }

  updatePassword(): void {
    if (!this.user.password) {
      alert('Debes ingresar una nueva contraseña.');
      return;
    }
    this.userService.updateUser(this.userId!, { password: this.user.password }).subscribe(
      () => alert('Contraseña actualizada.'),
      (error) => console.error('Error al actualizar contraseña:', error)
    );
  }

  deleteUser(): void {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userService.deleteUser(this.userId!).subscribe(
        () => {
          alert('Cuenta eliminada.');
          this.authService.logout();
          this.router.navigate(['/home']);
        },
        (error) => console.error(' Error al eliminar usuario:', error)
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      alert("Por favor selecciona un archivo.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.userService.uploadUserImage(this.userId!, formData).subscribe(
      (response) => {
        alert("Imagen subida correctamente.");
        this.user.image_url = response.image_url;
        console.log("Nueva URL de la imagen:", this.user.image_url); 
        this.updateUserImage();  
      },
      (error) => console.error(" Error subiendo la imagen:", error)
    );
  }

  updateUserImage(): void {
    console.log(" URL antes de actualizar:", this.user.image_url);
  
    if (this.user.image_url) {
      if (this.user.image_url.startsWith("http")) {
        this.userImageUrl = `${this.user.image_url}?t=${new Date().getTime()}`;
      } else {
        this.userImageUrl = `http://localhost:5000${this.user.image_url}?t=${new Date().getTime()}`;
      }
    } else {
      this.userImageUrl = 'http://localhost:5000/static/uploads/default-avatar.jpg';
    }
  
    console.log("URL final de la imagen en Angular:", this.userImageUrl);
    this.cdRef.detectChanges();
  }

  getUserImage(): string {
    return this.userImageUrl;
  }
}
