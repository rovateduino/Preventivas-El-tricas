export type CategoriaSite = 'HUB' | 'SWITCH CLARO' | 'CENTRAL EBT' | 'MUX EBT';

export interface Site {
  name: string;
  sigla: string;
  cat: CategoriaSite;
}

// QDF/QDCC usam viaA/viaB; PDT usa r/s/t; OUTRO acrescenta nome.
export interface Circuito {
  n: number;
  nome?: string;
  r?: string;
  s?: string;
  t?: string;
  viaA?: string;
  viaB?: string;
}

export interface MedicaoCorrente {
  total?: string;
  r?: string;
  s?: string;
  t?: string;
  viaA?: string;
  viaB?: string;
  geral?: string;
}

export interface Preventiva {
  id: string;
  uid: string;
  data: string; // YYYY-MM-DD
  tipo: string; // PDT | QDF | QDCC | nome digitado quando o tipo é "OUTRO"
  tipoComplemento?: string;
  viaSelecionada?: 'A' | 'B' | 'ambas';
  ticket: string;
  temperatura: string;
  site: Site;
  circuitos: Circuito[];
  medicaoCorrente: MedicaoCorrente;
  tensaoR?: string;
  tensaoS?: string;
  tensaoT?: string;
  tensaoRS?: string;
  tensaoST?: string;
  tensaoTR?: string;
  tensaoAC?: string;
  tensaoDC?: string;
  observacao?: string;
  criadoEm: string; // ISO-8601, ordenável lexicograficamente
  atualizadoEm: string; // ISO-8601
}
