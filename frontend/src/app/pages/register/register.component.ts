import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstname: [''], // Sin validadores
      lastname: [''],
      username: [''],
      gender: [''],
      description: [''],
      email: [''],
      password: [''],
    });
    
    
  }

  
  public submit() {
    console.log('Registro ');
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log(formData);

      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Registro exitoso:', response);
          alert('Registro completado. ¡Ahora puedes iniciar sesión!');
        },
        (error) => {
          console.error('Error durante el registro:', error);
          alert('Hubo un error al registrarte. Por favor, intenta nuevamente.');
        }
      );
    }else{
      alert('Registro fallido');
    }
  }
}

