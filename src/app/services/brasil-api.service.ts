import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, throwError, timeout } from 'rxjs';

import { environment } from '../environments/environment';
import { CnpjError } from '../models/cnpj-error.model';
import { Empresa } from '../models/empresa.model';
import { somenteDigitos } from '../shared/utils/cnpj.util';

const TIMEOUT_REQUISICAO_MS = 15_000;

/**
 * Encapsula a integração com a BrasilAPI (GET /api/cnpj/v1/{cnpj}),
 * traduzindo qualquer falha de rede/HTTP em um `CnpjError` amigável para a UI.
 */
@Injectable({ providedIn: 'root' })
export class BrasilApiService {
  private readonly http = inject(HttpClient);

  consultar(cnpj: string): Observable<Empresa> {
    const cnpjLimpo = somenteDigitos(cnpj);
    const url = `${environment.apiUrl}/${cnpjLimpo}`;

    return this.http.get<Empresa>(url).pipe(
      timeout(TIMEOUT_REQUISICAO_MS),
      catchError((erro: unknown) => throwError(() => this.mapearErro(erro)))
    );
  }

  private mapearErro(erro: unknown): CnpjError {
    if (erro instanceof TimeoutError) {
      return {
        tipo: 'SEM_CONEXAO',
        mensagem: 'A consulta demorou demais para responder. Verifique sua conexão e tente novamente.'
      };
    }

    if (erro instanceof HttpErrorResponse) {
      if (erro.status === 400) {
        return {
          tipo: 'FORMATO_INVALIDO',
          mensagem: 'CNPJ informado é inválido.'
        };
      }

      if (erro.status === 404) {
        return {
          tipo: 'CNPJ_NAO_ENCONTRADO',
          mensagem: 'CNPJ não encontrado na base da Receita Federal.'
        };
      }

      if (erro.status === 429) {
        return {
          tipo: 'LIMITE_REQUISICOES',
          mensagem: 'Limite de consultas à BrasilAPI atingido. Aguarde alguns instantes e tente novamente.'
        };
      }

      if (erro.status === 0) {
        return {
          tipo: 'SEM_CONEXAO',
          mensagem: 'Não foi possível se conectar à BrasilAPI. Verifique sua conexão com a internet.'
        };
      }

      return {
        tipo: 'SERVICO_INDISPONIVEL',
        mensagem: 'O serviço da BrasilAPI está indisponível no momento. Tente novamente mais tarde.'
      };
    }

    return {
      tipo: 'SERVICO_INDISPONIVEL',
      mensagem: 'Ocorreu um erro inesperado ao consultar o CNPJ.'
    };
  }
}
