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
import { CCsArrayItem, FilialSga } from '../../orcamentoRealizado/realizado/realizado.component';
import { CurvaService } from '../../../../services/baseOrcamentariaServices/curva/curva.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { GrupoItensService } from '../../../../services/baseOrcamentariaServices/orcamento/GrupoItens/grupo-itens.service';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { CentroCusto } from '../centrocusto/centrocusto.component';
import { ColaboradorService } from '../../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-home-orcamento',
  standalone: true,
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,ToastModule,
    FloatLabelModule,MultiSelectModule,DrawerModule,ProgressSpinnerModule,
    InputNumberModule,ProgressSpinnerModule,ButtonModule,MessageModule,
    FormsModule,RadioButtonModule,NzProgressModule,PaginatorModule,TooltipModule
  ],
  providers:[MessageService],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('2s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('efeitoFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 }))
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
  meuOrcadosResultadosCcsPai: any;
  realizadosResultadosCcsPai: any;
  meuRealizadosResultadosCcsPai: any;
  meuOrcadosResultadosGruposItens: any;
  totalMeuOrcadoCcPai: any;
  totalMeuOrcadoGruposItens: any;
  orcadosResultadosGruposItens: any;
  realizadosResultadosGruposItens: any;
  meuRealizadosResultadosGruposItens: any;
  ano: number = new Date().getFullYear();
  filial: number[] = [];
  periodo: any[] = [];
  filiaisSga: FilialSga[] = []
  //loading: boolean = true;
  loadingRealizado: boolean = false;
  loadingOrcado: boolean = false;
  loadingInicial: boolean = false;
  loadingInicial2: boolean = false;
  loadingInicial3: boolean = false;
  selectedCodManagers: any = '';

  ccsPais: { nome: string; orcado: number; realizado: number; gestor: string; orcadoFormatado: string; realizadoFormatado: string; porcentagem: number }[] = [];
  meuCcsPais: { nome: string; orcado: number; realizado: number; gestor: string; meuOrcadoFormatado: string; meuRealizadoFormatado: string; meuPorcentagem: number }[] = [];

  grupoItens: { nome: string; orcado: number; realizado: number; gestor: string; orcadoFormatado: string; realizadoFormatado: string; porcentagem: number }[] = [];
  meuGrupoItens: { nome: string; orcado: number; realizado: number; gestor: string; meuOrcadoFormatado: string; meuRealizadoFormatado: string; meuPorcentagem: number }[] = [];

  ccsPaisPaginados: any[] = []; // os da página atual
  meuCcsPaisPaginados: any[] = []; // os da página atual
  grupoItensPaginados: any[] = []; // os da página atual
  meuGrupoItensPaginados: any[] = []; // os da página atual
  
  primeiroItem: number = 0;
  meuPrimeiroItem: number = 0;
  itensPorPagina: number = 5;
  meuItensPorPagina: number = 5;
  primeiroItemGp: number = 0;
  meuPrimeiroItemGp: number = 0;
  itensPorPaginaGp: number = 5;  
  meuItensPorPaginaGp: number = 5;
  totalOrcadoCcPai: any;
  totalRealizadoCcPai: any;
  meuTotalRealizadoCcPai: any;
  meuTotalOrcadoCcPai: any;
  totalOrcadoGruposItens: any;
  meuTotalOrcadoGruposItens: any;
  totalRealizadoGruposItens: any;
  meuTotalRealizadoGruposItens: any;
  totalPorcentagem: any;
  meuTotalPorcentagem: any; 
  totalPorcentagemGp: any;
  meuTotalPorcentagemGp: any;

  totalOrcadoFormatado: string = '';
  meuTotalOrcadoFormatado: string = '';
  totalRealizadoFormatado: string = '';
  meuTotalRealizadoFormatado: string = '';
  totalPorcentagemFormatada: string = '';
  meuTotalPorcentagemFormatada: string = '';

  totalOrcadoFormatadoGp: string = '';
  meuTotalOrcadoFormatadoGp: string = '';
  totalRealizadoFormatadoGp: string = '';
  meuTotalRealizadoFormatadoGp: string = '';
  totalPorcentagemFormatadaGp: string = '';
  meuTotalPorcentagemFormatadaGp: string = '';

  meusGrupos: any;
  meusCcs: any;
  meusCcsCodigos: any;
  mostrarIndividual: boolean = false;
  exibirModal: boolean = false;

  selectedGruposItensCodigos: any[] = [];
  detalhesRealizadoGrupoItens: any[] = [];
  ccs:CCsArrayItem[] = [];
  dictOrcado:any;
  dictRealizado:any;
  totalRealizado!: any;
  meusCcsPaisUpdated:any;
  selectedFiliais: any[] = [];
  centrosCusto: CentroCusto[]| undefined;
  selectedAno: any = new Date().getFullYear();

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  constructor(
  private  loginService: LoginService,
  private curvaService: CurvaService,
  private messageService: MessageService,
  private grupoItensService: GrupoItensService,
  private centroCustoService: CentrocustoService,
  private colaboradorService: ColaboradorService 
  ){}

  ngOnInit(): void {
    
    if (!this.hasGroup(['Admin','Master'])) {
      this.mostrarIndividual = true;
      this.loadingInicial3 = true;
    }
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos 1
    this.periodo = Array.from({ length: mesAtual }, (_, i) => i + 1);
    // Só executa se for master ou admin
    if (this.hasGroup(['Master', 'Admin'])) {
      setTimeout(() => {
      this.calcularOrcado();
      this.calcularRealizado();
      this.loadingInicial = true;
      }, 1000);
    }
    //this.filtroInicial();
    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]
    if (this.hasGroup(['Master', 'Admin'])) {
    setTimeout(() => {
      this.filtroInicial();
    }, 30);
  }

    this.colaboradorService.getColaboradorInfo().subscribe(
      data => {
        this.selectedCodManagers = data.filial_detalhes.nome;

        // Aqui faz a conversão para o cod
        const filialObj = this.filiaisSga.find(f => f.codManager === this.selectedCodManagers);
        if (filialObj) {
          this.filial = [filialObj.cod];
        }
      }
    );

    this.calcsGestor();
    if (this.hasGroup(['OrcamentoGestorSetor', 'OrcamentoGestorItens'])&& !this.hasGroup(['Master', 'Admin'])) {
    setTimeout(() => {
      this.calcsGestor();
      this.calcularMeuOrcado();
      this.calcularMeuRealizadoCc();
    }, 2000);
  }

}

////////////////
  calcularMeusSetoreEGrupos(): void {
    this.mostrarIndividual = true;
    this.loadingInicial3 = true;
    this.calcsGestor();
    if (this.hasGroup(['Admin', 'Master'])) {
    setTimeout(() => {
      this.calcularMeuOrcado();
      this.calcularMeuRealizadoCc();
    }, 1000);
  }
  }

  calcsGestor(){
    this.grupoItensService.getMeusGruposItens().subscribe(
      response =>{
        this.meusGrupos = response.map((grupo: any) => grupo.codigo);
      },
      error => {
        console.error('Erro ao carregar meus grupos', error);
      } 
    );
    this.centroCustoService.getMeusCentrosCusto().subscribe(
      response => {
        this.meusCcs = response.map((centroCusto: any)=> centroCusto.cc_pai_detalhes?.id);
         this.meusCcs = Array.from(new Set(this.meusCcs)); // Remove duplicados aqui!
        this.carregarCcs(this.meusCcs);
        this.meusCcsCodigos = response.map((centroCusto: any)=> centroCusto.codigo);
         this.meusCcsCodigos = Array.from(new Set(this.meusCcsCodigos)); // Remove duplicados aqui!
      },
      error => {
        console.error('Erro ao carregar meus ccs', error);
      }
    );
  }

  carregarCcs(ccPaiId: any): void{
    this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
      centrosCusto =>{
        this.meusCcs = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
        this.meusCcs = Array.from(new Set(centrosCusto.map((centroCusto: any) => centroCusto.codigo)));
        this.meusCcs = Array.from(new Set(this.meusCcs)); // Remove duplicados aqui!
        this.meusCcsPaisUpdated = centrosCusto.map((centroCusto: any)=>centroCusto.cc_pai_detalhes?.id);
        this.meusCcsPaisUpdated = Array.from(new Set(this.meusCcsPaisUpdated)); // Remove duplicados aqui!
      }, error =>{
        console.error('Não rolou',error)
      }
    )
  }
    
  filtroInicial(): void {
    this.messageService.add({ severity: 'info', summary: 'Cálculos Iniciais', detail: 'Filial: Matriz | Período: Dia 01/01 até a presente data', life: 30000 });
  }  

  carregarFiltros(): void {
    this.exibirModal = true;
  }

  onFiliaisInformada(selectedCods: any[]): void{
    const filial = this.filiaisSga.filter(filial => selectedCods.includes(filial.cod));
    this.selectedCodManagers = filial.map(filial => filial.codManager).join(',');
  }

  calcularOrcado(): void {
    this.curvaService.getGarficoOrcamento(this.ano,this.periodo,this.selectedCodManagers).subscribe(
      (response) => {
        this.orcadosResultadosCcsPai = response.total_por_cc_pai;
        this.orcadosResultadosGruposItens = response.total_por_grupo_itens;
        this.totalOrcadoCcPai = response.total_cc;
        this.totalOrcadoGruposItens = response.total_grupo_itens;
        //this.loading = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        }

        reject(error); // Rejeita a Promise em caso de erro
      }
    );
  }

  calcularMeuOrcado(): void{
    this.loadingOrcado = true;
    this.carregarCcs(this.meusCcs);
    this.curvaService.getGarficoMeuOrcamentoGp(this.ano,this.periodo,this.selectedCodManagers,this.meusGrupos).subscribe(
      (response) => {
        //this.meuOrcadosResultadosCcsPai = response.total_por_cc_pai;
        this.meuOrcadosResultadosGruposItens = response.total_por_grupo_itens;
        //this.meuTotalOrcadoCcPai = response.total_cc;
        this.meuTotalOrcadoGruposItens = response.total_grupo_itens;
        //this.loading = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } //else {
          //this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        //}

        reject(error);

      }
    );
    
    this.curvaService.getGarficoMeuOrcamentoCc(this.ano,this.periodo,this.selectedCodManagers,this.meusCcsPaisUpdated).subscribe(
      (response) => {
        this.meuOrcadosResultadosCcsPai = response.total_por_cc_pai;
        this.meuTotalOrcadoCcPai = response.total_cc;
        this.loadingOrcado = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        }

        reject(error); // Rejeita a Promise em caso de erro
      }
    );
  }

  calcularMeuRealizadoCc(): void{
    this.loadingInicial3 = true;
    if (this.hasGroup(['OrcamentoGestorSetor'])){
    this.curvaService.calcularMeuRealizadoCc(this.ano,this.periodo,this.filial,this.meusCcs).subscribe(
      (response) => {
        this.meuRealizadosResultadosCcsPai = response.agrupado_por_pai;
        this.meuTotalRealizadoCcPai = response.total_soma_ccs;
        this.calcularMeuProgresso();
        this.calcularMeuProgressoGruposItens();
        this.loadingInicial3 = false;
      },
    
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        }
        
        reject(error); // Rejeita a Promise em caso de erro
      }
      
    )};
   if (this.hasGroup(['OrcamentoGestorItens'])){
    this.curvaService.calcularMeuRealizadoGp(this.ano,this.periodo,this.filial,this.meusGrupos).subscribe(
      (response) => {
        this.meuRealizadosResultadosGruposItens = response.dicionario_soma_nomes;
        this.meuTotalRealizadoGruposItens = response.total_soma_gps;
        this.calcularMeuProgresso();
        this.calcularMeuProgressoGruposItens();
        this.loadingInicial3 = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } //else {
          //this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        //}

        reject(error); // Rejeita a Promise em caso de erro
      }
    );
  }
}
  calcularRealizado(): void {
    
    this.curvaService.calcularRealizado(this.ano,this.periodo,this.filial).subscribe(
      (response) => {
        this.realizadosResultadosCcsPai = response.agrupado_por_pai;
        this.totalRealizadoCcPai = response.total_soma_ccs;
        this.realizadosResultadosGruposItens = response.dicionario_soma_nomes;
        this.totalRealizadoGruposItens = response.total_soma_gps;
        this.calcularProgresso();
        this.calcularProgressoGruposItens();
        this.loadingInicial = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
         // Exibe mensagem de erro apropriada
         if (error.status === 500) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno no servidor. Verifique os dados e tente novamente.' });
        } else if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
        }

        reject(error); // Rejeita a Promise em caso de erro
      }
    );    
  }

  calcular():void {
    if (this.hasGroup(['Master', 'Admin'])) {
    this.loadingInicial = true;
    this.loadingInicial2 = true;
    this.messageService.add({ severity: 'success', summary: 'Enviado!', detail: 'Aguarde um momento, os dados estão sendo processados.' });
    this.calcularOrcado();
    this.calcularRealizado();
    this.calcsGestor();
  }
    if (this.hasGroup(['OrcamentoGestorSetor', 'OrcamentoGestorItens'])) {
      this.loadingInicial3 = true;
      setTimeout(() => {
        this.calcsGestor();
        this.calcularMeuOrcado();
        this.calcularMeuRealizadoCc();
      }, 3000);
    }
  }
  calcularMeuProgresso(): void {
    
    // Verifica se os dados de orçado e realizado estão disponíveis
    if (!this.meuOrcadosResultadosCcsPai || !this.meuRealizadosResultadosCcsPai) {
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
    this.meuCcsPais = Object.keys(this.meuOrcadosResultadosCcsPai).map(nome => {
      // Trata o valor orçado
      const orcado = parseFloat(
        String(this.meuOrcadosResultadosCcsPai[nome]?.saldo || 0).replace(/\./g, '').replace(/,/g, '.')
      );
    
      // Trata o valor realizado
      let realizado = 0;
      if (this.meuRealizadosResultadosCcsPai[nome]) {
        try {
          const realizadoObj = JSON.parse(this.meuRealizadosResultadosCcsPai[nome].replace(/'/g, '"')); // Converte JSON inválido
          realizado = Number(realizadoObj?.saldo) || 0;
        } catch (error) {
          console.error(`Erro ao parsear JSON para ${nome}:`, this.meuRealizadosResultadosCcsPai[nome], error);
        }
      }
    
      // Calcula a porcentagem
      const porcentagem = orcado > 0 ? parseFloat(((realizado / orcado) * 100).toFixed(1)) : 0;
    
      return {
        nome: nome,
        orcado: orcado,
        realizado: realizado,
        gestor: this.meuOrcadosResultadosCcsPai[nome]?.gestor || 'N/A',
        meuOrcadoFormatado: formatarParaBRL(orcado),
        meuRealizadoFormatado: formatarParaBRL(realizado),
        meuPorcentagem: Math.min(porcentagem, 100)
      };
    });

    this.meuAtualizarPagina({ first: 0, rows: this.itensPorPagina });
  
        // Calcula o total orçado
    const totalOrcado = this.meuTotalOrcadoCcPai?.saldo
    ? parseFloat(String(this.meuTotalOrcadoCcPai.saldo).replace(/\./g, '').replace(/,/g, '.'))
    : 0;

    // Calcula o total realizado
    const totalRealizado = typeof this.meuTotalRealizadoCcPai === 'number'
    ? this.meuTotalRealizadoCcPai // Usa diretamente se for um número
    : parseFloat(String(this.meuTotalRealizadoCcPai?.saldo || 0).replace(/\./g, '').replace(/,/g, '.'));
    this.meuTotalPorcentagem = totalOrcado > 0 ? parseFloat(((totalRealizado / totalOrcado) * 100).toFixed(1)) : 0;
    // Formata os valores para exibição
    this.meuTotalOrcadoFormatado = formatarParaBRL(totalOrcado);
    this.meuTotalRealizadoFormatado = formatarParaBRL(totalRealizado);
    this.meuTotalPorcentagemFormatada = `${this.meuTotalPorcentagem.toFixed(1)}%`;

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
  }



  calcularMeuProgressoGruposItens(): void {

    // Verifica se os dados de orçado e realizado estão disponíveis
    if (!this.meuOrcadosResultadosGruposItens || !this.meuRealizadosResultadosGruposItens) {
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
    this.meuGrupoItens = Object.keys(this.meuOrcadosResultadosGruposItens).map(nome => {
      // Trata o valor orçado
      const orcado = parseFloat(
        String(this.meuOrcadosResultadosGruposItens[nome]?.saldo || 0).replace(/\./g, '').replace(/,/g, '.')
      );
  
      // Trata o valor realizado
      let realizado = 0;
      if (this.meuRealizadosResultadosGruposItens[nome]) {
        try {
          // Substitui 'None' por 'null' para corrigir o JSON
          const jsonCorrigido = this.meuRealizadosResultadosGruposItens[nome]
            .replace(/'/g, '"') // Substitui aspas simples por aspas duplas
            .replace(/None/g, 'null'); // Substitui 'None' por 'null'
          const realizadoObj = JSON.parse(jsonCorrigido); // Converte JSON corrigido
          realizado = Number(realizadoObj?.saldo) || 0;
        } catch (error) {
          console.error(`Erro ao parsear JSON para ${nome}:`, this.meuRealizadosResultadosGruposItens[nome], error);
        }
      }
  
      // Calcula a porcentagem
      const porcentagem = orcado > 0 ? parseFloat(((realizado / orcado) * 100).toFixed(1)) : 0;
      
  
      // Retorna o objeto formatado
      return {
        nome,
        orcado,
        realizado,
        gestor: this.meuOrcadosResultadosGruposItens[nome]?.gestor || 'N/A', // Adiciona o gestor
        meuOrcadoFormatado: formatarParaBRL(orcado),
        meuRealizadoFormatado: formatarParaBRL(realizado),
        meuPorcentagem: Math.min(porcentagem, 100) // Limita a porcentagem a no máximo 100%
      };
    });

    this.meuAtualizarPaginaGp({ first: 0, rows: this.itensPorPaginaGp });
  
    // Calcula o total orçado
    const totalOrcado = this.meuTotalOrcadoGruposItens?.saldo
      ? parseFloat(String(this.meuTotalOrcadoGruposItens.saldo).replace(/\./g, '').replace(/,/g, '.'))
      : 0;
  
    // Calcula o total realizado
    const totalRealizado = typeof this.meuTotalRealizadoGruposItens === 'number'
      ? this.meuTotalRealizadoGruposItens // Usa diretamente se for um número
      : parseFloat(String(this.meuTotalRealizadoGruposItens?.saldo || 0).replace(/\./g, '').replace(/,/g, '.'));
  
    this.meuTotalPorcentagemGp = totalOrcado > 0 ? parseFloat(((totalRealizado / totalOrcado) * 100).toFixed(1)) : 0;
    // Formata os valores para exibição
    this.meuTotalOrcadoFormatadoGp = formatarParaBRL(totalOrcado);
    this.meuTotalRealizadoFormatadoGp = formatarParaBRL(totalRealizado);
    this.meuTotalPorcentagemFormatadaGp = `${this.meuTotalPorcentagemGp.toFixed(1)}%`;

  }

  

  atualizarPagina(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.ccsPaisPaginados = this.ccsPais.slice(start, end);
  }

  meuAtualizarPagina(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.meuCcsPaisPaginados = this.meuCcsPais.slice(start, end);
  }

  atualizarPaginaGp(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.grupoItensPaginados = this.grupoItens.slice(start, end);
  }

  meuAtualizarPaginaGp(event: any) {
    const start = event.first;
    const end = start + event.rows;
    this.meuGrupoItensPaginados = this.meuGrupoItens.slice(start, end);
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

}
function reject(error: any) {
  throw new Error('Function not implemented.');
}

