export interface DadosAcademicos {
  id: number;
  ies: string;
  curso: string;
  modalidade: string;
  verbete: string;
  titulacao: string;
  campus: string;
  categoria: string;
  duracao: string;
  endereco: string;
  site: string;
  telefone: string;
  avaliacao:number;
  cidade: string;
  estado: string;
  anoAvaliacao: number;
}

export interface DadosAcademicosChart {
  totalIes: number;
  totalCursos: number;
  countEstrelados: number;
  countNaoEstrelados: number;
  countStars: number[];
}

export interface DadosAcademicosGrid {
  actions: any[];
  id: number;
  ies: string;
  curso: string;
  modalidade: string;
  verbete: string;
  titulacao: string;
  campus: string;
  categoria: string;
  duracao: string;
  endereco: string;
  site: string;
  telefone: string;
  avaliacao:number;
  cidade: string;
  estado: string;
  anoAvaliacao: number;
}

export interface DadosAcademicosFilter {
  ies: string;
  curso: string;
  modalidade: string;
  verbete: string;
  titulacao: string;
  avaliacao:number;
  anoAvaliacao: number;
  isAnima: boolean;
}
export interface DadosAcademicosChartFilter {
  ies: string;
  avaliacao:number;
  anoAvaliacao: number;
  isAnima: boolean;
}
