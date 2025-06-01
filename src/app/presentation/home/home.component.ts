import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/dashboard']
    },
    {
      label: 'Relatórios',
      icon: 'pi pi-fw pi-chart-line',
      items: [
        { label: 'Mensal', icon: 'pi pi-fw pi-calendar', routerLink: ['/relatorios/mensal'] },
        { label: 'Anual', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/relatorios/anual'] }
      ]
    },
    {
      label: 'Configurações',
      icon: 'pi pi-fw pi-cog',
      routerLink: ['/configuracoes']
    }
  ];
}
