import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DadosAcademicosEntity } from '../../domain/entities/dados-academicos.entity';
import { GetDadosAcademicosUseCase } from '../../core/services/dados-academicos.service';
import { Table } from 'primeng/table';
import { FieldType, FilterField } from '../components/fields/filter/filter.component';
import { IesService } from '../../core/services/ies.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CursoService } from '../../core/services/curso.service';
import { DadosAcademicosChart } from '../../core/models/dados-academicos.model';
import * as echarts from 'echarts';
import brazilMap from '../../../assets/maps/br.json';

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  CoreChartOptions,
  DatasetChartOptions,
  DoughnutControllerChartOptions,
  ElementChartOptions,
  Legend,
  LinearScale,
  PieController,
  PluginChartOptions,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
registerChartElements();

function registerChartElements() {
  Chart.register(
    PieController,
    BarController,
    BarElement,
    ArcElement,
    CategoryScale,
    RadialLinearScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
  );
    echarts.registerMap('BR', brazilMap as any);
}
@Component({
  selector: 'app-dados-academicos',
  templateUrl: './dados-academicos.component.html',
  styleUrl: './dados-academicos.component.scss'
})
export class DadosAcademicosComponent implements OnInit {
  data: DadosAcademicosEntity[] = [];
  coursesByStar: any[] = [];
  estreladosChart: any;
  geoMapOptions: any;
  chartBarStarsData: any;
  initialLoading = true;
  showCoursesByStarModal = false;
  private _chartInstance?: Chart<'doughnut', (number | undefined)[], string>;
  chartData = {} as DadosAcademicosChart;
  geoMapData: any[] = [];
  estreladosChartOptions : any;
  chartBarOptions: any;
  geoMapInstance:any;
  public formGroup: FormGroup = new FormGroup({});
  @ViewChild('dt2') dt: Table | undefined;
  @ViewChild('geoMapContainer', { static: false }) geoMapContainer!: ElementRef<HTMLDivElement>;
  public filters: FilterField[] = []
  isBrowser: boolean = false;
  public filtersChart: FilterField[] = []
  constructor(
    private getDadosAcademicosUseCase: GetDadosAcademicosUseCase,
    public iesService: IesService,
    public cursoService: CursoService,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
this.isBrowser = isPlatformBrowser(platformId);
  }

  async filterDadosAcademicos(event: any){
      this.data = await this.getDadosAcademicosUseCase.getDadosAcademicosFilter(event);
  }
  async filterDadosAcademicosChart(event: any){
      this.chartData = await this.getDadosAcademicosUseCase.getDadosAcademicosChartView(event);
      this.geoMapData = await this.getDadosAcademicosUseCase.getDataToGepMap(event);
      debugger;
      this._buildSummaryPieChart();
      this._buildBarChartStars();
      this._buildGeoMap();
  }
  async ngOnInit() {
    this.formGroup.addControl('ies',new FormControl(undefined));
    this.filters = [
      {
        name: 'ies',
        label: 'Instituição de Ensino',
        type: FieldType.DROPDOWN,
        service: this.iesService,
        size: 'large',
      },
      {
        name: 'curso',
        label: 'Curso',
        type: FieldType.DROPDOWN,
        service: this.cursoService,
        size: 'medium',
      },
      {
        name: 'anoAvaliacao',
        label: 'Ano Avaliação',
        type: FieldType.NUMBER,
        size: 'medium',
        initiateValue: true,
        required: true,
        defaultValue: new Date().getFullYear(),
      },
      {
        name: 'isAnima',
        label: 'Anima',
        type: FieldType.SLIDER,
        defaultValue: false,
      }
    ];
    this.filtersChart = [
      {
        name: 'anoAvaliacao',
        label: 'Ano Avaliação',
        type: FieldType.NUMBER,
        size: 'medium',
        initiateValue: true,
        required: true,
        defaultValue: new Date().getFullYear(),
      },
      {
        name: 'avaliacao',
        label: 'Avaliação',
        type: FieldType.DROPDOWN,
        options: [
          { name: '1', code: 1 },
          { name: '2', code: 2 },
          { name: '3', code: 3 },
          { name: '4', code: 4 },
          { name: '5', code: 5 },
        ],
        size: 'medium',

      }

    ]
    this.data = await this.getDadosAcademicosUseCase.getDadosAcademicosGrid();
  }

  async ngAfterViewInit() {

  if (!this.isBrowser) return;

  this.geoMapInstance = echarts.init(this.geoMapContainer.nativeElement);
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
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

    this.fetchCoursesByStars(stars); // Realiza a consulta no backend
  }
}
fetchCoursesByStars(stars: string) {
  // Altere a URL para o endpoint real do seu backend
  this.iesService.getCursosByStar(stars).then((data) => {
    this.coursesByStar = data;
    this.showCoursesByStarModal = true;
  });

}
 private _buildSummaryPieChart() {
  const documentStyle = getComputedStyle(document.documentElement);
  this.estreladosChartOptions = {
    plugins: {
      legend: {
        labels: {
          font: { family: 'Poppins', weight: '750' },
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

 private _buildGeoMap() {

  this.geoMapOptions = {
      title: {
          text: 'Valores por Estado',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        visualMap: {
          min: 0,
          max: 5,
          left: 'left',
          top: 'bottom',
          text: ['Alto', 'Baixo'],
          calculable: true
        },
        series: [
          {
            name: 'Valor',
            type: 'map',
            map: 'BR',
            roam: true,
            label: {
              show: true
            },
            data: this.geoMapData
          }
        ]
  }
  this.geoMapInstance.setOption(this.geoMapOptions);
 }

}
