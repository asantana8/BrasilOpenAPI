import { TestBed } from '@angular/core/testing';

import { Empresa } from '../models/empresa.model';
import { EsferaAdministrativa } from '../models/esfera-administrativa.enum';
import { ClassificacaoEsferaService } from './classificacao-esfera.service';

describe('ClassificacaoEsferaService', () => {
  let service: ClassificacaoEsferaService;

  const empresaBase: Empresa = {
    cnpj: '11444777000161',
    razao_social: 'Empresa Teste LTDA',
    nome_fantasia: 'Empresa Teste',
    descricao_situacao_cadastral: 'ATIVA',
    cnae_fiscal: 6201500,
    cnae_fiscal_descricao: 'Desenvolvimento de programas de computador sob encomenda',
    ddd_telefone_1: '1140028922',
    email: 'contato@empresateste.com.br',
    logradouro: 'RUA TESTE',
    numero: '100',
    bairro: 'CENTRO',
    municipio: 'SAO PAULO',
    uf: 'SP',
    cep: '01000000',
    qsa: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ClassificacaoEsferaService] });
    service = TestBed.inject(ClassificacaoEsferaService);
  });

  // CT-04
  it('deve classificar uma Prefeitura Municipal como MUNICIPAL', () => {
    const empresa: Empresa = {
      ...empresaBase,
      razao_social: 'PREFEITURA MUNICIPAL DO RECIFE',
      natureza_juridica: 'Município'
    };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.MUNICIPAL);
  });

  it('deve classificar pela razão social quando a natureza jurídica estiver ausente (Prefeitura)', () => {
    const empresa: Empresa = { ...empresaBase, razao_social: 'PREFEITURA MUNICIPAL DE OLINDA' };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.MUNICIPAL);
  });

  it('deve classificar órgãos e autarquias estaduais como ESTADUAL', () => {
    expect(
      service.classificar({ ...empresaBase, natureza_juridica: 'Autarquia Estadual ou do Distrito Federal' })
    ).toBe(EsferaAdministrativa.ESTADUAL);
    expect(service.classificar({ ...empresaBase, razao_social: 'TRIBUNAL DE JUSTICA DO ESTADO DE PE' })).toBe(
      EsferaAdministrativa.ESTADUAL
    );
  });

  // CT-05
  it('deve classificar um Ministério como FEDERAL', () => {
    const empresa: Empresa = {
      ...empresaBase,
      razao_social: 'MINISTERIO DA FAZENDA',
      natureza_juridica: 'Órgão Público do Poder Executivo Federal'
    };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.FEDERAL);
  });

  it('deve classificar pela razão social quando a natureza jurídica não indicar a esfera (Receita Federal)', () => {
    const empresa: Empresa = { ...empresaBase, razao_social: 'SECRETARIA DA RECEITA FEDERAL DO BRASIL' };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.FEDERAL);
  });

  // CT-06
  it('deve classificar uma empresa privada como PRIVADA', () => {
    const empresa: Empresa = { ...empresaBase, natureza_juridica: 'Sociedade Empresária Limitada' };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.PRIVADA);
  });

  it('deve classificar um MEI como PRIVADA mesmo sem natureza jurídica reconhecida', () => {
    const empresa: Empresa = { ...empresaBase, natureza_juridica: undefined, opcao_pelo_mei: true };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.PRIVADA);
  });

  // CT-07
  it('deve retornar NAO_IDENTIFICADA quando os dados forem insuficientes', () => {
    const empresa: Empresa = { ...empresaBase, natureza_juridica: undefined };

    expect(service.classificar(empresa)).toBe(EsferaAdministrativa.NAO_IDENTIFICADA);
  });

  it('deve retornar NAO_IDENTIFICADA para casos especiais ambíguos (Empresa Pública / Sociedade de Economia Mista)', () => {
    expect(
      service.classificar({ ...empresaBase, razao_social: 'CAIXA ECONOMICA FEDERAL', natureza_juridica: 'Empresa Pública' })
    ).toBe(EsferaAdministrativa.NAO_IDENTIFICADA);
    expect(
      service.classificar({
        ...empresaBase,
        razao_social: 'PETROLEO BRASILEIRO S A PETROBRAS',
        natureza_juridica: 'Sociedade de Economia Mista'
      })
    ).toBe(EsferaAdministrativa.NAO_IDENTIFICADA);
  });
});
