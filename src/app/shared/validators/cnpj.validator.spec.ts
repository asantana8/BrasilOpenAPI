import { FormControl } from '@angular/forms';
import { cnpjValidator } from './cnpj.validator';

describe('cnpjValidator', () => {
  const validator = cnpjValidator();

  it('deve retornar null para campo vazio (delega ao Validators.required)', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('deve aceitar um CNPJ válido com máscara', () => {
    const control = new FormControl('11.444.777/0001-61');
    expect(validator(control)).toBeNull();
  });

  it('deve aceitar um CNPJ válido sem máscara', () => {
    const control = new FormControl('11444777000161');
    expect(validator(control)).toBeNull();
  });

  it('deve rejeitar CNPJ com quantidade de dígitos incorreta', () => {
    const control = new FormControl('11.444.777/0001-6');
    expect(validator(control)).toEqual({ cnpjInvalido: true });
  });

  it('deve rejeitar sequência de dígitos repetidos', () => {
    const control = new FormControl('11.111.111/1111-11');
    expect(validator(control)).toEqual({ cnpjInvalido: true });
  });

  it('deve rejeitar CNPJ com dígito verificador incorreto', () => {
    const control = new FormControl('11.444.777/0001-62');
    expect(validator(control)).toEqual({ cnpjInvalido: true });
  });
});
