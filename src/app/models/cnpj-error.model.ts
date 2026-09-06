export type CnpjErrorTipo =
  | 'FORMATO_INVALIDO'
  | 'CNPJ_NAO_ENCONTRADO'
  | 'LIMITE_REQUISICOES'
  | 'SEM_CONEXAO'
  | 'SERVICO_INDISPONIVEL';

/**
 * Erro de negócio já traduzido para uma mensagem amigável, produzido pelo
 * `BrasilApiService` a partir de erros HTTP/timeout da BrasilAPI.
 */
export interface CnpjError {
  tipo: CnpjErrorTipo;
  mensagem: string;
}
