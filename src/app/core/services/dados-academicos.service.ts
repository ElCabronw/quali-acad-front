import { Injectable } from '@angular/core';
import { DadosAcademicosRepository } from '../../data/repositories/dados-academicos.repository';
import { DadosAcademicosEntity, ResultadoEstado } from '../../domain/entities/dados-academicos.entity';
import { DadosAcademicos, DadosAcademicosChart, DadosAcademicosFilter, DadosAcademicosGrid } from '../models/dados-academicos.model';
import { Router } from '@angular/router';
import { IesRepository } from '../../data/repositories/ies.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDadosAcademicosUseCase {
  constructor(private dataRepository: DadosAcademicosRepository,
    public router: Router,
  ) {}

  async getDadosAcademicosGrid(): Promise<DadosAcademicosGrid[]> {
    const data = await this.dataRepository.getData();
    return data.map((item) => ({
      actions: [
        {
          label: 'Detalhar',
          icon: 'pi pi-eye',
          command: () => {
            this.router.navigate(['dados-academicos', 'view', item.id]);
          },
        },
      ],
      id: item.id,
      ies: item.ies,
      curso: item.curso,
      modalidade: item.modalidade,
      verbete: item.verbete,
      titulacao: item.titulacao,
      campus: item.campus,
      categoria: item.categoria,
      duracao: item.duracao,
      endereco: item.endereco,
      site: item.site,
      telefone: item.telefone,
      avaliacao: item.avaliacao,
      cidade: item.cidade,
      estado: item.estado,
      anoAvaliacao: item.anoAvaliacao,
    }));



  }

  async getDadosAcademicosFilter(payload: DadosAcademicosFilter): Promise<DadosAcademicos[]> {
    const data = await this.dataRepository.getFilteredData(payload);
    return data.map((item) => ({
      actions: [
        {
          label: 'Detalhar',
          icon: 'pi pi-eye',
          command: () => {
            this.router.navigate(['dados-academicos', 'view', item.id]);
          },
        },
      ],
      id: item.id,
      ies: item.ies,
      curso: item.curso,
      modalidade: item.modalidade,
      verbete: item.verbete,
      titulacao: item.titulacao,
      campus: item.campus,
      categoria: item.categoria,
      duracao: item.duracao,
      endereco: item.endereco,
      site: item.site,
      telefone: item.telefone,
      avaliacao: item.avaliacao,
      cidade: item.cidade,
      estado: item.estado,
      anoAvaliacao: item.anoAvaliacao,
    }));
  }

  async getDadosAcademicosChartView(payload:DadosAcademicosFilter ): Promise<DadosAcademicosChart> {
    // const data = await this.dataRepository.getFilteredData(payload);

    const data = await this.dataRepository.getFilteredData(payload);

    //get uniques ies in data
    const totalIes = data.map((item) => item.ies).filter((value, index, self) => self.indexOf(value) === index).length;
    const totalCursos = data.map((item) => item.curso).filter((value, index, self) => self.indexOf(value) === index).length;
    const countEstrelados = data.filter((item) => item.avaliacao >= 3).length;
    const countNaoEstrelados = data.filter((item) => item.avaliacao.toString() == 'Não avaliado').length;
    const fiveStars = data.filter((item) => item.avaliacao == 5).length;
    const fourStars = data.filter((item) => item.avaliacao == 4).length;
    const threeStars = data.filter((item) => item.avaliacao == 3).length;
    const countStars = [countNaoEstrelados,threeStars,fourStars,fiveStars];
    return {
      totalIes,
      totalCursos,
      countEstrelados,
      countNaoEstrelados,
      countStars
    };
  }

  async getDataToGepMap(payload: DadosAcademicosFilter): Promise<ResultadoEstado[]> {
   return await this.dataRepository.getDataToMap(payload);
  }

}
