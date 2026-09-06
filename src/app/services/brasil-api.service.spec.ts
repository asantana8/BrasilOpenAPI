import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { Empresa } from '../models/empresa.model';
import { BrasilApiService } from './brasil-api.service';

describe('BrasilApiService', () => {
  let service: BrasilApiService;
  let httpMock: HttpTestingController;

  const empresaMock: Empresa = {
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
    TestBed.configureTestingModule({
      providers: [BrasilApiService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(BrasilApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve consultar a BrasilAPI removendo a máscara do CNPJ informado', () => {
    service.consultar('11.444.777/0001-61').subscribe((empresa) => {
      expect(empresa).toEqual(empresaMock);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    expect(req.request.method).toBe('GET');
    req.flush(empresaMock);
  });

  it('deve mapear 400 para FORMATO_INVALIDO', () => {
    service.consultar('11444777000161').subscribe({
      next: () => fail('esperava um erro'),
      error: (erro) => expect(erro).toEqual({ tipo: 'FORMATO_INVALIDO', mensagem: jasmine.any(String) })
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  it('deve mapear 404 para CNPJ_NAO_ENCONTRADO', () => {
    service.consultar('11444777000161').subscribe({
      next: () => fail('esperava um erro'),
      error: (erro) => expect(erro).toEqual({ tipo: 'CNPJ_NAO_ENCONTRADO', mensagem: jasmine.any(String) })
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('deve mapear 429 para LIMITE_REQUISICOES', () => {
    service.consultar('11444777000161').subscribe({
      next: () => fail('esperava um erro'),
      error: (erro) => expect(erro).toEqual({ tipo: 'LIMITE_REQUISICOES', mensagem: jasmine.any(String) })
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    req.flush('Too many requests', { status: 429, statusText: 'Too Many Requests' });
  });

  it('deve mapear erro de rede (status 0) para SEM_CONEXAO', () => {
    service.consultar('11444777000161').subscribe({
      next: () => fail('esperava um erro'),
      error: (erro) => expect(erro).toEqual({ tipo: 'SEM_CONEXAO', mensagem: jasmine.any(String) })
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    req.error(new ProgressEvent('network error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('deve mapear erro 500 para SERVICO_INDISPONIVEL', () => {
    service.consultar('11444777000161').subscribe({
      next: () => fail('esperava um erro'),
      error: (erro) => expect(erro).toEqual({ tipo: 'SERVICO_INDISPONIVEL', mensagem: jasmine.any(String) })
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/11444777000161`);
    req.flush('Internal error', { status: 500, statusText: 'Internal Server Error' } as HttpErrorResponse);
  });
});
