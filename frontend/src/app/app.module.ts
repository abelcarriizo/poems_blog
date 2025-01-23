import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { HomePrivateComponent } from './pages/home-private/home-private.component';
import { HomePublicComponent } from './pages/home-public/home-public.component';
import { PoemsListComponent } from './components/poems-list/poems-list.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomePrivateComponent,
    HomePublicComponent,
    PoemsListComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
