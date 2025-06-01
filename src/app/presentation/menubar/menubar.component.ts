import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent implements OnInit{
  @Output() toggleSidebar = new EventEmitter<void>();
  items: MenuItem[] | undefined;
  sidebarVisible = false;
  navbarVisible = false;
  onToggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.toggleSidebar.emit();
  }
  goToProfile() {
    // Lógica para redirecionar para a página de perfil
    console.log('Redirecting to profile...');
  }

  logout() {
    // Lógica para logout
    console.log('Logging out...');
  }

  goToHome() {
    // Lógica para redirecionar para a home
    console.log('Redirecting to home...');
  }

  goToAbout() {
    // Lógica para redirecionar para a página sobre
    console.log('Redirecting to about...');
  }
  ngOnInit() {
    this.items = [

      {
          label: 'Options',
          items: [
              {
                  label: 'Profile',
                  icon: 'pi pi-user',

              },
              {
                  label: 'Logout',
                  icon: 'pi pi-power-off'
              }
          ]
      }

  ];
  }
}
