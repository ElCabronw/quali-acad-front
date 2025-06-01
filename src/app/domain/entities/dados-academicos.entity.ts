export interface DadosAcademicosEntity {
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
export interface ResultadoEstado {
  name: string;   // Nome do estado (ex: 'SP', 'MG')
  value: number;  // Média das avaliações filtradas
}
