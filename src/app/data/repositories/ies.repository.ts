import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import jsonData from '../mocks/csvjson.json';
import animaJsonData from '../mocks/iesAnima.json';
import iesData from '../mocks/filtered_ies.json';
import { IIesRepository } from "../../domain/interfaces/ies.respository.interface";
import { DadosAcademicosEntity } from "../../domain/entities/dados-academicos.entity";
@Injectable({
  providedIn: 'root',
})
export class IesRepository implements IIesRepository {
  constructor() {}
  getIes(): Promise<any[]> {
  return Promise.resolve(iesData);
 }
  obterIesUnicasComId(dados: DadosAcademicosEntity[]) {
  const iesMap = new Map<string, { id: number; ies: string }>();
  let idCounter = 1;

  dados.forEach(item => {
    if (!iesMap.has(item.ies)) {
      iesMap.set(item.ies, { id: idCounter, ies: item.ies });
      idCounter++;
    }
  });

  return Array.from(iesMap.values());
}

  getIesFilteredData(filter: any): Promise<any[]> {
    let result;

    result = iesData.filter((data) => {
      return (
        (!filter.ies || filter.ies == '-1' || data.ies.includes(filter.ies))
      );
    }
    );
    if(filter.isAnima){
      const iesArray = animaJsonData.map((data) => data.NomeIES.toUpperCase());
      result = result.filter(item => iesArray.includes(item.ies.toUpperCase()));
    }
    return Promise.resolve(result);
  }

  getIesById(id: number): Promise<any> {
    const result = iesData.find((data) => data.id === id);
    return Promise.resolve(result);
  }

  getCursosByIes(id: number): Promise<any> {
    const ies = iesData.find((data) => data.id === id);
    if(ies){
      const iesName = ies.ies;
      const result = jsonData.filter((data) => data.ies === iesName);
      // get cursos
      result.map((data) => {
        return {
          curso: data.curso,
          modalidade: data.modalidade,
          avaliacao:data.avaliacao,
          anoAvaliacao: data.anoAvaliacao
        }
      });
      return Promise.resolve(result);

    }
    return Promise.resolve([]);



  }
  getCursosByStar(stars: string, ies = ''): Promise<any> {
    if(stars == "Nao"){
      const result = jsonData.filter((data) => data.avaliacao == "Não avaliado" && (data.ies === ies || ies === ''));
      return Promise.resolve(result);
    }
    else{
      const result = jsonData.filter((data) => data.avaliacao === Number(stars) && (data.ies === ies || ies === ''));
      return Promise.resolve(result);
    }



  }
}
