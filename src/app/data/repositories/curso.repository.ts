import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
// import jsonData from '../mocks/formattedJson2223.json';

import { DadosAcademicosEntity } from '../../domain/entities/dados-academicos.entity';
import { ICursoRepository } from '../../domain/interfaces/curso.repository.interface';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CursoRepository implements ICursoRepository {
  private dadosAcademicosUrl = 'http://localhost:3001/dados';
  constructor(private http: HttpClient) {}
  // getCursos(): Promise<any[]> {
  //   //   let ies = jsonData.map((item: { id: number; ies: string; curso: string; modalidade: string; verbete: string; titulacao: string; campus: string; categoria: string; duracao: string; endereco: string; site: string; telefone: string; avaliacao: number; cidade: string; estado: string; anoAvaliacao: number; }) => ({
  //   //    id: item.id,
  //   //    nome: item.ies
  //   //  }));
  //   //distinct ies
  //   let iesUnicas = this.obterCursosUnicosComId(jsonData);
  //   return Promise.resolve(iesUnicas);
  // }
  async getCursos(): Promise<any[]> {
    // Tipo de retorno mais específico
    try {
      // 1. Buscar todos os dados da URL /dados
      const todosOsDados = await lastValueFrom(
        this.http.get<DadosAcademicosEntity[]>(this.dadosAcademicosUrl)
      );

      // Se a resposta for null/undefined (improvável com get bem-sucedido, mas seguro verificar)
      // ou se não for um array, retorna um array vazio.
      if (!todosOsDados || !Array.isArray(todosOsDados)) {
        console.warn(
          'Nenhum dado acadêmico recebido do servidor ou formato inesperado.'
        );
        return [];
      }

      // 2. Chamar a função auxiliar para obter os cursos únicos com IDs
      const cursosUnicos = this.obterCursosUnicosComId(todosOsDados);
      return cursosUnicos;
    } catch (error) {
      console.error(
        'Erro ao buscar dados acadêmicos para obter cursos únicos:',
        error
      );
      return []; // Retorna um array vazio em caso de erro na requisição HTTP
    }
  }
  obterCursosUnicosComId(dados: DadosAcademicosEntity[]) {
    const cursoMap = new Map<string, { id: number; curso: string }>();
    let idCounter = 1;

    dados.forEach((item) => {
      if (!cursoMap.has(item.curso)) {
        cursoMap.set(item.curso, { id: idCounter, curso: item.curso });
        idCounter++;
      }
    });

    return Array.from(cursoMap.values());
  }
}
