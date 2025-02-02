import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalUsers: number = 0;
  totalPoems: number = 0;
  totalRatings: number = 0;
  totalAdmins: number = 0;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getAdminStats().subscribe(
      (stats) => {
        this.totalUsers = stats.total_users;
        this.totalPoems = stats.total_poems;
        this.totalRatings = stats.total_ratings;
        this.totalAdmins = stats.total_admins;
      },
      (error) => {
        console.error('❌ Error obteniendo estadísticas:', error);
      }
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([`${route}`]);
  }
}


