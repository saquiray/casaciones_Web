export interface PoderJudicialSearchParams {
  filtro: 'S' | 'A' | 'F';
  search: string;
  demandante?: string;
  demandado?: string;
  numexpediente?: string;
  anoingreso?: string;
  idtipoproceso: number;
  anopublica?: string;
  pg: number;
}

export interface PoderJudicialResult {
  titulo: string;
  expediente: string;
  tipoResolucion: string;
  demandante: string;
  demandado: string;
  resumen: string;
  fechaPublicacion: string;
  fechaIngreso: string;
  score: number;
  ano: string;
  archivo: string;
  pdfUrl: string;
}

export interface PoderJudicialPdfResponse {
  existe: string;
  archivo: string;
}

export interface PoderJudicialPagination {
  paginaActual: number;
  totalPaginas: number;
  paginas: number[];
}

export interface PoderJudicialSearchResponse {
  results: PoderJudicialResult[];
  pagination: PoderJudicialPagination;
}
