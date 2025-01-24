import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { HomePrivateComponent } from './pages/home-private/home-private.component';
import { AuthGuard } from './guards/auth.guard';
import { HomePublicComponent } from './pages/home-public/home-public.component';
import { LoginComponent } from './pages/login/login.component';
import { PoemDetailComponent } from './pages/poem-detail/poem-detail.component';
import { PoemsListComponent } from './components/poems-list/poems-list.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'homepublic', component: HomePublicComponent },  // Ruta para mostrar poems públicos
  { path: 'dashboard', component: HomePrivateComponent, canActivate: [AuthGuard] },
  { path: '', component: PoemsListComponent },
  { path: 'poems/:id', component: PoemDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
