import { Component } from '@angular/core';

export interface Analise {
  id: number;
  data: string;
  amostra: any;
  estado: string;
}


@Component({
  selector: 'app-analise',
  imports: [],
  templateUrl: './analise.component.html',
  styleUrl: './analise.component.scss'
})
export class AnaliseComponent {

}
