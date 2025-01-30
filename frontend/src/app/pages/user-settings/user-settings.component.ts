import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-settings',
  standalone: false,
  
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent {
  userId: number | null = null;
  userData: any = {
    name: '',
    lastName: '',
    username: '',
    gender: '',
    email: '',
    password: '',
    description: '',
    profileImage: ''
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
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
        this.userData = data;
      },
      (error) => console.error('❌ Error al cargar usuario:', error)
    );
  }

  saveChanges(): void {
    this.userService.updateUser(this.userId!, this.userData).subscribe(
      () => alert('✅ Datos actualizados con éxito.'),
      (error) => console.error('❌ Error al actualizar:', error)
    );
  }

  updatePassword(): void {
    if (!this.userData.password) {
      alert('⚠ Debes ingresar una nueva contraseña.');
      return;
    }
    this.userService.updateUser(this.userId!, { password: this.userData.password }).subscribe(
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
  uploadImage(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
  
    if (!file) {
      alert('⚠ No se seleccionó ninguna imagen.');
      return;
    }
  
    const formData = new FormData();
    formData.append('profileImage', file);
  
    this.userService.uploadProfileImage(this.userId!, formData).subscribe(
      (response) => {
        alert('✅ Imagen actualizada con éxito.');
        this.userData.profileImage = response.imageUrl; // Actualizar la imagen en la UI
      },
      (error) => {
        console.error('❌ Error al subir imagen:', error);
        alert('Hubo un error al subir la imagen.');
      }
    );
  }
  
}
