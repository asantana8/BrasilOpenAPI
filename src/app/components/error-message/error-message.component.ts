import { Component, computed, input } from '@angular/core';
import { CnpjErrorTipo } from '../../models/cnpj-error.model';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  readonly mensagem = input.required<string>();
  readonly tipo = input<CnpjErrorTipo>('SERVICO_INDISPONIVEL');

  protected readonly classeAlerta = computed<string>(() => {
    const tiposDeAtencao: CnpjErrorTipo[] = ['CNPJ_NAO_ENCONTRADO', 'LIMITE_REQUISICOES', 'FORMATO_INVALIDO'];
    return tiposDeAtencao.includes(this.tipo()) ? 'alert-warning' : 'alert-danger';
  });
}
