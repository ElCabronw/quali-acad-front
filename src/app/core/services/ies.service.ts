import { Injectable } from "@angular/core";
import { BaseDropdown } from "../../presentation/components/lib/services";
import { Observable, of } from "rxjs";
import { ListItem } from "../../presentation/components/lib/models";
import { IesRepository } from "../../data/repositories/ies.repository";
import { IesGrid } from "../models/ies.model";
import { Router } from "@angular/router";

@Injectable()
export class IesService implements BaseDropdown {
  constructor(private repository: IesRepository,public router: Router) {}
  getAll(): Observable<ListItem[]> {
    return new Observable((observer) => {
      this.repository.getIes().then((data) => {
        observer.next(data);
        observer.complete();
      });
    });
  }
  getPaged(searchQuery: string, page: number, pageSize: number, dependencies: any): Observable<ListItem[]> {
    return new Observable((observer) => {
      this.repository.getIes().then((data) => {
        if (data) {
          const result = data
            .filter(
              (item) =>
                item.ies && // Garante que item.nome não seja undefined ou vazio
                item.ies.toUpperCase().includes(searchQuery.toUpperCase() || '')
            )
            .map((item) => ({
              code: item.id,
              name: item.ies,
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
  async getIesById(id: number): Promise<any> {
    const data = await this.repository.getIesById(id);
    return data;
  }
  async getIesGrid(): Promise<IesGrid[]> {
    const data = await this.repository.getIes();
    return data.map((item) => ({
      id: item.id,
      ies: item.ies,
      site: item.site,
      actions: [
        {
          label: 'Detalhar',
          icon: 'pi pi-eye',
          command: () => {
            this.router.navigate(['ies', 'view', item.id]);
          },
        },
      ]
    }));
  }

  async getIesGridFilter(payload: any): Promise<IesGrid[]> {
    const data = await this.repository.getIesFilteredData(payload);
    return data.map((item) => ({
      id: item.id,
      ies: item.ies,
      site: item.site,
      actions: [
        {
          label: 'Detalhar',
          icon: 'pi pi-eye',
          command: () => {
            this.router.navigate(['instituicoes', 'view', item.id]);
          },
        },
      ]
    }));
  }

  async getCursosByIes(id: number): Promise<any[]> {
    const data = await this.repository.getCursosByIes(id);
    return data;
  }

  async getCursosByStar(stars: string, ies = ''): Promise<any[]> {
    const data = await this.repository.getCursosByStar(stars, ies);
    return data;
  }

}
