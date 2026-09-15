import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SgtItem } from '../../models/sgt-item.model';
import { SgtService } from '../../services/sgt.service';
import { ConsultaSgtPageComponent } from './consulta-sgt-page.component';

describe('ConsultaSgtPageComponent', () => {
  let component: ConsultaSgtPageComponent;
  let fixture: ComponentFixture<ConsultaSgtPageComponent>;
  let sgtServiceSpy: jasmine.SpyObj<SgtService>;

  const mockItens: SgtItem[] = [
    {
      codigo: 1,
      codigo_pai: null,
      nome: 'Procedimento Comum Cível',
      sigla: 'ProcComCiv',
      descricao: 'Procedimento ordinário comum cível',
      glossario: 'Glossário explicativo do procedimento comum',
      tipo_situacao: 'A',
      dispositivo_legal: null,
      artigo: null,
      dt_publicacao: '2020-01-01',
      dt_alteracao: '2023-01-01',
      dt_inativacao: null
    },
    {
      codigo: 2,
      codigo_pai: 1,
      nome: 'Procedimento Sumário',
      sigla: 'ProcSum',
      descricao: 'Antigo procedimento sumário',
      glossario: 'Inativado pelo CPC',
      tipo_situacao: 'I',
      dispositivo_legal: null,
      artigo: null,
      dt_publicacao: '2010-01-01',
      dt_alteracao: '2016-03-18',
      dt_inativacao: '2016-03-18'
    }
  ];

  beforeEach(async () => {
    sgtServiceSpy = jasmine.createSpyObj('SgtService', [
      'consultarItens',
      'consultarHealth',
      'sincronizar'
    ]);
    sgtServiceSpy.consultarItens.and.returnValue(of(mockItens));
    sgtServiceSpy.consultarHealth.and.returnValue(
      of({ status: 'OK', banco_conectado: true, banco_nome: 'cnj_sgt_db' })
    );

    await TestBed.configureTestingModule({
      imports: [ConsultaSgtPageComponent],
      providers: [
        { provide: SgtService, useValue: sgtServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaSgtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o formulário padrão configurado para classes', () => {
    expect(component['buscaForm'].controls.tipo.value).toBe('c');
    expect(component['buscaForm'].controls.situacao.value).toBe('TODOS');
  });

  it('deve realizar pesquisa e preencher os itens encontrados', () => {
    component['buscaForm'].controls.descricao.setValue('Procedimento');
    component['pesquisar']();

    expect(sgtServiceSpy.consultarItens).toHaveBeenCalledWith({
      tipo_consulta: 'c',
      codigo: null,
      descricao: 'Procedimento'
    });
    expect(component['itens']()).toEqual(mockItens);
    expect(component['carregando']()).toBeFalse();
    expect(component['consultou']()).toBeTrue();
  });

  it('deve filtrar itens por situação', () => {
    component['itens'].set(mockItens);
    component['buscaForm'].controls.situacao.setValue('A');
    expect(component['itensFiltrados']().length).toBe(1);
    expect(component['itensFiltrados']()[0].codigo).toBe(1);

    component['buscaForm'].controls.situacao.setValue('I');
    expect(component['itensFiltrados']().length).toBe(1);
    expect(component['itensFiltrados']()[0].codigo).toBe(2);
  });

  it('deve selecionar item para exibir detalhes', () => {
    component['abrirDetalhes'](mockItens[0]);
    expect(component['itemSelecionado']()).toEqual(mockItens[0]);

    component['fecharDetalhes']();
    expect(component['itemSelecionado']()).toBeNull();
  });

  it('deve lidar com erro de consulta', () => {
    sgtServiceSpy.consultarItens.and.returnValue(
      throwError(() => ({ mensagem: 'Falha ao consultar SGT' }))
    );

    component['pesquisar']();
    expect(component['erro']()?.mensagem).toBe('Falha ao consultar SGT');
    expect(component['itens']()).toEqual([]);
  });

  it('deve reagir à mudança do filtro de situação sem nova consulta', () => {
    component['itens'].set(mockItens);
    component['buscaForm'].controls.situacao.setValue('A');
    expect(component['itensFiltrados']()).toEqual([mockItens[0]]);

    component['buscaForm'].controls.situacao.setValue('I');
    expect(component['itensFiltrados']()).toEqual([mockItens[1]]);

    component['buscaForm'].controls.situacao.setValue('TODOS');
    expect(component['itensFiltrados']()).toEqual(mockItens);
  });

  it('deve verificar a saúde do serviço com sucesso', () => {
    component['verificarSaude']();

    expect(sgtServiceSpy.consultarHealth).toHaveBeenCalled();
    expect(component['health']()).toEqual({
      status: 'OK',
      banco_conectado: true,
      banco_nome: 'cnj_sgt_db'
    });
    expect(component['feedbackSucesso']()).toContain('online');
    expect(component['carregando']()).toBeFalse();
  });

  it('deve marcar o serviço como offline quando o healthcheck falhar', () => {
    sgtServiceSpy.consultarHealth.and.returnValue(
      throwError(() => ({ mensagem: 'Serviço indisponível' }))
    );

    component['verificarSaude']();

    expect(component['health']()).toEqual({ status: 'OFFLINE', banco_conectado: false });
    expect(component['erro']()?.mensagem).toBe('Serviço indisponível');
  });

  it('deve disparar a sincronização e atualizar a listagem em caso de sucesso', () => {
    sgtServiceSpy.sincronizar.and.returnValue(
      of({ status: 'SUCESSO', mensagem: 'Sincronização com o CNJ finalizada com sucesso!', detalhes: {} })
    );

    component['dispararSincronizacao']();

    expect(sgtServiceSpy.sincronizar).toHaveBeenCalled();
    expect(component['sincronizando']()).toBeFalse();
    expect(component['feedbackSucesso']()).toBe('Sincronização com o CNJ finalizada com sucesso!');
    expect(sgtServiceSpy.consultarItens).toHaveBeenCalled();
  });

  it('deve tratar erro ao disparar a sincronização', () => {
    sgtServiceSpy.sincronizar.and.returnValue(
      throwError(() => ({ mensagem: 'Falha ao sincronizar com o CNJ' }))
    );

    component['dispararSincronizacao']();

    expect(component['sincronizando']()).toBeFalse();
    expect(component['erro']()?.mensagem).toBe('Falha ao sincronizar com o CNJ');
  });

  it('não deve disparar nova sincronização enquanto uma já estiver em andamento', () => {
    component['sincronizando'].set(true);
    component['dispararSincronizacao']();
    expect(sgtServiceSpy.sincronizar).not.toHaveBeenCalled();
  });
});
