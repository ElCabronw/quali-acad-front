import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HomeComponent } from './home/home.component';
import { MenuItem, MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { NavbarComponent } from './navbar/navbar.component';
import { MenubarComponent } from './menubar/menubar.component';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { RatingModule } from 'primeng/rating';
import { Table } from 'primeng/table';
import { DadosAcademicosComponent } from './dados-academicos/dados-academicos.component';
import { DadosAcademicosRepository } from '../data/repositories/dados-academicos.repository';
import { GetDadosAcademicosUseCase } from '../core/services/dados-academicos.service';
import { LimitTextPipe } from '../limit-text.pipe';
import { DadosAcademicosViewComponent } from './dados-academicos/view/dados-academicos-view/dados-academicos-view.component';
import { ComponentsModule } from './components/components.module';
import { IesRepository } from '../data/repositories/ies.repository';
import { IesService } from '../core/services/ies.service';
import { CursoRepository } from '../data/repositories/curso.repository';
import { CursoService } from '../core/services/curso.service';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InstituicoesComponent } from './instituicoes/instituicoes.component';
import { InstituicoesViewComponent } from './instituicoes/view/instituicoes-view.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CursosComponent } from './cursos/cursos.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dados-academicos',
    component: DadosAcademicosComponent,
  },
  {
    path: 'dados-academicos/view/:id',
    component: DadosAcademicosViewComponent,
  },
  {
    path: 'instituicoes',
    component: InstituicoesComponent,
  },
  {
    path: 'instituicoes/view/:id',
    component: InstituicoesViewComponent,
  },
  {
    path: 'cursos',
    component: CursosComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    InstituicoesViewComponent,
    HomeComponent,
    NavbarComponent,
    MenubarComponent,
    DadosAcademicosComponent,
    DadosAcademicosViewComponent,
    InstituicoesComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    LimitTextPipe,
    FormsModule,
    TabViewModule,
    ChartModule,
    DropdownModule,
    CardModule,
    ToastModule,
    DialogModule,
    ToolbarModule,
    RatingModule,
    AccordionModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), // <- ESSENCIAL!
    }),
    MenuModule,
    BadgeModule,
    MenubarModule,
    SidebarModule,
    SplitButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    PanelMenuModule,
    CommonModule,
    TableModule,
    IconFieldModule,
    ComponentsModule,
    InputIconModule,
    HttpClientModule,
    TagModule,
    LimitTextPipe,
  ],
  exports: [
    InstituicoesViewComponent,
    InstituicoesComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    MenubarComponent,
    DadosAcademicosComponent,
    DadosAcademicosViewComponent,
  ],
  providers: [
    MessageService,
    IesRepository,
    IesService,
    DadosAcademicosRepository,
    GetDadosAcademicosUseCase,
    CursoRepository,
    CursoService,
  ],
})
export class PresentationModule {}
