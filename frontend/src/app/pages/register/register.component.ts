import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  navigateToPoems() {
    this.router.navigate(['/homepublic']); 
  }
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]], 
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      gender: ['', [Validators.required]],
      description: ['', [Validators.maxLength(250)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public submit() {
    console.log('Registro iniciado');
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log(formData);

      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Registro exitoso:', response);
          alert('Registro completado. ¡Ahora puedes iniciar sesión!');
        }
      );
    } else {
      alert('Por favor, completa todos los campos obligatorios correctamente.');
    }
  }
}
