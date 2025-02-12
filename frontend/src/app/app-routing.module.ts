import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { HomePrivateComponent } from './pages/home-private/home-private.component';
import { HomePublicComponent } from './pages/home-public/home-public.component';
import { LoginComponent } from './pages/login/login.component';
import { PoemDetailComponent } from './pages/poem-detail/poem-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RateComponent } from './pages/rate/rate.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreatePoemComponent } from './pages/create-poem/create-poem.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminPoemsComponent } from './pages/admin-poems/admin-poems.component';
import { AdminRatingsComponent } from './pages/admin-ratings/admin-ratings.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'create-poem', component: CreatePoemComponent, canActivate:[AuthGuard] },
  { path: 'home', component: HomeComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'homepublic', component: HomePublicComponent },
  { path: 'dashboard', component: HomePrivateComponent, canActivate:[AuthGuard]},
  { path: 'poems/:id', component: PoemDetailComponent, canActivate:[AuthGuard]},
  { path: 'panel', component: DashboardComponent, canActivate:[AuthGuard]},
  { path: 'rate', component: RateComponent, canActivate:[AuthGuard]},
  { path: 'rate/:id', component: RateComponent, canActivate:[AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate:[AuthGuard]},
  { path: 'settings', component: UserSettingsComponent, canActivate:[AuthGuard]},
  { path: 'settings/:id', component: UserSettingsComponent, canActivate:[AuthGuard]},
  { path: 'users', component: AdminUsersComponent, canActivate:[AuthGuard] },
  { path: 'poems-users', component: AdminPoemsComponent, canActivate:[AuthGuard] },
  { path: 'rate-users', component: AdminRatingsComponent, canActivate:[AuthGuard]},
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
