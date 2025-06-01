import { Injectable } from '@angular/core';
import { IDadosAcademicosRepository } from '../../domain/interfaces/dados-academicos.repository.interface';
import { DadosAcademicosEntity, ResultadoEstado } from '../../domain/entities/dados-academicos.entity';
import jsonData from '../mocks/csvjson.json';
import animaJsonData from '../mocks/iesAnima.json';
import dadosMockup from '../mocks/dados_mockup.json';
import { DadosAcademicosChartFilter, DadosAcademicosFilter } from '../../core/models/dados-academicos.model';
@Injectable({
  providedIn: 'root',
})
export class DadosAcademicosRepository implements IDadosAcademicosRepository {
  constructor() {}


  getData(): Promise<DadosAcademicosEntity[]> {
    return Promise.resolve(jsonData as DadosAcademicosEntity[]);
  }

  getFilteredData(filter: DadosAcademicosFilter): Promise<DadosAcademicosEntity[]> {

    let result;
    result = jsonData.filter((data) => {
      return (
        (!filter.ies || filter.ies == '-1' || data.ies.includes(filter.ies)) &&
        (!filter.curso || filter.curso == '-1' || data.curso.includes(filter.curso)) &&
        (!filter.modalidade || filter.modalidade == '-1' || data.modalidade === filter.modalidade) &&
        (!filter.verbete || filter.verbete == '-1' || data.verbete.includes(filter.verbete)) &&
        (!filter.titulacao || filter.titulacao == '-1' || data.titulacao === filter.titulacao) &&
        (!filter.avaliacao || filter.avaliacao == -1 || data.avaliacao === Number(filter.avaliacao)) &&
        (!filter.anoAvaliacao || filter.anoAvaliacao == -1 || data.anoAvaliacao === Number(filter.anoAvaliacao))
      );
    });
    if(filter.isAnima){
      // get all NomeIES from animaJsonData and filter jsonData by NomeIES
      const iesArray = animaJsonData.map((data) => data.NomeIES.toUpperCase());
      result = result.filter(item => iesArray.includes(item.ies.toUpperCase()));

    }
    return Promise.resolve(result);
  }

  getDataToMap(filter: DadosAcademicosFilter): Promise<ResultadoEstado[]> {
      // 1. Filtrar os dados com base no filtro recebido
  const filtrados = dadosMockup.filter(item => {
    return (!filter.ies || item.ies.toLowerCase().includes(filter.ies.toLowerCase())) &&
           (!filter.curso || item.nome_curso.toLowerCase().includes(filter.curso.toLowerCase())) &&
           (!filter.verbete || item.nome_curso.toLowerCase().includes(filter.verbete.toLowerCase())) &&
           (!filter.titulacao || item.titulacao.toLowerCase() === filter.titulacao.toLowerCase()) &&
           (!filter.isAnima || item.tipo_ies.toLowerCase() === 'anima')
          ;
  });

  // 2. Agrupar por estado e calcular média das avaliações
  const mapaEstado: Record<string, number[]> = {};

  for (const item of filtrados) {
    const estado = item.estado;
    const ano = String(filter.anoAvaliacao) as keyof typeof item.avaliacoes;
    const nota = item.avaliacoes[ano] ? item.avaliacoes[ano] : null;

    if (nota != null) {
      if (!mapaEstado[estado]) {
        mapaEstado[estado] = [];
      }
      mapaEstado[estado].push(nota);
    }
  }

  // 3. Gerar saída: [{ name: 'SP', value: 4.5 }, ...]
  const resultado: ResultadoEstado[] = Object.entries(mapaEstado).map(([estado, notas]) => {
    const soma = notas.reduce((acc, val) => acc + val, 0);
    const media = soma / notas.length;
    return { name: estado, value: parseFloat(media.toFixed(2)) };
  });

  return Promise.resolve(resultado);

  }
}

