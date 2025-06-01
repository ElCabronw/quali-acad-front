import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import jsonData from '../mocks/formattedJson2223.json';
// import animaJsonData from '../mocks/iesAnima.json';
// import iesData from '../mocks/filtered_ies.json';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IIesRepository } from '../../domain/interfaces/ies.respository.interface';
import { DadosAcademicosEntity } from '../../domain/entities/dados-academicos.entity';
@Injectable({
  providedIn: 'root',
})
export class IesRepository implements IIesRepository {
  private jsonServerBaseUrl = 'http://localhost:3001'; // URL do JSON Server
  private iesDataUrl = 'http://localhost:3001/iesData';
  private dadosAcademicosUrl = 'http://localhost:3001/dados';
  constructor(private http: HttpClient) {}
  getIes(): Promise<any[]> {
    const iesData = this.http.get<any[]>(`${this.jsonServerBaseUrl}/iesData`);
    return lastValueFrom(iesData);
    // return Promise.resolve(iesData);
  }
  obterIesUnicasComId(dados: DadosAcademicosEntity[]) {
    const iesMap = new Map<string, { id: number; ies: string }>();
    let idCounter = 1;

    dados.forEach((item) => {
      if (!iesMap.has(item.ies)) {
        iesMap.set(item.ies, { id: idCounter, ies: item.ies });
        idCounter++;
      }
    });

    return Array.from(iesMap.values());
  }
  private async _fetchAndFilterData(filter: any): Promise<any[]> {
    let params = new HttpParams();
    if (filter.ies && filter.ies !== '-1') {
      params = params.set('ies', filter.ies);
    }
    if (filter.isAnima) {
      params = params.set('isAnima', 'true');
    }
    const fetchedData$ = this.http.get<DadosAcademicosEntity[]>(
      `${this.jsonServerBaseUrl}/iesData`,
      { params }
    );
    let data = (await lastValueFrom(fetchedData$)) || [];
    if (filter.isAnima) {
      const animaIesData$ = this.http.get<any[]>(
        `${this.jsonServerBaseUrl}/iesAnima`
      );
      const animaData = (await lastValueFrom(animaIesData$)) || [];
      const iesAnimaArray = animaData.map((d) => d.NomeIES.toUpperCase());
      data = data.filter(
        (item) => item.ies && iesAnimaArray.includes(item.ies.toUpperCase())
      );
    }
    return data;
  }
  getIesFilteredData(filter: any): Promise<any[]> {
    return this._fetchAndFilterData(filter);
  }

  getIesById(id: number): Promise<any> {
    const fetchedData$ = this.http.get<DadosAcademicosEntity[]>(
      `${this.jsonServerBaseUrl}/iesData/${id}`
    );
    return lastValueFrom(fetchedData$);
    // const result = iesData.find((data) => data.id === id);
    // return Promise.resolve(result);
  }

  // getCursosByIes(id: number): Promise<any> {

  //   const ies = iesData.find((data) => data.id === id);
  //   if (ies) {
  //     const iesName = ies.ies;
  //     const result = jsonData.filter((data) => data.ies === iesName);
  //     // get cursos
  //     result.map((data) => {
  //       return {
  //         curso: data.curso,
  //         modalidade: data.modalidade,
  //         avaliacao: data.avaliacao,
  //         anoAvaliacao: data.anoAvaliacao,
  //       };
  //     });
  //     return Promise.resolve(result);
  //   }
  //   return Promise.resolve([]);
  // }

  async getCursosByIes(id: number): Promise<any> {
    try {
      // 1. Buscar a IES específica pelo ID em /iesData
      // json-server permite filtrar por qualquer propriedade usando query parameters
      const paramsIes = new HttpParams().set('id', id.toString());
      const iesArray = await lastValueFrom(
        this.http.get<any[]>(this.iesDataUrl, { params: paramsIes })
      );

      // Verifica se a IES foi encontrada (json-server retorna um array)
      if (iesArray && iesArray.length > 0) {
        const iesEncontrada = iesArray[0];
        const nomeDaIes = iesEncontrada.ies;

        // 2. Buscar os dados acadêmicos (cursos) filtrando pelo nome da IES
        // É importante encodar o nome da IES caso contenha caracteres especiais
        const paramsDados = new HttpParams().set('ies', nomeDaIes);
        const cursosDaIes = await lastValueFrom(
          this.http.get<any>(this.dadosAcademicosUrl, { params: paramsDados })
        );

        // 3. Mapear os resultados para a estrutura desejada
        // A sua função original tinha um .map que não estava sendo atribuído.
        // Aqui corrigimos para retornar os dados mapeados.
        const resultadoFormatado = cursosDaIes.map((dado: any) => ({
          curso: dado.curso,
          modalidade: dado.modalidade,
          avaliacao: dado.avaliacao,
          anoAvaliacao: dado.anoAvaliacao,
        }));

        return resultadoFormatado;
      } else {
        // Nenhuma IES encontrada com o ID fornecido
        return [];
      }
    } catch (error) {
      return [];
    }
  }
  // getCursosByStar(stars: string, ies = ''): Promise<any> {
  //   if (stars == 'Nao') {
  //     const result = jsonData.filter(
  //       (data) =>
  //         data.avaliacao == 'Não avaliado' && (data.ies === ies || ies === '')
  //     );
  //     return Promise.resolve(result);
  //   } else {
  //     const result = jsonData.filter(
  //       (data) =>
  //         data.avaliacao === Number(stars) && (data.ies === ies || ies === '')
  //     );
  //     return Promise.resolve(result);
  //   }
  // }
  async getCursosByStar(stars: string, ies: string = ''): Promise<any> {
    let params = new HttpParams();

    // 1. Define o parâmetro de consulta para 'avaliacao'
    //    Normaliza a entrada 'stars' para ser mais flexível com "Nao" ou "Não avaliado"
    const lowerStars = stars.toLowerCase();
    if (lowerStars === 'nao' || lowerStars === 'não avaliado') {
      // json-server fará o match exato com a string "Não avaliado"
      params = params.append('avaliacao', 'Não avaliado');
    } else {
      // Para estrelas numéricas (ex: "3", "4", "5"), json-server fará o match
      // com a string correspondente no campo 'avaliacao' do JSON.
      // A sua interface DadoAcademico.avaliacao é string, o que é correto aqui.
      params = params.append('avaliacao', stars);
    }

    // 2. Define o parâmetro de consulta para 'ies', se fornecido e não vazio
    if (ies && ies.trim() !== '') {
      params = params.append('ies', ies);
    }

    try {
      // 3. Faz a requisição GET para json-server com os parâmetros construídos
      const observableResult$ = this.http.get<any>(this.dadosAcademicosUrl, {
        params,
      });
      const result = await lastValueFrom(observableResult$);
      return result || []; // Retorna os dados filtrados ou um array vazio
    } catch (error) {
      console.error(
        `Erro ao buscar cursos por avaliação '${stars}' e IES '${ies}':`,
        error
      );
      return []; // Retorna um array vazio em caso de erro, como na função original
    }
  }
}
