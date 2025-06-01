import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import { GetDadosAcademicosUseCase } from '../../core/services/dados-academicos.service';
import {
  FieldType,
  FilterField,
} from '../components/fields/filter/filter.component';
import { Table } from 'primeng/table';
import { DadosAcademicosEntity } from '../../domain/entities/dados-academicos.entity';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('dt2') dt: Table | undefined;
  iesBestPerformanceData: any[] = [];
  iesBadPerformanceData: any[] = [];

  cursosBestPerformanceData: any[] = [];
  cursosBadPerformanceData: any[] = [];
  public filtersChart: FilterField[] = [];
  isBrowser: boolean = false;
  geoMapData: any[] = [];
  geoMapInstance: any;
  geoMapOptions: any;
  @ViewChild('geoMapContainer', { static: false })
  geoMapContainer!: ElementRef<HTMLDivElement>;
  constructor(
    private getDadosAcademicosUseCase: GetDadosAcademicosUseCase,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  async ngOnInit() {
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
    ];
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    if (this.geoMapContainer && this.geoMapContainer.nativeElement) {
      if (!this.geoMapInstance) {
        this.geoMapInstance = echarts.init(this.geoMapContainer.nativeElement);
      }

      await this.filterGeoMapChart({
        anoAvaliacao: new Date().getFullYear(),
      });
    }
  }

  async filterDadosAcademicosChart(event: any) {
    let iesData =
      await this.getDadosAcademicosUseCase.calcularRankingIesPorMedia(event);

    this.iesBestPerformanceData = iesData.melhoresIes;
    this.iesBadPerformanceData = iesData.pioresIes;

    let cursosData =
      await this.getDadosAcademicosUseCase.calcularRankingCursosPorMedia(event);

    this.cursosBestPerformanceData = cursosData.melhoresCursos;
    this.cursosBadPerformanceData = cursosData.pioresCursos;

    this.geoMapData = await this.getDadosAcademicosUseCase.getDataToGepMap(
      event
    );
    if (this.isBrowser) {
      this._buildGeoMap();
    }
  }

  async filterGeoMapChart(event: any) {
    this.geoMapData = await this.getDadosAcademicosUseCase.getDataToGepMap(
      event
    );
    if (this.isBrowser) {
      this._buildGeoMap();
    }
  }

  private _buildGeoMap() {
    console.log('geoMapData:', this.geoMapData);
    this.geoMapOptions = {
      title: {
        text: 'Valores por Estado',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      visualMap: {
        min: 0,
        max: 5,
        left: 'left',
        top: 'bottom',
        text: ['Alto', 'Baixo'],
        calculable: true,
      },
      series: [
        {
          name: 'Valor',
          type: 'map',
          map: 'BR',
          roam: true,
          label: {
            show: true,
          },
          data: this.geoMapData,
        },
      ],
    };
    if (this.geoMapInstance) {
      this.geoMapInstance.setOption(this.geoMapOptions);
      this.geoMapInstance.resize();
    } else {
      console.warn(
        'geoMapInstance is not initialized when trying to build geo map.'
      );
    }
  }
}
