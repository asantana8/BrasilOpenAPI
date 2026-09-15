import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/portal-consultas/portal-consultas-page.component').then((m) => m.PortalConsultasPageComponent)
  },
  {
    path: 'cnpj',
    loadComponent: () =>
      import('./pages/consulta-cnpj/consulta-cnpj-page.component').then((m) => m.ConsultaCnpjPageComponent)
  },
  {
    path: 'sgt',
    loadComponent: () =>
      import('./pages/consulta-sgt/consulta-sgt-page.component').then((m) => m.ConsultaSgtPageComponent)
  },
  {
    path: 'sgt-cnj',
    redirectTo: 'sgt',
    pathMatch: 'full'
  },
  {
    path: 'tpu',
    redirectTo: 'sgt',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }
];
