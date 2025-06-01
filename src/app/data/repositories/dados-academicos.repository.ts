import { Injectable } from '@angular/core';
import { IDadosAcademicosRepository } from '../../domain/interfaces/dados-academicos.repository.interface';
import {
  DadosAcademicosEntity,
  ResultadoEstado,
} from '../../domain/entities/dados-academicos.entity';
// import jsonData from '../mocks/formattedJson2223.json';
// import animaJsonData from '../mocks/iesAnima.json';
// import dadosMockup from '../mocks/dados_mockup.json';
import {
  DadosAcademicosChartFilter,
  DadosAcademicosFilter,
} from '../../core/models/dados-academicos.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DadosAcademicosRepository implements IDadosAcademicosRepository {
  private jsonServerBaseUrl = 'http://localhost:3001'; // URL do JSON Server
  constructor(private http: HttpClient) {}

  async getData(): Promise<DadosAcademicosEntity[]> {
    const data$ = this.http.get<DadosAcademicosEntity[]>(
      `${this.jsonServerBaseUrl}/dados`
    );
    return lastValueFrom(data$);
  }
  private async _fetchAndFilterData(
    filter: DadosAcademicosFilter
  ): Promise<DadosAcademicosEntity[]> {
    let params = new HttpParams();

    // Adiciona parâmetros para filtros que json-server pode lidar diretamente (match exato)
    // A lógica de '-1' significa que o filtro não deve ser aplicado pelo servidor para esse campo.
    if (filter.modalidade && filter.modalidade !== '-1') {
      params = params.append('modalidade', filter.modalidade);
    }
    if (filter.titulacao && filter.titulacao !== '-1') {
      params = params.append('titulacao', filter.titulacao);
    }
    // `avaliacao` é string na entidade. `filter.avaliacao` é number.
    if (filter.avaliacao && filter.avaliacao !== -1) {
      params = params.append('avaliacao', filter.avaliacao.toString());
    }
    // `anoAvaliacao` é number na entidade. `filter.anoAvaliacao` é number.
    if (filter.anoAvaliacao && filter.anoAvaliacao !== -1) {
      params = params.append('anoAvaliacao', filter.anoAvaliacao);
    }

    // Para filtros 'includes' (case-insensitive) e 'q' (full-text search simples):
    // Se você tem um campo principal de busca, pode usar o parâmetro 'q' do json-server.
    // Ex: if (filter.termoDeBuscaPrincipal) params = params.append('q', filter.termoDeBuscaPrincipal);
    // Caso contrário, faremos esses filtros no lado do cliente após o fetch inicial.

    const fetchedData$ = this.http.get<DadosAcademicosEntity[]>(
      `${this.jsonServerBaseUrl}/dados`,
      { params }
    );
    let data = (await lastValueFrom(fetchedData$)) || [];

    // Filtros do lado do cliente para lógica mais complexa ou case-insensitive includes
    let clientFilteredData = data.filter((item) => {
      const iesPass =
        !filter.ies ||
        filter.ies == '-1' ||
        (item.ies && item.ies.toLowerCase().includes(filter.ies.toLowerCase()));

      const cursoPass =
        !filter.curso ||
        filter.curso == '-1' ||
        (item.curso &&
          item.curso.toLowerCase().includes(filter.curso.toLowerCase())); // Usando item.curso

      const verbetePass =
        !filter.verbete ||
        filter.verbete == '-1' ||
        (item.verbete &&
          item.verbete.toLowerCase().includes(filter.verbete.toLowerCase())); // Usando item.verbete

      // Os filtros exatos (modalidade, titulacao, avaliacao, anoAvaliacao) já foram aplicados
      // pelo servidor se não eram '-1'. Se eram '-1', as condições abaixo os ignoram corretamente.
      const modalidadePassServer =
        !filter.modalidade ||
        filter.modalidade == '-1' ||
        item.modalidade === filter.modalidade;
      const titulacaoPassServer =
        !filter.titulacao ||
        filter.titulacao == '-1' ||
        item.titulacao === filter.titulacao;
      const avaliacaoPassServer =
        !filter.avaliacao ||
        filter.avaliacao == -1 ||
        item.avaliacao === filter.avaliacao;
      const anoAvaliacaoPassServer =
        !filter.anoAvaliacao ||
        filter.anoAvaliacao == -1 ||
        item.anoAvaliacao == filter.anoAvaliacao;

      return (
        iesPass &&
        cursoPass &&
        verbetePass &&
        modalidadePassServer &&
        titulacaoPassServer &&
        avaliacaoPassServer &&
        anoAvaliacaoPassServer
      );
    });

    if (filter.isAnima) {
      const animaIesData$ = this.http.get<any[]>(
        `${this.jsonServerBaseUrl}/iesAnima`
      );
      const animaData = (await lastValueFrom(animaIesData$)) || [];
      const iesAnimaArray = animaData.map((d) => d.NomeIES.toUpperCase());
      clientFilteredData = clientFilteredData.filter(
        (item) => item.ies && iesAnimaArray.includes(item.ies.toUpperCase())
      );
    }
    return clientFilteredData;
  }
  async getFilteredData(
    filter: DadosAcademicosFilter
  ): Promise<DadosAcademicosEntity[]> {
    return this._fetchAndFilterData(filter);
  }
  async getDataToMap(
    filter: DadosAcademicosFilter
  ): Promise<ResultadoEstado[]> {
    // Reutiliza a lógica de busca e filtragem principal
    const dadosParaMapa = await this._fetchAndFilterData(filter);
    // Aplica as condições específicas adicionais do getDataToMap
    const filtradosFinal = dadosParaMapa.filter((item) => {
      const avaliacaoValidaNumerica =
        item.avaliacao != null &&
        String(item.avaliacao).trim() !== '' &&
        !isNaN(Number(item.avaliacao)) &&
        isFinite(Number(item.avaliacao));

      // O item precisa ter uma avaliação numérica válida e um estado definido para o agrupamento
      return avaliacaoValidaNumerica && item.estado != null;
    });

    // Agrupar por estado e calcular média das avaliações
    const mapaEstado: Record<string, number[]> = {};

    for (const item of filtradosFinal) {
      // item.estado já foi verificado como não nulo
      const estado = item.estado!; // Usamos '!' pois já filtramos item.estado != null
      // item.avaliacao já foi verificado como numérico válido
      const nota = Number(item.avaliacao); //parseFloat(item.avaliacao); // Já sabemos que é um número válido

      if (!mapaEstado[estado]) {
        mapaEstado[estado] = [];
      }
      mapaEstado[estado].push(nota);
    }

    const resultado: ResultadoEstado[] = Object.entries(mapaEstado)
      .map(([estado, notas]) => {
        if (notas.length === 0) return null; // Caso um estado não tenha notas válidas após todos os filtros
        const soma = notas.reduce((acc, val) => acc + val, 0);
        const media = soma / notas.length;
        return { name: estado, value: parseFloat(media.toFixed(2)) };
      })
      .filter((r) => r !== null) as ResultadoEstado[]; // Remove quaisquer entradas nulas

    return resultado; // Promise.resolve não é necessário com async/await
  }
}
