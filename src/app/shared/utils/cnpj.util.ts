/** Remove qualquer caractere que não seja dígito. */
export function somenteDigitos(valor: string): string {
  return (valor ?? '').replace(/\D/g, '');
}

/**
 * Aplica a máscara progressiva de CNPJ (00.000.000/0000-00) enquanto o
 * usuário digita, aceitando no máximo 14 dígitos.
 */
export function aplicarMascaraCnpj(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 14);

  if (digitos.length > 12) {
    return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5');
  }
  if (digitos.length > 8) {
    return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, '$1.$2.$3/$4');
  }
  if (digitos.length > 5) {
    return digitos.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2.$3');
  }
  if (digitos.length > 2) {
    return digitos.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
  }
  return digitos;
}
