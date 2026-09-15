import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ModulosNavComponent } from '../../components/modulos-nav/modulos-nav.component';
import { ConsultaApiError } from '../../models/consulta-api-error.model';
import {
  SgtHealthResponse,
  SgtItem,
  SgtSincronizacaoResponse,
  TipoConsultaSgt
} from '../../models/sgt-item.model';
import { SgtService } from '../../services/sgt.service';

@Component({
  selector: 'app-consulta-sgt-page',
  imports: [CommonModule, ReactiveFormsModule, ModulosNavComponent],
  templateUrl: './consulta-sgt-page.component.html',
  styleUrl: './consulta-sgt-page.component.scss'
})
export class ConsultaSgtPageComponent {
  private readonly sgtService = inject(SgtService);

  protected readonly buscaForm = new FormGroup({
    tipo: new FormControl<TipoConsultaSgt>('c', { nonNullable: true }),
    descricao: new FormControl('', { nonNullable: true }),
    codigo: new FormControl<number | null>(null),
    situacao: new FormControl<'TODOS' | 'A' | 'I'>('TODOS', { nonNullable: true })
  });

  protected readonly itens = signal<SgtItem[]>([]);
  protected readonly carregando = signal(false);
  protected readonly sincronizando = signal(false);
  protected readonly consultou = signal(false);
  protected readonly erro = signal<ConsultaApiError | null>(null);
  protected readonly feedbackSucesso = signal<string | null>(null);
  protected readonly health = signal<SgtHealthResponse | null>(null);
  protected readonly itemSelecionado = signal<SgtItem | null>(null);
  protected readonly codigoCopiado = signal<number | null>(null);

  protected readonly rotulosTipo: Record<TipoConsultaSgt, { singular: string; plural: string; tag: string }> = {
    c: { singular: 'Classe Processual', plural: 'Classes Processuais', tag: 'Classe' },
    a: { singular: 'Assunto Processual', plural: 'Assuntos Processuais', tag: 'Assunto' },
    m: { singular: 'Movimento Processual', plural: 'Movimentos Processuais', tag: 'Movimento' }
  };

  private readonly situacaoSelecionada = toSignal(this.buscaForm.controls.situacao.valueChanges, {
    initialValue: this.buscaForm.controls.situacao.value
  });

  protected readonly itensFiltrados = computed(() => {
    const lista = this.itens();
    const filtroSituacao = this.situacaoSelecionada();

    if (filtroSituacao === 'TODOS') {
      return lista;
    }
    return lista.filter((item) => item.tipo_situacao === filtroSituacao);
  });

  protected readonly contagemAtivos = computed(() => {
    return this.itens().filter((item) => item.tipo_situacao === 'A').length;
  });

  protected readonly contagemInativos = computed(() => {
    return this.itens().filter((item) => item.tipo_situacao === 'I').length;
  });

  protected selecionarTipo(tipo: TipoConsultaSgt): void {
    if (this.buscaForm.controls.tipo.value === tipo) return;
    this.buscaForm.controls.tipo.setValue(tipo);
    this.itens.set([]);
    this.consultou.set(false);
    this.erro.set(null);
    this.itemSelecionado.set(null);
  }

  protected pesquisar(limparFeedbackSucesso = true): void {
    this.carregando.set(true);
    this.erro.set(null);
    if (limparFeedbackSucesso) {
      this.feedbackSucesso.set(null);
    }
    this.consultou.set(true);
    this.itemSelecionado.set(null);

    const tipo = this.buscaForm.controls.tipo.value;
    const descricao = this.buscaForm.controls.descricao.value;
    const codigo = this.buscaForm.controls.codigo.value;

    this.sgtService
      .consultarItens({
        tipo_consulta: tipo,
        codigo: codigo && !isNaN(codigo) ? Number(codigo) : null,
        descricao: descricao.trim() ? descricao.trim() : null
      })
      .subscribe({
        next: (resultado) => {
          this.itens.set(resultado);
          this.carregando.set(false);
        },
        error: (erroConsulta: ConsultaApiError) => {
          this.erro.set(erroConsulta);
          this.itens.set([]);
          this.carregando.set(false);
        }
      });
  }

  protected aplicarExemplo(termo: string, tipo?: TipoConsultaSgt): void {
    if (tipo) {
      this.buscaForm.controls.tipo.setValue(tipo);
    }
    this.buscaForm.controls.descricao.setValue(termo);
    this.buscaForm.controls.codigo.setValue(null);
    this.pesquisar();
  }

  protected limpar(): void {
    this.buscaForm.reset({
      tipo: this.buscaForm.controls.tipo.value,
      descricao: '',
      codigo: null,
      situacao: 'TODOS'
    });
    this.itens.set([]);
    this.consultou.set(false);
    this.erro.set(null);
    this.feedbackSucesso.set(null);
    this.itemSelecionado.set(null);
  }

  protected verificarSaude(): void {
    this.carregando.set(true);
    this.sgtService.consultarHealth().subscribe({
      next: (res) => {
        this.health.set(res);
        this.feedbackSucesso.set(
          `Serviço SGT/CNJ online! Banco "${res.banco_nome || 'conectado'}" com status: ${res.status}.`
        );
        this.carregando.set(false);
      },
      error: (err: ConsultaApiError) => {
        this.health.set({ status: 'OFFLINE', banco_conectado: false });
        this.erro.set(err);
        this.carregando.set(false);
      }
    });
  }

  protected dispararSincronizacao(): void {
    if (this.sincronizando()) return;
    this.sincronizando.set(true);
    this.feedbackSucesso.set(null);
    this.erro.set(null);

    this.sgtService.sincronizar().subscribe({
      next: (res: SgtSincronizacaoResponse) => {
        this.sincronizando.set(false);
        this.feedbackSucesso.set(res.mensagem || 'Sincronização com o CNJ finalizada com sucesso!');
        this.pesquisar(false);
      },
      error: (err: ConsultaApiError) => {
        this.sincronizando.set(false);
        this.erro.set(err);
      }
    });
  }

  protected abrirDetalhes(item: SgtItem): void {
    this.itemSelecionado.set(item);
  }

  protected fecharDetalhes(): void {
    this.itemSelecionado.set(null);
  }

  protected copiarCodigo(codigo: number): void {
    navigator.clipboard?.writeText(codigo.toString());
    this.codigoCopiado.set(codigo);
    setTimeout(() => {
      if (this.codigoCopiado() === codigo) {
        this.codigoCopiado.set(null);
      }
    }, 2000);
  }

  protected formatarData(data?: string | null): string {
    if (!data) return '-';
    const partes = data.split('T')[0].split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
  }
}
