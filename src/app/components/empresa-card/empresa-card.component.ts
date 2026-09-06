import { Component, inject, input } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
import { EsferaAdministrativa } from '../../models/esfera-administrativa.enum';
import { ClassificacaoEsferaService } from '../../services/classificacao-esfera.service';

const ESFERA_CLASSES: Record<EsferaAdministrativa, string> = {
  [EsferaAdministrativa.FEDERAL]: 'text-bg-primary',
  [EsferaAdministrativa.ESTADUAL]: 'text-bg-info',
  [EsferaAdministrativa.MUNICIPAL]: 'text-bg-warning',
  [EsferaAdministrativa.PRIVADA]: 'text-bg-secondary',
  [EsferaAdministrativa.NAO_IDENTIFICADA]: 'text-bg-light'
};

@Component({
  selector: 'app-empresa-card',
  imports: [],
  templateUrl: './empresa-card.component.html',
  styleUrl: './empresa-card.component.scss'
})
export class EmpresaCardComponent {
  private readonly classificacaoEsferaService = inject(ClassificacaoEsferaService);

  readonly empresa = input.required<Empresa>();

  protected get enderecoCompleto(): string {
    const dados = this.empresa();
    return [dados.logradouro, dados.numero, dados.complemento, dados.bairro].filter(Boolean).join(', ');
  }

  protected get situacaoClasse(): string {
    const situacao = this.empresa().descricao_situacao_cadastral?.toUpperCase() ?? '';
    return situacao === 'ATIVA' ? 'text-bg-success' : 'text-bg-secondary';
  }

  protected get esfera(): EsferaAdministrativa {
    return this.classificacaoEsferaService.classificar(this.empresa());
  }

  protected get esferaClasse(): string {
    return ESFERA_CLASSES[this.esfera];
  }
}
