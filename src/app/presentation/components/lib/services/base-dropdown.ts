import { Observable } from 'rxjs';
import { ListItem } from '../models/list-item.model';

export interface BaseDropdown {
  getAll(): Observable<ListItem[]>;
  getPaged(searchQuery: string, page: number, pageSize: number, dependencies: any): Observable<ListItem[]>;
  getById(id: number): Observable<any>;
}
