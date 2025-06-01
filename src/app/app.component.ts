import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PresentationModule } from "./presentation/presentation.module";
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PresentationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'quali-acad-front';
  sidebarVisible = false;
  navbarVisible = false;
  // toggleDisplay() {
  //   this.sidebarVisible = !this.sidebarVisible; // Alterna a visibilidade da sidebar
  // }
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  toggleDisplay() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarClosed() {
    this.sidebarVisible = false; // Define a variável como false quando a sidebar é fechada
  }
}
