import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import jsonData from '../mocks/csvjson.json';

import { DadosAcademicosEntity } from "../../domain/entities/dados-academicos.entity";
import { ICursoRepository } from "../../domain/interfaces/curso.repository.interface";
@Injectable({
  providedIn: 'root',
})
export class CursoRepository implements ICursoRepository {
  constructor() {}
  getCursos(): Promise<any[]> {
  //   let ies = jsonData.map((item: { id: number; ies: string; curso: string; modalidade: string; verbete: string; titulacao: string; campus: string; categoria: string; duracao: string; endereco: string; site: string; telefone: string; avaliacao: number; cidade: string; estado: string; anoAvaliacao: number; }) => ({
  //    id: item.id,
  //    nome: item.ies
  //  }));
   //distinct ies
    let iesUnicas = this.obterCursosUnicosComId(jsonData);
   return Promise.resolve(iesUnicas);
 }
  obterCursosUnicosComId(dados: DadosAcademicosEntity[]) {
  const cursoMap = new Map<string, { id: number; curso: string }>();
  let idCounter = 1;

  dados.forEach(item => {
    if (!cursoMap.has(item.curso)) {
      cursoMap.set(item.curso, { id: idCounter, curso: item.curso });
      idCounter++;
    }
  });

  return Array.from(cursoMap.values());
}
}
