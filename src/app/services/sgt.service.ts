import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';

import { environment } from '../environments/environment';
import { ConsultaApiError } from '../models/consulta-api-error.model';
import {
  SgtFiltroConsulta,
  SgtHealthResponse,
  SgtItem,
  SgtSincronizacaoResponse
} from '../models/sgt-item.model';

@Injectable({ providedIn: 'root' })
export class SgtService {
  private readonly http = inject(HttpClient);

  consultarItens(filtro: SgtFiltroConsulta): Observable<SgtItem[]> {
    let params = new HttpParams().set('tipo_consulta', filtro.tipo_consulta);

    if (filtro.codigo !== undefined && filtro.codigo !== null && !isNaN(filtro.codigo)) {
      params = params.set('codigo', filtro.codigo.toString());
    }

    if (filtro.descricao && filtro.descricao.trim().length > 0) {
      params = params.set('descricao', filtro.descricao.trim());
    }

    return this.http.get<SgtItem[]>(`${environment.sgtApiUrl}/consulta_itens`, { params }).pipe(
      timeout(20_000),
      catchError((erro: unknown) => throwError(() => this.mapearErro(erro)))
    );
  }

  consultarHealth(): Observable<SgtHealthResponse> {
    return this.http.get<SgtHealthResponse>(`${environment.sgtBaseUrl}/health`).pipe(
      timeout(10_000),
      catchError((erro: unknown) => throwError(() => this.mapearErro(erro)))
    );
  }

  sincronizar(): Observable<SgtSincronizacaoResponse> {
    return this.http.post<SgtSincronizacaoResponse>(`${environment.sgtApiUrl}/sincronizar`, {}).pipe(
      timeout(60_000),
      catchError((erro: unknown) => throwError(() => this.mapearErro(erro)))
    );
  }

  private mapearErro(erro: unknown): ConsultaApiError {
    if (erro instanceof HttpErrorResponse) {
      if (erro.status === 0) {
        return {
          mensagem:
            'Não foi possível conectar ao microserviço SGT/CNJ (http://localhost:8000). Certifique-se de que a API Python/FastAPI está em execução.'
        };
      }
      if (erro.status === 404) {
        return {
          mensagem: 'Nenhum registro encontrado no SGT/CNJ para os filtros informados.'
        };
      }
      if (erro.status === 400) {
        return {
          mensagem:
            erro.error?.detail || 'Parâmetros de consulta inválidos para as Tabelas Processuais Unificadas.'
        };
      }
      if (erro.status >= 500) {
        return {
          mensagem:
            erro.error?.detail || 'Erro interno no servidor SGT/CNJ ao consultar a base de dados.'
        };
      }
    }

    return {
      mensagem: 'Não foi possível concluir a consulta no SGT/CNJ. Tente novamente em instantes.'
    };
  }
}
