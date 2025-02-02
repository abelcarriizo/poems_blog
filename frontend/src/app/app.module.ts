import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomePrivateComponent } from './pages/home-private/home-private.component';
import { HomePublicComponent } from './pages/home-public/home-public.component';
import { PoemsListComponent } from './components/poems-list/poems-list.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PoemDetailComponent } from './pages/poem-detail/poem-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RateComponent } from './pages/rate/rate.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthInterceptor } from './interceptors/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreatePoemComponent } from './pages/create-poem/create-poem.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminPoemsComponent } from './pages/admin-poems/admin-poems.component';
import { AdminRatingsComponent } from './pages/admin-ratings/admin-ratings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomePrivateComponent,
    HomePublicComponent,
    PoemsListComponent,
    HomeComponent,
    LoginComponent,
    PoemDetailComponent,
    DashboardComponent,
    ProfileComponent,
    RateComponent,
    NotFoundComponent,
    SidebarComponent,
    CreatePoemComponent,
    UserSettingsComponent,
    AdminUsersComponent,
    AdminPoemsComponent,
    AdminRatingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
