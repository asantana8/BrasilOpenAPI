/**
 * Representa um sócio ou administrador retornado pelo QSA (Quadro de Sócios e
 * Administradores) da Receita Federal via BrasilAPI.
 *
 * Apenas `nome_socio` e `qualificacao_socio` são exigidos pelo PRD; os demais
 * campos existem na resposta real da API e foram mantidos como opcionais para
 * não quebrar a tipagem caso venham preenchidos.
 */
export interface Socio {
  nome_socio: string;
  qualificacao_socio: string;
  cnpj_cpf_do_socio?: string;
  data_entrada_sociedade?: string;
  faixa_etaria?: string;
  qualificacao_socio_codigo?: number;
}
