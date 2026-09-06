import { Injectable } from '@angular/core';

import { EsferaAdministrativa } from '../models/esfera-administrativa.enum';
import { Empresa } from '../models/empresa.model';

const NATUREZA_MUNICIPAL = ['MUNICIPIO', 'MUNICIPAL'];
const NATUREZA_ESTADUAL = ['ESTADUAL', 'DISTRITO FEDERAL', 'ESTADO'];
const NATUREZA_FEDERAL = ['FEDERAL', 'UNIAO'];

// Natureza jurídica de empresas cujo controle acionário pode ser federal, estadual
// ou municipal (ex.: Petrobras, Caixa Econômica Federal, Serpro, Dataprev, Embrapa).
// Sem um dado explícito de titularidade, a esfera é ambígua por definição (RN-001).
const NATUREZA_AMBIGUA = ['EMPRESA PUBLICA', 'SOCIEDADE DE ECONOMIA MISTA'];

const NATUREZA_PRIVADA = [
  'SOCIEDADE EMPRESARIA',
  'SOCIEDADE SIMPLES',
  'EMPRESARIO (INDIVIDUAL)',
  'EMPRESARIO INDIVIDUAL',
  'ASSOCIACAO PRIVADA',
  'FUNDACAO PRIVADA',
  'COOPERATIVA',
  'EMPRESA INDIVIDUAL DE RESPONSABILIDADE LIMITADA'
];

const RAZAO_SOCIAL_MUNICIPAL = [
  'PREFEITURA MUNICIPAL',
  'CAMARA MUNICIPAL',
  'FUNDO MUNICIPAL',
  'SECRETARIA MUNICIPAL',
  'AUTARQUIA MUNICIPAL'
];

const RAZAO_SOCIAL_ESTADUAL = [
  'GOVERNO DO ESTADO',
  'SECRETARIA DE ESTADO',
  'TRIBUNAL DE JUSTICA',
  'ASSEMBLEIA LEGISLATIVA',
  'POLICIA CIVIL',
  'POLICIA MILITAR'
];

const RAZAO_SOCIAL_FEDERAL = [
  'MINISTERIO',
  'RECEITA FEDERAL',
  'UNIVERSIDADE FEDERAL',
  'INSTITUTO FEDERAL',
  'POLICIA FEDERAL',
  'BANCO CENTRAL',
  'INSS',
  'SENADO FEDERAL',
  'CAMARA DOS DEPUTADOS'
];

function normalizar(texto: string | undefined | null): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase();
}

function contemAlgum(texto: string, termos: readonly string[]): boolean {
  return termos.some((termo) => texto.includes(termo));
}

/**
 * Estima a esfera administrativa (Federal, Estadual, Municipal, Privada ou
 * Não Identificada) de uma empresa a partir dos dados cadastrais da BrasilAPI.
 *
 * A BrasilAPI não fornece esse dado oficialmente (RN-001 do PRD v2): a
 * classificação é sempre uma inferência, nunca deve ser apresentada como
 * dado oficial, e centraliza toda a regra de negócio aqui — nenhum
 * componente deve reimplementá-la.
 */
@Injectable({ providedIn: 'root' })
export class ClassificacaoEsferaService {
  classificar(empresa: Empresa): EsferaAdministrativa {
    if (empresa.opcao_pelo_mei) {
      return EsferaAdministrativa.PRIVADA;
    }

    const natureza = normalizar(empresa.natureza_juridica);

    if (natureza) {
      if (contemAlgum(natureza, NATUREZA_MUNICIPAL)) {
        return EsferaAdministrativa.MUNICIPAL;
      }
      if (contemAlgum(natureza, NATUREZA_ESTADUAL)) {
        return EsferaAdministrativa.ESTADUAL;
      }
      if (contemAlgum(natureza, NATUREZA_FEDERAL)) {
        return EsferaAdministrativa.FEDERAL;
      }

      // Natureza jurídica reconhecida, mas fora da Administração Pública direta.
      if (contemAlgum(natureza, NATUREZA_AMBIGUA)) {
        return EsferaAdministrativa.NAO_IDENTIFICADA;
      }
      if (contemAlgum(natureza, NATUREZA_PRIVADA)) {
        return EsferaAdministrativa.PRIVADA;
      }
    }

    const razaoSocial = normalizar(`${empresa.razao_social ?? ''} ${empresa.nome_fantasia ?? ''}`);

    if (contemAlgum(razaoSocial, RAZAO_SOCIAL_MUNICIPAL)) {
      return EsferaAdministrativa.MUNICIPAL;
    }
    if (contemAlgum(razaoSocial, RAZAO_SOCIAL_ESTADUAL)) {
      return EsferaAdministrativa.ESTADUAL;
    }
    if (contemAlgum(razaoSocial, RAZAO_SOCIAL_FEDERAL)) {
      return EsferaAdministrativa.FEDERAL;
    }

    return EsferaAdministrativa.NAO_IDENTIFICADA;
  }
}
