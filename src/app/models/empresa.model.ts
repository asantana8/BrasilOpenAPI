import { Socio } from './socio.model';

/**
 * Modelo dos dados cadastrais de uma empresa retornados pela BrasilAPI
 * (GET /api/cnpj/v1/{cnpj}).
 *
 * Os campos obrigatórios seguem exatamente o contrato definido no PRD.
 * Campos opcionais adicionais existem na resposta real da API e foram
 * incluídos para enriquecer a exibição sem alterar o contrato original.
 */
export interface Empresa {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  descricao_situacao_cadastral: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  ddd_telefone_1: string;
  email: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  qsa: Socio[];

  // Campos opcionais adicionais presentes na resposta real da BrasilAPI.
  ddd_telefone_2?: string;
  complemento?: string;
  porte?: string;
  natureza_juridica?: string;
  capital_social?: number;
  data_situacao_cadastral?: string;
  data_inicio_atividade?: string;

  // Campos usados como fontes de inferência pelo ClassificacaoEsferaService (PRD v2).
  codigo_natureza_juridica?: number;
  ente_federativo_responsavel?: string;
  opcao_pelo_mei?: boolean | null;
}
