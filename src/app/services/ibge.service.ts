import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';

import { environment } from '../environments/environment';
import { ConsultaApiError } from '../models/consulta-api-error.model';
import { Municipio } from '../models/municipio.model';

@Injectable({ providedIn: 'root' })
export class IbgeService {
  private readonly http = inject(HttpClient);

  consultar(uf: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${environment.apiBaseUrl}/ibge/municipios/v1/${uf.toUpperCase()}`).pipe(
      timeout(15_000),
      catchError((erro: unknown) =>
        throwError(() => ({
          mensagem:
            erro instanceof HttpErrorResponse && erro.status === 404
              ? 'UF não encontrada. Use uma sigla válida, como PE ou SP.'
              : 'Não foi possível carregar os municípios agora. Tente novamente.'
        } satisfies ConsultaApiError))
      )
    );
  }
}
