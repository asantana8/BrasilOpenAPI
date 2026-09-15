import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-modulos-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './modulos-nav.component.html',
  styleUrl: './modulos-nav.component.scss'
})
export class ModulosNavComponent {}
