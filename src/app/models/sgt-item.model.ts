export type TipoConsultaSgt = 'c' | 'a' | 'm';

export interface SgtItem {
  codigo: number;
  codigo_pai?: number | null;
  nome: string;
  sigla?: string | null;
  descricao?: string | null;
  glossario?: string | null;
  tipo_situacao: 'A' | 'I' | string;
  dispositivo_legal?: string | null;
  artigo?: string | null;
  dt_publicacao?: string | null;
  dt_alteracao?: string | null;
  dt_inativacao?: string | null;
  tipo?: TipoConsultaSgt;
}

export interface SgtFiltroConsulta {
  tipo_consulta: TipoConsultaSgt;
  codigo?: number | null;
  descricao?: string | null;
}

export interface SgtSincronizacaoResponse {
  status: string;
  mensagem: string;
  detalhes: Record<string, unknown>;
}

export interface SgtHealthResponse {
  status: string;
  banco_conectado: boolean;
  banco_nome?: string | null;
}
