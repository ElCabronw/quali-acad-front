import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() sidebarVisible: boolean = false; // Recebe a visibilidade da sidebar
  @Output() sidebarClosed = new EventEmitter<void>();
  menuItems: MenuItem[] = [
    { icon: 'pi pi-home', label: 'Dados Acadêmicos', url: '/dados-academicos' },
    { icon: 'pi pi-user', label: 'Perfil', url: '/perfil' },
    { icon: 'pi pi-cog', label: 'Configurações', url: '/configuracoes' },
    { icon: 'pi pi-graduation-cap', label: 'Instituições', url: '/instituicoes'},
    { icon: 'pi pi-graduation-cap', label: 'Curso', url: '/cursos'},

  ];
  toggleSidebar() {
    // this.sidebarVisible = !this.sidebarVisible;
    this.sidebarClosed.emit();
  }
  closeSidebar() {
    // Emitir o evento de fechamento
    this.sidebarClosed.emit();
  }
  // closeSidebar() {
  //   this.sidebarVisible = false;
  // }
}
