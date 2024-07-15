import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoginService } from '../../services/login/login.service';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeriodoService } from '../../services/periodos/periodo.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [
    RouterLink,RouterOutlet,TabMenuModule,CommonModule, RouterOutlet, NzIconModule,NzUploadModule, 
    NzLayoutModule, NzMenuModule,RouterLink,DividerModule,CalendarModule,FormsModule,ReactiveFormsModule,
  ],

  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.scss'
})
export class AvaliacaoComponent implements OnInit{
  periodoPermitido: boolean = false; // Inicializar a propriedade aqui
  dataInicio: Date | null = null;
  dataFim: Date | null = null;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private loginService: LoginService,
    private periodoService: PeriodoService
  )
  {
  }
  ngOnInit(): void {
    this.periodoService.getPeriodo().subscribe((response) => {
      if (response.dataInicio) {
        this.dataInicio = new Date(response.dataInicio);
      }
      if (response.dataFim) {
        this.dataFim = new Date(response.dataFim);
      }
      this.verificarPeriodo();
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  verificarPeriodo(): void {
    const agora = new Date();
    if (this.dataInicio && this.dataFim) {
      this.periodoPermitido = agora >= this.dataInicio && agora <= this.dataFim;
    }
  }

  salvarPeriodo(): void {
    const data = {
      dataInicio: this.dataInicio ? this.dataInicio.toISOString().split('T')[0] : '',
      dataFim: this.dataFim ? this.dataFim.toISOString().split('T')[0] : ''
    };
    this.periodoService.setPeriodo(data).subscribe((response) => {
      console.log('Período salvo com sucesso:', response);
      this.verificarPeriodo();
    });
  }
}



