import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';

import { environment } from '../environments/environment';
import { CepModel } from '../models/cep.model';
import { ConsultaApiError } from '../models/consulta-api-error.model';

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly http = inject(HttpClient);

  consultar(cep: string): Observable<CepModel> {
    return this.http.get<CepModel>(`${environment.apiBaseUrl}/cep/v2/${cep.replace(/\\D/g, '')}`).pipe(
      timeout(15_000),
      catchError((erro: unknown) => throwError(() => this.mapearErro(erro, 'CEP')))
    );
  }

  private mapearErro(erro: unknown, recurso: string): ConsultaApiError {
    const status = erro instanceof HttpErrorResponse ? erro.status : 0;
    return {
      mensagem:
        status === 404
          ? `${recurso} não encontrado. Confira os dados informados.`
          : 'Não foi possível concluir a consulta agora. Tente novamente em instantes.'
    };
  }
}
