import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService,ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TagModule } from 'primeng/tag';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Ensaio } from '../ensaio/ensaio.component';
import { CalculoEnsaio } from '../calculo-ensaio/calculo-ensaio.component';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-resultados',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, 
    InputMaskModule, DialogModule, ConfirmDialogModule, 
    SelectModule, IconFieldModule, FloatLabelModule, TableModule, 
    InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule, 
    DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, 
    InputNumberModule, CardModule, InplaceModule, TooltipModule, 
    TagModule,MultiSelectModule,DatePickerModule
  ],
    providers:[
       MessageService,ConfirmationService
  ],
  animations: [
    trigger('efeitoFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 }))
      ])
    ]),
    trigger('efeitoZoom', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('0.5s ease-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('swipeAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('swipeAnimationReverse', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {
  ensaios: Ensaio[] = [];
  calculos: CalculoEnsaio[] = [];
  data_inicio: Date | null = null;
  data_fim: Date | null = null;
  ensaiosSelecionados: number[] = [];
  calculosSelecionados: string[] = [];
  mediasEnsaios: any[] = [];
  mediasCalculos: any[] = [];
  totalEnsaios: number = 0;
  totalCalculos: number = 0;
  
  constructor(
    private analiseService: AnaliseService,
    private loginService: LoginService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private amostraService: AmostraService,
    private ensaioService: EnsaioService
  ){}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void { 
    this.getEnsaios();
    this.getCalculos();
  }

  getEnsaios(): void{
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response;
      }, error => {
        console.error('Erro ao obter os ensaios:', error);
      }
    )
  }

  getCalculos(): void{
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.calculos = response;
      }, error => {
        console.error('Erro ao obter os cálculos:', error);
      }
    )
  }

  buscarMediasEnsaios(): void {
    if (!this.ensaiosSelecionados || this.ensaiosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um ensaio',
        life: 3000
      });
      return;
    }

    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    // Formatar datas para string no formato esperado pelo backend (YYYY-MM-DD)
    const dataInicio = this.formatarDataParaBackend(this.data_inicio);
    const dataFim = this.formatarDataParaBackend(this.data_fim);

    this.analiseService.getMediasEnsaiosPorPeriodo(
      this.ensaiosSelecionados,
      dataInicio,
      dataFim
    ).subscribe({
      next: (response: any) => {
        this.mediasEnsaios = response.resultados || [];
        this.totalEnsaios = response.total_ensaios || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.totalEnsaios} ensaio(s) encontrado(s)`,
          life: 3000
        });
      },
      error: (err: any) => {
        console.error('Erro ao obter médias dos ensaios:', err);
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Timeout!',
            detail: 'Sessão expirada! Por favor faça o login novamente.'
          });
        } else if (err.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Acesso negado!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao buscar médias dos ensaios.'
          });
        }
      }
    });
  }

  buscarMediasCalculos(): void {
    if (!this.calculosSelecionados || this.calculosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um cálculo',
        life: 3000
      });
      return;
    }

    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    // Formatar datas para string no formato esperado pelo backend (YYYY-MM-DD)
    const dataInicio = this.formatarDataParaBackend(this.data_inicio);
    const dataFim = this.formatarDataParaBackend(this.data_fim);

    // Enviar descrições dos cálculos ao invés de IDs
    this.analiseService.getMediasCalculosPorPeriodo(
      this.calculosSelecionados,
      dataInicio,
      dataFim
    ).subscribe({
      next: (response: any) => {
        this.mediasCalculos = response.resultados || [];
        this.totalCalculos = response.total_calculos || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.totalCalculos} cálculo(s) encontrado(s)`,
          life: 3000
        });
      },
      error: (err: any) => {
        console.error('Erro ao obter médias dos cálculos:', err);
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Timeout!',
            detail: 'Sessão expirada! Por favor faça o login novamente.'
          });
        } else if (err.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Acesso negado!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao buscar médias dos cálculos.'
          });
        }
      }
    });
  }

  private formatarDataParaBackend(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

}
