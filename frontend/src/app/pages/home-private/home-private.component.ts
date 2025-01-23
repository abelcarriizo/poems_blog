import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-private',
  standalone: false,
  
  templateUrl: './home-private.component.html',
  styleUrl: './home-private.component.css'
})
export class HomePrivateComponent {
 userId: number | null = null;
  username: string = 'Usuario';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUsername() || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
  }
}
