import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { SgtItem } from '../models/sgt-item.model';
import { SgtService } from './sgt.service';

describe('SgtService', () => {
  let service: SgtService;
  let httpMock: HttpTestingController;

  const mockItens: SgtItem[] = [
    {
      codigo: 1,
      codigo_pai: null,
      nome: 'Procedimento Comum Cível',
      sigla: 'ProcComCiv',
      descricao: 'Classe para processos comuns',
      glossario: 'Glossario explicativo',
      tipo_situacao: 'A',
      dispositivo_legal: null,
      artigo: null,
      dt_publicacao: '2020-01-01',
      dt_alteracao: '2023-01-01',
      dt_inativacao: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SgtService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(SgtService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve consultar itens com tipo_consulta, codigo e descricao', () => {
    service
      .consultarItens({ tipo_consulta: 'c', codigo: 1, descricao: 'Procedimento' })
      .subscribe((itens) => {
        expect(itens).toEqual(mockItens);
      });

    const req = httpMock.expectOne((r) => r.url === `${environment.sgtApiUrl}/consulta_itens`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('tipo_consulta')).toBe('c');
    expect(req.request.params.get('codigo')).toBe('1');
    expect(req.request.params.get('descricao')).toBe('Procedimento');
    req.flush(mockItens);
  });

  it('deve verificar status de healthcheck', () => {
    const healthMock = { status: 'OK', banco_conectado: true, banco_nome: 'cnj_sgt_db' };
    service.consultarHealth().subscribe((res) => {
      expect(res).toEqual(healthMock);
    });

    const req = httpMock.expectOne(`${environment.sgtBaseUrl}/health`);
    expect(req.request.method).toBe('GET');
    req.flush(healthMock);
  });

  it('deve mapear erro de conexão quando a API não estiver disponível', () => {
    service.consultarItens({ tipo_consulta: 'c' }).subscribe({
      next: () => fail('Deveria ter lançado erro'),
      error: (erro) => {
        expect(erro.mensagem).toContain('Não foi possível conectar ao microserviço SGT/CNJ');
      }
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.sgtApiUrl}/consulta_itens`);
    req.error(new ProgressEvent('network error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('deve mapear erro 400 utilizando a mensagem retornada pela API', () => {
    service.consultarItens({ tipo_consulta: 'x' as any }).subscribe({
      next: () => fail('Deveria ter lançado erro'),
      error: (erro) => {
        expect(erro.mensagem).toBe('tipo_consulta inválido');
      }
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.sgtApiUrl}/consulta_itens`);
    req.flush({ detail: 'tipo_consulta inválido' }, { status: 400, statusText: 'Bad Request' });
  });

  it('deve mapear erro 404 informando ausência de registros', () => {
    service.consultarItens({ tipo_consulta: 'c', descricao: 'inexistente' }).subscribe({
      next: () => fail('Deveria ter lançado erro'),
      error: (erro) => {
        expect(erro.mensagem).toContain('Nenhum registro encontrado');
      }
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.sgtApiUrl}/consulta_itens`);
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('deve mapear erro 500 do servidor', () => {
    service.consultarItens({ tipo_consulta: 'c' }).subscribe({
      next: () => fail('Deveria ter lançado erro'),
      error: (erro) => {
        expect(erro.mensagem).toBe('Falha ao consultar a base de dados.');
      }
    });

    const req = httpMock.expectOne((r) => r.url === `${environment.sgtApiUrl}/consulta_itens`);
    req.flush({ detail: 'Falha ao consultar a base de dados.' }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('deve disparar a sincronização via POST e retornar o resultado', () => {
    const sincronizacaoMock = {
      status: 'SUCESSO',
      mensagem: 'Sincronização realizada com sucesso.',
      detalhes: { classe: 10, assunto: 20, movimento: 30 }
    };

    service.sincronizar().subscribe((res) => {
      expect(res).toEqual(sincronizacaoMock);
    });

    const req = httpMock.expectOne(`${environment.sgtApiUrl}/sincronizar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(sincronizacaoMock);
  });
});
