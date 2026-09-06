import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';

import { environment } from '../environments/environment';
import { ConsultaApiError } from '../models/consulta-api-error.model';
import { Feriado } from '../models/feriado.model';

@Injectable({ providedIn: 'root' })
export class FeriadosService {
  private readonly http = inject(HttpClient);

  consultar(ano: number): Observable<Feriado[]> {
    return this.http.get<Feriado[]>(`${environment.apiBaseUrl}/feriados/v1/${ano}`).pipe(
      timeout(15_000),
      catchError((erro: unknown) =>
        throwError(() => ({
          mensagem:
            erro instanceof HttpErrorResponse && erro.status === 404
              ? 'Não há feriados disponíveis para este ano.'
              : 'Não foi possível carregar os feriados agora. Tente novamente.'
        } satisfies ConsultaApiError))
      )
    );
  }
}
