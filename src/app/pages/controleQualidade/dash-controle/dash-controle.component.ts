import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ArquivoComponent } from '../arquivo/arquivo.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule, IconField } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule, InputIcon } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { Table, TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { keyframes } from '@angular/animations';
import { ConfirmationService } from 'primeng/api';
import { Chart, ChartType } from 'chart.js';
import { Amostra } from '../amostra/amostra.component';
import { Ordem } from '../ordem/ordem.component';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import jsPDF from 'jspdf';
import autoTable, { CellInput } from "jspdf-autotable";
@Component({
  selector: 'app-dash-controle',
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,ToastModule,FormsModule,ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink,InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule, CheckboxModule, TreeTableModule
  ],
  providers: [MessageService],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('2s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('efeitoFade',[
      transition(':enter',[
        style({ opacity: 0 }),
        animate('2s', style({ opacity:1 }))
      ])
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
  templateUrl: './dash-controle.component.html',
  styleUrl: './dash-controle.component.scss'
})

export class DashControleComponent implements OnInit {

  chart: Chart | undefined;

  ngOnInit(): void {
    setTimeout(() => {
      const canvas = document.getElementById('chart') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 🔹 Labels (datas)
      const labels = this.exemplos.map(e => e.data);

      // 🔹 Valores (exemplo: só para simulação vou usar ID como valor)
      const values = this.exemplos.map(e => e.id);

      // Criar gráfico
      this.chart = new Chart(ctx, {
        type: 'line' as ChartType,
        data: {
          labels,
          datasets: [
            {
              label: 'Análises',
              data: values,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
              fill: true,
              tension: 0.3,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }, 0);
  }

  exemplos = [
    { id: 101, material: 'Cimento', data: '2025-09-29', status: 'Pendente' },
    { id: 102, material: 'Areia', data: '2025-09-29', status: 'Finalizada' },
    { id: 103, material: 'Argamassa', data: '2025-09-28', status: 'Aprovada' },
    { id: 104, material: 'Concreto', data: '2025-09-27', status: 'Laudo' },
  ];

  constructor(
    private loginService: LoginService,
  ){}
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
}

