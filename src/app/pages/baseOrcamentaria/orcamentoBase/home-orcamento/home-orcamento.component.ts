import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { trigger, transition, style, animate } from '@angular/animations';
import { FilialSga } from '../../orcamentoRealizado/realizado/realizado.component';
import { CurvaService } from '../../../../services/baseOrcamentariaServices/curva/curva.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-home-orcamento',
  standalone: true,
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,DividerModule,ToastModule,
    FloatLabelModule,MultiSelectModule,DrawerModule,
    InputNumberModule,ProgressSpinnerModule,
    FormsModule,RadioButtonModule,NzProgressModule,PaginatorModule,TooltipModule
  ],
  animations:[
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
  templateUrl: './home-orcamento.component.html',
  styleUrl: './home-orcamento.component.scss'
})
export class HomeOrcamentoComponent implements OnInit {
  orcadosResultadosCcsPai: any;
  realizadosResultadosCcsPai: any;
  orcadosResultadosGruposItens: any;
  realizadosResultadosGruposItens: any;
  ano: number = 2025;
  filial: number[] = [0, 1,2, 3,4, 5,6, 7];
  periodo: any[] = [];
  filiaisSga: FilialSga[] = []
  loading: boolean = false;
  selectedCodManagers: any[] = [
    'Matriz','F07 - CD MPA','F08 - UP ATM','F09 - CD MFL',
     'F09 - CD MFL' ]

  ccsPais: { nome: string; orcado: number; realizado: number; gestor: string; orcadoFormatado: string; realizadoFormatado: string; porcentagem: number }[] = [];
  grupoItens: { nome: string; orcado: number; realizado: number; gestor: string; orcadoFormatado: string; realizadoFormatado: string; porcentagem: number }[] = [];

  ccsPaisPaginados: any[] = []; // os da página atual
  grupoItensPaginados: any[] = []; // os da página atual
  
  
  primeiroItem: number = 0;
  itensPorPagina: number = 5;
  
  primeiroItemGp: number = 0;
  itensPorPaginaGp: number = 5;  
  
  totalOrcadoCcPai: any;
  totalRealizadoCcPai: any;
  totalOrcadoGruposItens: any;
  totalRealizadoGruposItens: any;
  totalPorcentagem: any; 
  totalPorcentagemGp: any;

  totalOrcadoFormatado: string = '';
  totalRealizadoFormatado: string = '';
  totalPorcentagemFormatada: string = '';

  totalOrcadoFormatadoGp: string = '';
  totalRealizadoFormatadoGp: string = '';
  totalPorcentagemFormatadaGp: string = '';

  exibirModal: boolean = false;
  
  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  constructor(
  private  loginService: LoginService,
  private curvaService: CurvaService
  ){}

  ngOnInit(): void {
    this.loading = true;
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos 1
  this.periodo = Array.from({ length: mesAtual }, (_, i) => i + 1);
    this.calcularOrcado();
    this.calcularRealizado();

    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]
   
    } 

  carregarFiltros(): void {
    this.exibirModal = true;
  }

  calcularOrcado(): void {
    this.curvaService.getGarficoOrcamento(this.ano,this.periodo,this.selectedCodManagers).subscribe(
      (response) => {
        this.orcadosResultadosCcsPai = response.total_por_cc_pai;
        console.log('Dados do orcadosResultadosCcsPai:', this.orcadosResultadosCcsPai);
        this.orcadosResultadosGruposItens = response.total_por_grupo_itens;
        console.log('Dados do orcadosResultadosGruposItens:', this.orcadosResultadosGruposItens);
        this.totalOrcadoCcPai = response.total_cc;
        //console.log('totalOrcadoCcPai:', this.totalOrcadoCcPai);
        this.totalOrcadoGruposItens = response.total_grupo_itens;
        //console.log('totalOrcadoGruposItens:', this.totalOrcadoGruposItens);
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );
  }

  calcularRealizado(): void {
    this.curvaService.calcularRealizado(this.ano,this.periodo,this.filial).subscribe(
      (response) => {
        this.realizadosResultadosCcsPai = response.agrupado_por_pai;
        //console.log('Dados do CCS rEALIZADOS', this.realizadosResultadosCcsPai);
        this.totalRealizadoCcPai = response.total_soma_ccs;
        console.log('totalRealizadoCcPai:', this.totalRealizadoCcPai);
        this.realizadosResultadosGruposItens = response.dicionario_soma_nomes;
        //console.log('Dados do realizadosResultadosGruposItens:', this.realizadosResultadosGruposItens);
        this.totalRealizadoGruposItens = response.total_soma_gps;
        //console.log('totalRealizadoGruposItens:', this.totalRealizadoGruposItens);
        this.calcularProgresso();
        this.calcularProgressoGruposItens();
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );    
  }

  calcular():void {
    this.calcularOrcado();
    this.calcularRealizado();
  }

  calcularProgresso(): void {
    // Verifica se os dados de orçado e realizado estão disponíveis
    if (!this.orcadosResultadosCcsPai || !this.realizadosResultadosCcsPai) {
      //console.error('Dados de orçado ou realizado estão ausentes.');
      return;
    }
  
    const formatarParaBRL = (valor: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      }).format(valor);
    };

    // Calcula a porcentagem para cada ccPai
    this.ccsPais = Object.keys(this.orcadosResultadosCcsPai).map(nome => {
      // Trata o valor orçado
      const orcado = parseFloat(
        String(this.orcadosResultadosCcsPai[nome]?.saldo || 0).replace(/\./g, '').replace(/,/g, '.')
      );
    
      // Trata o valor realizado
      let realizado = 0;
      if (this.realizadosResultadosCcsPai[nome]) {
        try {
          const realizadoObj = JSON.parse(this.realizadosResultadosCcsPai[nome].replace(/'/g, '"')); // Converte JSON inválido
          realizado = Number(realizadoObj?.saldo) || 0;
        } catch (error) {
          console.error(`Erro ao parsear JSON para ${nome}:`, this.realizadosResultadosCcsPai[nome], error);
        }
      }
    
      // Calcula a porcentagem
      const porcentagem = orcado > 0 ? parseFloat(((realizado / orcado) * 100).toFixed(1)) : 0;
      
      // Retorna o objeto formatado
      return {
        nome,
        orcado,
        realizado,
        gestor: this.orcadosResultadosCcsPai[nome]?.gestor || 'N/A', // Adiciona o gestor
        orcadoFormatado: formatarParaBRL(orcado),
        realizadoFormatado: formatarParaBRL(realizado),
        porcentagem: Math.min(porcentagem, 100) // Limita a porcentagem a no máximo 100%
      };
    });
    this.atualizarPagina({ first: 0, rows: this.itensPorPagina });
  
        // Calcula o total orçado
    const totalOrcado = this.totalOrcadoCcPai?.saldo
    ? parseFloat(String(this.totalOrcadoCcPai.saldo).replace(/\./g, '').replace(/,/g, '.'))
    : 0;

    // Calcula o total realizado
    const totalRealizado = typeof this.totalRealizadoCcPai === 'number'
    ? this.totalRealizadoCcPai // Usa diretamente se for um número
    : parseFloat(String(this.totalRealizadoCcPai?.saldo || 0).replace(/\./g, '').replace(/,/g, '.'));

    this.totalPorcentagem = totalOrcado > 0 ? parseFloat(((totalRealizado / totalOrcado) * 100).toFixed(1)) : 0;

    // Formata os valores para exibição
    this.totalOrcadoFormatado = formatarParaBRL(totalOrcado);
    this.totalRealizadoFormatado = formatarParaBRL(totalRealizado);
    this.totalPorcentagemFormatada = `${this.totalPorcentagem.toFixed(1)}%`;

    console.log('Total Orçado (BRL):', this.totalOrcadoFormatado);
    console.log('Total Realizado (BRL):', this.totalRealizadoFormatado);
    console.log('Porcentagem Total:', this.totalPorcentagemFormatada);

  }

  calcularProgressoGruposItens(): void {
    // Verifica se os dados de orçado e realizado estão disponíveis
    if (!this.orcadosResultadosGruposItens || !this.realizadosResultadosGruposItens) {
      return;
    }
  
    const formatarParaBRL = (valor: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      }).format(valor);
    };
  
    // Calcula a porcentagem para cada grupoItem
    this.grupoItens = Object.keys(this.orcadosResultadosGruposItens).map(nome => {
      // Trata o valor orçado
      const orcado = parseFloat(
        String(this.orcadosResultadosGruposItens[nome]?.saldo || 0).replace(/\./g, '').replace(/,/g, '.')
      );
  
      // Trata o valor realizado
      let realizado = 0;
      if (this.realizadosResultadosGruposItens[nome]) {
        try {
          // Substitui 'None' por 'null' para corrigir o JSON
          const jsonCorrigido = this.realizadosResultadosGruposItens[nome]
            .replace(/'/g, '"') // Substitui aspas simples por aspas duplas
            .replace(/None/g, 'null'); // Substitui 'None' por 'null'
          const realizadoObj = JSON.parse(jsonCorrigido); // Converte JSON corrigido
          realizado = Number(realizadoObj?.saldo) || 0;
        } catch (error) {
          console.error(`Erro ao parsear JSON para ${nome}:`, this.realizadosResultadosGruposItens[nome], error);
        }
      }
  
      // Calcula a porcentagem
      const porcentagem = orcado > 0 ? parseFloat(((realizado / orcado) * 100).toFixed(1)) : 0;
      
  
      // Retorna o objeto formatado
      return {
        nome,
        orcado,
        realizado,
        gestor: this.orcadosResultadosGruposItens[nome]?.gestor || 'N/A', // Adiciona o gestor
        orcadoFormatado: formatarParaBRL(orcado),
        realizadoFormatado: formatarParaBRL(realizado),
        porcentagem: Math.min(porcentagem, 100) // Limita a porcentagem a no máximo 100%
      };
    });

    this.atualizarPaginaGp({ first: 0, rows: this.itensPorPaginaGp });
  
    // Calcula o total orçado
    const totalOrcado = this.totalOrcadoGruposItens?.saldo
      ? parseFloat(String(this.totalOrcadoGruposItens.saldo).replace(/\./g, '').replace(/,/g, '.'))
      : 0;
  
    // Calcula o total realizado
    const totalRealizado = typeof this.totalRealizadoGruposItens === 'number'
      ? this.totalRealizadoGruposItens // Usa diretamente se for um número
      : parseFloat(String(this.totalRealizadoGruposItens?.saldo || 0).replace(/\./g, '').replace(/,/g, '.'));
  
    this.totalPorcentagemGp = totalOrcado > 0 ? parseFloat(((totalRealizado / totalOrcado) * 100).toFixed(1)) : 0;
  
    // Formata os valores para exibição
    this.totalOrcadoFormatadoGp = formatarParaBRL(totalOrcado);
    this.totalRealizadoFormatadoGp = formatarParaBRL(totalRealizado);
    this.totalPorcentagemFormatadaGp = `${this.totalPorcentagemGp.toFixed(1)}%`;
  
    console.log('Total Orçado GP (BRL):', this.totalOrcadoFormatadoGp);
    console.log('Total Realizado GP (BRL):', this.totalRealizadoFormatadoGp);
    console.log('Porcentagem Total GP:', this.totalPorcentagemFormatadaGp);
  }
  

  atualizarPagina(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.ccsPaisPaginados = this.ccsPais.slice(start, end);
  }

  atualizarPaginaGp(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.grupoItensPaginados = this.grupoItens.slice(start, end);
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

}
