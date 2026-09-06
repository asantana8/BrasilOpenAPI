import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CepModel } from '../../models/cep.model';
import { ConsultaApiError } from '../../models/consulta-api-error.model';
import { Feriado } from '../../models/feriado.model';
import { Municipio } from '../../models/municipio.model';
import { CepService } from '../../services/cep.service';
import { FeriadosService } from '../../services/feriados.service';
import { IbgeService } from '../../services/ibge.service';

@Component({
  selector: 'app-portal-consultas-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './portal-consultas-page.component.html',
  styleUrl: './portal-consultas-page.component.scss'
})
export class PortalConsultasPageComponent {
  private readonly cepService = inject(CepService);
  private readonly ibgeService = inject(IbgeService);
  private readonly feriadosService = inject(FeriadosService);

  protected readonly cepForm = new FormGroup({
    cep: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\\d{5}-?\\d{3}$/)] })
  });
  protected readonly ibgeForm = new FormGroup({
    uf: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[A-Za-z]{2}$/)] }),
    busca: new FormControl('', { nonNullable: true })
  });
  protected readonly feriadosForm = new FormGroup({
    ano: new FormControl(new Date().getFullYear(), { nonNullable: true, validators: [Validators.required, Validators.min(1900), Validators.max(2100)] })
  });

  protected readonly cep = signal<CepModel | null>(null);
  protected readonly municipios = signal<Municipio[]>([]);
  protected readonly feriados = signal<Feriado[]>([]);
  protected readonly carregando = signal<string | null>(null);
  protected readonly erro = signal<ConsultaApiError | null>(null);
  protected readonly buscaMunicipio = signal('');
  protected readonly municipiosFiltrados = computed(() => {
    const termo = this.buscaMunicipio().trim().toLocaleLowerCase();
    return this.municipios().filter((municipio) => municipio.nome.toLocaleLowerCase().includes(termo));
  });
  protected readonly proximoFeriado = computed(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    return this.feriados().find((feriado) => feriado.date >= hoje) ?? null;
  });

  protected consultarCep(): void {
    if (this.cepForm.invalid) {
      this.cepForm.markAllAsTouched();
      return;
    }
    this.executar('cep', () => this.cepService.consultar(this.cepForm.controls.cep.value), (resultado) => this.cep.set(resultado));
  }

  protected consultarMunicipios(): void {
    if (this.ibgeForm.invalid) {
      this.ibgeForm.markAllAsTouched();
      return;
    }
    this.buscaMunicipio.set('');
    this.executar('ibge', () => this.ibgeService.consultar(this.ibgeForm.controls.uf.value), (resultado) => this.municipios.set(resultado));
  }

  protected consultarFeriados(): void {
    if (this.feriadosForm.invalid) {
      this.feriadosForm.markAllAsTouched();
      return;
    }
    this.executar('feriados', () => this.feriadosService.consultar(this.feriadosForm.controls.ano.value), (resultado) => this.feriados.set(resultado));
  }

  protected atualizarBuscaMunicipio(): void {
    this.buscaMunicipio.set(this.ibgeForm.controls.busca.value);
  }

  protected formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  protected rotuloTipo(tipo: string): string {
    return tipo === 'national' ? 'Nacional' : tipo === 'state' ? 'Estadual' : tipo === 'municipal' ? 'Municipal' : tipo;
  }

  private executar<T>(modulo: string, consulta: () => import('rxjs').Observable<T>, sucesso: (resultado: T) => void): void {
    this.carregando.set(modulo);
    this.erro.set(null);
    consulta().subscribe({
      next: (resultado) => {
        sucesso(resultado);
        this.carregando.set(null);
      },
      error: (erro: ConsultaApiError) => {
        this.erro.set(erro);
        this.carregando.set(null);
      }
    });
  }
}
