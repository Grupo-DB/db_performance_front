import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { GrupoItensService } from '../../../../services/baseOrcamentariaServices/orcamento/GrupoItens/grupo-itens.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { GrupoItens } from '../../orcamentoBase/grupo-itens/grupo-itens.component';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';
import { CentroCustoPai } from '../../orcamentoBase/centrocustopai/centrocustopai.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilialService } from '../../../../services/avaliacoesServices/filiais/registerfilial.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { DrawerModule } from 'primeng/drawer';
import { MeterGroupModule } from 'primeng/metergroup';
import { CardModule } from 'primeng/card';
import { OrcamentoBaseService } from '../../../../services/baseOrcamentariaServices/orcamento/OrcamentoBase/orcamento-base.service';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { CentroCusto } from '../../orcamentoBase/centrocusto/centrocusto.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { trigger, transition, style, animate } from '@angular/animations';
import { InplaceModule } from 'primeng/inplace';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Chart } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { RaizAnaliticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizAnalitica/raiz-analitica.service';


export interface CCsArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface ccsOrcadosArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}

export interface CCsPaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}

export interface FilialSga{
  nome: string;
  cod: number;
  codManager: string;
}

@Component({
  selector: 'app-orcamentogrupoitens',
  imports: [
    DividerModule, CommonModule, NzMenuModule, RouterLink, FloatLabelModule, MultiSelectModule, SelectModule,
    FormsModule, ReactiveFormsModule, InputNumberModule, DrawerModule, MeterGroupModule, ToastModule, AvatarModule,
    CardModule, TableModule, TooltipModule, InplaceModule, ProgressSpinnerModule, ButtonModule, MessageModule,
],
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
      ],
  templateUrl: './orcamentogrupoitens.component.html',
  styleUrl: './orcamentogrupoitens.component.scss'
})
export class OrcamentogrupoitensComponent {
  gruposItens:GrupoItens []| undefined;
  gestores: any[] = [];
  selectedGestor: any = null;
  ccsPais: CentroCustoPai[] | undefined;
  centrosCusto: CentroCusto[]| undefined;
  selectedCcsPais: any[] = [];
  selectedGruposItens: any[] = [];
  selectedGruposItensCodigos: any[] = [];
  selectedFiliais: any[] = [];
  filiaisSga: FilialSga[] = []
  ccs:CCsArrayItem[] = [];
  ccsPaisArray:CCsPaisArrayItem[] = [];
  ccsOrcadosArray:ccsOrcadosArrayItem[] = [];
  gruposPorGestor: any[] = [];
  percent: any;
  gestor:any;
  detalhesRealizadoGrupoItens: any[] = [];
  detalhesRealizadoCC: any[] = [];
  selectedAno: number = 2025;
  detalhes: any | undefined;
  selectedCodManagers: any;
  totalRealizado!: any;
  totalOrcado!: any;
  totalOrcadoFormatado!: any;
  totalSaldo!: any;
  modalRealizado: boolean = false;
  ModalOrcado: boolean = false;
  modalDetalhesLancamentos: boolean = false;
  meusGrupos: any;
  meusCcs: any;
  totalCC: any;
  loading: boolean = false;
  loading2: boolean = false;

  dictOrcado:any;
  dictRealizado:any;
  graficoTotalOrcadoRealizado:Chart<'bar'> | undefined;

  periodo!: number;

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));
  dropdown: any;

  constructor(
    private loginService: LoginService,
    private grupoItensService: GrupoItensService,
    private ccPaiService: CentrocustopaiService,
    private filialService: FilialService,
    private orcamentoBaseService: OrcamentoBaseService,
    private centroCustoService: CentrocustoService,
    private messageService: MessageService,
    private raizAnaliticaService: RaizAnaliticaService
  ) { }
  ngOnInit(): void {
    // Carregar lista de gestores para filtragem (Admin/Master)
    this.raizAnaliticaService.getGestores().subscribe({
      next: (gestores) => {
        this.gestores = gestores;
      },
      error: (err) => console.error('Erro ao carregar gestores', err)
    });

    this.grupoItensService.getGruposItens().subscribe((data) => {
      this.gruposItens = data;
      this.gruposItens = this.gruposItens.filter(
        (item, index, self) =>
        index === self.findIndex((t) => t.nome_completo === item.nome_completo)
      );
    });
    this.ccPaiService.getCentrosCustoPai().subscribe((data) => {
      this.ccsPais = data;
    });

    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]

    this.calcsGestor();
  }
  onGestorSelecionado(gestorId: any): void {
    this.selectedGestor = gestorId;
    // Limpa seleções atuais de grupos/ccs ao trocar de gestor
    this.selectedGruposItens = [];
    this.selectedGruposItensCodigos = [];

    if (!gestorId) return;

    this.grupoItensService.getGrupoItensByGestor(gestorId).subscribe({
      next: (grupos) => {
        // Atualiza a lista que alimenta o MultiSelect de grupos (Admin/Master)
        this.gruposItens = grupos as any;
      },
      error: (err) => console.error('Erro ao carregar grupos do gestor', err)
    });
  }

  calcsGestor(){
    this.grupoItensService.getMeusGruposItens().subscribe(
      response =>{
        this.meusGrupos = response;
      },
      error => {
        console.error('Erro ao carregar meus grupos', error);
      } 
    );
    this.centroCustoService.getMeusCentrosCusto().subscribe(
      response => {
        this.meusCcs = response;
      },
      error => {
        console.error('Erro ao carregar meus ccs', error);
      }
    );
  }
  
  onGrupoItensSelecionado(grupoItensId: any[]): void {
    // Mapeamento dos ids para os códigos correspondentes
    const grupoItensMap: { [key: string]: string } = this.gruposItens?.reduce((map, item) => {
      map[item.id] = item.codigo;
      return map;
    }, {} as { [key: string]: string }) || {};

    // Converte os ids para códigos
    const selectedGruposItensCodigos = grupoItensId.map(id => grupoItensMap[id]);

    this.selectedGruposItens = grupoItensId; // Mantém os ids para o método grupoItensDetalhes
    this.selectedGruposItensCodigos = selectedGruposItensCodigos; // Mantém os códigos para o método calculosOrcamentosRealizados

    if (grupoItensId.length <= 1) {
      this.grupoItensDetalhes();
    } else {
     //this.executarCalculos();
    }
  }

  grupoItensDetalhes():Promise <void>{
    return new Promise((resolve, reject) => {     
      if(this.selectedGruposItens !== undefined){
        this.loading = true;
        this.grupoItensService.getGrupoItensDetalhes(this.selectedGruposItens).subscribe(
          (response) => {
            this.gestor = response;
            resolve(); // Resolve a Promise após a conclusão
            this.loading = false;
          },
          error =>{
            console.error('Não carregou', error)
          }
        )
      }
    })
  }

  onCcPaiSelecionado(ccPaiId: any[]): void {
    if (ccPaiId.length <= 1) {
      this.selectedCcsPais = ccPaiId; // Atualiza a variável
      this.carregarCcs(ccPaiId);
      
    } else {
      this.selectedCcsPais = ccPaiId;
      this.carregarCcs(ccPaiId);
    }
  }

  carregarCcs(ccPaiId: any): void{
    this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
      centrosCusto =>{
        this.centrosCusto = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
        this.detalhes = centrosCusto[0];
      }, error =>{
        console.error('Não rolou',error)
      }
      
    )
  }

  realizadoDetalhes(){
    this.modalRealizado = true;
  }
  orcadoDetalhes(){
    this.ModalOrcado = true;
  }

  onFiliaisInformada(selectedCods: any[]): void{
    const selectedFiliais = this.filiaisSga.filter(filial => selectedCods.includes(filial.cod));
    this.selectedCodManagers = selectedFiliais.map(filial => filial.codManager).join(',');
    // this.calculosOrcamentosRealizados();
    // this.orcamentosByGrupoItens();
  }

  onAnoInformado(ano: any):void{      
    this.selectedAno = ano;
  }


calculosOrcamentosRealizados(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (this.selectedGruposItensCodigos.length !== null) {
      let totalRealizadoAcumulado = 0; // Variável para acumular o total realizado
      this.loading = true;
      this.grupoItensService.calcularOrcamentoRealizado(this.selectedGruposItensCodigos, this.centrosCusto, this.selectedFiliais,this.periodo, this.selectedAno).subscribe(
        response => {
          totalRealizadoAcumulado += response.total; // Acumula o total realizado
          this.detalhesRealizadoGrupoItens = response.agrupado_por_pai;
          this.ccs = Object.keys(response.agrupado_por_pai).map((key) => ({
            label: key,
            color1: '#1b91ff',
            color2: '#fbbf24',
            value: response.agrupado_por_pai[key],
            icon: 'pi pi-table',
          }));
          this.dictRealizado = response.agrupado_por_pai;
          this.totalRealizado = totalRealizadoAcumulado; // Atualiza o total realizado acumulado
          resolve(); // Resolve a Promise após os cálculos estarem prontos
          this.loading = false;
        },
        erro => {
          console.error('Erro ao calcular realizado:', erro);
          reject(erro); // Rejeita a Promise em caso de erro
        }
      );
    } else {
      resolve(); // Resolve imediatamente se não houver cálculos a serem feitos
    }
  });
}

async executarCalculos(): Promise<void> {
  this.messageService.add({ severity: 'success', summary: 'Enviado!', detail: 'Aguarde um momento, os dados estao sendo processados.' });
  try {
    await this.orcamentosByGrupoItens(); // Aguarda o cálculo do total orçado
    await this.calculosOrcamentosRealizados(); // Aguarda o cálculo do total realizado
    await this.montarGrafico(); // Aguarda a montagem do gráfico
    this.calcularSaldo(); // Chama calcularSaldo após ambos os cálculos estarem prontos
    
  } catch (err: any) {
    console.error('Erro ao executar cálculos:', err);

    // Verifica o status do erro e exibe mensagens apropriadas
    if (err.status === 500) {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'O parâmetro periodo contém meses futuros, o que não é permitido.Caso o período esteja correto verifique os demais dados ou informe o responsável.',life: 25000 });
    } else if (err.status === 401 || err.status === 200) {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
    }
  }
}
ccsLancamentos(meterItem: any) {
  this.loading = true;
  this.modalDetalhesLancamentos = true;
  const indice = meterItem.label;
  if (this.selectedGruposItensCodigos !== null) {
    this.grupoItensService.calcularOrcamentoRealizado(this.selectedGruposItensCodigos, this.centrosCusto, this.selectedFiliais,this.periodo, this.selectedAno).subscribe(
      response => {
        this.detalhesRealizadoGrupoItens = response.agrupado_por_pai[indice].detalhes;
        this.detalhesRealizadoCC = response.df_agrupado_pais_detalhes[indice].detalhes;
        this.totalCC = response.agrupado_por_pai[indice];
        this.loading = false;
      }, erro => {
        console.error('Não rolou', erro);
      }
    )
  }
}


orcamentosByGrupoItens(): void {
  if (this.selectedGruposItensCodigos !== null) {
    let totalOrcadoAcumulado = 0; // Variável para acumular o total orçado

    this.orcamentoBaseService.getOrcamentoBaseByGrupoIten(this.selectedGruposItensCodigos, this.selectedCcsPais,this.periodo, this.selectedAno, this.selectedCodManagers).subscribe(
      response => {
        totalOrcadoAcumulado += response.total; // Acumula o total orçado
        this.ccsPaisArray = Object.keys(response.total_por_cc_pai).map((key) => ({
          label: key,
          color1: '#1b91ff',
          color2: '#fbbf24',
          value: response.total_por_cc_pai[key],
          icon: 'pi pi-tags',
        }));

        this.ccsOrcadosArray = Object.keys(response.total_por_cc).map((key) => ({
          label: key,
          color1: '#1b91ff',
          color2: '#fbbf24',
          value: response.total_por_cc[key],
          icon: 'pi pi-tags',
        }));
        this.dictOrcado = response.total_por_cc_pai;
        this.totalOrcado = totalOrcadoAcumulado; // Atualiza o total orçado acumulado
      },
      erro => {
        console.error('Erro ao obter orçamento:', erro);
      }
    );
  }
}

montarGrafico(): void{
  this.loading2 = true;
  const valorOrcado = this.dictOrcado;
  const valorRealizado = this.dictRealizado;
  this.atualizarGraficoOrcadoRealizado(valorOrcado, valorRealizado);
  this.loading2 = false;
}

calcularSaldo() {
  // Converte os valores para números
  this.loading = true;
  const totalOrcado = Number(String(this.totalOrcado).replace(/\./g, '').replace(/,/g, '')) || 0;
  const totalRealizado = Number(String(this.totalRealizado).replace(/\./g, '').replace(/,/g, '')) || 0;

  this.totalSaldo = totalOrcado - totalRealizado;

  // Formatação dos números
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  this.totalOrcado = formatter.format(totalOrcado);
  this.totalRealizado = formatter.format(totalRealizado);
  this.totalSaldo = formatter.format(this.totalSaldo);
  this.loading = false;
}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

    limparDadosOrcados(): void {
      this.ccsPaisArray = []; // Limpa os dados do array de centros de custo pai
      this.ccsOrcadosArray = []; // Limpa os dados do array de centros de custo orçados
    }
    
    limparDadosRealizados(): void {
      this.ccs = []; // Limpa os dados do array de centros de custo realizados
      this.detalhesRealizadoCC = []; // Limpa os dados da tabela de detalhes realizados
      this.totalCC = 0; // Reseta o total
    }   


/**----------------------------------------------GRAFICO ORCADO x REALIZADO----------------------------------------------------------*/

atualizarGraficoOrcadoRealizado(valorOrcado: any, valorRealizado: any): void {
  const ctx = document.getElementById('graficoOrcadoRealizado') as HTMLCanvasElement;

  // Garante que os labels sejam os mesmos para ambos os datasets
  const labels = Array.from(new Set([...Object.keys(valorOrcado), ...Object.keys(valorRealizado)]));

  // Alinha os dados de "Orçado" e "Realizado" com base nos labels
  const dataOrcado = labels.map(label => Number(String(valorOrcado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número
  const dataRealizado = labels.map(label => Number(String(valorRealizado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número

  if (this.graficoTotalOrcadoRealizado) {
    this.graficoTotalOrcadoRealizado.destroy();
  }

  this.graficoTotalOrcadoRealizado = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Orçado',
          data: dataOrcado,
          backgroundColor: '#004598',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
        },
        {
          label: 'Realizado',
          data: dataRealizado,
          backgroundColor: '#71AAE0',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          beginAtZero: true,
          stacked: false,
          ticks: {
            color: '#ffffff',
            font: {
              weight: 'bold',
            },
            maxRotation: 90, // Rotação máxima
            minRotation: 90,
          },
          title: {
            display: false,
            text: 'Centros de Custo',
          },
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          stacked: false,
          beginAtZero: true,
          title: {
            display: false,
            text: 'Valores',
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR').format(context.raw)}`;
            },
          },
        },
      },
    },
  });
}
}