import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
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
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { CalculoEnsaio } from '../calculo-ensaio/calculo-ensaio.component';
import { Ensaio } from '../ensaio/ensaio.component';

@Component({
  selector: 'app-acompanhamento',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, 
    InputMaskModule, DialogModule, ConfirmDialogModule, CheckboxModule, AccordionModule,
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
  templateUrl: './acompanhamento.component.html',
  styleUrl: './acompanhamento.component.scss'
})
export class AcompanhamentoComponent implements OnInit {
    ensaios: Ensaio[] = [];
    calculos: CalculoEnsaio[] = [];
    locaisSelecionados: string[] = [];
    locaisColeta: any[] = [];
    data_inicio: Date | null = null;
    data_fim: Date | null = null;
    apenas_finalizadas: boolean = false;
    ensaiosSelecionados: number[] = [];
    calculosSelecionados: string[] = [];
    resultadosAcompanhamento: any[] = [];
    totalAnalises: number = 0;
    periodoSelecionado: any = null;
    totalPrevisto: number = 0;
    totalRealizado: number = 0;
    laboratorioSelecionado: string = '';
    laboratorios = [
      { label: 'Matriz', value: 'Matriz' },
      { label: 'ATM', value: 'ATM' },
    ];
    agruparPor: string = 'laboratorio';
    opcoesAgrupamento = [
      { label: 'Laboratório', value: 'laboratorio' },
      { label: 'Local de Coleta', value: 'local_coleta' }
    ];
    resultadosAgrupados: any[] = [];
    totaisGeraisAgrupados: any = null;
    exibirTabelaAgrupada: boolean = false;
    laboratorioAgrupado: string = '';
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
      this.getLocaisDeColeta();
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

  getLocaisDeColeta(): void {
    this.amostraService.getLocaisDeColeta().subscribe(
      response => {
        console.log('Response da API locais:', response);
        
        // A API retorna um objeto { total: number, locais_coleta: string[] }
        const locaisArray = (response as any)?.locais_coleta || response;
        
        if (Array.isArray(locaisArray)) {
          // Transformar array de strings em array de objetos
          this.locaisColeta = locaisArray.map((local: any, index: number) => ({
            id: typeof local === 'string' ? index : (local.id || index),
            descricao: typeof local === 'string' ? local : (local.descricao || local.value || local)
          }));
          console.log('locaisColeta transformado:', this.locaisColeta);
        } else {
          console.error('locais_coleta não é um array:', locaisArray);
          this.locaisColeta = [];
        }
      }, error => {
        console.error('Erro ao obter os locais de coleta:', error);
        this.locaisColeta = [];
      }
    );
  }

  buscarAcompanhamentos(): void {
    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    if (!this.locaisSelecionados || this.locaisSelecionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um local de coleta',
        life: 3000
      });
      return;
    }

    // Formatar datas para string no formato YYYY-MM-DD
    const dataInicial = this.formatarDataParaBackend(this.data_inicio);
    const dataFinal = this.formatarDataParaBackend(this.data_fim);

    // Enviar requisição única com todos os locais selecionados
    this.analiseService.getAcompanhamentoTempoPorAnalise(
      dataInicial,
      dataFinal,
      this.locaisSelecionados,
      this.apenas_finalizadas,
      this.laboratorioSelecionado
    ).subscribe({
      next: (response: any) => {
        console.log('Acompanhamento obtido:', response);
        this.resultadosAcompanhamento = response.resultados || [];
        this.totalAnalises = response.total_analises || 0;
        this.periodoSelecionado = response.periodo || null;
        this.totalPrevisto = response.totais_gerais.tempo_previsto_total || 0;
        this.totalRealizado = response.totais_gerais.tempo_trabalho_total || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.totalAnalises} análise(s) encontrada(s)`,
          life: 3000
        });
      },
      error: (error: any) => {
        console.error('Erro ao buscar acompanhamento:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar dados de acompanhamento',
          life: 3000
        });
      }
    });
  }

   private formatarDataParaBackend(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  buscarAnaliseAgrupada(): void {
    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    const dataInicial = this.formatarDataParaBackend(this.data_inicio);
    const dataFinal = this.formatarDataParaBackend(this.data_fim);

    this.analiseService.getAnaliseAgrupada(
      dataInicial,
      dataFinal,
      this.agruparPor,
      this.laboratorioAgrupado
    ).subscribe({
      next: (response: any) => {
        console.log('Análises agrupadas obtidas:', response);
        const resultados = response.resultados || [];
        
        // Encontrar o registro de totais (local_coleta ou laboratorio === "TOTAL" ou "Todos")
        const registroTotais = resultados.find((r: any) => 
          r.local_coleta === 'TOTAL' || r.laboratorio === 'TOTAL' || 
          r.local_coleta === 'Todos' || r.laboratorio === 'Todos'
        );
        
        if (registroTotais) {
          // Extrair valores, tratando objetos parsedValue
          this.totaisGeraisAgrupados = {
            quantidade_analises: registroTotais.quantidade_analises,
            tempo_previsto: registroTotais.tempo_previsto,
            tempo_trabalho: registroTotais.tempo_trabalho,
            percentual_previsto: typeof registroTotais.percentual_previsto === 'object' 
              ? registroTotais.percentual_previsto.parsedValue 
              : registroTotais.percentual_previsto,
            percentual_trabalho: typeof registroTotais.percentual_trabalho === 'object'
              ? registroTotais.percentual_trabalho.parsedValue
              : registroTotais.percentual_trabalho
          };
          
          // Remover o registro de totais da lista de resultados
          this.resultadosAgrupados = resultados.filter((r: any) => 
            r.local_coleta !== 'TOTAL' && r.laboratorio !== 'TOTAL' &&
            r.local_coleta !== 'Todos' && r.laboratorio !== 'Todos'
          );
        } else {
          this.resultadosAgrupados = resultados;
          this.totaisGeraisAgrupados = null;
        }
        
        this.exibirTabelaAgrupada = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.resultadosAgrupados.length} resultado(s) encontrado(s)`,
          life: 3000
        });
      },
      error: (error: any) => {
        console.error('Erro ao buscar análises agrupadas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar dados agrupados',
          life: 3000
        });
      }
    });
  }
}
