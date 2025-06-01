import { Component, OnInit } from '@angular/core';
import { IesGrid } from '../../core/models/ies.model';
import { IesService } from '../../core/services/ies.service';
import { FieldType, FilterField } from '../components/fields/filter/filter.component';

@Component({
  selector: 'app-instituicoes',
  templateUrl: './instituicoes.component.html',
  styleUrl: './instituicoes.component.scss'
})
export class InstituicoesComponent implements OnInit {
  instituicoes: IesGrid[]  = [];
  public filters: FilterField[] = []
  constructor( public iesService: IesService) { }
  async filterIes(event: any){
    this.instituicoes = await this.iesService.getIesGridFilter(event);
}
  async ngOnInit(): Promise<void> {
    this.filters = [
      {
        name: 'ies',
        label: 'Instituição de Ensino',
        type: FieldType.DROPDOWN,
        service: this.iesService,
        size: 'large',
      },
      {
        name: 'isAnima',
        label: 'Anima',
        type: FieldType.SLIDER,
        defaultValue: false,
        size: 'large',
      }
    ];
    this.instituicoes = await this.iesService.getIesGrid();
  }

}
