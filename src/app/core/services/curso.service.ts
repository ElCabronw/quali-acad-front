import { Injectable } from "@angular/core";
import { BaseDropdown } from "../../presentation/components/lib/services";
import { Observable, of } from "rxjs";
import { ListItem } from "../../presentation/components/lib/models";

import { CursoRepository } from "../../data/repositories/curso.repository";

@Injectable()
export class CursoService implements BaseDropdown {
  constructor(private repository: CursoRepository) {}
  getAll(): Observable<ListItem[]> {
    return new Observable((observer) => {
      this.repository.getCursos().then((data) => {
        observer.next(data);
        observer.complete();
      });
    });
  }
  getPaged(searchQuery: string, page: number, pageSize: number, dependencies: any): Observable<ListItem[]> {
    return new Observable((observer) => {
      this.repository.getCursos().then((data) => {
        if (data) {
          const result = data
            .filter(
              (item) =>
                item.curso && // Garante que item.nome não seja undefined ou vazio
                item.curso.toUpperCase().includes(searchQuery.toUpperCase() || '')
            )
            .map((item) => ({
              code: item.id,
              name: item.curso,
            }));
          observer.next(result);
          observer.complete();
        } else {
          observer.next([]); // Retorna uma lista vazia se data for null ou undefined
          observer.complete();
        }
      });
    });
  }


  getById(id: number): Observable<any> {
   return of();
  }
}
