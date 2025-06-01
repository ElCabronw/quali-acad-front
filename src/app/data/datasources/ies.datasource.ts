import { Injectable } from "@angular/core";
import jsonData from '../mocks/csvjson.json';
@Injectable({
  providedIn: 'root'
})
export class IesDataSource {
  getIes(): Promise<any[]> {
     let ies = jsonData.map((item: { id: number; ies: string; curso: string; modalidade: string; verbete: string; titulacao: string; campus: string; categoria: string; duracao: string; endereco: string; site: string; telefone: string; avaliacao: number; cidade: string; estado: string; anoAvaliacao: number; }) => ({
      id: item.id,
      nome: item.ies
    }));
    return Promise.resolve(ies);
  }
}
