export interface Site {
  nome: string;
  sigla: string;
  categoria: 'HUB' | 'SWITCH CLARO' | 'CENTRAL EBT' | 'MUX EBT';
}

export interface Circuito {
  numero: number;
  medR: number;
  medS?: number;
  medT?: number;
}

export interface MedicaoCorrente {
  total?: number;
  r?: number;
  s?: number;
  t?: number;
  viaA?: number;
  viaB?: number;
  geral?: number;
}

export interface Preventiva {
  id: string;
  uid: string; // Firebase Auth UID for ownership
  data: string; // YYYY-MM-DD
  tipoQuadro: 'PDT' | 'QDF' | 'QDCC' | 'QDGE' | string;
  ticket: string;
  temperatura: number;
  site: Site;
  circuitos: Circuito[];
  medicaoCorrente: MedicaoCorrente;
  criadoEm: number; // Timestamp
  atualizadoEm: number; // Timestamp
}
