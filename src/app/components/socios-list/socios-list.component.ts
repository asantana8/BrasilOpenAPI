import { Component, input } from '@angular/core';
import { Socio } from '../../models/socio.model';

@Component({
  selector: 'app-socios-list',
  imports: [],
  templateUrl: './socios-list.component.html',
  styleUrl: './socios-list.component.scss'
})
export class SociosListComponent {
  readonly socios = input.required<Socio[]>();
}
