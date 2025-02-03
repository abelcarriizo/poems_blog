import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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

  selectedFile: File | null = null;
  userImageUrl: string = 'static/uploads/default-profile.png'; // Imagen por defecto

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef // ⬅️ Importamos ChangeDetectorRef para manejar cambios en la UI
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadUserData();
    } else {
      alert('Debes iniciar sesión para acceder a la configuración.');
      this.router.navigate(['/login']);
    }
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId!).subscribe(
      (data) => {
        this.user= data;
        this.updateUserImage(); // ⬅️ Asegurar que la imagen se actualiza correctamente
      },
      (error) => console.error('❌ Error al cargar usuario:', error)
    );
  }

  saveUserInfo(): void {
    this.userService.updateUser(this.userId!, this.user).subscribe(
      () => alert('✅ Datos actualizados con éxito.'),
      (error) => console.error('❌ Error al actualizar:', error)
    );
  }

  saveDescription(): void {
    this.userService.updateUser(this.userId!, { descripcion: this.user.descripcion }).subscribe(
      () => alert('✅ Descripción guardada.'),
      (error) => console.error('❌ Error al actualizar la descripción:', error)
    );
  }

  updatePassword(): void {
    if (!this.user.password) {
      alert('⚠ Debes ingresar una nueva contraseña.');
      return;
    }
    this.userService.updateUser(this.userId!, { password: this.user.password }).subscribe(
      () => alert('✅ Contraseña actualizada.'),
      (error) => console.error('❌ Error al actualizar contraseña:', error)
    );
  }

  deleteUser(): void {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.')) {
      this.userService.deleteUser(this.userId!).subscribe(
        () => {
          alert('❌ Cuenta eliminada.');
          this.authService.logout();
          this.router.navigate(['/home']);
        },
        (error) => console.error('❌ Error al eliminar usuario:', error)
      );
    }
  }

  // ⬇⬇⬇ FUNCIONES PARA SUBIR Y MOSTRAR IMAGEN ⬇⬇⬇

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  uploadImage(): void {
    if (!this.selectedFile) {
      alert("⚠ Por favor selecciona un archivo.");
      return;
    }
  
    const userId = this.authService.getUserId();
    if (!userId) {
      alert("⚠ Error: No se encontró el ID del usuario.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.userService.uploadUserImage(userId, formData).subscribe(
      (response) => {
        alert("✅ Imagen subida correctamente.");
        
        // 📌 Actualizamos `image_url` con el valor devuelto por Flask
        this.user.image_url = response.image_url;
        console.log("📸 Nueva URL de la imagen:", this.user.image_url);  // 🔥 Depuración
  
        this.updateUserImage();  // 🔥 Llamamos a la función para actualizar la UI
      },
      (error) => console.error("❌ Error subiendo la imagen:", error)
    );
  }
  updateUserImage(): void {
    console.log("🔎 URL antes de actualizar:", this.user.image_url);
  
    if (this.user.image_url) {
      // 🔹 Asegurarse de que la URL no está mal formateada
      if (this.user.image_url.startsWith("http")) {
        this.userImageUrl = `${this.user.image_url}?t=${new Date().getTime()}`;
      } else {
        this.userImageUrl = `http://localhost:5000${this.user.image_url}?t=${new Date().getTime()}`;
      }
    } else {
      this.userImageUrl = 'http://localhost:5000/static/uploads/default-avatar.jpg';
    }
  
    console.log("🔄 URL final de la imagen en Angular:", this.userImageUrl);
    this.cdRef.detectChanges();
  }
  
  
  
  
  getUserImage(): string {
    return this.userImageUrl;
  }
}
