import { Injectable } from '@angular/core';
import { DadosAcademicosRepository } from '../../data/repositories/dados-academicos.repository';
import {
  DadosAcademicosEntity,
  ResultadoEstado,
} from '../../domain/entities/dados-academicos.entity';
import {
  DadosAcademicos,
  DadosAcademicosChart,
  DadosAcademicosFilter,
  DadosAcademicosGrid,
} from '../models/dados-academicos.model';
import { Router } from '@angular/router';
import { IesRepository } from '../../data/repositories/ies.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDadosAcademicosUseCase {
  constructor(
    private dataRepository: DadosAcademicosRepository,
    public router: Router
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

  async getDadosAcademicosFilter(
    payload: DadosAcademicosFilter
  ): Promise<DadosAcademicos[]> {
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

  async getDadosAcademicosChartView(
    payload: DadosAcademicosFilter
  ): Promise<DadosAcademicosChart> {
    // const data = await this.dataRepository.getFilteredData(payload);

    const data = await this.dataRepository.getFilteredData(payload);

    //get uniques ies in data
    const totalIes = data
      .map((item) => item.ies)
      .filter((value, index, self) => self.indexOf(value) === index).length;
    const totalCursos = data
      .map((item) => item.curso)
      .filter((value, index, self) => self.indexOf(value) === index).length;
    const countEstrelados = data.filter((item) => item.avaliacao >= 3).length;
    const countNaoEstrelados = data.filter(
      (item) => item.avaliacao.toString() == 'Não avaliado'
    ).length;
    const fiveStars = data.filter((item) => item.avaliacao == 5).length;
    const fourStars = data.filter((item) => item.avaliacao == 4).length;
    const threeStars = data.filter((item) => item.avaliacao == 3).length;
    const countStars = [countNaoEstrelados, threeStars, fourStars, fiveStars];
    return {
      totalIes,
      totalCursos,
      countEstrelados,
      countNaoEstrelados,
      countStars,
    };
  }

  async getDataToGepMap(
    payload: DadosAcademicosFilter
  ): Promise<ResultadoEstado[]> {
    return await this.dataRepository.getDataToMap(payload);
  }

  async calcularRankingIesPorMedia(
    payload: DadosAcademicosFilter,
    topN: number = 5 // Número de IES para listar nas melhores/piores
  ): Promise<any> {
    let dados = await this.dataRepository.getFilteredData(payload);
    // 1. Calcular a soma das notas e o número de avaliações válidas para cada IES
    const agregacaoPorIes: Record<
      string,
      { somaNotas: number; contagemNotas: number; anoAvaliacao?: number }
    > = {};

    dados.forEach((item) => {
      const nomeIes = item.ies;
      const notaNum = item.avaliacao;

      if (notaNum) {
        // Verifica se a nota é um número válido

        if (!isNaN(notaNum)) {
          // Considera apenas notas numéricas válidas
          if (!agregacaoPorIes[nomeIes]) {
            agregacaoPorIes[nomeIes] = { somaNotas: 0, contagemNotas: 0 };
          }
          agregacaoPorIes[nomeIes].somaNotas += Number(notaNum);
          agregacaoPorIes[nomeIes].contagemNotas++;
          // Armazena o ano de avaliação, se necessário
          agregacaoPorIes[nomeIes].anoAvaliacao = item.anoAvaliacao;
        }
      }
    });

    // 2. Calcular a média para cada IES que teve pelo menos uma avaliação válida
    const iesComMedias: any[] = [];
    for (const nomeIes in agregacaoPorIes) {
      if (agregacaoPorIes.hasOwnProperty(nomeIes)) {
        const agregacao = agregacaoPorIes[nomeIes];
        if (agregacao.contagemNotas > 0) {
          const media = agregacao.somaNotas / agregacao.contagemNotas;
          iesComMedias.push({
            nomeIes: nomeIes,
            mediaAvaliacao: parseFloat(media.toFixed(2)), // Arredonda para 2 casas decimais
            numeroDeAvaliacoesValidas: agregacao.contagemNotas,
            anoAvaliacao: agregacao.anoAvaliacao, // Inclui o ano de avaliação
          });
        }
      }
    }
    // 3. Ordenar as IES pela média de avaliação
    // Para melhores: ordem decrescente de média, depois por mais avaliações (desempate)
    // Para piores: ordem crescente de média, depois por menos avaliações (desempate)

    // Filtrar IES com mediaAvaliacao null antes de ordenar para o ranking
    const iesRankeaveis = iesComMedias.filter(
      (ies) => ies.mediaAvaliacao !== null
    );

    // Ordenar para Melhores IES
    const melhoresIes = [...iesRankeaveis]
      .sort((a, b) => {
        // Tratar 'a.mediaAvaliacao' e 'b.mediaAvaliacao' como 'number' pois filtramos 'null'
        const mediaA = a.mediaAvaliacao as number;
        const mediaB = b.mediaAvaliacao as number;
        if (mediaB !== mediaA) {
          return mediaB - mediaA; // Maior média primeiro
        }
        return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas; // Desempate: mais avaliações
      })
      .slice(0, topN);
    // const iesOrdenadas = [...iesComMedias].sort((a, b) => {
    //   if (b.mediaAvaliacao !== a.mediaAvaliacao) {
    //     return b.mediaAvaliacao - a.mediaAvaliacao; // Maior média primeiro
    //   }
    //   return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas; // Mais avaliações primeiro como desempate
    // });

    // const melhoresIes = iesOrdenadas.slice(0, topN);

    // Para piores, invertemos a ordenação primária (menor média primeiro)
    // e para desempate, podemos manter mais avaliações ou inverter, dependendo do critério.
    // Aqui, vamos pegar as piores da lista já ordenada e depois reordenar se necessário, ou pegar da lista reversa.

    const pioresIes = [...iesRankeaveis]
      .sort((a, b) => {
        const mediaA = a.mediaAvaliacao as number;
        const mediaB = b.mediaAvaliacao as number;
        if (mediaA !== mediaB) {
          return mediaA - mediaB; // Menor média primeiro
        }
        // Desempate para piores: pode ser mais avaliações (ruins) ou menos (menos confiável)
        // Vamos com mais avaliações para a mesma média baixa sendo "pior" (mais evidência de baixa qualidade)
        return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas;
      })
      .slice(0, topN);
    // const pioresIesTemporario = [...iesComMedias].sort((a, b) => {
    //   if (a.mediaAvaliacao !== b.mediaAvaliacao) {
    //     return a.mediaAvaliacao - b.mediaAvaliacao; // Menor média primeiro
    //   }
    //   // Como critério de desempate para "pior", uma IES com poucas avaliações e nota baixa
    //   // pode ser considerada "pior" do que uma com muitas avaliações e a mesma nota baixa.
    //   // Ou o inverso, se muitas avaliações baixas for pior.
    //   // Vamos usar: menor número de avaliações para a mesma média baixa é "pior" (menos consistente).
    //   // Ou, se preferir, pode ser "mais avaliações ruins é pior". Vamos com mais avaliações.
    //   return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas;
    // });

    // const pioresIes = pioresIesTemporario.slice(0, topN);

    return {
      melhoresIes: melhoresIes,
      pioresIes: pioresIes,
    };
  }

  async calcularRankingCursosPorMedia(
    payload: DadosAcademicosFilter,
    topN: number = 5 // Número de IES para listar nas melhores/piores
  ): Promise<any> {
    let dados = await this.dataRepository.getFilteredData(payload);
    // 1. Calcular a soma das notas e o número de avaliações válidas para cada IES
    const agregacaoPorCurso: Record<
      string,
      { somaNotas: number; contagemNotas: number; anoAvaliacao?: number }
    > = {};

    dados.forEach((item) => {
      const nomeCurso = item.curso;
      const notaNum = item.avaliacao;

      if (notaNum) {
        // Verifica se a nota é um número válido

        if (!isNaN(notaNum)) {
          // Considera apenas notas numéricas válidas
          if (!agregacaoPorCurso[nomeCurso]) {
            agregacaoPorCurso[nomeCurso] = { somaNotas: 0, contagemNotas: 0 };
          }
          agregacaoPorCurso[nomeCurso].somaNotas += Number(notaNum);
          agregacaoPorCurso[nomeCurso].contagemNotas++;
          // Armazena o ano de avaliação, se necessário
          agregacaoPorCurso[nomeCurso].anoAvaliacao = item.anoAvaliacao;
        }
      }
    });

    // 2. Calcular a média para cada IES que teve pelo menos uma avaliação válida
    const cursosComMedias: any[] = [];
    for (const nomeCurso in agregacaoPorCurso) {
      if (agregacaoPorCurso.hasOwnProperty(nomeCurso)) {
        const agregacao = agregacaoPorCurso[nomeCurso];
        if (agregacao.contagemNotas > 0) {
          const media = agregacao.somaNotas / agregacao.contagemNotas;
          cursosComMedias.push({
            nomeCurso: nomeCurso,
            mediaAvaliacao: parseFloat(media.toFixed(2)), // Arredonda para 2 casas decimais
            numeroDeAvaliacoesValidas: agregacao.contagemNotas,
            anoAvaliacao: agregacao.anoAvaliacao, // Inclui o ano de avaliação
          });
        }
      }
    }

    // 3. Ordenar as IES pela média de avaliação
    // Para melhores: ordem decrescente de média, depois por mais avaliações (desempate)
    // Para piores: ordem crescente de média, depois por menos avaliações (desempate)

    // Filtrar IES com mediaAvaliacao null antes de ordenar para o ranking
    const cursosRankeaveis = cursosComMedias.filter(
      (ies) => ies.mediaAvaliacao !== null
    );

    // Ordenar para Melhores IES
    const melhoresCursos = [...cursosRankeaveis]
      .sort((a, b) => {
        // Tratar 'a.mediaAvaliacao' e 'b.mediaAvaliacao' como 'number' pois filtramos 'null'
        const mediaA = a.mediaAvaliacao as number;
        const mediaB = b.mediaAvaliacao as number;
        if (mediaB !== mediaA) {
          return mediaB - mediaA; // Maior média primeiro
        }
        return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas; // Desempate: mais avaliações
      })
      .slice(0, topN);
    // const iesOrdenadas = [...iesComMedias].sort((a, b) => {
    //   if (b.mediaAvaliacao !== a.mediaAvaliacao) {
    //     return b.mediaAvaliacao - a.mediaAvaliacao; // Maior média primeiro
    //   }
    //   return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas; // Mais avaliações primeiro como desempate
    // });

    // const melhoresIes = iesOrdenadas.slice(0, topN);

    // Para piores, invertemos a ordenação primária (menor média primeiro)
    // e para desempate, podemos manter mais avaliações ou inverter, dependendo do critério.
    // Aqui, vamos pegar as piores da lista já ordenada e depois reordenar se necessário, ou pegar da lista reversa.

    const pioresCursos = [...cursosRankeaveis]
      .sort((a, b) => {
        const mediaA = a.mediaAvaliacao as number;
        const mediaB = b.mediaAvaliacao as number;
        if (mediaA !== mediaB) {
          return mediaA - mediaB; // Menor média primeiro
        }
        // Desempate para piores: pode ser mais avaliações (ruins) ou menos (menos confiável)
        // Vamos com mais avaliações para a mesma média baixa sendo "pior" (mais evidência de baixa qualidade)
        return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas;
      })
      .slice(0, topN);
    // const pioresIesTemporario = [...iesComMedias].sort((a, b) => {
    //   if (a.mediaAvaliacao !== b.mediaAvaliacao) {
    //     return a.mediaAvaliacao - b.mediaAvaliacao; // Menor média primeiro
    //   }
    //   // Como critério de desempate para "pior", uma IES com poucas avaliações e nota baixa
    //   // pode ser considerada "pior" do que uma com muitas avaliações e a mesma nota baixa.
    //   // Ou o inverso, se muitas avaliações baixas for pior.
    //   // Vamos usar: menor número de avaliações para a mesma média baixa é "pior" (menos consistente).
    //   // Ou, se preferir, pode ser "mais avaliações ruins é pior". Vamos com mais avaliações.
    //   return b.numeroDeAvaliacoesValidas - a.numeroDeAvaliacoesValidas;
    // });

    // const pioresIes = pioresIesTemporario.slice(0, topN);

    return {
      melhoresCursos: melhoresCursos,
      pioresCursos: pioresCursos,
    };
  }
}
