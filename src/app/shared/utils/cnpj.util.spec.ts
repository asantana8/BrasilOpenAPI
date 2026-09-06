import { aplicarMascaraCnpj, somenteDigitos } from './cnpj.util';

describe('cnpj.util', () => {
  describe('somenteDigitos', () => {
    it('deve remover pontuação e barra do CNPJ', () => {
      expect(somenteDigitos('11.444.777/0001-61')).toBe('11444777000161');
    });

    it('deve retornar string vazia para entrada vazia', () => {
      expect(somenteDigitos('')).toBe('');
    });
  });

  describe('aplicarMascaraCnpj', () => {
    it('deve formatar progressivamente enquanto o usuário digita', () => {
      expect(aplicarMascaraCnpj('11')).toBe('11');
      expect(aplicarMascaraCnpj('114447')).toBe('11.444.7');
      expect(aplicarMascaraCnpj('114447770001')).toBe('11.444.777/0001');
      expect(aplicarMascaraCnpj('11444777000161')).toBe('11.444.777/0001-61');
    });

    it('deve ignorar dígitos além do 14º', () => {
      expect(aplicarMascaraCnpj('1144477700016199')).toBe('11.444.777/0001-61');
    });
  });
});
