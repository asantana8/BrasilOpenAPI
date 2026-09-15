import { Component, inject, input, signal } from '@angular/core';

import { ModulosNavComponent } from '../../components/modulos-nav/modulos-nav.component';
import { CnpjFormComponent } from '../../components/cnpj-form/cnpj-form.component';
import { EmpresaCardComponent } from '../../components/empresa-card/empresa-card.component';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { SociosListComponent } from '../../components/socios-list/socios-list.component';
import { CnpjError } from '../../models/cnpj-error.model';
import { Empresa } from '../../models/empresa.model';
import { BrasilApiService } from '../../services/brasil-api.service';

@Component({
  selector: 'app-consulta-cnpj-page',
  imports: [
    ModulosNavComponent,
    CnpjFormComponent,
    EmpresaCardComponent,
    SociosListComponent,
    LoadingComponent,
    ErrorMessageComponent
  ],
  templateUrl: './consulta-cnpj-page.component.html',
  styleUrl: './consulta-cnpj-page.component.scss'
})
export class ConsultaCnpjPageComponent {
  private readonly brasilApiService = inject(BrasilApiService);

  /** Quando embutido dentro de outra página (ex.: Portal), o menu de módulos não é exibido aqui. */
  readonly mostrarMenu = input(true);

  protected readonly carregando = signal(false);
  protected readonly empresa = signal<Empresa | null>(null);
  protected readonly erro = signal<CnpjError | null>(null);

  protected onBuscar(cnpj: string): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.empresa.set(null);

    this.brasilApiService.consultar(cnpj).subscribe({
      next: (empresaEncontrada) => {
        this.empresa.set(empresaEncontrada);
        this.carregando.set(false);
      },
      error: (erroConsulta: CnpjError) => {
        this.erro.set(erroConsulta);
        this.carregando.set(false);
      }
    });
  }
}
