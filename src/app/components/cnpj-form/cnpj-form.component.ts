import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { cnpjValidator } from '../../shared/validators/cnpj.validator';
import { aplicarMascaraCnpj, somenteDigitos } from '../../shared/utils/cnpj.util';

@Component({
  selector: 'app-cnpj-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cnpj-form.component.html',
  styleUrl: './cnpj-form.component.scss'
})
export class CnpjFormComponent {
  readonly carregando = input<boolean>(false);
  readonly buscar = output<string>();

  private readonly formBuilder = inject(FormBuilder);

  protected readonly formulario = this.formBuilder.nonNullable.group({
    cnpj: this.formBuilder.nonNullable.control('', {
      validators: [Validators.required, cnpjValidator()]
    })
  });

  protected get cnpjControl() {
    return this.formulario.controls.cnpj;
  }

  protected onCnpjInput(evento: Event): void {
    const elemento = evento.target as HTMLInputElement;
    const valorMascarado = aplicarMascaraCnpj(elemento.value);
    this.cnpjControl.setValue(valorMascarado, { emitEvent: false });
  }

  protected onSubmit(): void {
    if (this.formulario.invalid || this.carregando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.buscar.emit(somenteDigitos(this.cnpjControl.value));
  }
}
