import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { somenteDigitos } from '../utils/cnpj.util';

const PESOS_PRIMEIRO_DIGITO = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_SEGUNDO_DIGITO = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function calcularDigitoVerificador(digitos: number[], pesos: number[]): number {
  const soma = digitos.reduce((acumulado, digito, indice) => acumulado + digito * pesos[indice], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Validator de Reactive Forms para CNPJ: exige 14 dígitos, rejeita sequências
 * repetidas (ex.: "00000000000000") e confere os dois dígitos verificadores
 * pelo algoritmo módulo 11 oficial da Receita Federal.
 *
 * Retorna `null` para campo vazio, deixando o `Validators.required` cuidar
 * dessa validação separadamente.
 */
export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valorDigitado = control.value as string | null;
    if (!valorDigitado) {
      return null;
    }

    const cnpj = somenteDigitos(valorDigitado);

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return { cnpjInvalido: true };
    }

    const digitos = cnpj.split('').map(Number);

    const primeiroDigitoCalculado = calcularDigitoVerificador(digitos.slice(0, 12), PESOS_PRIMEIRO_DIGITO);
    if (primeiroDigitoCalculado !== digitos[12]) {
      return { cnpjInvalido: true };
    }

    const segundoDigitoCalculado = calcularDigitoVerificador(digitos.slice(0, 13), PESOS_SEGUNDO_DIGITO);
    if (segundoDigitoCalculado !== digitos[13]) {
      return { cnpjInvalido: true };
    }

    return null;
  };
}
