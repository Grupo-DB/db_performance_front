import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homeproducao',
  standalone: true,
  imports: [
    DividerModule,RouterModule
  ],
  templateUrl: './homeproducao.component.html',
  styleUrl: './homeproducao.component.scss'
})
export class HomeproducaoComponent {

}
