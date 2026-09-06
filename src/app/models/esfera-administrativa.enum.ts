/**
 * Esfera administrativa estimada de uma entidade a partir dos dados
 * cadastrais retornados pela BrasilAPI. A BrasilAPI não expõe esse dado
 * oficialmente: trata-se sempre de uma inferência (ver `ClassificacaoEsferaService`).
 */
export enum EsferaAdministrativa {
  FEDERAL = 'Federal',
  ESTADUAL = 'Estadual',
  MUNICIPAL = 'Municipal',
  PRIVADA = 'Privada',
  NAO_IDENTIFICADA = 'Não Identificada'
}
