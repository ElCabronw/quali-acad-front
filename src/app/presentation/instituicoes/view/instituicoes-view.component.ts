import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IesService } from '../../../core/services/ies.service';
import { DadosAcademicosChart } from '../../../core/models/dados-academicos.model';
import { GetDadosAcademicosUseCase } from '../../../core/services/dados-academicos.service';

@Component({
  selector: 'app-instituicoes-view',
  templateUrl: './instituicoes-view.component.html',
  styleUrl: './instituicoes-view.component.scss'
})
export class InstituicoesViewComponent implements OnInit {
  public instituicaoId: number = 0;
  public instituicaoData: any;
  cursosByIes: any[] = [];
  estreladosChart: any;
  coursesByStar: any[] = [];
  showCoursesByStarModal = false;
  chartBarStarsData: any;
  chartBarOptions: any;
  chartData = {} as DadosAcademicosChart;
  estreladosChartOptions: any;
  constructor(private activatedRoute: ActivatedRoute, public iesService: IesService,private getDadosAcademicosUseCase: GetDadosAcademicosUseCase) {
  }
  async ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.instituicaoId = +params['id'];
      console.log('ID:', this.instituicaoId);
    });
    this.iesService.getIesById(this.instituicaoId).then((data) => {
      this.instituicaoData = data
    });

    this.cursosByIes = await this.iesService.getCursosByIes(this.instituicaoId);
    let payload = {
      ies: this.instituicaoData.ies,
      curso: '-1',
      modalidade: '-1',
      verbete: '-1',
      titulacao: '-1',
      avaliacao:-1,
      anoAvaliacao: -1,
      isAnima: false
    };
    this.chartData = await this.getDadosAcademicosUseCase.getDadosAcademicosChartView(payload);
    this._buildSummaryPieChart();
    this._buildBarChartStars();
  }
  private _buildSummaryPieChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.estreladosChartOptions = {
      plugins: {
        legend: {
          labels: {
            font: { family: 'Poppins', weight: '500' },
          },

          position: 'top',
        },
      },
      cutout: '50%',
      responsive: true,
      maintainAspectRatio: false,
    };
    this.estreladosChart= {
      labels: ['Avaliados', 'Não Avaliados'],
      datasets: [
        {
          data: [this.chartData.countEstrelados, this.chartData.countNaoEstrelados],
          backgroundColor: [documentStyle.getPropertyValue('--primary-color'), documentStyle.getPropertyValue('--red-400')],
        },
      ],

    }
   }
   private _buildBarChartStars(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      onClick: (event: any, elements: any[]) => this.handleChartStartsClick(event, elements),
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }

      }
  };

    this.chartBarStarsData= {
      labels: ['Nao avaliados', '3 Estrelas', '4 Estrelas', '5 Estrelas'],
      datasets: [
        {
          data: this.chartData.countStars,
          // backgroundColor: [
          //   documentStyle.getPropertyValue('--red-400'),
          //   documentStyle.getPropertyValue('--yellow-400'),
          //   documentStyle.getPropertyValue('--green-400'),
          //   documentStyle.getPropertyValue('--primary-color'),
          // ],
          label: 'Qtd Estrelas',
          backgroundColor: documentStyle.getPropertyValue('--primary-color'),
        },
      ],

   }
  }
  public handleChartStartsClick(event: any, elements: any[]) {
    if (elements.length > 0) {
      const dataIndex = elements[0].index;
      const stars = this.chartBarStarsData.labels[dataIndex].split(' ')[0]; // Extrai o número de estrelas

      this.fetchCoursesByStars(stars, this.instituicaoData.ies);
    }
  }
  fetchCoursesByStars(stars: string, ies: string) {
    this.iesService.getCursosByStar(stars,ies).then((data) => {
      this.coursesByStar = data;
      this.showCoursesByStarModal = true;
    });

  }
}
