import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
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
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Chart } from 'chart.js';
import { Amostra } from '../amostra/amostra.component';
import { Ordem } from '../ordem/ordem.component';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import jsPDF from 'jspdf';
import autoTable, { CellInput } from "jspdf-autotable";
import { Analise } from '../analise/analise.component';

interface FileWithInfo {
  file: File;
  descricao: string;
}

interface Linha {
  numero: number;
  diametro: number | null;
  area: number | null;
  espessura: number | null;
  subst: number | null;
  junta: number | null;
  carga: number | null;
  resist: number | null;
  validacao: string;
  rupturas: {
    sub: number | null;
    subArga: number | null;
    rupArga: number | null;
    argaCola: number | null;
    colarPastilha: number | null;
  };
}

interface LinhaSuperficial {
  numero: number;
  diametro: number | null;
  area: number | null;
  espessura: number | null;
  subst: number | null;
  junta: number | null;
  carga: number | null;
  resist: number | null;
  validacao: string;
  rupturas: {
    sub: number | null;
    subArga: number | null;
    rupArga: number | null;
    argaCola: number | null;
    colarPastilha: number | null;
  };
}

interface LinhaFlexao {
  cp: number;
  flexao_n: number | null;
  flexao_mpa: number | null;
  media_mpa: number | null;
  tracao_flexao: number | null;
}

interface LinhaCompressao {
  cp: number;
  compressao_n: number | null;
  compressao_mpa: number | null;
  media_mpa: number | null;
  tracao_compressao: number | null;

}

interface LinhaRetracao {
  data: string;
  idade: number | null;
  media: number | null;
  desvio_maximo: number | null;
}

interface LinhaElasticidade {
  individual: number | null;
  media: number | null;
  desvio_padrao: number | null;
}
@Component({
  selector: 'app-arquivo',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule, TagModule, CheckboxModule, TreeTableModule, ProgressSpinnerModule
  ],
  animations:[
    trigger('efeitoFade',[
      transition(':enter',[
        style({ opacity: 0 }),
        animate('2s', style({ opacity:1 }))
      ])
    ]),
    trigger('efeitoZoom', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('2s', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('bounceAnimation', [
      transition(':enter', [
        animate('4.5s ease-out', keyframes([
          style({ transform: 'scale(0.5)', offset: 0 }),
          style({ transform: 'scale(1.2)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ])),
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
  providers: [
      MessageService,ConfirmationService,DatePipe
    ],
  templateUrl: './arquivo.component.html',
  styleUrl: './arquivo.component.scss',
})
export class ArquivoComponent implements OnInit, OnDestroy {
  @Input() mostrarMenu = true; 
  @ViewChild('graficoCanvas', { static: true }) graficoCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  amostras: Amostra[] = [];
  ordens: Ordem[] = [];
  analises: any[] = [];
  produtosFiltrados: any[] = [];
  materiaisFiltro: any[] = [];
  laudoForm!: FormGroup;
  modalLaudo: boolean = false;
  modalImpressao: boolean = false;
  
  // Flag para controlar detecção de mudanças
  private isInitializing = true;
  uploadedFilesWithInfo: FileWithInfo[] = [];

  // AQUI JIAN
  descricaoApi: string = '';

  modalDadosLaudoSubstrato: boolean = false;
  linhas: Linha[] = [];
  modalDadosLaudoSuperficial: boolean = false;
  linhasSuperficial: LinhaSuperficial[] = [];
  parecer_superficial: any = null;
  parecer_substrato: any = null;

  jsonModal: {
    substrato: any[];
    superficial: any[];
    flexao: any[];
    compressao: any[];
    retracao: any[];
    elasticidade: any[];
  } = {
    substrato: [],
    superficial: [],
    flexao: [],
    compressao: [],
    retracao: [],
    elasticidade: [],
  };

  laudoAnaliseLinhasId: number = 0;

  modalDadosLaudoFlexao: boolean = false;
  linhasFlexao: LinhaFlexao[] = [];
  linhasCompressao: LinhaCompressao[] = [];
  modalDadosLaudoCompressao: boolean = false;
  parecer_flexao: any = null;
  parecer_compressao: any = null;

  modalDadosLaudoRetracao: boolean = false;
  linhasRetracao: LinhaRetracao[] = [];
  parecer_retracao: any = null;

  modalDadosLaudoElasticidade: boolean = false;
  linhasElasticidade: LinhaElasticidade[] = [];
  parecer_elasticidade: any = null;

  ensaios_laudo: any[] = [];
  ensaios_selecionados: any[] = [];
  amostra_detalhes_selecionada: any = {}
  analises_selecionadas: any[] = [];
  // Propriedades para ordem expressa
  isOrdemExpressa: boolean = false;
  ensaiosDisponiveis: any[] = [];
  calculosDisponiveis: any[] = [];
  ensaiosSelecionados: any[] = [];
  calculosSelecionados: any[] = [];
  modalEnsaiosVisible: boolean = false;
  modalCalculosVisible: boolean = false;
  editFormVisible: boolean = false;
  modalVisualizar: boolean = false;
  analiseSelecionada: any;
  amostraImagensSelecionada: any;
  imagensAmostra: any[] = [];
  imagemAtualIndex: number = 0;
  modalImagensVisible = false;
  bodyTabelaObs: string = '';
  selectedEnsaios: TreeNode[] = []; // aqui ficam os selecionados
  
  // Cache para menu items para evitar recriação constante
  private menuItemsCache = new Map<number, any[]>();
  
  // Propriedades para o parecer da IA
  parecerResposta: string = '';
  mostrarParecer: boolean = false;
  parecerCarregando: boolean = false;
  tipoFiltro = [
    { value: 'Expressa' },
    { value: 'Plano' },
  ];
  // Grafico Lauudo
  dadosTabela = [
    { tempo: '5min', valor: 2.3 },
    { tempo: '20min', valor: 4.1 },
    { tempo: '1h', valor: 6.85 },
    { tempo: '2h', valor: 8.35 },
    { tempo: '3h', valor: 10.0 },
    { tempo: '4h', valor: 12.0 },
    { tempo: '6h', valor: 14.0 }
  ];
  materiais: any[] = [
    { value: 'Aditivos' },
    { value: 'Acabamento' },
    { value: 'Areia' },
    { value: 'Argamassa' },
    { value: 'Cal' },
    { value: 'Calcario' },
    { value: 'Cimento' },
    { value: 'Cinza Pozolana' },
    { value: 'Fertilizante' },
    { value: 'Finaliza' },
    { value: 'Mineracao' },
    { value: 'Areia' },
  ]
  listaEnsaios: any;
  listaCalculos: any;
  modalGarantiasVisible: boolean = false;
  garantias: any;
  produtoId: any;
constructor(
private loginService: LoginService,
private analiseService: AnaliseService,
private amostraService: AmostraService,
private messageService: MessageService,
private confirmationService: ConfirmationService,
private datePipe: DatePipe,
private cdr: ChangeDetectorRef
){}
  ngOnInit(): void {
    // Reset completo ao inicializar o componente
    this.resetOperacoes();
    
    this.isInitializing = true;
    this.loadAnalises();
    
    for (let i = 1; i <= 10; i++) {
      this.linhas.push({
        numero: i,
        diametro: 0,
        area: 0,
        espessura: 0,
        subst: 0,
        junta: 0,
        carga: 0,
        resist: 0,
        validacao: "",
        rupturas: {
          sub: 0,
          subArga: 0,
          rupArga: 0,
          argaCola: 0,
          colarPastilha: 0
        }
      });
    }

    for (let i = 1; i <= 10; i++) {
      this.linhasSuperficial.push({
        numero: i,
        diametro: 0,
        area: 0,
        espessura: 0,
        subst: 0,
        junta: 0,
        carga: 0,
        resist: 0,
        validacao: "",
        rupturas: {
          sub: 0,
          subArga: 0,
          rupArga: 0,
          argaCola: 0,
          colarPastilha: 0
        }
      });
    }

    for (let i = 1; i <= 3; i++) {
      this.linhasFlexao.push({
        cp: i,
        flexao_n: null,
        flexao_mpa: null,
        media_mpa: null,
        tracao_flexao: null,
      });
    }

    for (let i = 1; i <= 3; i++) {
      this.linhasCompressao.push({
        cp: i,
        compressao_n: null,
        compressao_mpa: null,
        media_mpa: null,
        tracao_compressao: null,
      });
    }

    for (let i = 1; i <= 3; i++) {
      this.linhasRetracao.push({
        data: '',
        idade: null,
        media: null,
        desvio_maximo: null,
      });
    }

    for (let i = 1; i <= 3; i++) {
      this.linhasElasticidade.push({
        individual: null,
        media: null,
        desvio_padrao: null,
      });
    }
    
    // Marca que a inicialização terminou
    setTimeout(() => {
      this.isInitializing = false;
      this.cdr.detectChanges();
    }, 100);
  }

//===================================Datas ==============================================================================
converterResultadoParaData(valor: any): string | null {
  if (!valor) return null;
  
  // Se o valor for um número (timestamp)
  if (typeof valor === 'number') {
    // Verifica se é um timestamp válido (entre 1970 e 2050)
    if (valor > 0 && valor < 2524608000000) {
      const data = new Date(valor);
      if (!isNaN(data.getTime())) {
        return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
      }
    }
  }
  
  // Se for string, tenta converter
  if (typeof valor === 'string') {
    const numeroValor = parseFloat(valor);
    if (!isNaN(numeroValor)) {
      const data = new Date(numeroValor);
      if (!isNaN(data.getTime())) {
        return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
      }
    }
  }
  
  return null;
}

calcResultadoEhData(calc: any): boolean {
  if (!calc) return false;
  
  const descricao = calc.calculos?.toLowerCase() || '';
  
  // Verifica se a descrição indica que é uma data
  const indicadoresData = [
    'variação dimensional linear',
    'desmoldagem',
    'data',
    'potencial',
    'compressão'
  ];
  
  return indicadoresData.some(indicador => descricao.includes(indicador));
}

// Método para converter resultado de cálculo para data
converterResultadoCalculoParaData(calc: any): string | null {
  if (!calc || !calc.resultados) return null;
  
  const valor = calc.resultados;
  
  if (typeof valor === 'number') {
    // Verifica se é um timestamp válido
    const minTimestamp = 1577836800000; // 01/01/2020
    const maxTimestamp = 1893456000000; // 01/01/2030
    
    if (valor >= minTimestamp && valor <= maxTimestamp) {
      const data = new Date(valor);
      if (!isNaN(data.getTime())) {
        return this.datePipe.transform(data, 'dd/MM/yyyy') || '';
      }
    }
  }
  
  return null;
}

formatarDataExibicao(value: any): string {
  if (!value) return '';
  
  let date: Date | null = null;
  
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    // Trata como timestamp em milissegundos
    date = new Date(value);
  } else if (typeof value === 'string') {
    const numeroValor = parseFloat(value);
    if (!isNaN(numeroValor)) {
      date = new Date(numeroValor);
    } else {
      date = new Date(value);
    }
  }
  
  if (!date || isNaN(date.getTime())) return '';
  
  try {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  } catch {
    return '';
  }
}

formatForDisplay(value: any): string {
  const num = typeof value === 'number' ? value : Number(value);
  if (!isFinite(num)) return '';
  // Usar até 4 casas decimais, mas remover zeros à direita
  return parseFloat(num.toFixed(4)).toString();
}
//====================================================================================================
  ngAfterViewInit() {
    this.dt1.filter(true, 'laudo', 'equals');
    this.dt1.filter(true, 'aprovada', 'equals');
    this.dt1.clear();
  }
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  analisesFiltradas: any[] = []; // array para exibir na tabela
  materiaisSelecionados: string[] = []; // valores escolhidos no multiselect
  laboratoriosFiltro: any[] = [];
  laboratoriosSelecionados: string[] = [];
  loadAnalises(): void { 
    this.analiseService.getAnalisesFechadas().subscribe(
      (response: any[]) => {
        // Mapeia e cria campos "planos" para facilitar o filtro global
        this.analises = response.map((analise: any) => ({
          ...analise,
          material: analise.amostra_detalhes?.material ?? '',
          fornecedor: analise.amostra_detalhes?.fornecedor ?? '',
          numero: analise.amostra_detalhes?.numero ?? '',
          status: analise.amostra_detalhes?.status ?? '',
          responsavel: analise.amostra_detalhes?.expressa_detalhes?.responsavel ?? '',
          data_entrada: analise.amostra_detalhes?.data_entrada ?? '',
          data_coleta: analise.amostra_detalhes?.data_coleta ?? '',
          laboratorio: analise.amostra_detalhes?.laboratorio ?? ''
        }));
        // Inicializa a lista filtrada
      this.analisesFiltradas = [...this.analises];
      
      // Limpar cache de menu items quando dados são atualizados
      this.menuItemsCache.clear();

        // Cria opções únicas para o MultiSelect
        this.materiaisFiltro = this.analises
          .map((analise) => ({
            label: analise.material,
            value: analise.material
          }))
          .filter(
            (item, index, self) =>
              index === self.findIndex((opt) => opt.value === item.value)
          );

        // Opções únicas para o filtro de Laboratório
        this.laboratoriosFiltro = this.analises
          .map((analise) => ({
            label: analise.laboratorio,
            value: analise.laboratorio
          }))
          .filter((item, index, self) => item.value && index === self.findIndex(opt => opt.value === item.value));
      },
      (error) => {
        console.error('Erro ao carregar análises', error);
      }
    );

  }
  // Filtro pelo MultiSelect
  filtrarPorMateriais(): void {
    
    if (this.materiaisSelecionados.length === 0) {
      this.analisesFiltradas = [...this.analises];
    } else {
      this.analisesFiltradas = this.analises.filter((analise) =>
        this.materiaisSelecionados.includes(analise.material)
      );
    }
  }

  // Filtro pelo MultiSelect de Laboratório
  filtrarPorLaboratorios(): void {
    if (this.laboratoriosSelecionados.length === 0) {
      this.analisesFiltradas = [...this.analises];
    } else {
      this.analisesFiltradas = this.analises.filter((analise) =>
        this.laboratoriosSelecionados.includes(analise.laboratorio)
      );
    }
  }
  //Normalização
  private normalize(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  
  // Severidade por laboratório (LCA/LCI/LDB)
  getLaboratorioSeverity(lab: string | undefined): 'info' | 'success' | 'warn' | 'contrast' | undefined {
    if (!lab) return undefined;
    const key = lab.toUpperCase();
    switch (key) {
      case 'LCA':
        return 'success';
      case 'LCI':
        return 'info';
      case 'LDB':
        return 'contrast';
      default:
        return 'warn';
    }
  }
  // Cache para evitar recalcular severities
  private severityCache = new Map<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined>();
  
  // TrackBy functions para melhorar performance dos *ngFor
  trackByIndex(index: number, item: any): number {
    return index;
  }
  
  trackByNumero(index: number, item: any): any {
    return item.numero || index;
  }
  
  trackByCp(index: number, item: any): any {
    return item.cp || index;
  }
  
  trackById(index: number, item: any): any {
    return item.id || index;
  }
  
  //Severity
  getSeverity(materialNome: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    // Evita recálculo durante inicialização
    if (this.isInitializing) {
      return 'secondary';
    }
    
    if (this.severityCache.has(materialNome)) {
      return this.severityCache.get(materialNome);
    }
    
    const materialNormalizado = this.normalize(materialNome);
    if (!materialNome) {
      const result = 'secondary' as const;
      this.severityCache.set(materialNome, result);
      return result;
    }
    
    let result: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined;
    switch (materialNormalizado.toLowerCase()) {
      case 'calcario':
        result = 'warn';
        break;
      case 'acabamento':
        result = 'success';
        break;
      case 'argamassa':
        result = 'info';
        break;
      case 'cal':
        result = 'danger';
        break;
      case 'mineracao':
        result = 'contrast';
        break;
      default:
        result = 'secondary';
    }
    
    this.severityCache.set(materialNome, result);
    return result;
  }
  //////////////////////////////////////////////////
  tipoSelecionados: string = ''; // valores escolhidos no multiselect
  // Filtro pelo MultiSelect
  filtrarPorTipo(): void {
    if (this.tipoSelecionados.length === 0) {
      this.analisesFiltradas = [...this.analises];
    } else {      
      if(this.tipoSelecionados == 'Expressa'){
          this.analisesFiltradas = this.analises.filter(
          (analise) => analise?.amostra_detalhes?.expressa_detalhes
        );
      }else{
        this.analisesFiltradas = this.analises.filter(
          (analise) => analise?.amostra_detalhes?.ordem_detalhes
        );
      }
    }
  }
  //Tipos de Ordem
  getTipoOrdem(tipoOrdem: string): 'warn' | 'contrast' | undefined {
    switch (tipoOrdem) {
      case 'Expressa':
        return 'warn';
      default:
        return 'contrast';
    }
    
  }
  // Filtro Global com debounce para evitar loops infinitos
  private filterTimeout: any;
  
  filterTable(): void {
    // Cancelar timeout anterior se existir
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    
    // Aplicar filtro com debounce de 300ms
    this.filterTimeout = setTimeout(() => {
      if (this.dt1) {
        this.dt1.filterGlobal(this.inputValue, 'contains');
      }
    }, 300);
  }
  
  //Menu Items
  getMenuItems(analise: any) {
    // Usar cache para evitar recriação constante dos menu items
    const analiseId = analise.id;
    
    if (!this.menuItemsCache.has(analiseId)) {
      const menuItems = [
        { label: 'Visualizar', icon: 'pi pi-eye', command: () => this.visualizar(analise), tooltip: 'Visualizar OS', tooltipPosition: 'top' },
        { label: 'Imprimir', icon: 'pi pi-print', command: () => this.abrirModalImpressao(analise) },
        { label: 'Imagens', icon: 'pi pi-image', command: () => this.visualizarImagens(analise.amostra_detalhes) },
      ];
      this.menuItemsCache.set(analiseId, menuItems);
    }
    
    return this.menuItemsCache.get(analiseId) || [];
  }
// ============================== CONSULTAR IA ====================================================
/////////==========CONSULTAR GARANTIA POR PRODUTO ===========///////////////////////////////////////
  consultarGarantia(produtoId: any): void{
    this.modalGarantiasVisible = true;
    this.amostraService.consultarGarantiaPorProduto(this.produtoId).subscribe(
      response => {
        this.garantias = response;
      },
      error => {
        console.error('Erro ao carregar garantias de produto:', error);
      }
    );
  }

  consultarParecer(analise: any) {
  this.produtoId = analise.amostra_detalhes?.produto_amostra_detalhes?.id;
  
  // Iniciar loading (não mostrar o dialog ainda)
  this.parecerCarregando = true;
  this.mostrarParecer = false;
  this.parecerResposta = '';
  this.cdr.markForCheck(); // Marcar para verificação de mudanças
  this.cdr.detectChanges(); // Forçar detecção de mudanças
  
  // Primeiro carregar as garantias, depois processar o parecer
  this.amostraService.consultarGarantiaPorProduto(this.produtoId).subscribe({
    next: (garantias) => {
      this.garantias = garantias;
      
      // Processar as garantias para criar a ficha técnica formatada
      this.processarParecer(analise);
    },
    error: (error) => {
      this.garantias = null;
      // Mesmo com erro, processar o parecer
      this.processarParecer(analise);
    }
  });
}

private processarParecer(analise: any) {
  // Formatear as garantias para string legível
  let fichaTecnicaFormatada = '';
  if (this.garantias && Array.isArray(this.garantias) && this.garantias.length > 0) {
    fichaTecnicaFormatada = this.garantias.map((garantia: any) => {
      let item = `Requisito: ${garantia.requisito || 'N/A'}`;
      
      if (garantia.norma) item += ` | Norma: ${garantia.norma}`;
      if (garantia.classe) item += ` | Classe: ${garantia.classe}`;
      if (garantia.especificacao) item += ` | Especificação: ${garantia.especificacao}`;
      
      if (garantia.minimo !== null && garantia.minimo !== undefined) {
        item += ` | Mínimo: ${garantia.minimo}`;
      }
      if (garantia.maximo !== null && garantia.maximo !== undefined) {
        item += ` | Máximo: ${garantia.maximo}`;
      }
      if (garantia.unidade) {
        item += ` ${garantia.unidade}`;
      }
      
      return item;
    }).join('\n');
  } else {
    fichaTecnicaFormatada = "Nenhuma garantia cadastrada para este produto.";
  }
  
  // Montar payload no formato plano com chaves individuais
  const payload: any = {
    "Produto": analise.amostra_detalhes?.produto_amostra_detalhes?.nome || "",
    "Tipo": analise.amostra_detalhes?.produto_amostra_detalhes?.tipo || "", 
    "Subtipo": analise.amostra_detalhes?.produto_amostra_detalhes?.subtipo || "",
    "Ficha Técnica": fichaTecnicaFormatada,
  };

  // Separar resultados em uma seção específica
  const resultados: any = {};

  // Processar cálculos e extrair ensaios de dentro deles
  if (analise.ultimo_calculo && Array.isArray(analise.ultimo_calculo)) {
    analise.ultimo_calculo.forEach((calculo: any) => {
      // Adicionar informações do próprio cálculo
      const nomeCalculo = calculo.descricao || calculo.nome || calculo.tipo_calculo;
      const valorCalculo = calculo.valor || calculo.resultado || calculo.media;
      const unidadeCalculo = calculo.unidade || calculo.simbolo || '';
      if (nomeCalculo && valorCalculo !== null && valorCalculo !== undefined) {
        const valorFormatado = this.formatarValorResultado(valorCalculo, unidadeCalculo);
        if (valorFormatado) {
          resultados[nomeCalculo] = valorFormatado;
        }
      }

      // Extrair ensaios de dentro dos cálculos
      if (calculo.ensaios_utilizados && Array.isArray(calculo.ensaios_utilizados)) {
        calculo.ensaios_utilizados.forEach((ensaio: any) => {
          const nomeEnsaio = ensaio.descricao || ensaio.nome || ensaio.tipo_ensaio;
          const valorEnsaio = ensaio.valor || ensaio.resultado || ensaio.media;
          const unidadeEnsaio = ensaio.unidade || ensaio.simbolo || '';
          if (nomeEnsaio && valorEnsaio !== null && valorEnsaio !== undefined) {
            const valorFormatado = this.formatarValorResultado(valorEnsaio, unidadeEnsaio);
            if (valorFormatado) {
              resultados[nomeEnsaio] = valorFormatado;
            }
          }
        });
      }
    });
  }

  // Processar ensaios diretos (que aparecem na seção "Ensaios" separada dos cálculos)
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados && Array.isArray(analise.ultimo_ensaio.ensaios_utilizados)) {
    analise.ultimo_ensaio.ensaios_utilizados.forEach((ensaio: any) => {
      const nomeEnsaio = ensaio.descricao || ensaio.nome || ensaio.tipo_ensaio;
      const valorEnsaio = ensaio.valor || ensaio.resultado || ensaio.media;
      const unidadeEnsaio = ensaio.unidade || ensaio.simbolo || '';
      if (nomeEnsaio && valorEnsaio !== null && valorEnsaio !== undefined && !resultados[nomeEnsaio]) {
        const valorFormatado = this.formatarValorResultado(valorEnsaio, unidadeEnsaio);
        if (valorFormatado) {
          resultados[nomeEnsaio] = valorFormatado;
        }
      }
    });
  }

  // Processar dados diretos de ultimo_ensaio (caso existam fora dos cálculos)
  if (analise.ultimo_ensaio && typeof analise.ultimo_ensaio === 'object') {
    Object.keys(analise.ultimo_ensaio).forEach(chave => {
      const valor = analise.ultimo_ensaio[chave];
      // Filtrar campos desnecessários e evitar duplicações
      const camposExcluir = ['id', 'digitador', 'analise', 'ensaios_utilizados', 'created_at', 'updated_at', 'usuario', 'calculos', 'resultados', 'responsavel'];
      
      if (valor !== null && valor !== undefined && !camposExcluir.includes(chave) && !resultados[chave]) {
        // Verificar se é um valor que pode ser formatado melhor
        if (typeof valor === 'string' && valor.includes('[object Object]')) {
          // Ignorar valores malformados
          return;
        }
        
        // Usar o nome do campo como está, mas limpo
        const nomeFormatado = chave.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const valorFormatado = this.formatarValorResultado(valor);
        if (valorFormatado) {
          resultados[nomeFormatado] = valorFormatado;
        }
      }
    });
  }
  
  // Adicionar seção de Resultados ao payload apenas se houver dados válidos
  if (Object.keys(resultados).length > 0) {
    // Filtrar e formatar resultados para exibição mais limpa
    const resultadosFormatados = Object.keys(resultados)
      .filter(chave => {
        const valor = resultados[chave];
        // Filtrar valores vazios, nulos, ou que contém [object Object]
        return valor && 
               valor.toString().trim() !== '' && 
               !valor.toString().includes('[object Object]') &&
               !valor.toString().includes('undefined');
      })
      .map(chave => {
        const valor = resultados[chave];
        // Melhorar a apresentação dos nomes dos campos
        const nomeApresentacao = chave
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/\s+/g, ' ')
          .trim();
        
        return `${nomeApresentacao}: ${valor}`;
      })
      .join('\n');
    
    if (resultadosFormatados) {
      payload["Resultados"] = resultadosFormatados;
    }
  }

  this.analiseService.emitirParecer(payload).subscribe(
    (response) => {      
      // Finalizar loading
      this.parecerCarregando = false;
      this.cdr.detectChanges(); // Forçar detecção de mudanças
      
      // Extrair a resposta do objeto retornado do backend Django
      let parecerTexto = '';
      if (typeof response === 'string') {
        parecerTexto = response;
      } else if (response && response.message) {
        // Resposta do backend Django
        if (typeof response.message === 'string') {
          parecerTexto = response.message;
        } else {
          parecerTexto = JSON.stringify(response.message);
        }
      } else if (response && response.choices && response.choices[0] && response.choices[0].message) {
        parecerTexto = response.choices[0].message.content;
      } else if (response && response.reply) {
        parecerTexto = response.reply;
      } else if (response && response.content) {
        parecerTexto = response.content;
      } else if (response && response.response) {
        parecerTexto = response.response;
      } else {
        parecerTexto = JSON.stringify(response, null, 2);
      }
      
      // Limpar caracteres de escape e formatação JSON indesejada
      parecerTexto = parecerTexto.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      if (parecerTexto.startsWith('"') && parecerTexto.endsWith('"')) {
        parecerTexto = parecerTexto.slice(1, -1);
      }
      
      this.parecerResposta = parecerTexto;
      
      // Usar setTimeout para garantir que as mudanças sejam processadas
      setTimeout(() => {
        // Agora mostrar o dialog com o parecer pronto
        this.mostrarParecer = true;
        this.cdr.markForCheck(); // Marcar para verificação de mudanças
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      }, 0);
      
    },
    (error) => {
      console.error('Erro ao buscar parecer:', error);
      this.parecerCarregando = false;
      this.parecerResposta = 'Erro ao obter parecer da IA. Tente novamente.';
      
      // Usar setTimeout para garantir que as mudanças sejam processadas
      setTimeout(() => {
        // Mostrar o dialog mesmo em caso de erro
        this.mostrarParecer = true;
        this.cdr.markForCheck(); // Marcar para verificação de mudanças
        this.cdr.detectChanges(); // Forçar detecção de mudanças
      }, 0);
    }
  );
}

  private montarEnsaios(): any {
    const ensaios: any = {};
    
    // Assumindo que você tem uma lista de ensaios
    this.listaEnsaios?.forEach((ensaio: { nome: string | number; resultado: any; unidade: any; }) => {
      ensaios[ensaio.nome] = `${ensaio.resultado}${ensaio.unidade || ''}`;
    });
    return ensaios;
  }

  private montarCalculos(): any {
    const calculos: any = {};
    
    // Assumindo que você tem uma lista de cálculos
    this.listaCalculos?.forEach((calculo: { nome: string | number; resultado: any; unidade: any; }) => {
      calculos[calculo.nome] = `${calculo.resultado}${calculo.unidade || ''}`;
    });
    
    return calculos;
  }

  private formatarValorResultado(valor: any, unidade: string = ''): string {
    // Se o valor parece ser um timestamp (número grande)
    if (typeof valor === 'number' && valor > 1000000000000) {
      const dataFormatada = this.converterResultadoParaData(valor);
      if (dataFormatada) {
        return dataFormatada;
      }
    }
    
    // Se for um número, formatá-lo adequadamente
    if (typeof valor === 'number') {
      return `${this.formatForDisplay(valor)}${unidade}`;
    }
    
    // Se for string e contém [object Object], ignorar
    if (typeof valor === 'string' && valor.includes('[object Object]')) {
      return '';
    }
    
    return `${valor}${unidade}`;
  }

  //=============================================MÉTODOS do MENU ITEM=============================================
  visualizar(analise: any) {
    this.analiseSelecionada = analise;
    this.modalVisualizar = true;
  }

  // Métodos para verificar status das datas de rompimento
  getStatusDataRompimento(dataBase: string, diasRompimento: number): { status: string, diasRestantes: number, cor: string, icone: string } {
    if (!dataBase) {
      return { status: 'Sem data', diasRestantes: 0, cor: '#6c757d', icone: 'pi-question-circle' };
    }

    const dataBaseDate = new Date(dataBase);
    const dataRompimento = new Date(dataBaseDate);
    dataRompimento.setDate(dataRompimento.getDate() + diasRompimento);
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataRompimento.setHours(0, 0, 0, 0);
    
    const diffTime = dataRompimento.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { 
        status: `Vencido há ${Math.abs(diasRestantes)} dia(s)`, 
        diasRestantes: diasRestantes, 
        cor: '#dc3545', 
        icone: 'pi-times-circle' 
      };
    } else if (diasRestantes === 0) {
      return { 
        status: 'Vence hoje!', 
        diasRestantes: 0, 
        cor: '#fd7e14', 
        icone: 'pi-exclamation-triangle' 
      };
    } else if (diasRestantes <= 2) {
      return { 
        status: `Vence em ${diasRestantes} dia(s)`, 
        diasRestantes: diasRestantes, 
        cor: '#ffc107', 
        icone: 'pi-exclamation-circle' 
      };
    } else if (diasRestantes <= 5) {
      return { 
        status: `${diasRestantes} dias restantes`, 
        diasRestantes: diasRestantes, 
        cor: '#17a2b8', 
        icone: 'pi-info-circle' 
      };
    } else {
      return { 
        status: `${diasRestantes} dias restantes`, 
        diasRestantes: diasRestantes, 
        cor: '#28a745', 
        icone: 'pi-check-circle' 
      };
    }
  }

  getStatusL1(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 1);
  }

  getStatusL7(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 7);
  }

  getStatusL28(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 28);
  }

  getStatusM1(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 1);
  }

  getStatusM7(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 7);
  }

  getStatusM28(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 28);
  }

  imprimirVisualizar(analise: any){
      const doc = new jsPDF();
      let y = 10; // posição inicial Y
      doc.setFontSize(20);
      const pageWidth = doc.internal.pageSize.getWidth(); // largura da página
      doc.text("OS", pageWidth / 2, y, { align: "center" });    
      y += 15;
  
      // --- Dados ---
      doc.setFontSize(16);
      doc.text("Dados", 10, y);
      y += 10;
  
      doc.setFontSize(12);
      doc.text(`Número: ${analise.amostra_detalhes?.numero || 'N/D'}`, 10, y); y += 8;
      doc.text(`Classificação: ${analise.amostra_detalhes?.expressa_detalhes?.classificacao 
        || analise.amostra_detalhes?.ordem_detalhes?.classificacao || 'N/D'}`, 10, y); y += 8;
      doc.text(`Responsável: ${analise.amostra_detalhes?.expressa_detalhes?.responsavel 
        || analise.amostra_detalhes?.ordem_detalhes?.responsavel || 'N/D'}`, 10, y); y += 8;
  
      const dataAbertura = analise.amostra_detalhes?.expressa_detalhes?.data 
        || analise.amostra_detalhes?.ordem_detalhes?.data;
      doc.text(`Data de Abertura: ${dataAbertura ? new Date(dataAbertura).toLocaleDateString('pt-BR') : 'N/D'}`, 10, y); 
      y += 15;
  
      // --- Cálculos ---
      doc.setFontSize(16);
      doc.text("Cálculos", 10, y); 
      y += 10;
  
      doc.setFontSize(12);
      if (analise?.ultimo_calculo?.length > 0) {
        analise.ultimo_calculo.forEach((calc: any) => {
          doc.text(`Descrição: ${calc.calculos}`, 10, y); y += 8;
          doc.text(`Resultado: ${calc.resultados}`, 10, y); y += 8;
          calc.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
            doc.text(`Descrição: ${ensaios_utilizados.descricao}`, 30, y); y += 8;
            doc.text(`Resultado: ${ensaios_utilizados.valor}`, 30, y); y += 8;
            if(y>=290){
              doc.addPage();
              y=10;
            }
          });
          
          y += 4; // espaço extra
          if(y>=290){
            doc.addPage();
            y=10;
          }
        });
      } else {
        doc.text("N/D", 10, y);
        y += 8;
        if(y>=290){
          doc.addPage();
          y=10;
        }
      }
  
      y += 10;
  
      // --- Ensaios ---
      doc.setFontSize(16);
      doc.text("Ensaios", 10, y); 
      y += 10;
  
      doc.setFontSize(12);
      if (analise?.ultimo_ensaio?.ensaios_utilizados?.length > 0) {
        analise.ultimo_ensaio.ensaios_utilizados.forEach((ensaio: any) => {
          doc.text(`Descrição: ${ensaio.descricao}`, 10, y); y += 8;
          doc.text(`Resultado: ${ensaio.valor}`, 10, y); y += 8;
          y += 4;
          if(y>=290){
            doc.addPage();
            y=10;
          }
        });
      } else {
        doc.text("N/D", 10, y);
        if(y>=290){
          doc.addPage();
          y=10;
        }
      }
  
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl, "_blank");
    }
  abrirModalImpressao(analise: any) {
    this.amostra_detalhes_selecionada = analise;

    if(analise.amostra_detalhes.expressa_detalhes){

      const calculos = analise.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.map(
        (calculo: any) => {
          const children = (calculo.ensaios_detalhes || []).map((ensaio: any) => ({
            data: {
              id: calculo.id + '/' + ensaio.id,
              descricao: ensaio.id + ' - ' + ensaio.descricao,
              disabled: false
            },
            leaf: true
          }));

          return {
            data: {
              id: '' + calculo.id,
              descricao:calculo.descricao,
              disabled: false
            },
            children: children.length > 0 ? children : undefined,
            expanded: false,
            partialSelected: false
          };
        }
      );

      const ensaios = analise.amostra_detalhes.expressa_detalhes.ensaio_detalhes.map(
        (ensaio: any) => {
          const children = (ensaio.variavel_detalhes || []).map((variavel: any) => ({
            data: {
              id: ensaio.id + '/' + variavel.id,
              descricao: variavel.id + ' - ' + variavel.nome,
              disabled: false
            },
            leaf: true
          }));

          return {
            data: {
              id: '' + ensaio.id,
              descricao: ensaio.descricao,
              disabled: false
            },
            children: children.length > 0 ? children : undefined,
            expanded: false,
            partialSelected: false
          };
        }
      );

      // separador
      const separador = {
        data: {
          id: 'separador',
          descricao: '---------- CÁLCULOS ---------',
          disabled: true
        },
        leaf: true
      };

      this.ensaios_laudo = [...ensaios, separador, ...calculos];

    }

    if (analise?.amostra_detalhes?.ordem_detalhes) {
      this.ensaios_laudo = [];

      analise.amostra_detalhes.ordem_detalhes.plano_detalhes?.forEach((plano_detalhes: any) => {
        if (plano_detalhes.ensaio_detalhes) {
          this.ensaios_laudo.push(
            ...plano_detalhes.ensaio_detalhes.map((ensaio_detalhes: any) => {
              const children = (ensaio_detalhes.variavel_detalhes || []).map((variavel: any) => ({
                data: {
                  id: ensaio_detalhes.id + '/' + variavel.id,
                  descricao: variavel.id + ' - ' + variavel.nome,
                  disabled: false
                },
                leaf: true
              }));

              return {
                data: {
                  id: '' + ensaio_detalhes.id,
                  descricao: ensaio_detalhes.descricao,
                  disabled: false
                },
                children: children.length > 0 ? children : undefined,
                expanded: false,
                partialSelected: false
              };
            })
          );
        }

        if (plano_detalhes.calculo_ensaio_detalhes) {
          this.ensaios_laudo.push({
            data: {
              id: 'separador_' + plano_detalhes.id, // id único pra não dar conflito
              descricao: '---------- CÁLCULOS ---------',
              disabled: true
            },
            leaf: true
          });

          this.ensaios_laudo.push(
            ...plano_detalhes.calculo_ensaio_detalhes.map((calculo: any) => {
              const ensaiosChildren = (calculo.ensaios_detalhes || []).map((ensaio: any) => ({
                data: {
                  id: calculo.id+'/' + ensaio.id,
                  descricao: ensaio.id + ' - ' + ensaio.descricao,
                  disabled: false
                },
                leaf: true
              }));

              return {
                data: {
                  id: ''+calculo.id,
                  descricao: calculo.descricao,
                  disabled: false
                },
                children: ensaiosChildren.length > 0 ? ensaiosChildren : undefined,
                expanded: false,
                partialSelected: false
              };
            })
          );
        }

      });
    }
 
    this.modalImpressao = true;
  }

  imprimirSelecionados() {
    this.imprimirCalculoPDF(this.amostra_detalhes_selecionada);
  }

  imprimirCalculoPDF(analise: any) {
    const resultado: { pai: string, filhos: string[] }[] = [];

    this.selectedEnsaios.forEach((selectedEnsaios: any) => {
      const id = String(selectedEnsaios.data.id);

      if (id.includes("/")) {
        const [pai, filho] = id.split("/");
        let paiExistente = resultado.find(r => r.pai === pai);

        if (!paiExistente) {
          paiExistente = { pai, filhos: [] };
          resultado.push(paiExistente);
        }

        paiExistente.filhos.push(filho);

      } else {
        const pai = id;
        let paiExistente = resultado.find(r => r.pai === pai);
        if (!paiExistente) {
          resultado.push({ pai, filhos: [] });
        }
      }
    });

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let contadorLinhas = 45;
    const data_entrada = formatDate(analise.amostra_detalhes.data_entrada, 'dd/MM/yyyy', 'en-US');
    const data_coleta = formatDate(analise.amostra_detalhes.data_coleta, 'dd/MM/yyyy', 'en-US');

    autoTable(doc, {
      startY: 10,
      body: [
        [
          { content: "Ordem de Serviço", styles: { halign: "left", fontStyle: "bold" } },
          { content: analise.amostra_detalhes.numero, styles: { halign: "left", fontStyle: "bold" } },
          { content: "Data de Entrada: "+data_entrada, styles: { halign: "left" } },
        ],
        [
          { content: "Material da Amostra: "+analise.amostra_detalhes.material, colSpan: 2, styles: { halign: "left" } },
          { content: "Data de Amostra: "+data_coleta, styles: { halign: "left" } }
        ],
        [
          { content: "Tipo: "+analise.amostra_detalhes?.tipo_amostragem, styles: { halign: "left" } },
          { content: "Sub-tipo: "+analise.amostra_detalhes?.subtipo, styles: { halign: "left" } },
          { content: "Data de Conclusão: ", styles: { halign: "left" } }
        ],
        [
          { content: "Local da Coleta: "+analise.amostra_detalhes.local_coleta, colSpan: 2, styles: { halign: "left" } },
          { content: "Data de Descarte: ", styles: { halign: "left", fontStyle: "bold" } }
        ]
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2
      }
    });

    if(analise.amostra_detalhes.expressa_detalhes){
      
      analise.amostra_detalhes.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {

        const existe = resultado.some(item => {
          return item.pai == ensaio_detalhes.id;
        });

        if(existe){

          let body: any[] = [];
          let linha: any[] = [];
          let linhaVazia: any[] = [];

          linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220]  } });
          linha.push({ content: 'Técnico', styles: { halign: "center", fontStyle: "bold" } });
          linha.push({ content: 'Nº Cadinho', styles: { halign: "center", fontStyle: "bold" } });
          
          linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220]  } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });

          body.push(linha);
          body.push(linhaVazia);

          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });
          contadorLinhas = (doc as any).lastAutoTable.finalY;
          
          body = [];
          linha = [];
          linhaVazia = [];

          ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
            const pai = resultado.find(item => item.pai == ensaio_detalhes.id);
            const filhoExiste = pai?.filhos.includes(String(variavel_detalhes.id));

            if (filhoExiste) {
              linha.push({ content: variavel_detalhes.nome, styles: { halign: "center" } });
              let variavel_valor = '';
              if(variavel_detalhes.valor && variavel_detalhes.valor != 0){
                variavel_valor = variavel_detalhes.valor;
              }
              linhaVazia.push({ content: variavel_valor, styles: { halign: "center" } });
            }
          });

       

          ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
            let variavel_valor = '';
            if(variavel_detalhes.valor && variavel_detalhes.valor != 0){
              variavel_valor = variavel_detalhes.valor;
            }
            linhaVazia.push({ content: variavel_valor, styles: { halign: "center" } });
          });

          linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220]  } });
          linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220]  } });

          body.push(linha);
          body.push(linhaVazia);
          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });
          contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
        }
        
      });
      
      let contador_calculo = 0;
      analise.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.forEach((calculo_ensaio_detalhes: any) => {

        const existe = resultado.some(item => {
          return item.pai == calculo_ensaio_detalhes.id;
        });
        if(existe){
          if(contador_calculo == 0){
              autoTable(doc, {
                startY: contadorLinhas+5,
                body: [
                  [
                    { content: "Cálculos", styles: { halign: "left", fontStyle: "bold" } },
                  ],
                ],
                theme: "grid",
                styles: {
                  fontSize: 9,
                  cellPadding: 2
                }
              });
              contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
              contador_calculo = 1;
          }

          let body: any[] = [];
          let linha: any[] = [];
          let linhaVazia: any[] = [];

          linha.push({ content: calculo_ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold" } });
          linha.push({ content: 'Técnico', styles: { halign: "center", fontStyle: "bold" } });
          linha.push({ content: 'Nº Cadinho', styles: { halign: "center", fontStyle: "bold" } });

          linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220]  } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });

          body.push(linha);
          body.push(linhaVazia);

          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });
          contadorLinhas = (doc as any).lastAutoTable.finalY;
          
          body = [];
          linha = [];
          linhaVazia = [];

          let contador = 0;
          calculo_ensaio_detalhes.ensaios_detalhes.forEach((ensaios_detalhes: any) => {
            const pai = resultado.find(item => item.pai == calculo_ensaio_detalhes.id);
            const filhoExiste = pai?.filhos.includes(String(ensaios_detalhes.id));

            if (filhoExiste) {
              linha.push({ content: ensaios_detalhes.descricao, styles: { halign: "center"} });
              let variavel_valor = '';
              if(ensaios_detalhes.valor && ensaios_detalhes.valor != 0){
                variavel_valor = ensaios_detalhes.valor;
              }
              linhaVazia.push({ content: variavel_valor, styles: { halign: "center" } });
              contador ++;
              if(contador >= 4){
                linhaVazia.push({ content: '', styles: { halign: "center" } });
                linhaVazia.push({ content: '', styles: { halign: "center" } });
                body.push(linha);
                body.push(linhaVazia);
                autoTable(doc, {
                  startY: contadorLinhas,
                  body,
                  theme: "grid",
                  styles: { fontSize: 8, cellPadding: 2 }
                });
                contadorLinhas = (doc as any).lastAutoTable.finalY;
                body = [];
                linha = [];
                linhaVazia = [];
                contador = 0;
              }
            }
          });

          linha.push({ content: calculo_ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220]  } });
          linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220]  } });

          body.push(linha);
          body.push(linhaVazia);
          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });
          contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
        }
      });

    }else{
      
      analise.amostra_detalhes.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {
              
        plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
          const existe = resultado.some(item => {
            return item.pai == ensaio_detalhes.id;
          });
          if(existe){
            let body: any[] = [];
            let linha: any[] = [];
            let linhaVazia: any[] = [];
            
            linha.push({ content:  ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220]  } });
            linha.push({ content: 'Técnico', styles: { halign: "center", fontStyle: "bold" } });
            linha.push({ content: 'Nº Cadinho', styles: { halign: "center", fontStyle: "bold" } });

            linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220] } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
            body.push(linha);
            body.push(linhaVazia);

            autoTable(doc, {
              startY: contadorLinhas,
              body,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 }
            });
            contadorLinhas = (doc as any).lastAutoTable.finalY;
            
            body = [];
            linha = [];
            linhaVazia = [];

            ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
              const pai = resultado.find(item => item.pai == ensaio_detalhes.id);
              const filhoExiste = pai?.filhos.includes(String(variavel_detalhes.id));

              if (filhoExiste) {
                let variavel_valor = '';
                if(variavel_detalhes.valor && variavel_detalhes.valor != 0){
                  variavel_valor = variavel_detalhes.valor;
                }
                linha.push({ content: variavel_detalhes.nome, styles: { halign: "center"} });
                linhaVazia.push({ content: variavel_valor, styles: { halign: "center" } });
              }
            });    

            linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220] } });
            linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220] } });
            
            body.push(linha);
            body.push(linhaVazia);

            autoTable(doc, {
              startY: contadorLinhas,
              body,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 }
            });

            contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
          }
        });

        let contador_calculo = 0;
        plano_detalhes.calculo_ensaio_detalhes.forEach((calculo_ensaio_detalhes: any) => {
          const existe = resultado.some(item => item.pai == calculo_ensaio_detalhes.id);

          if (existe) {
            if(contador_calculo == 0){
              autoTable(doc, {
                startY: contadorLinhas+5,
                body: [
                  [
                    { content: "Cálculos", styles: { halign: "center", fontStyle: "bold" } },
                  ],
                ],
                theme: "grid",
                styles: {
                  fontSize: 9,
                  cellPadding: 2
                }
              });

              contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
              contador_calculo = 1;
            }

            let body: any[] = [];
            let linha: any[] = [];
            let linhaVazia: any[] = [];

            linha.push({ content: calculo_ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220] } });
            linha.push({ content: 'Técnico', styles: { halign: "center", fontStyle: "bold" } });
            linha.push({ content: 'Nº Cadinho', styles: { halign: "center", fontStyle: "bold" } });

            linhaVazia.push({ content: '', styles: { halign: "center", fillColor: [220, 220, 220] } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
            body.push(linha);
            body.push(linhaVazia);

            autoTable(doc, {
              startY: contadorLinhas,
              body,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 }
            });
            contadorLinhas = (doc as any).lastAutoTable.finalY;
            
            body = [];
            linha = [];
            linhaVazia = [];

            let contador = 0;
            calculo_ensaio_detalhes.ensaios_detalhes.forEach((ensaio_detalhes: any) => {
              const pai = resultado.find(item => item.pai == calculo_ensaio_detalhes.id);
              const filhoExiste = pai?.filhos.includes(String(ensaio_detalhes.id));

              if (filhoExiste) {
                linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center" } });
                let variavel_valor = '';
                if(ensaio_detalhes.valor && ensaio_detalhes.valor != 0){
                  variavel_valor = ensaio_detalhes.valor;
                }
                linhaVazia.push({ content: variavel_valor, styles: { halign: "center" } });

                contador ++;
                if(contador >= 4){
                  linhaVazia.push({ content: '', styles: { halign: "center" } });
                  linhaVazia.push({ content: '', styles: { halign: "center" } });
                  body.push(linha);
                  body.push(linhaVazia);
                  autoTable(doc, {
                    startY: contadorLinhas,
                    body,
                    theme: "grid",
                    styles: { fontSize: 8, cellPadding: 2 }
                  });
                  contadorLinhas = (doc as any).lastAutoTable.finalY;
                  body = [];
                  linha = [];
                  linhaVazia = [];
                  contador = 0;
                }
              }
            });

            linha.push({ content: calculo_ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold", fillColor: [220, 220, 220] } });
            linhaVazia.push({ content: '', styles: { halign: "center" , fillColor: [220, 220, 220]} });

            body.push(linha);
            body.push(linhaVazia);

            autoTable(doc, {
              startY: contadorLinhas,
              body,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 }
            });
            contadorLinhas = (doc as any).lastAutoTable.finalY + 5;
          }
        });
      });
    }

    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
    
    //   // doc.save("Etiqueta.pdf");
  }

  excluirAmostraExpressa(id: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a os ${id}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.amostraService.deleteAmostraExpressa(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
            if (err.status === 500) {
              this.messageService.add({ severity: 'error', summary: 'Erro de exclusão!', detail: 'Não é possível excluir, pois esta OS já está associada a uma análise! ', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }
  
  excluirAmostraOrdem(id: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a os ${id}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.amostraService.deleteAmostraOrdem(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
            if (err.status === 500) {
              this.messageService.add({ severity: 'error', summary: 'Erro de exclusão!', detail: 'Não é possível excluir, pois esta OS já está associada a uma análise! ', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }


//==============================================METODOS IMAGENS==============================================
visualizarImagens(amostraId: any): void {
  this.amostraImagensSelecionada = amostraId;
  this.carregarImagensAmostra(amostraId.id);
}

carregarImagensAmostra(amostraId: number): void {
  this.amostraService.getImagensAmostra(amostraId).subscribe({
    next: (imagens) => {
      // Usar image_url em vez de image para ter a URL completa
      this.imagensAmostra = imagens.map((img: { image_url: any; image: any; }) => ({
        ...img,
        image: img.image_url || img.image // Usar image_url se disponível, senão fallback para image
      }));
      this.imagemAtualIndex = 0;
      this.modalImagensVisible = true;
      
      if (imagens.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Esta amostra não possui imagens anexadas.'
        });
      }
    },
    error: (error) => {
      console.error('Erro ao carregar imagens:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar imagens da amostra.'
      });
    }
  });
}

// Métodos para navegação entre imagens
proximaImagem(): void {
  if (this.imagemAtualIndex < this.imagensAmostra.length - 1) {
    this.imagemAtualIndex++;
  }
}


imagemAnterior(): void {
  if (this.imagemAtualIndex > 0) {
    this.imagemAtualIndex--;
  }
}

// Método para ir para uma imagem específica
irParaImagem(index: number): void {
  this.imagemAtualIndex = index;
}

// Método para deletar uma imagem
// Flag para prevenir múltiplas chamadas - deletar imagem
public deletarImagemEmAndamento = false;
private ultimoCliqueDeletar = 0;
private deletarOperacaoToken = '';
private deletarAcceptRan = false;

deletarImagem(imageId: number, event?: Event): void {  
  // Prevenir propagação de evento se existir
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  // Proteção por timestamp - 1 segundo entre chamadas
  const agora = Date.now();
  if (agora - this.ultimoCliqueDeletar < 1000) {
    return;
  }
  this.ultimoCliqueDeletar = agora;  
  // Prevenir múltiplas chamadas
  if (this.deletarImagemEmAndamento) {
    return;
  }
  this.deletarImagemEmAndamento = true;
  // Fechar qualquer confirmação existente antes de abrir nova
  this.confirmationService.close();
  // Garante single confirm aberto
  this.confirmationService.close();
  const token = `deletar_${imageId}_${Date.now()}`;
  this.deletarOperacaoToken = token;
  this.deletarAcceptRan = false;
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja deletar esta imagem?',
    header: 'Confirmação',
    icon: 'pi pi-check-circle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-warn',
    accept: () => {
      if (this.deletarAcceptRan || this.deletarOperacaoToken !== token) return;
      this.deletarAcceptRan = true;
      this.amostraService.deleteImagem(this.amostraImagensSelecionada.id, imageId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Imagem deletada com sucesso!'
          });
          
          this.carregarImagensAmostra(this.amostraImagensSelecionada.id);
          this.deletarImagemEmAndamento = false;
          this.deletarOperacaoToken = '';
          this.deletarAcceptRan = false;
        },
        error: (error) => {
          console.error('Erro ao deletar imagem:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar imagem.'
          });
          this.deletarImagemEmAndamento = false;
          this.deletarOperacaoToken = '';
          this.deletarAcceptRan = false;
        }
      });
    },
    reject: () => {
      // Reset flag quando usuário cancela
      this.deletarImagemEmAndamento = false;
      this.deletarOperacaoToken = '';
      this.deletarAcceptRan = false;
    }
  });
  // fim confirm
}

downloadImagem(imagem: any): void {
  const link = document.createElement('a');
  link.href = imagem.image;
  link.download = `amostra_${this.amostraImagensSelecionada.numero}_imagem_${imagem.id}`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onDescricaoChange(imagem: any): void {
  // Debounce para não fazer muitas requisições
  if (this.descricaoTimeout) {
    clearTimeout(this.descricaoTimeout);
  }
  
  this.descricaoTimeout = setTimeout(() => {
    this.salvarDescricaoImagem(imagem);
  }, 3000); // Salva após 3 segundos sem alterações
}

private descricaoTimeout: any;

salvarDescricaoImagem(imagem: any): void {
  // método no service para atualizar descrição
  this.amostraService.atualizarDescricaoImagem(imagem.id, imagem.descricao).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Descrição atualizada com sucesso!'
      });
    },
    error: (error) => {
      console.error('Erro ao atualizar descrição:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar descrição da imagem.'
      });
    }
  });
}

// Método para capturar mudanças na descrição durante o upload
onDescricaoInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;
  const descricao = target.value;
  
  if (this.uploadedFilesWithInfo[index]) {
    this.uploadedFilesWithInfo[index].descricao = descricao;
  }
}  

duplicata(amostra: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja fazer a duplicata?`,
      header: 'Confirmar Duplicata',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        
        const novaAmostra = JSON.parse(JSON.stringify(amostra));
        //zera id
        delete novaAmostra.id;
        
          // Calcular data de descarte se necessário
          let dataDescarteFormatada = novaAmostra.data_descarte;
          if (!dataDescarteFormatada && novaAmostra.data_entrada && novaAmostra.material) {
            const dataEntrada = new Date(novaAmostra.data_entrada);
            if (!isNaN(dataEntrada.getTime())) {
              const dataDescarte = this.calcularDataDescarte(dataEntrada, novaAmostra.material);
              if (dataDescarte) {
                dataDescarteFormatada = formatDate(dataDescarte, 'yyyy-MM-dd', 'en-US');
              }
            }
          }

          this.amostraService.registerAmostra(
            novaAmostra.laboratorio,
            novaAmostra.material,
            novaAmostra.finalidade,
            novaAmostra.numeroSac,
            novaAmostra.data_envia,
            novaAmostra.destino_envio,
            novaAmostra.data_recebimento,
            novaAmostra.reter,
            novaAmostra.registro_ep,
            novaAmostra.registro_produto,
            novaAmostra.numero_lote,
            novaAmostra.data_coleta,
            novaAmostra.data_entrada,
            novaAmostra.numero,
            novaAmostra.tipoAmostra,
            novaAmostra.subtipo,
            novaAmostra.produtoAmostra,
            novaAmostra.codDb,
            novaAmostra.estado_fisico,
            novaAmostra.periodo_Hora,
            novaAmostra.periodo_turno,
            novaAmostra.tipo_amostragem,
            novaAmostra.local_coleta,
            novaAmostra.fornecedor,
            novaAmostra.representatividade_lote,
            novaAmostra.identificacao_complementar,
            novaAmostra.complemento,
            novaAmostra.observacoes,
            novaAmostra.ordem,
            null,
            novaAmostra.digitador,
            novaAmostra.status,
            dataDescarteFormatada
          ).subscribe({
            next: (amostraCriada) => {              
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Duplicata registrada com sucesso.' 
              });
              
              
            },
            error: (err) => {
              console.error('Erro ao registrar amostra:', err);
              if (err.status === 401) {
                this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
              } else if (err.status === 403) {
                this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
              } else if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
              }
            }
          });
        },
      
    });
  }

  // Função para calcular a data de descarte baseada no material e data de entrada
  private calcularDataDescarte(dataEntrada: Date, material: string): Date | null {
    if (!dataEntrada || !material) {
      return null;
    }

    const materialNormalizado = this.normalize(material);
    const dataDescarte = new Date(dataEntrada);
    
    // Argamassa: +120 dias
    if (materialNormalizado === 'argamassa') {
      dataDescarte.setDate(dataDescarte.getDate() + 120);
    }
    // Cal, Cinza Pozolana, Cimento, Calcario e Finaliza: +90 dias  
    else if (materialNormalizado === 'cal' || 
             materialNormalizado === 'cinza pozolana' ||
             materialNormalizado === 'cimento' ||
             materialNormalizado === 'calcario' ||
             materialNormalizado === 'finaliza') {
      dataDescarte.setDate(dataDescarte.getDate() + 90);
    }
    // Para outros materiais, usar 90 dias como padrão
    else {
      dataDescarte.setDate(dataDescarte.getDate() + 90);
    }

    return dataDescarte;
  }


  //Finalizar análise
  // Flag para prevenir múltiplas chamadas - finalizar
  public finalizarAnaliseEmAndamento = false;
  private ultimoCliqueFinalizar = 0;

  private finalizarOperacaoToken = '';
  private finalizarAcceptRan = false;

  finalizarAnalise(analise: any, event?: Event): void {   
    // Prevenir propagação de evento se existir
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    // Proteção por timestamp - 1 segundo entre chamadas
    const agora = Date.now();
    if (agora - this.ultimoCliqueFinalizar < 1000) {
      return;
    }
    this.ultimoCliqueFinalizar = agora;
    // Prevenir múltiplas chamadas
    if (this.finalizarAnaliseEmAndamento) {
      return;
    }
    this.finalizarAnaliseEmAndamento = true;
    // Fechar qualquer confirmação existente antes de abrir nova
    this.confirmationService.close();
    const token = `finalizar_${analise.id}_${Date.now()}`;
    this.finalizarOperacaoToken = token;
    this.finalizarAcceptRan = false;
    this.confirmationService.confirm({
      message: `Tem certeza que deseja finalizar a análise da amostra ${analise.id}?`,
      header: 'Finalizar Análise',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        if (this.finalizarAcceptRan || this.finalizarOperacaoToken !== token) return;
        this.finalizarAcceptRan = true;
        this.analiseService.finalizarAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise finalizada com sucesso!'
            });
            setTimeout(() => {
              this.loadAnalises();
              this.finalizarAnaliseEmAndamento = false;
              this.finalizarOperacaoToken = '';
              this.finalizarAcceptRan = false;
            }, 1000);
          },
          error: (error) => {
            console.error('Erro ao finalizar análise:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao finalizar análise.'
            });
            this.finalizarAnaliseEmAndamento = false;
            this.finalizarOperacaoToken = '';
            this.finalizarAcceptRan = false;
          } 
        });
      },
      reject: () => {
        // Reset flag quando usuário cancela
        this.finalizarAnaliseEmAndamento = false;
        this.finalizarOperacaoToken = '';
        this.finalizarAcceptRan = false;
      }
    });
  }

  // Flag e timestamp para prevenir múltiplas chamadas
  public reabrirAnaliseEmAndamento = false;
  private reabrirAnaliseLastCall = 0;
  private reabrirOperacaoToken = '';
  private reabrirAcceptRan = false;

  reabrirAnalise(analise: any, event?: Event): void {
    // Prevenir propagação de evento COMPLETAMENTE
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    const now = Date.now();
    if (now - this.reabrirAnaliseLastCall < 800) {
      return;
    }
    this.reabrirAnaliseLastCall = now;

    if (this.reabrirAnaliseEmAndamento) {
      return;
    }
    this.reabrirAnaliseEmAndamento = true;

    // Fechar confirmações abertas e abrir uma única
    this.confirmationService.close();
    const token = `reabrir_${analise.id}_${Date.now()}`;
    this.reabrirOperacaoToken = token;
    this.reabrirAcceptRan = false;

    this.confirmationService.confirm({
      message: `Tem certeza que deseja reabrir a análise da amostra ${analise.id}?`,
      header: 'Reabrir Análise',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        if (this.reabrirAcceptRan || this.reabrirOperacaoToken !== token) return;
        this.reabrirAcceptRan = true;
        this.analiseService.reabrirAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise reaberta com sucesso!'
            });
            setTimeout(() => {
              this.loadAnalises();
              this.reabrirAnaliseEmAndamento = false;
              this.reabrirOperacaoToken = '';
              this.reabrirAcceptRan = false;
            }, 1000);
          },
          error: (error) => {
            console.error('Erro ao reabrir análise:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao reabrir análise.'
            });
            this.reabrirAnaliseEmAndamento = false;
            this.reabrirOperacaoToken = '';
            this.reabrirAcceptRan = false;
          }
        });
      },
      reject: () => {
        this.reabrirAnaliseEmAndamento = false;
        this.reabrirOperacaoToken = '';
        this.reabrirAcceptRan = false;
      }
    });
  }
  // Método utilitário para reset completo de operações
  private resetOperacoes(): void {
    this.reabrirAnaliseEmAndamento = false;
    this.finalizarAnaliseEmAndamento = false;
    this.aprovarAnaliseEmAndamento = false;
    this.deletarImagemEmAndamento = false;
    // Limpando tokens e guardas
    this.reabrirOperacaoToken = '';
    this.reabrirAcceptRan = false;
  }

  laudoAnalise(analise: any, event?: Event): void {
    // Prevenir propagação de evento se existir
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    // Debounce simples
    const agora = Date.now();
    if (agora - this.ultimoCliqueLaudo < 800) {
      return;
    }
    this.ultimoCliqueLaudo = agora;

    // Evita reentrância
    if (this.laudoAnaliseEmAndamento) {
      return;
    }
    this.laudoAnaliseEmAndamento = true;
    // Fechar qualquer confirmação existente antes de abrir nova
    this.confirmationService.close();

    const token = `laudo_${analise.id}_${Date.now()}`;
    this.laudoOperacaoToken = token;
    this.laudoAcceptRan = false;

    this.confirmationService.confirm({
      message: `Tem certeza que deseja encaminhar à análise ${analise.id} para laudo?`,
      header: 'Encaminhar para Laudo',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        if (this.laudoAcceptRan || this.laudoOperacaoToken !== token) return;
        this.laudoAcceptRan = true;
        this.analiseService.laudoAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise encaminhada para laudo com sucesso!'
            });
             setTimeout(() => {
             this.loadAnalises();
         }, 1000);
          },
          error: (error) => {
            console.error('Erro ao encaminhar análise para laudo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao reabrir análise.'
            });
          },
          complete: () => {
            this.laudoAnaliseEmAndamento = false;
            this.laudoOperacaoToken = '';
            this.laudoAcceptRan = false;
          }
        });
      }
    });
  }

  // Flag para prevenir múltiplas chamadas - aprovar
  public aprovarAnaliseEmAndamento = false;
  private ultimoCliqueAprovar = 0;
  private aprovarOperacaoToken = '';
  private aprovarAcceptRan = false;

  // Flags/controles específicos para Laudo
  public laudoAnaliseEmAndamento = false;
  private ultimoCliqueLaudo = 0;
  private laudoOperacaoToken = '';
  private laudoAcceptRan = false;

  aprovarAnalise(analise: any, event?: Event): void {
    // Evita múltiplos disparos por propagação/ancoras
    if (event) {
      try {
        event.preventDefault();
        event.stopPropagation();
        if ((event as any).stopImmediatePropagation) {
          (event as any).stopImmediatePropagation();
        }
      } catch {}
    }

    // Debounce simples de 800ms
    const agora = Date.now();
    if (agora - this.ultimoCliqueAprovar < 800) {
      return;
    }
    this.ultimoCliqueAprovar = agora;

    // Evita reentrância
    if (this.aprovarAnaliseEmAndamento) {
      return;
    }
    this.aprovarAnaliseEmAndamento = true;

    // Garante um único ConfirmDialog do PrimeNG e accept single-shot
    this.confirmationService.close();
    const token = `aprovar_${analise.id}_${Date.now()}`;
    this.aprovarOperacaoToken = token;
    this.aprovarAcceptRan = false;

    this.confirmationService.confirm({
      message: `Tem certeza que deseja aprovar a análise ${analise.id}?`,
      header: 'Aprovar Análise',
      icon: 'pi pi-check-circle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        if (this.aprovarAcceptRan || this.aprovarOperacaoToken !== token) return;
        this.aprovarAcceptRan = true;
        this.analiseService.aprovarAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise aprovada para laudo com sucesso!'
            });
            setTimeout(() => {
              this.loadAnalises();
            }, 1000);
          },
          error: (error) => {
            console.error('Erro ao aprovar análise para laudo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao aprovar análise.'
            });
          },
          complete: () => {
            this.aprovarAnaliseEmAndamento = false;
            this.aprovarOperacaoToken = '';
            this.aprovarAcceptRan = false;
          }
        });
      },
      reject: () => {
        this.aprovarAnaliseEmAndamento = false;
        this.aprovarOperacaoToken = '';
        this.aprovarAcceptRan = false;
      }
    });
  }

  salvarSelecionados() {
    this.imprimirLaudoPDF(this.amostra_detalhes_selecionada);
  }

  imprimirLaudoPDF(amostra_detalhes_selecionada: any){
    if(this.normalize(amostra_detalhes_selecionada.amostra_detalhes.material) === 'argamassa' || this.normalize(amostra_detalhes_selecionada.amostra_detalhes.material) === 'Argamassa'){
      // if(this.normalize(amostra_detalhes_selecionada.amostra_detalhes.tipo_amostra) === 'colante'){
      //   this.imprimirLaudoArgColantePDF(amostra_detalhes_selecionada);
      // }else{
        this.imprimirLaudoArgPDF(amostra_detalhes_selecionada);
      // }
      
    }else{
      this.imprimirLaudoCalcPDF(amostra_detalhes_selecionada);
    }
  }

  ///////AQUIIII
  imprimirLaudoCalcPDF(amostra_detalhes_selecionada: any) {
    const doc = new jsPDF({ 
      unit: "mm", 
      format: "a4" 
    });

    const logoBase64 = 'data:image/png;base64,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';
    
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19); // x, y, largura, altura

    //cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(amostra_detalhes_selecionada.numero+' | 1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR'); // exemplo: 07/08/2025 13:35:22

    const agora_validade = new Date();
    agora_validade.setDate(agora_validade.getDate() + 60); // adiciona 60 dias
    // Formata para dd/MM/yy
    const dataFormatadaValidade = agora_validade.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('Data de Emissão: '+dataHoraFormatada, 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    let y = 52;

    const dataColetaFormatada = new Date(amostra_detalhes_selecionada.data_coleta);
    const dataColetaFormatada2 = dataColetaFormatada.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    //Dados amostra
    const linhas = [
      ['Material: '+amostra_detalhes_selecionada.amostra_detalhes.material, "Tipo: "+amostra_detalhes_selecionada.amostra_detalhes.tipo_amostragem, ""],
      ['Sub-Tipo: '+amostra_detalhes_selecionada.amostra_detalhes.subtipo, "Local de Coleta: "+amostra_detalhes_selecionada.amostra_detalhes.local_coleta, ""],
      ['Produto: ', "", ""],
      ['Fornecedor: '+amostra_detalhes_selecionada.amostra_detalhes.fornecedor, "Amostragem: "+amostra_detalhes_selecionada.amostra_detalhes.tipo_amostragem, "Data Coleta / Fabricação: "+dataColetaFormatada2],
      ['Registro EP: '+amostra_detalhes_selecionada.amostra_detalhes.registro_ep, "Registro do Produto: "+amostra_detalhes_selecionada.amostra_detalhes.registro_produto, ""],
    ];

    doc.rect(15, 48, 182, 35); //tabela dados amostra
    linhas.forEach((linha, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 130, y);
      y += 7;
    });

    //tabela de ensaios
    let contadorLinhas = 88;
    const head = [['Ensaio', 'Resultado', 'Unidade', 'Garantia', '', 'Norma']];
    const body: any[] = [];

    // "text": "Produto: Calcário corretivo de Acidez; Perda ao Fogo: 88.89%; Re+ SiO2: 15.73%"
    this.descricaoApi = 'Produto: '+amostra_detalhes_selecionada.amostra_detalhes.produto_amostra_detalhes.nome+'; ';
    amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
      this.ensaios_selecionados.forEach((selected: any) => {
        const linha: any[] = [];
        if (selected.id === ensaios_utilizados.id) {
          let norma: string = '-';
          if (ensaios_utilizados.norma) {
            norma = ensaios_utilizados.norma;
          }
          let unidade: string = '-';
          if (ensaios_utilizados.unidade) {
            unidade = ensaios_utilizados.unidade;
          }
          let valor: string = '-';
          if (ensaios_utilizados.valor) {
            valor = ensaios_utilizados.valor;
          }

          let garantia_num: string = '-';
          let garantia_texto: string = '-';
          if (selected.garantia) {
            const aux = selected.garantia.split(' ');

            garantia_num = aux[0]; 
            garantia_texto = aux[1]; 
          }

          this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';
          
          linha.push({ content: ensaios_utilizados.descricao });
          linha.push({ content: valor });
          linha.push({ content: unidade });
          linha.push({ content: garantia_num });
          linha.push({ content: garantia_texto });
          linha.push({ content: norma });
          body.push(linha);
        }
      });
      
      autoTable(doc, {
        startY: contadorLinhas,
        head,
        body: body,
        theme: "grid",
        styles: { fontSize: 8, halign: 'left', cellPadding: 1 },
        headStyles: { halign: 'left', fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      });
    });

    amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
      ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        this.ensaios_selecionados.forEach((selected: any) => {
          const linha: any[] = [];

          if (selected.id === ensaios_utilizados.id) {
            let norma: string = '-';
            if (ensaios_utilizados.norma) {
              norma = ensaios_utilizados.norma;
            }
            let unidade: string = '-';
            if (ensaios_utilizados.unidade) {
              unidade = ensaios_utilizados.unidade;
            }
            let valor: string = '-';
            if (ensaios_utilizados.valor) {
              valor = ensaios_utilizados.valor;
            }

            let garantia_num: string = '-';
            let garantia_texto: string = '-';
            if (selected.garantia) {
              const aux = selected.garantia.split(' ');

              garantia_num = aux[0]; 
              garantia_texto = aux[1]; 
            }
          
          this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

            linha.push({ content: ensaios_utilizados.descricao });
            linha.push({ content: valor });
            linha.push({ content: unidade });
            linha.push({ content: garantia_num });
            linha.push({ content: garantia_texto });
            linha.push({ content: norma });
            body.push(linha);
          }
        });
        
        autoTable(doc, {
          startY: contadorLinhas,
          head,
          body: body,
          theme: "grid",
          styles: { fontSize: 8, halign: 'left', cellPadding: 1 },
          headStyles: { halign: 'left', fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
        });
      });
    });

    //observações
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 95, 213);
    autoTable(doc, {
      body: [[this.bodyTabelaObs]],
      startY: 216,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      }
    });
    doc.rect(14, 215, 182, 20); //tabela obs

    //original assinado...
    autoTable(doc, {
      body: [['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']],
      startY: 270,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    //rodape
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: '+dataFormatadaValidade, 16, 281);
    doc.text("DB Calc Plan", 100, 281);
    doc.text("Vesão: 9.0", 180, 281);

    const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, 238, 40, 30); // x, y, largura, altura

  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }
  
  imprimirLaudoArgColantePDF(amostra_detalhes_selecionada: any) {

    const doc = new jsPDF({ 
      unit: "mm", 
      format: "a4" 
    });

    const logoBase64 = 'data:image/png;base64,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';
    
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19); // x, y, largura, altura

    //cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(amostra_detalhes_selecionada.numero+' | 1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR'); // exemplo: 07/08/2025 13:35:22

    const agora_validade = new Date();
    agora_validade.setDate(agora_validade.getDate() + 60); // adiciona 60 dias
    // Formata para dd/MM/yy
    const dataFormatadaValidade = agora_validade.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('Data de Emissão: '+dataHoraFormatada, 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    let y = 52;

    const dataColetaFormatada = new Date(amostra_detalhes_selecionada.data_coleta);
    const dataColetaFormatada2 = dataColetaFormatada.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    this.descricaoApi = 'Produto: '+amostra_detalhes_selecionada.amostra_detalhes.produto_amostra_detalhes.nome+'; ';

    //Dados amostra
    const linhas = [
      ['Material: '+amostra_detalhes_selecionada.material, "Tipo: "+amostra_detalhes_selecionada.tipo_amostragem, ""],
      ['Sub-Tipo: '+amostra_detalhes_selecionada.subtipo, "Fornecedor: "+amostra_detalhes_selecionada.fornecedor, ""],
      ['Local de Coleta: '+amostra_detalhes_selecionada.subtipo, "", "Data Coleta / Fabricação: "+dataColetaFormatada2],
      ['Registro EP: '+amostra_detalhes_selecionada.produto_amostra_detalhes.registro_empresa, "Registro do Produto: "+amostra_detalhes_selecionada.produto_amostra_detalhes.registro_produto, ""],
    ];

    doc.rect(15, 48, 182, 35); //tabela dados amostra
    linhas.forEach((linha, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 130, y);
      y += 7;
    });

    //tabela de ensaios
    let contadorLinhas = 88;
    const head = [['Ensaio', 'Unid', 'Resultado', 'Método']];
    const body: any[] = [];

    amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
      this.ensaios_selecionados.forEach((selected: any) => {
        const linha: any[] = [];

        if (selected.id === ensaios_utilizados.id) {
          let norma: string = '-';
          if (ensaios_utilizados.norma) {
            norma = ensaios_utilizados.norma;
          }
          let unidade: string = '-';
          if (ensaios_utilizados.unidade) {
            unidade = ensaios_utilizados.unidade;
          }
          let valor: string = '-';
          if (ensaios_utilizados.valor) {
            valor = ensaios_utilizados.valor;
          }

          let garantia_num: string = '-';
          let garantia_texto: string = '-';
          if (selected.garantia) {
            const aux = selected.garantia.split(' ');

            garantia_num = aux[0]; 
            garantia_texto = aux[1]; 
          }

          this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';
          
          linha.push({ content: ensaios_utilizados.descricao });
          linha.push({ content: valor });
          linha.push({ content: unidade });
          linha.push({ content: garantia_num });
          linha.push({ content: garantia_texto });
          linha.push({ content: norma });
          body.push(linha);
        }
      });
      
      autoTable(doc, {
        startY: contadorLinhas,
        head,
        body: body,
        theme: "grid",
        styles: { fontSize: 8, halign: 'left', cellPadding: 1 },
        headStyles: { halign: 'left', fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      });
    });

    amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
      ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        this.ensaios_selecionados.forEach((selected: any) => {
          const linha: any[] = [];

          if (selected.id === ensaios_utilizados.id) {
            let norma: string = '-';
            if (ensaios_utilizados.norma) {
              norma = ensaios_utilizados.norma;
            }
            let unidade: string = '-';
            if (ensaios_utilizados.unidade) {
              unidade = ensaios_utilizados.unidade;
            }
            let valor: string = '-';
            if (ensaios_utilizados.valor) {
              valor = ensaios_utilizados.valor;
            }

            let garantia_num: string = '-';
            let garantia_texto: string = '-';
            if (ensaios_utilizados.garantia) {
              const aux = ensaios_utilizados.garantia.split(' ');

              garantia_num = aux[0]; 
              garantia_texto = aux[1]; 
            }
          
            this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

            linha.push({ content: ensaios_utilizados.descricao });
            linha.push({ content: valor });
            linha.push({ content: unidade });
            linha.push({ content: garantia_num });
            linha.push({ content: garantia_texto });
            linha.push({ content: norma });
            body.push(linha);
          }
        });
        
        autoTable(doc, {
          startY: contadorLinhas,
          head,
          body: body,
          theme: "grid",
          styles: { fontSize: 8, halign: 'left', cellPadding: 1 },
          headStyles: { halign: 'left', fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
        });
      });
    });

    //observações
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 84, 213);
    autoTable(doc, {
      body: [[this.bodyTabelaObs]],
      startY: 216,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      }
    });
    doc.rect(14, 215, 182, 20); //tabela obs

    //original assinado...
    autoTable(doc, {
      body: [['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']],
      startY: 270,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    //rodape
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: '+dataFormatadaValidade, 16, 281);
    doc.text("DB Calc Plan", 100, 281);
    doc.text("Vesão: 9.0", 180, 281);

    const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, 238, 40, 30); // x, y, largura, altura

  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }

  private montarGrafico(): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.graficoCanvas.nativeElement.getContext('2d');
      if (!ctx) return resolve();

      if (this.chart) {
        this.chart.destroy();
      }

      const labels = this.dadosTabela.map(d => d.tempo);
      const valores = this.dadosTabela.map(d => d.valor);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: valores,
            borderColor: 'blue',
            fill: false,
            pointRadius: 3
          }]
        },
        options: {
          responsive: false,
          animation: {
            onComplete: () => {
              resolve(); // 🔹 só libera quando o gráfico terminou de renderizar
            }
          },
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    });
  }

  async imprimirLaudoArgPDF(amostra_detalhes_selecionada: any) {

    const logoBase64 = 'data:image/png;base64,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';

    const primeira_imgagem_arg = 'data:image/png;base64,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t771rQceeGDkyJHDhw8fNmwYuzeWGjVqnD9/PhIZKgcuX77cuHFjnju2Xweeu/vuu483byQyGCoH7CRgyAvLeAsbOvHkRZFlvOQ8999//5AhQ1R98cUX//Vf//XAgQOqGooJynj/8A//MPZx7qlTp77zne/Ur1//ypUrkclQjLhz586YMWM4ag8aNOjMmTNXr17liu/du5es6f/8n//z1ltvRboqCW3vUaUQsG/fvv/1v/7X6NGjo/pXX127dm3ixIm/8zu/s3DhwshkqBy4ePEiT9l//a//9eGHH3788ccfCwFv3749TZHIYKgcKKyd0HBPYBlvYUMnnrwosox31apVf/RHf9SzZ08I4EBMddq0aVGzoYiQlPF+8MEHf/qnf9qlSxf7bL+4cfLkyR/96EdPPvnkp59+GplCrF69+oc//OGKFSuiepWEtveoUghQxjtq1KioHuKLL774yU9+UqNGjcKaS9Hj0qVL999/P0nv559/fu3ataspwO0PKBgqG2z3MOSFZbyFjfDAkx/F9H66fft29+7df/VXf/W3f/u3OTyRC/3e7/3er/zKr1SrVo03dCQyFAuU8XKtFy1atHv37l0h3nzzzVatWv393//9mjVrIp2hSLF+/Xqe8eyfZ3Hyfuedd86ePRvVqyS0vUeVQkDOjBd069bte9/73oULF6K6oRKA9+nPf/7zRx555NatW5HJYKisKKyd0HBPYBlvYUMnnrwopoz3xIkTP/jBDzge1a5du2YIyH333fcnf/In27Zti0SGYgEZb4cOHX71V3/1d3/3dzkrCyTAv/7rv96/f3/7N4qKHlOnTv2DP/iDDRs2RHWDB23vUaUQkJTxDh48GPvhw4ejuqESQBnvAw888Nlnn10Nf5tAsK/VGCohCmsnNNwTWMZb2NCJJy+KKeNduHDhd77znTfeeOP27du8egHkwIEDf/M3fzNkyBAmG+kMRQGuLxnvf/yP//Gf//mff/azn/00xI9+9KP//b//92OPPbZ3795IZyhGsHH17duXjHfnzp2RyeBB23tUKQQkZbzDhg377d/+bftbDJUKZLwPPvjgb/3Wbz3zzDO1atXSz5erVau2YMGCSGEwVBrY2c+QF5bxFjZ04smLosl4r1692qhRI/3UOTKFuHXrVp06dX7+85+fPn06MhmKAmS87dq1U87z+eefnwnx6aefrlu37q/+6q+aNWtmX2UvbowdO/YP//APt27dGtUNHrS9R5VCQFLGO2DAgD/7sz/76KOPorqhEoCt9eGHH/5//9//97//9//+/0vhN3/zN/v37x8pDBWJ9957T3+ppCKwcuVKXqnF9K9MFdZOaLgnsIy3sKETT14UTcb71ltv/eVf/iXHIyYVmVJ48cUXv/3tb69YsaKYPtA2KOMl5zl48GBkCnHnzp3WrVv/wz/8g/1LnsWNZcuWfetb38r+C1U85u+//z53RVX+JUNt71GlEJAz42UKzZs3v++++65fvx6ZDJUA+lbzD37wg02bNu3atSv4p3h37tyxY4f9YOIbAA9Fly5datSo0b59e96A5QtiNmrUqE6dOl988UXUX+GjsHZCwz2BZbyFjeC8UwoURxLILObMmfP3f//3GzdujEwejh49yplp6NCh5EiRyVD4SMp4QYcOHf78z//cvthc3OD6/sVf/EXv3r1jH0dwHG/cuDH3QFX+c0fa3qNKIUAZ75gxY6J6iCNHjvz1X/91r169orqhcoBH7P7773/kkUfu3LkTmQzfFNjuevTosX37dt6A18sbxOS81LVr1zNnzkT9FT4Kayc03BNYxlvY0IknL4oj42Uie/bsWbp0ac4vsrKJr1+/fsuWLfaHJYsJyni/9a1vcVbmEHAjxNWrV3fs2PH973//4YcfruJ/rbfocfnyZTLbf/iHf9i2bZvbx7gTlixZ8lu/9Vsc2rgfZKyC0PYeVQoByngHDx584cKFL7744vPPP//www9btGjxR3/0RzvtV7UrGfQZ70MPPWR/IPCbB1tcr1693nnnnahe3vjkk0/IqC3jNVQpWMZb2NCJJy+KI+M1VEEo4/1P/+k/PfHEE2Q+DUPUrFnzz/7sz/7bf/tvU6ZMsc8fih5r164lTfr+97+/cOHCAwcOkDU9//zzfxKi4k6EBQFt71GlEMC1+/3f//0//dM/ffzxxx999NGHH374u9/97h/8wR8MHTo09hm+4Z5DGS/XiE04Mhm+KSjj3bNnT1Qvb5w+fdoyXkNVg2W8hQ2dePLCMl5DgYLDVvfu3X/zN3/zN37jN/6/KfzWb/3W3/7t344aNercuXORzlC84B6YOHHit771rf/yX/7L//yf//N//I//8Z//838ma1q8eDGbWySqktD2HlUKAQcPHvyXf/mX3/3d3/293/s9ym9/+9sPPvjg1KlT7V/irYQg433ggQf+/M//nKdv2rRpXCYwZcqU559//tixY5HIUDGwjPduUcXfBYbSwDLewoZOPHlhGa+hQMHdu3fv3oULF8738Nprrx09erQqf521quHq1auvv/56v379nnrqqWrVqvXv33/btm328b6296hSCLh+/fq77777dgoHDhw4f/581GaoZLh48eKDDz7ICfD/44Hqr/3ary1atCgSGSoGlvHeLQprJzTcE1jGW9jQiScvLOM1GAyFjmvXrp06dYqzmv1ioaDtPaoYDOWKmzdvktkOGDBgkIeBAwcOGzbM/kJ+RcMy3ruF7YSGvLCMt7ChE09eWMZrMBgMRQZt71HFYDAUCyzjvVvYTmjIC8t4Cxs68eSFZbwGg8FQZND2HlUMBkOxgDNbnz599u3bF9XLG2fPnu3du/dnn30W1QsfthMa8sIy3sKGTjx5Ufkz3mvXrh04cGDnzp27KhhHjx69bX8U1GAwFD60vUcVg8FQCcBJZubMmbPKgNmzZxPh4Ycf7t+//9y5cyNr+WHOnDnjxo178MEHKeGR9WvhhRde2LRpU2XYhWwnNOSFZbyFjfDAkx+VP+Pdu3dv/fr1W7du3bFjxw4VAyI3atSI8osvvoh6NRgMhoKFtveocq/BW+b69etXKgDXrl2zrykZCgUjR4586qmnevbs2b1s6Ny5c7du3aJKBaDs8ZkjZ6q2bdvy4EeTv3eoPDuhodLCMt7Chk48eVH5jwubN29m/923b9+RI0cOVwyOHTu2bt26Vq1affLJJ1GvBoPBULDQ9h5V7jVOnz7dr1+/Ll26cIwuRxCwT58+J0+ejLoxGCo3RowYsWjRohs3bpAHlgVEKHuQElAuI9y9ezeP55UrV6LJ3ztUnp3QUGlhGW9hQyeevKj8Ge+WLVsGDx5c0X+C9dChQ+TVlvFWBnz88ccbN258s4KxYcOGt956qzK8jw0x8LB/XsE4d+4cx7Kov2KEtveocq/B2bdJkyaLFy9evnz5snICoZYsWdK0adMdO3ZE3RjKA3fu3Hn33XfXr1//ennjjTfe+Oijj6JuqiRGjRq1YsWKqFLsOHDgQL9+/SzjNRQELOMtbOjEkxcFkfEOGjTo8uXLUb1i8MEHH3Tq1Mky3sqA559//plnnmlfwWjVqlX9+vX3798f9WqoHCARfeGFF9q1axd9kFcx4AYo7qOntveocq/x9ttvjxw5siLGQwqxffv2qGIoD5w/f569sUGDBq1bt4aUF4j21FNPTZgwIeqmSoLbdfny5VGl2PHuu+9axmsoFFjGW9gIDzz5YRmvYBlvJQH35LPPPjtx4sRTp06drDAQnFy3c+fO27Ztizo2VA5cuHChY8eOY8aMWbVqFUlpRYDI3bt3HzZsWBH/Cqi296hyr0HGy0N969atqF5OYIIk0pbxli/Onj1LovLhhx9+8cUX0TciygPnzp1bvHjx6NGjo26qJCzjvSeoPDuhodLCMt7CRnjgyQ/LeAXLeCsJuCc5FnA2iuoVBjIr7is7Llc2nD9/vk+fPu+8805UrxgsW7aMpJqbLaoXHcLd3TJew12DjHfw4MHkqFG9/LB+/fpx48ZFlSoJy3jvCSrPTmiotLCMt7ARHnjywzJewTLeSgLuSY4FCxcujOoVhi+++GLgwIF2XK5sIOPt27fv7t27o3rFYOnSpZbxfmOwjLeAQMbLC/fTTz+N6uWHdevWWcZb9oz3+vmzS+bNnjBhwvjxExatevPKzTxHuBs3rt2+8+XxD97Zsef9j48d3P7WgbMfH9u0bfetLyv27GcZr6GAYBlvYSM88OSHZbyCZbyVBNyTlvFWZVjGWy4Id3fLeA13Dct4Kw7lkvGe2vfmT37wvVoNmrVq2fzhBx95bsH6kp7zO9fmTx23/b3DB/dsWv3GztdemtKyy+gta16q16T3lTuRpIJgGa+hgGAZb2EjPPDkR+XPeHfs2DF06NCK/sOqR44c6dq162effRbVDfcI3JOW8VZlWMZbLgh398oyO67m8OHDb9++HdXLCby82CvsbzWXLyzjrTiUS8Z7/O01des1OX4u+PnRW6/Oqteyy+fX7pw5cWj9mjU7d797884vv7x9493d29et33D680sXzx5q8Nj9z0576cwnH3/08Zn1C55r0WnUlnWL6jTovHHLlu273rl2K3gqTx/74LV1a9/a+/7NO+W2aVjGayggWMZb2NCJJy8qIuMl7NGjR7du3bqlzNi2bdvkyZMbN268fv36cgmYE/Qyf/786tWrr1ixAh5Zvy42b95MHlURJ4aqAG4ey3irMizjLRcEm3s5zY53BMnqra8LfPVTy6tXr0amcsKNGzeeffZZ9tuyDA9U/h/7fpOwjLfiUE4Z79p69Zoc/ez6l3fuvL12dsN23fbte7t3h1YtmreoUaPWqq37392yslmDhs2aNB0xZcEH7275+ff+snGXwYvnPDfsufnrFk5p1WXMjjeW/OhH97Vs37pGtRpL33jr7LF3O7Zp0aJl8+rV66/Z/n7UTZlhGa+hgGAZb2FDJ568qIiXPSeb4cOHt2zZslevXj3LBiK0b9++UaNGPXr0KHu0JBC5c+fODRo06Nq1a7mMmRR9yZIlLG+0IoZSg0WzjLcqwzLeckGwuZfT7I4fPz516tSJEydO+lqYMmUKu/dTTz1FhOeeey6ylhmEIuDTTz/drVs3uoisd48JEyZU9J9JKyyQ6w4ZMqSC/nLV+PHjo0qVRLlkvB/tfeOBH/1bl96Dhg8b0qR+nckLVx967635i5cf/GB/t6bP9B09a/nzg2s3br/2tTfe2vvB5Yuf9GhW9+X1216ZNbLLkGnrFk4l492+/qWfPfT02x8emzu2T89hUw/u3T7rpRXvH3inXZ3qvce/HHVTZljGayggWMZb2NCJJy8qIuPlzMpOR8p39OjRI2UGQY4dOxZVKgzl2Auhxo4dO3369Dt3KvgXZYoR3JCkIosWLYrqFQbu0sGDB+/atSuqGyoHLly40L9//71790b1igHnTh7SIv5wT9t7VCkbVq9e3axZs8mTJ5Nkfj3ItywRSsbXjjxt2rS2bdviHk218HH79u3PPvvs46+LTz75ZP/+/R07dty2bduHH374Qfnh8OHDvBM5GNBF1Nnd4/Tp0xcvXoymWoAop4z39Qf+7V+79R0yfPjweUvXXL5x5/zZoxOGD2jbptm/fe/vOgyefOrw7tb1nv7xTx8cMXXh+YtnB7Zrunrn/tVzx3QbOl0Z75Z1L9Vr2uv6V19tXzmzz5DJZ08fGz10QOuWzX/wD3/dftjsqJsywzJeQwHBMt7Chk48eVFBGe/QoUPfeuutqF71sHDhwhdeeKHcf2+t0oKzyNatWzeVGZs3b964cWPz5s379u0Lj6wVgC1btqxatapevXocdjnbRdayYffu3RX999UqLe7cuXPixAlWoIzYs2fPhg0bGjVqNHfu3LfffntHxWDXrl3Dhg1r164dexQ9Rn1/XTBO5s5eGq1F5YC296hSNpDxzps3L6oUHV577bWpU6dGlcLHwYMHmzVr1rhx46ZfC/g2bNjwpz/96dNPP12jRo3q5YeaNWs+FIIuos7uEjjWrVuXJ/dWef8JtG8M5fSt5jX1GjQ77SWSS18Y8WSd5stWvdK/c8O2fcedOv7hO+/sXfXStB/967+v2b5zYPtma4KMd3TX4DPeKS07j96yloy399Uvv9r2yqz+w6bOG9Pv8VqNFq9Y3atZjfaDn4+ClhmW8RoKCJbxFjZ04smLCsp4hwwZwskyqlc9cECsOhkv0xw3bly1atVatWrVsjzA2ahOnTpRpcLQokULjnQc78pl2JzGnnnmGbL0aFGqGM6dO9etWzfOtRy1y4gGDRo8/PDDLGa9evU44FYEiPzkk08+9thjpNZRr2UAuUHHjh0r20dP2t6jStmwZs2auXPnRpWiw9q1a6dPnx5VCh/bt2/v2bNn9MOYr4U9e/bs27fvnQoAYUHUzd1j7969K1as6NOnz9WrV6PZFhrKJ+PdvbZug2Ynzt2M6l999eq8CU/WaDhyxPDqj/6s/cDxm1bOada89eCBvZ+p23TfkZNjejbv1H/0nMnDeg1/ft3CqcHfal77Ut0mva+Q8a6c2X/4tMVTnn3smdrPjhj+9C9+3Hrg1PL6ZpplvIYCgmW8hQ2dePLCMt6KQJXKeG/cuDF06NA5c+aU5etqPs6cOVNeoUoGHZ0+ffrUqVNR/euCIEeOHOnSpcvKlSujRali4Hox/fXr10M+KjNYUi5KVKkY6KJHlTKAIMy6VatWZ8+ejdaickDbe1QpGyzjLSDs3Llz0qRJUaXocPz48REjRlSGJOrrgYyXpD2qfF1cOnPslZWrL91IP91Xzp2eM3X86AlTX1v/2utbd12+9PniuVMHDh7+xq73aH1v5+tTp8/dtnXTpp37jr//zto3dp069sErr27kdPLx4f2bd+y9+MUnMyaPG/vcjPWvr12z5e3yyg4PHDhgGa+hUGAZb2FDJ568sIy3IlDVMt6RI0dyLI7qVRLXr18fOHDgqlWronoVA4lu3759P/jgg6helcCsO3bsaBlvgaL4Mt4JEyYU6y+oHz16tKAz3uHDhy9YsODatWuXyhWXL1++dOkiYGVUpX7hwsXLV65AqNEkZU7E3MsFV69e5Vbs3bu3ZbyGgoBlvIUNnXjywjLeikAVzHhfffXVqF4lwQt+wIABVTzjfe+94COFqgZmbRlv4cIy3gJCoWe848aNq127dv/+/dkty4J+/fpFLAUsDl41q0ll+J+gLUWC/6QQ2ssK5tiyZcvOnTtzPIgmf+9QXjuhoYhhGW9hQyeevLCMtyJgGW9Vg2W8nHIs46080PYeVcoGy3gLCJbxVmYcP36cp2l1lcH+/fsrw61YXjuhoYhhGW9hQyeevLCMtyJgGW9Vg2W8lvFG9coBbe9RpWywjLeAYBlvheLKxXMfnfr40tXrUd3D7Vs3Ll2+UpzrXuAor53QUMSwjLewoRNPXljGWxGwjLeqwTJey3ijeuWAtveoUjZYxltAsIy34nD0wI6enVtXr1GjS58h7584E1lTOHpg67OjZ1yqEu/8AkN57YSGIoZlvIUNnXjywjLeioBlvFUNlvFaxhvVKwe0vUeVssEy3gKCZbwVhAufHOnctvGzk2Zv27plYOc2rXuMvhK+3m9ev3YzfNG/s3lJ9Xpdvgj/qeAb165ev5H+14MM9xbltRMaihiW8RY2dOLJC8t4KwKW8VY1WMZrGW9UrxzQ9h5VygbLeAsIlvFWEDatfaVll6GXwjT27PEPlyxddenG7Xe2rO3do1OfIaM/+Oiz/dtfqdOk5+fXrm1bt6RX185de/TZceBo6JoG70pOR1UEFy5cYL7RzO8pymsnNBQxLOMtbOjEkxeW8VYELOOtarCM1zLeqF45oO09qpQNlvEWECzjrSAsX75s4JSXo0qI8x+/36J+vWfHTx3Yo12n/mM3v7msQYs+h4+9P7Bv1+fnzO/XqUmbXmOu3sq4EAsWLGjatGmLFi1apuBzB2cUadWqleM+ATmNDs2bN8+251SWHPOuXBxv1KgR841mfk9RXjuhoYhhGW9hQyeevLCMtyJgGW9Vg2W8lvFG9coBbe9RpWywjLeAYBlvBWH58uVDZyyLKgF++dbq2Y1adLv05Vfnj+9p3qLtvEXzG7bo8/G5L3bu2Lpt64ZuLas/Ubfd59fCbzmH4KJ07969Vq1aAwcOHDRoEO8L9kxB/yzQ4MGD4X369Ondu3f/FJDJggBHVeGUiKlihCCQHRAcR6q9evWiikZxXHB5+XEQYAG0UgXOC42Cw2XEgkDBccEiF6pAoSA1a9bs2rVrNPl7ivLaCQ1FDMt4Cxs68eRFxWW8vHqjetXD/PnzLeOtUrCMlxOPZbyVB9reo0rZQMbLhhZVig6vv/76888/H1UKH5bxVhDeWLmsXe8xyl9vXPhk1pwXZ08Z06bTQN7x18980LpN+9kL5zVp1e+Dw/s7tGhQt0nzls3rPlm/9afX0r/Ny0Uhpx0/fvzGjRtfe+219SlwBwrr1q3zLeIo4W+88Ua2UVWFck0QLM4owGWEEyoUZkAa4FpDvyCU47I75IyjceLFHCdNmkTqG03+nqK8dkJDEcMy3sKGTjx5UUEZ79ChQ3fs2EHwqJuqBGY9b968mTNnWsZbdWAZr2W8Ub1yQHtRVCkbVq5cycl1VxZIriJ2lyilo5Pl1OdsfeuttyKWBWTZrVjIQDiaR1MtfDBNy3grAmeP7G3epMELi9YcPPj+C2MG1mvdc9vWNxrUqb9u89tLXxjVsHX3NWtfbtC89+ur5j9VveGq198cO7D9w7WanbmSkfH2799/+PDhJIQkt2Dt2rVrUv88L9y3UAKqiJ2FqgQqeefKAqiCMNJqxQHOy5Ug2yhLOKJ1EGehVQI6ksUZga8BanVGst9Ro0b169cvmvw9RXnthIYihmW8hQ2dePKiIl6N586da9euHSfgOXPmzJ49e1YIn5ANUsqiqkjYngNOICI4vR9BkeGOyO7KbLsjlM5SAvwIDr6FWbdo0YJjh2W8VQeW8VrGG9UrB7S9R5Wy4eWXX/7hD39Yv379evXq1a1bF0IpYKldu3adOnVEsLhWEZpU1qpVixKjSrUqIBb5QgBGAEEjIqABWFAC1yqLWiWjbNCggZNRYlEpyBFLo0aNmNqwYcOiqRY+yHiLKYGP4dixY/cq4/3qy9tb1y5u1rBO7Tq1G7Zov/HtD768c2PB1DG1a9WoXb/JK2/uPvjOxl4DJx45+l73ds3qN27Wq2f3bv2HfXIx4083kfFWq1atQ4cObVJoG4LzEmjVqlXr1q3FBZqwIMNFSrmgdAIs8oLIKAtwXkAWWmVUHJUYxRGIhGGi3ukLF1VlkZJNTxaqQLx9+/Yo1dEzzzzTp0+faOb3FOW1ExqKGJbxFjZ04smLish4v/jiC84ZDz/8MBtf8+bN3Z9qgAtUm4WAoEGAEQEWCGXwdw9atmzSpImzo5Qj1caNG1OyEctRTUAy2RWEUkagKjGdQMNzMo3EEZrwosrejZfsbkiUxAncUnYR7JT33Xff0KFDSQWjFSlqKONdvXp1VK+SuHbt2sCBA6t4xvv+++9H9aqEDz74oLgz3ldffbVLly6LFi1aEGL+/Pnz5s2jhL/44osLFy586aWXVAKMtIbCoFUEqBWgpKogcBFnlwajQJNkCgVxoKpWEcQYIZQMlSDYBbVCFERNYT8vLV68uHfv3uPHj4+mWvgg4yXrYCPiqhUZ1q5d+/zzz/fo0ePq1avRbL9h/PLOqeOHdu/Zc+L0pzLcvHb5gwP7Pzx68s4vA376zGd3fvnl2Y+P79t/4PNz5z/99NObtzOeQaag33QF+p1YwIsDrqpPXBWgibUK2UqQs5ptFPyquIOMQNwZRUDYGCEyeQLS3TVr1kQzv6cor53QUMSwjLewoRNPXlRExnvhwgU2u7Fjx65bt27FihW8fVeuXOmIXsbLly8Xlx1QBaoicPpXXnlFpbM7i4xOpiolVZTOV9WwPRAQAUvoFwR0dhE5qhojlPJ1VZok0GhlZNZMn4z3+vXr0YoUNdxnvNxLd+4G3H4Ry+RlQXhTl08oHyXHpPXy5cu847kBokWpYiDjJXN4++23uec5j165coUyRmJwdkfEfRK2pKEmITKFiEwhIpOHqMFrilV9yO4LfC74lmvXru3Zs6dDhw5FnPGuXr2ai/vmm2/q1/neCCG+ceNGESz6RT7HKeUSqN94w/1CoEqagJPRihE4IjjfDRs2QKTH7seHh8GCaMgoQegdIPAPXShphdAqMWE3b948ZsyYYvrLVSdOnODt07Fjx85Fhy5dupDMk/QW9JeneEtWHURzvtcor53QUMSwjLewoRNPXlTErnTx4sVevXo999xznIc4Z4QnkOCQ4c4fVJ1dpxCqOovIDtehRBxIAJwdizM6YHdnI1VlBxoApxznJZmqsou7klaggM7uoIAIKH3Bpk2bhg8fPmLEiCqS8TJNzlgc+ufOnTsr67vijmRXHSmhmo2YXdVQHsB9kV5VwckcCc1xkl11JDQnyuiUc9iTTz65dOnSaFGqGMj3WrZsyZF07Nixo0aNGh3CJ+QVlLKMHDnS2WVR6SwxOF/ByUpJ1J2r+oTSkdAcwFl8I8hZZWzMunr16uT80VpUDmh7jyplAxlvu3btZsyYQWaocvLkyVNDsMlT5eafNm3aCy+8QCscO+WUKVMmTZoEpwnMnDlTrSqxEEShAL5wAKFVHBCEViyUVNW7CxIOYSoWhoFSMtdKF5S0YkTmQtFKVaPl4SU5LKbPeHmh37hxQz+OKT5cu3ativyukKEcUV47oaGIYRlvYUMnnryoiIz3woUL3bp169y5MwcRDoXjQohwIOZ4ATiGTggBmThxIk2cHbEjwwjhQEkpu0rZJXABpZFeESBY0NCX4ASy0yNVQBNV4vhEgwFEo4rM6TUSILsEOKprCEYsnPOaNWs2aNCgKvKtZk4hXG7yPX17vE2bNky/VatWqrZt27Zp+LX21q1bq0pr8+bNRSSDcKTW18iRNW7cmCBwyfQFclcls4LLgpgq8UWwuCogLFWUgCp2qrJTqjsCNmnSBDugyjBohfizcMOTjDiqAg0PMeWPfvSjF198MVqUKoZPP/20UaNGrGTXEN27d+fxpxTh9oC4JlJEiIyyU2rHkFEEhB5RK17OAnr06EHpeqHVl6kLAAeOi/Ts2ZMSXwhGxLI4KCBErUDdASmdBSWXvkaNGkWc8e7YsaNBgwb16tVr2LChfnuWKoADrrvsEBlVInMcgVoB3G8SwagSyAL0W7gQp1EQCKU/DJHQO4AzUvoyv1WE1tq1a1fZH1QZDFUB5bUTGooYlvEWNnTiyYuKyHi/+OILjiYkAI888siDDz5ILiTyxBNPPProow899NDjjz+O5eGHH37ssccosWB33OkhsuAIAThShaBXBEoZgfTOETg9wUXUNZwIrhU9BDhHelQTGgJCiKDBZzs6osGg/8d//MehQ4fevJn+O41FDKY5ePDgAQMGrF27Vt8SX5X5nfDg294h3HfI14R//hGLvhnu7FgoV69erao0Akp5yU5VrcuXL1dVWLFiBVWATF5EU0DZsVDiFUaNxikxdtydEgQRw35FgFopAS5YwjBBHPLeKpvxnjlzpkOHDlOnTn3zzTfXhX8pdP369SKvpUBVgDs7aysiiwT4UpXSb1JVAgi+fi8QAInpAdwp5SsSOKRcRJxFkF1KdYdRFjW98cYb06ZNa9GixWeffRatReWAtveoUjZcv3791KlTJyoex48fj1gW/KYSZF8DJ0+evHz5cjRVg8FQdCivndBQxLCMt7ChE09eVETGe/78+X79+i1duvTdd999++23jx07tn//fpH33ntv+/btR44c+eCDD3bs2EEJx4Ly6NGjb7311t69e5G98847ECyUu3fvhhw4cGDXrl2HDx/GZevWrR9++OGhQ4dwfP/992klOBFwRLxv3z7Inj175EjXdEQvKCE4EgQix507d4oQXBEIhS8W4jAeHA8e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';

    const segunda_imagem_arg = 'data:image/png;base64,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Gkku6Vmb1JNMnqGJXsxBBGydOnXiHEHldbbooosnb775Zll4qiSLVI+K/yjag+iJTm1KUinUiC6a00RqKOGuuQtdqXb55ZebV4IeEjxjWTt06KDIadWqVbkM8wSOOvLII/fee+9zzz33mmuuufbaa+3cFi1a7LnnnhZU1XrZZZepaUHXmWeeuf322++8884aXvlZAYOhadOmqrXdd99d2abkNopW2ocffniTJk1OPvlkbCEEVGWHHXaYIWeddZbClZCLL74Y/bTTTkNUb2vTgZCrr75aVaBhRkWFs0Ubv16znHDCCeQ3b9780ksvjUnNovG3v/1t//33Nyk5KLyHeOGFFx500EF77bWX+uTGG2+kHmPJIXPfffdVeNBB0YifXbrwM//ggw/GQwdEIIrhlGeC6chHDNOOO+44PsRvILVJQKcqZvJNSgevugi84IILGjduvNZaa6266qqVT4XmEALA1IaTJoqEhKewsYmEln0knGqhKLaddUOGDIlvTRExB5x7d999twMkJMyOua++EmlCXZQ6iCL+AYN9ob4St3Ho1egOXmoIAxvB9icHUZyrb1nKQO2Q7yluSR45ciRVg0gIacoPO875bxOZVFfId1907dpVtYlSmxScljbLmDFjyKltUhMxx3qJalYjxqQMcebUJi0EzAaF1YqGqMy91jyATTGmeOaK2qSstpet4zbbbNOoUSMnWLkYcwxe2mijjUT4+eefL5CEiotyxRVXXH/99Y8++mgRJQjPO+88G0eArVsgXvGfffbZ+I8//njM9sI555xjw6ILfvR99tnHtWvbBrMu7TPOOMPGIUR1h0iUHadhrg022GDDDTe0UywQzvgLGsccc8zGG29sI9uJZHpito9snC222ELEIlplcsi3cQQ8+f/85z/pgBKq4rHLNt98c3uThFDpkksuYfVuu+2mCz00YaNRNs7qq6/+5z//+aSTTgqj9NovW2+9NbojBQVCc08byhFEVZPaj9xiCgw40XnVLqMDOn/iJ3mRRRb55S9/edRRRzlay5XIyPgZI5e4GRnzAtmJm2ydddbZYYcdBg4cWCnwQArywgsvyGbSSiwgvZA83XvvvfW/bISol+pfUaZQAj377LMyHsJLah1kNhK7Nm3aEJuWcCAruu222yS7yiftklogKkB6SnTqywQ1mxSK8PK9DpInBUm3bt0kgvGB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';

      const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';

    this.analiseService.getAnaliseById(amostra_detalhes_selecionada.id).subscribe
    (
      (analise) => {
        amostra_detalhes_selecionada = analise;
      },
    );
    const doc = new jsPDF({
      unit: "mm",
      format: "a4"
    });

    // Logo topo
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19);

    // Cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(amostra_detalhes_selecionada.numero+' | 1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR');

    const agora_validade = new Date();
    agora_validade.setDate(agora_validade.getDate() + 60);
    const dataFormatadaValidade = agora_validade.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const dataColetaFormatada3 = new Date(amostra_detalhes_selecionada.data_entrada).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const dataColetaFormatada2 = new Date(amostra_detalhes_selecionada.data_coleta).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const dataColeta = new Date(amostra_detalhes_selecionada.data_coleta);

    // cria uma cópia e adiciona 28 dias
    const dataColeta28Dias = new Date(dataColeta);
    dataColeta28Dias.setDate(dataColeta28Dias.getDate() + 28);

    // formata no padrão pt-BR (dd/mm/aa)
    const dataColetaFormatada = dataColeta28Dias.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    doc.setFontSize(9);
    doc.text('Data de Emissão: '+dataHoraFormatada, 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    // Título dados amostra
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    // Bloco dados amostra
    let y = 52;

    const linhas = [
      ['Material: '+amostra_detalhes_selecionada.amostra_detalhes.material, "Sub-Tipo: "+amostra_detalhes_selecionada.amostra_detalhes.subtipo, "Data da Amostra: "+dataColetaFormatada3],
      ['Fornecedor: '+amostra_detalhes_selecionada.amostra_detalhes.fornecedor, "Tipo: "+amostra_detalhes_selecionada.amostra_detalhes.tipo_amostragem, "Data de modelagem: "+dataColetaFormatada2],
      ['', "", "Data do Ensaio (28 dias): "+dataColetaFormatada],
    ];
    doc.rect(15, 48, 182, 20); // moldura
    linhas.forEach((linha) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 140, y);
      y += 7;
    });
    let contadorLinhas = y;

    contadorLinhas = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : contadorLinhas + 10;

    const linhas2 = [
      ["NBR 12572", "Determinação das propriedades de transmissão do vapor de água"],
      ["NBR 13276", "Determinação do índice de consistência"],
      ["NBR 13277", "Determinação da retenção de água"],
      ["NBR 13278", "Determinação da densidade de massa e teor de ar incorporado"],
      ["NBR 13279", "Determinação da resistência à tração na flexão e à compressão"],
      ["NBR 13280", "Densidade de massa no estado endurecido"],
      ["NBR 13281 - 1", "Argamassa para revestimento: Requisitos"],
      ["NBR 13281 - 2", "Argamassa para assentamento: Requisitos"],
      ["NBR 13528 - 1", "Determinação da resistência à tração: Requisitos"],
      ["NBR 13528 - 2", "Determinação da resistência à tração: Aderência ao substrato"],
      ["NBR 13528 - 3", "Determinação da resistência à tração: Aderência à superfície"],
      ["NBR 15148", "Determinação do coeficiente de absorção por capilaridades"],
      ["NBR 15258", "Argamassa para revestimento de paredes e Tetos - Determinação da resistência potencial a Tração"],
      ["NBR 15261", "Determinação da variação dimensional (retração ou expansão linear)"],
      ["NBR 15630", "Determinação do módulo de elasticidade, através da propagação de onda ultra-sônica"],
      ["NBR 16605", "Determinação da massa específica"],
      ["NBR 16973", "Granulometria úmida"],
      ["NBR 17054", "Granulometria seca"],
      ["NBR 6473", "Cal virgem e cal hidratada - Análise Química"],
      ["NBR 9289", "Cal hidratada para argamassas - Determinação da finura"],
      ["EN ISO 15.148 e NBR 13.281 Anexo A", "Determinação do coeficiente de absorção de água por capilaridade."],
      ["NBR 14081 - 3", "Determinação do tempo em aberto - Argamassa colante industrializada para assetamento de placas cerâmicas"],
      ["NBR 14081 - 4", "Determinação da resistência de aderência à tração - Argamassa colante industrializada para assetamento de placas cerâmicas"],
      ["NBR 14081 - 5", "Determinação do deslizamento - Argamassa colante industrializada para assetamento de placas cerâmicas"],
    ];
    
    let normasFiltradas: any[] = [];

    function temNormaTodas(lista: any[]): boolean {
      return lista?.some(e => e.norma?.toLowerCase() === "todas" || e.norma?.toLowerCase() === "todos");
    }

    if (amostra_detalhes_selecionada?.ultimo_ensaio?.ensaios_utilizados) {

      const ensaios = amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados;
      if (temNormaTodas(ensaios)) {
        normasFiltradas = [...linhas2];
      } else {
        const normasUtilizadas = ensaios.map((e: any) => e.norma).filter((n: any) => !!n);
          normasFiltradas = linhas2.filter(linha => normasUtilizadas.includes(linha[0])
        );
      }
    }

    if (normasFiltradas.length === 0 && amostra_detalhes_selecionada?.ultimo_calculo) {
      amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
        const ensaios = ultimo_calculo.ensaios_utilizados || [];
        if (temNormaTodas(ensaios)) {
          normasFiltradas = [...linhas2];
          return;
        }

        const normasUtilizadas = ensaios.map((e: any) => e.norma).filter((n: any) => !!n);
          normasFiltradas = linhas2.filter(linha => normasUtilizadas.includes(linha[0])      
        );
      });
    }
    contadorLinhas = contadorLinhas -10;
    // doc.rect(15, contadorLinhas, 182, 75); // moldura

    contadorLinhas = contadorLinhas + 4;
    normasFiltradas.forEach((linha) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, contadorLinhas);
      doc.text(linha[1], 50, contadorLinhas);
      contadorLinhas += 4;
    });

    contadorLinhas = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : contadorLinhas + 10;


// ====== TABELA DE fresco ===================================================
    const head = [
      [
        { content: 'Ensaio no estado fresco', colSpan: 6 }
      ],
       [
        { content: 'Ensaio' },
        { content: 'Valor' },
        { content: 'Unid' },
        { content: 'Garantia' },
        { content: ''},
        { content: 'Norma'},
      ]
    ];
    const body: any[] = [];
    if(amostra_detalhes_selecionada.ultimo_ensaio && amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados){
      amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        if(ensaios_utilizados.estado == 'Fresco'){
          this.ensaios_selecionados.forEach((selected: any) => {
            const linha: any[] = [];

          if (selected.id === ensaios_utilizados.id) {
            let norma: string = '-';
            if (ensaios_utilizados.norma) {
              norma = ensaios_utilizados.norma;
            }
            let unidade: string = '-';
            if (ensaios_utilizados.unidade) {
              unidade = ensaios_utilizados.unidade;
            }
            let valor: string = '-';
            if (ensaios_utilizados.valor) {
              valor = ensaios_utilizados.valor;
            }

              let garantia_num: string = '-';
              let garantia_texto: string = '-';
              if (selected.garantia) {
                const aux = selected.garantia.split(' ');

                garantia_num = aux[0]; 
                garantia_texto = aux[1]; 
              }

              this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

              linha.push({ content: ensaios_utilizados.descricao });
              linha.push({ content: valor });
              linha.push({ content: unidade });
              linha.push({ content: garantia_num });
              linha.push({ content: garantia_texto });
              linha.push({ content: norma });
              body.push(linha);
            }
          });
          
          autoTable(doc, {
            startY: contadorLinhas,
            head,
            body: body,
            theme: "grid",
            styles: {
              fontSize: 8,
              halign: 'left',   // 🔹 alinhamento horizontal à esquerda
              valign: 'middle',
              cellPadding: 1,
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: 0,
              lineWidth: 0.1,
              halign: 'left',   // 🔹 também no cabeçalho
            },
            bodyStyles: {
              lineWidth: 0.1,
              halign: 'left',   // 🔹 e no corpo
            },
          });
        }
      });
    }
    if(amostra_detalhes_selecionada.ultimo_calculo){
      amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
        ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
          if(ensaios_utilizados.estado == 'Fresco'){
            this.ensaios_selecionados.forEach((selected: any) => {
              const linha: any[] = [];

            if (selected.id === ensaios_utilizados.id) {
              let norma: string = '-';
              if (ensaios_utilizados.norma) {
                norma = ensaios_utilizados.norma;
              }
              let unidade: string = '-';
              if (ensaios_utilizados.unidade) {
                unidade = ensaios_utilizados.unidade;
              }
              let valor: string = '-';
              if (ensaios_utilizados.valor) {
                valor = ensaios_utilizados.valor;
              }

                let garantia_num: string = '-';
                let garantia_texto: string = '-';
                if (selected.garantia) {
                  const aux = selected.garantia.split(' ');

                  garantia_num = aux[0]; 
                  garantia_texto = aux[1]; 
                }

                this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

                linha.push({ content: ensaios_utilizados.descricao });
                linha.push({ content: valor });
                linha.push({ content: unidade });
                linha.push({ content: garantia_num });
                linha.push({ content: garantia_texto });
                linha.push({ content: norma });
                body.push(linha);
              }
            });
            
            autoTable(doc, {
              startY: contadorLinhas,
              head,
              body: body,
              theme: "grid",
              styles: {
                fontSize: 8,
                halign: 'left',   // 🔹 alinhamento horizontal à esquerda
                valign: 'middle',
                cellPadding: 1,
              },
              headStyles: {
                fillColor: [220, 220, 220],
                textColor: 0,
                lineWidth: 0.1,
                halign: 'left',   // 🔹 também no cabeçalho
              },
              bodyStyles: {
                lineWidth: 0.1,
                halign: 'left',   // 🔹 e no corpo
              },
            });
          }
        });
      });
    }
    // Posição após a última tabela de ensaios
    contadorLinhas = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : contadorLinhas + 10;

     // ====== TABELA DE solto ===================================================
    const headSolto = [
      [
        { content: 'Ensaio no estado solto', colSpan: 6 }
      ],
       [
        { content: 'Ensaio' },
        { content: 'Valor' },
        { content: 'Unid' },
        { content: 'Garantia' },
        { content: ''},
        { content: 'Norma'},
      ]
    ];
    const bodySolto: any[] = [];

    if(amostra_detalhes_selecionada.ultimo_ensaio && amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados){
      amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        if(ensaios_utilizados.estado == 'Solto'){
          this.ensaios_selecionados.forEach((selected: any) => {
            const linha: any[] = [];

            if (selected.id === ensaios_utilizados.id) {
              let norma: string = '-';
              if (ensaios_utilizados.norma) {
                norma = ensaios_utilizados.norma;
              }
              let unidade: string = '-';
              if (ensaios_utilizados.unidade) {
                unidade = ensaios_utilizados.unidade;
              }
              let valor: string = '-';
              if (ensaios_utilizados.valor) {
                valor = ensaios_utilizados.valor;
              }

              let garantia_num: string = '-';
              let garantia_texto: string = '-';
              if (selected.garantia) {
                const aux = selected.garantia.split(' ');

                garantia_num = aux[0]; 
                garantia_texto = aux[1]; 
              }

              this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

              linha.push({ content: ensaios_utilizados.descricao });
              linha.push({ content: valor });
              linha.push({ content: unidade });
              linha.push({ content: garantia_num });
              linha.push({ content: garantia_texto });
              linha.push({ content: norma });
              bodySolto.push(linha);
            }
          });
          
          autoTable(doc, {
            startY: contadorLinhas,
            head: headSolto,
            body: bodySolto,
            theme: "grid",
            styles: {
              fontSize: 8,
              halign: 'left',   // 🔹 alinhamento horizontal à esquerda
              valign: 'middle',
              cellPadding: 1,
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: 0,
              lineWidth: 0.1,
              halign: 'left',   // 🔹 também no cabeçalho
            },
            bodyStyles: {
              lineWidth: 0.1,
              halign: 'left',   // 🔹 e no corpo
            },
          });
        }
      });
    }

    if(amostra_detalhes_selecionada.ultimo_calculo){
      amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
        ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
          if(ensaios_utilizados.estado == 'Solto'){
            this.ensaios_selecionados.forEach((selected: any) => {
              const linha: any[] = [];

            if (selected.id === ensaios_utilizados.id) {
              let norma: string = '-';
              if (ensaios_utilizados.norma) {
                norma = ensaios_utilizados.norma;
              }
              let unidade: string = '-';
              if (ensaios_utilizados.unidade) {
                unidade = ensaios_utilizados.unidade;
              }
              let valor: string = '-';
              if (ensaios_utilizados.valor) {
                valor = ensaios_utilizados.valor;
              }

                let garantia_num: string = '-';
                let garantia_texto: string = '-';
                if (selected.garantia) {
                  const aux = selected.garantia.split(' ');

                  garantia_num = aux[0]; 
                  garantia_texto = aux[1]; 
                }

                this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

                linha.push({ content: ensaios_utilizados.descricao });
                linha.push({ content: valor });
                linha.push({ content: unidade });
                linha.push({ content: garantia_num });
                linha.push({ content: garantia_texto });
                linha.push({ content: norma });
                bodySolto.push(linha);
              }
            });
            
            autoTable(doc, {
              startY: contadorLinhas,
              head: headSolto,
              body: bodySolto,
              theme: "grid",
              styles: {
                fontSize: 8,
                halign: 'left',   // 🔹 alinhamento horizontal à esquerda
                valign: 'middle',
                cellPadding: 1,
              },
              headStyles: {
                fillColor: [220, 220, 220],
                textColor: 0,
                lineWidth: 0.1,
                halign: 'left',   // 🔹 também no cabeçalho
              },
              bodyStyles: {
                lineWidth: 0.1,
                halign: 'left',   // 🔹 e no corpo
              },
            });
          }
        });
      });
    }  

    // Posição após a última tabela de ensaios
    contadorLinhas = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : contadorLinhas + 10;

         // ====== TABELA DE endurecido ===================================================
    const headEndurecido = [
      [
        { content: 'Ensaio no estado endurecido', colSpan: 6 }
      ],
       [
        { content: 'Ensaio' },
        { content: 'Valor' },
        { content: 'Unid' },
        { content: 'Garantia' },
        { content: ''},
        { content: 'Norma'},
      ]
    ];
    const bodyEndurecido: any[] = [];

    if(amostra_detalhes_selecionada.ultimo_ensaio && amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados){
      amostra_detalhes_selecionada.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        if(ensaios_utilizados.estado == 'Endurecido'){
          this.ensaios_selecionados.forEach((selected: any) => {
            const linha: any[] = [];

          if (selected.id === ensaios_utilizados.id) {
            let norma: string = '-';
            if (ensaios_utilizados.norma) {
              norma = ensaios_utilizados.norma;
            }
            let unidade: string = '-';
            if (ensaios_utilizados.unidade) {
              unidade = ensaios_utilizados.unidade;
            }
            let valor: string = '-';
            if (ensaios_utilizados.valor) {
              valor = ensaios_utilizados.valor;
            }

              let garantia_num: string = '-';
              let garantia_texto: string = '-';
              if (selected.garantia) {
                const aux = selected.garantia.split(' ');

                garantia_num = aux[0]; 
                garantia_texto = aux[1]; 
              }

              this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

              linha.push({ content: ensaios_utilizados.descricao });
              linha.push({ content: valor });
              linha.push({ content: unidade });
              linha.push({ content: garantia_num });
              linha.push({ content: garantia_texto });
              linha.push({ content: norma });
              bodyEndurecido.push(linha);
            }
          });
          
          autoTable(doc, {
            startY: contadorLinhas,
            head: headEndurecido,
            body: bodyEndurecido,
            theme: "grid",
            styles: {
              fontSize: 8,
              halign: 'left',   // 🔹 alinhamento horizontal à esquerda
              valign: 'middle',
              cellPadding: 1,
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: 0,
              lineWidth: 0.1,
              halign: 'left',   // 🔹 também no cabeçalho
            },
            bodyStyles: {
              lineWidth: 0.1,
              halign: 'left',   // 🔹 e no corpo
            },
          });
        }
      });
    }

    if(amostra_detalhes_selecionada.ultimo_calculo){
      amostra_detalhes_selecionada.ultimo_calculo.forEach((ultimo_calculo: any) => {
        ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
          if(ensaios_utilizados.estado == 'Endurecido'){
            this.ensaios_selecionados.forEach((selected: any) => {
              const linha: any[] = [];

            if (selected.id === ensaios_utilizados.id) {
              let norma: string = '-';
              if (ensaios_utilizados.norma) {
                norma = ensaios_utilizados.norma;
              }
              let unidade: string = '-';
              if (ensaios_utilizados.unidade) {
                unidade = ensaios_utilizados.unidade;
              }
              let valor: string = '-';
              if (ensaios_utilizados.valor) {
                valor = ensaios_utilizados.valor;
              }

                let garantia_num: string = '-';
                let garantia_texto: string = '-';
                if (selected.garantia) {
                  const aux = selected.garantia.split(' ');

                  garantia_num = aux[0]; 
                  garantia_texto = aux[1]; 
                }

                this.descricaoApi += ensaios_utilizados.descricao+': '+valor+''+unidade+'; ';

                linha.push({ content: ensaios_utilizados.descricao });
                linha.push({ content: valor });
                linha.push({ content: unidade });
                linha.push({ content: garantia_num });
                linha.push({ content: garantia_texto });
                linha.push({ content: norma });
                bodyEndurecido.push(linha);
              }
            });
            
            autoTable(doc, {
              startY: contadorLinhas,
              head: headEndurecido,
              body: bodyEndurecido,
              theme: "grid",
              styles: {
                fontSize: 8,
                halign: 'left',   // 🔹 alinhamento horizontal à esquerda
                valign: 'middle',
                cellPadding: 1,
              },
              headStyles: {
                fillColor: [220, 220, 220],
                textColor: 0,
                lineWidth: 0.1,
                halign: 'left',   // 🔹 também no cabeçalho
              },
              bodyStyles: {
                lineWidth: 0.1,
                halign: 'left',   // 🔹 e no corpo
              },
            });
          }
        });
      });
    }
    // Posição após a última tabela de ensaios
    contadorLinhas = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : contadorLinhas + 10;

    console.log(amostra_detalhes_selecionada)
    // === Tabela de FLEXÃO ===
    const headFlexao = [
      [
        { content: 'Determinação da resistência potencial à flexão', colSpan: 5 }
      ],
      [
        { content: 'CP' },
        { content: 'Carga de Ruptura à Flexão (N)' },
        { content: 'Resist. à Tração na Flexão (Mpa)' },
        { content: 'Resist. Média (Mpa)' },
        { content: 'Resist. Tração na Flexão' },
      ]
    ];

    // --- Cálculos das colunas de flexão ---
    if(amostra_detalhes_selecionada.flexao){
      const flexaoValores =
        amostra_detalhes_selecionada.flexao
          ?.map((item: any) => item.flexao_mpa)
          .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor))
        || [];

      const mediaFlexao = flexaoValores.length
        ? flexaoValores.reduce((a: number, b: number) => a + b, 0) / flexaoValores.length
        : 0;

      const maxFlexao = flexaoValores.length ? Math.max(...flexaoValores) : 0;
      const minFlexao = flexaoValores.length ? Math.min(...flexaoValores) : 0;

      // Formatados com 2 casas decimais
      const media_flexao = mediaFlexao.toFixed(2);
      const maximo_flexao = maxFlexao.toFixed(2);
      const minimo_flexao = minFlexao.toFixed(2);

      const bodyFlexao = [
        ...amostra_detalhes_selecionada.flexao?.map((item: any) => [
          item.cp ?? item.cp ?? item.cp ?? '',
          item.flexao_n ?? '',
          item.flexao_mpa ?? '',
          item.media_mpa ?? '',
          item.tracao_flexao ?? '',
        ]),

        [
          { content: 'Média Flexão (Mpa)', colSpan: 3, styles: { halign: 'left' } },
          media_flexao
        ],
        [
          { content: 'Resultado Máx (Mpa)', colSpan: 3, styles: { halign: 'left' } },
          maximo_flexao
        ],
        [
          { content: 'Resultado Mín (MPa)', colSpan: 3, styles: { halign: 'left' } },
          minimo_flexao
        ],
      
      ];

      // --- Inserir no PDF ---
      autoTable(doc, {
        head: headFlexao,
        body: bodyFlexao,
        startY: contadorLinhas, // ou a posição desejada
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    const headCompressao = [
      [
        { content: 'Determinação da resistência potencial à compressão', colSpan: 5 }
      ],
      [
        { content: 'CP' },
        { content: 'Compressão (N)'},
        { content: 'Compressão (Mpa)' },
        { content: 'Média (Mpa)' },
        { content: 'Tração na Compressão (Mpa)' },
      ]
    ];

    // --- Cálculos das colunas de compressão ---
    if(amostra_detalhes_selecionada.compressao){
      const compressaoValores = amostra_detalhes_selecionada.compressao
        .map((item: any) => item.compressao_mpa)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaCompressao = compressaoValores.length
        ? compressaoValores.reduce((a: number, b: number) => a + b, 0) / compressaoValores.length
        : 0;

      const maxCompressao = compressaoValores.length ? Math.max(...compressaoValores) : 0;
      const minCompressao = compressaoValores.length ? Math.min(...compressaoValores) : 0;

      const bodyCompressao = [
        ...amostra_detalhes_selecionada.compressao.map((item: any) => [
          item.cp ?? item.cp ?? item.cp ?? '',
          item.compressao_n ?? '',
          item.compressao_mpa ?? '',
          item.media_mpa ?? '',
          item.tracao_compressao ?? '',
        ]),

        [
          { content: 'Média Compressão (Mpa)', colSpan: 3, styles: { halign: 'left' } },
          mediaCompressao.toFixed(2)
        ],
        [
          { content: 'Resultado Máx (Mpa)', colSpan: 3, styles: { halign: 'left' } },
          maxCompressao.toFixed(2)
        ],
        [
          { content: 'Resultado Mín (Mpa)', colSpan: 3, styles: { halign: 'left' } },
          minCompressao.toFixed(2)
        ],
      
      ];

      autoTable(doc, {
        head: headCompressao,
        body: bodyCompressao,
        startY: contadorLinhas, 
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    // ====== TABELA head2/body2 ==================================================
    const head2 = [
      [
        {content: 'Determinação da resistência potencial de aderência à tração ao substrato', colSpan: 14}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
        { content: 'Forma de Ruptura (%)', colSpan: 5 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    // --- Cálculos da coluna 'resist' ---
    if(amostra_detalhes_selecionada.substrato){
      const resistencias = amostra_detalhes_selecionada.substrato.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist = resistencias.length
        ? resistencias.reduce((a: number, b: number) => a + b, 0) / resistencias.length
        : 0;

      const maxResist = resistencias.length ? Math.max(...resistencias) : 0;
      const minResist = resistencias.length ? Math.min(...resistencias) : 0;

      const desvioPadrao = resistencias.length > 1 ? Math.sqrt(resistencias.map((valor: number) => Math.pow(valor - mediaResist, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias.length - 1)) : 0;


      // Formatar para 2 casas decimais
      const media = mediaResist.toFixed(2);
      const maximo = maxResist.toFixed(2);
      const minimo = minResist.toFixed(2);
      const desvio2 = desvioPadrao.toFixed(2);

      const body2 = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.substrato.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.espessura ?? '',
          item.subst ?? '',
          item.junta ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

        [
          { content: 'Média Resistência Substrato', colSpan: 7, styles: { halign: 'right' } },
          media,
          { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
        ],
        [
          { content: 'Resultado MAX', colSpan: 7, styles: { halign: 'right' } },
          maximo
        ],
        [
          { content: 'Resultado MIN', colSpan: 7, styles: { halign: 'right' } },
          minimo
        ],
        [
          { content: 'Desvio Padrão (Mpa)', colSpan: 7, styles: { halign: 'right' } },
          desvio2
        ],
        [
          { content: 'Tipo de Ruptura', colSpan: 7 }
        ],
      ];

      autoTable(doc, {
        head: head2,
        body: body2,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      // Depois da head2/body2
      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;

      // Primeira imagem
      doc.addImage(primeira_imgagem_arg, 'PNG', 14, contadorLinhas, 182, 40); // x, y, w, h
      contadorLinhas += 50;
    }

    // ====== TABELA head3/body3 ==================================================
    const head3 = [
      [
        {content: 'Determinação da resistência potencial de aderência à tração superficial', colSpan: 11}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
        { content: 'Forma de Ruptura (%)', colSpan: 5 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    if(amostra_detalhes_selecionada.superficial){
      const resistencias2 = amostra_detalhes_selecionada.superficial.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist2 = resistencias2.length
        ? resistencias2.reduce((a: number, b: number) => a + b, 0) / resistencias2.length
        : 0;

      const maxResist2 = resistencias2.length ? Math.max(...resistencias2) : 0;
      const minResist2 = resistencias2.length ? Math.min(...resistencias2) : 0;

      const desvioPadrao2 = resistencias2.length > 1 ? Math.sqrt(resistencias2.map((valor: number) => Math.pow(valor - mediaResist2, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias2.length - 1)) : 0;

      // Formatar para 2 casas decimais
      const media2 = mediaResist2.toFixed(2);
      const maximo2 = maxResist2.toFixed(2);
      const minimo2 = minResist2.toFixed(2);
      const desvio2 = desvioPadrao2.toFixed(2);

      const body3 = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.superficial.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

          [
            { content: 'Média Resistência Substrato', colSpan: 4, styles: { halign: 'right' } },
            media2,
            { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
          ],
          [
            { content: 'Resultado MAX', colSpan: 4, styles: { halign: 'right' } },
            maximo2
          ],
          [
            { content: 'Resultado MIN', colSpan: 4, styles: { halign: 'right' } },
            minimo2
          ], 
          [
            { content: 'Desvio Padrão (Mpa)', colSpan: 4, styles: { halign: 'right' } },
            desvio2
          ],
          [
            { content: 'Tipo de Ruptura', colSpan: 4 }
          ],
      ];

      autoTable(doc, {
        head: head3,
        body: body3,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      // Depois da head3/body3
      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;

      // Segunda imagem
      doc.addImage(segunda_imagem_arg, 'PNG', 14, contadorLinhas, 182, 40);

      doc.addPage();
      contadorLinhas = 10;
    }

    // ====== TABELA headTracaoNormal ==================================================
    const headTracaoNormal = [
      [
        {content: 'Resist. Ader. a Tração (Normal)', colSpan: 11}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    if(amostra_detalhes_selecionada.tracao_normal){
      const resistencias2 = amostra_detalhes_selecionada.tracao_normal.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist2 = resistencias2.length
        ? resistencias2.reduce((a: number, b: number) => a + b, 0) / resistencias2.length
        : 0;

      const maxResist2 = resistencias2.length ? Math.max(...resistencias2) : 0;
      const minResist2 = resistencias2.length ? Math.min(...resistencias2) : 0;

      const desvioPadrao2 = resistencias2.length > 1 ? Math.sqrt(resistencias2.map((valor: number) => Math.pow(valor - mediaResist2, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias2.length - 1)) : 0;

      // Formatar para 2 casas decimais
      const media2 = mediaResist2.toFixed(2);
      const maximo2 = maxResist2.toFixed(2);
      const minimo2 = minResist2.toFixed(2);
      const desvio2 = desvioPadrao2.toFixed(2);

      const bodyTracaoNormal = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.tracao_normal.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

          [
            { content: 'Média Resistência Substrato', colSpan: 4, styles: { halign: 'right' } },
            media2,
            { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
          ],
          [
            { content: 'Resultado MAX', colSpan: 4, styles: { halign: 'right' } },
            maximo2
          ],
          [
            { content: 'Resultado MIN', colSpan: 4, styles: { halign: 'right' } },
            minimo2
          ], 
          [
            { content: 'Desvio Padrão (Mpa)', colSpan: 4, styles: { halign: 'right' } },
            desvio2
          ],
      ];

      autoTable(doc, {
        head: headTracaoNormal,
        body: bodyTracaoNormal,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      // Depois da head3/body3
      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    // ====== TABELA headTracaoSubmersa ==================================================
    const headTracaoSubmersa = [
      [
        {content: 'Resist. Ader. a Tração (Submersa)', colSpan: 11}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    if(amostra_detalhes_selecionada.tracao_submersa){
      const resistencias2 = amostra_detalhes_selecionada.tracao_submersa.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist2 = resistencias2.length
        ? resistencias2.reduce((a: number, b: number) => a + b, 0) / resistencias2.length
        : 0;

      const maxResist2 = resistencias2.length ? Math.max(...resistencias2) : 0;
      const minResist2 = resistencias2.length ? Math.min(...resistencias2) : 0;

      const desvioPadrao2 = resistencias2.length > 1 ? Math.sqrt(resistencias2.map((valor: number) => Math.pow(valor - mediaResist2, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias2.length - 1)) : 0;

      // Formatar para 2 casas decimais
      const media2 = mediaResist2.toFixed(2);
      const maximo2 = maxResist2.toFixed(2);
      const minimo2 = minResist2.toFixed(2);
      const desvio2 = desvioPadrao2.toFixed(2);

      const bodyTracaoSubmersa = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.tracao_submersa.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

          [
            { content: 'Média Resistência Substrato', colSpan: 4, styles: { halign: 'right' } },
            media2,
            { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
          ],
          [
            { content: 'Resultado MAX', colSpan: 4, styles: { halign: 'right' } },
            maximo2
          ],
          [
            { content: 'Resultado MIN', colSpan: 4, styles: { halign: 'right' } },
            minimo2
          ], 
          [
            { content: 'Desvio Padrão (Mpa)', colSpan: 4, styles: { halign: 'right' } },
            desvio2
          ],
      ];

      autoTable(doc, {
        head: headTracaoSubmersa,
        body: bodyTracaoSubmersa,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    // ====== TABELA headTracaoAberto ==================================================
    const headTracaoAberto = [
      [
        {content: 'Resist. Ader. a Tração (Tempo Aberto)', colSpan: 11}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    if(amostra_detalhes_selecionada.tracao_tempo_aberto){
      const resistencias2 = amostra_detalhes_selecionada.tracao_tempo_aberto.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist2 = resistencias2.length
        ? resistencias2.reduce((a: number, b: number) => a + b, 0) / resistencias2.length
        : 0;

      const maxResist2 = resistencias2.length ? Math.max(...resistencias2) : 0;
      const minResist2 = resistencias2.length ? Math.min(...resistencias2) : 0;

      const desvioPadrao2 = resistencias2.length > 1 ? Math.sqrt(resistencias2.map((valor: number) => Math.pow(valor - mediaResist2, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias2.length - 1)) : 0;

      // Formatar para 2 casas decimais
      const media2 = mediaResist2.toFixed(2);
      const maximo2 = maxResist2.toFixed(2);
      const minimo2 = minResist2.toFixed(2);
      const desvio2 = desvioPadrao2.toFixed(2);

      const bodyTracaoAberto = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.tracao_tempo_aberto.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

          [
            { content: 'Média Resistência Substrato', colSpan: 4, styles: { halign: 'right' } },
            media2,
            { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
          ],
          [
            { content: 'Resultado MAX', colSpan: 4, styles: { halign: 'right' } },
            maximo2
          ],
          [
            { content: 'Resultado MIN', colSpan: 4, styles: { halign: 'right' } },
            minimo2
          ], 
          [
            { content: 'Desvio Padrão (Mpa)', colSpan: 4, styles: { halign: 'right' } },
            desvio2
          ],
      ];

      autoTable(doc, {
        head: headTracaoAberto,
        body: bodyTracaoAberto,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    // ====== TABELA headTracaoEstufa ==================================================
    const headTracaoEstufa = [
      [
        {content: 'Resist. Ader. a Tração (Estufa)', colSpan: 11}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    if(amostra_detalhes_selecionada.tracao_estufa){
      const resistencias2 = amostra_detalhes_selecionada.tracao_estufa.linhas
        .map((item: any) => item.resist)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaResist2 = resistencias2.length
        ? resistencias2.reduce((a: number, b: number) => a + b, 0) / resistencias2.length
        : 0;

      const maxResist2 = resistencias2.length ? Math.max(...resistencias2) : 0;
      const minResist2 = resistencias2.length ? Math.min(...resistencias2) : 0;

      const desvioPadrao2 = resistencias2.length > 1 ? Math.sqrt(resistencias2.map((valor: number) => Math.pow(valor - mediaResist2, 2)).reduce((a: number, b: number) => a + b, 0) / (resistencias2.length - 1)) : 0;

      // Formatar para 2 casas decimais
      const media2 = mediaResist2.toFixed(2);
      const maximo2 = maxResist2.toFixed(2);
      const minimo2 = minResist2.toFixed(2);
      const desvio2 = desvioPadrao2.toFixed(2);

      const bodyTracaoEstufa = [
        // espalha as linhas geradas pelo map
        ...amostra_detalhes_selecionada.tracao_estufa.linhas.map((item: any) => [
          item.numero ?? '',
          item.diametro ?? '',
          item.area ?? '',
          item.carga ?? '',
          item.resist ?? '',
          item.validacao ?? '',
          item.rupturas?.sub ?? '',
          item.rupturas?.subArga ?? '',
          item.rupturas?.rupArga ?? '',
          item.rupturas?.argaCola ?? '',
          item.rupturas?.colarPastilha ?? ''
        ]),

          [
            { content: 'Média Resistência Substrato', colSpan: 4, styles: { halign: 'right' } },
            media2,
            { content: 'Observações', colSpan: 6, rowSpan: 5, styles: { halign: 'left', valign: 'top' } }
          ],
          [
            { content: 'Resultado MAX', colSpan: 4, styles: { halign: 'right' } },
            maximo2
          ],
          [
            { content: 'Resultado MIN', colSpan: 4, styles: { halign: 'right' } },
            minimo2
          ], 
          [
            { content: 'Desvio Padrão (Mpa)', colSpan: 4, styles: { halign: 'right' } },
            desvio2
          ],
      ];

      autoTable(doc, {
        head: headTracaoEstufa,
        body: bodyTracaoEstufa,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    console.log('amostra_detalhes_selecionada', amostra_detalhes_selecionada);

    // ====== TABELA headRetracao/bodyRetracao ==================================================
    const headRetracao = [
      [
        { content: 'Determinação da retração linear', colSpan: 4 }
      ],
      [
        { content: 'Data' },
        { content: 'Idade (dias)' },
        { content: 'Média (mm/m)' },
        { content: 'Desvio Máximo (%)' },
      ]
    ];

    // --- Cálculos das colunas de retração ---
    if (amostra_detalhes_selecionada.retracao) {
      const retracaoMedias = amostra_detalhes_selecionada.retracao
        .map((item: any) => item.media)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const retracaoDesvios = amostra_detalhes_selecionada.retracao
        .map((item: any) => item.desvio_maximo)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaRetracao = retracaoMedias.length
        ? retracaoMedias.reduce((a: number, b: number) => a + b, 0) / retracaoMedias.length
        : 0;

      const maxRetracao = retracaoMedias.length ? Math.max(...retracaoMedias) : 0;
      const minRetracao = retracaoMedias.length ? Math.min(...retracaoMedias) : 0;

      const desvioMedioRetracao = retracaoDesvios.length
        ? retracaoDesvios.reduce((a: number, b: number) => a + b, 0) / retracaoDesvios.length
        : 0;

      const bodyRetracao = [
        ...amostra_detalhes_selecionada.retracao.map((item: any) => [
          item.data ?? '',
          item.idade ?? '',
          item.media ?? '',
          item.desvio_maximo ?? '',
        ]),

        [
          { content: 'Média Retração (mm/m)', colSpan: 3, styles: { halign: 'left' } },
          mediaRetracao.toFixed(2)
        ],
        [
          { content: 'Resultado Máx (mm/m)', colSpan: 3, styles: { halign: 'left' } },
          maxRetracao.toFixed(2)
        ],
        [
          { content: 'Resultado Mín (mm/m)', colSpan: 3, styles: { halign: 'left' } },
          minRetracao.toFixed(2)
        ],
        [
          { content: 'Desvio Médio (%)', colSpan: 3, styles: { halign: 'left' } },
          desvioMedioRetracao.toFixed(2)
        ],
      ];

      autoTable(doc, {
        head: headRetracao,
        body: bodyRetracao,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    // ====== TABELA headElasticidade/bodyElasticidade ==================================================
    const headElasticidade = [
      [
        { content: 'Determinação do módulo de elasticidade', colSpan: 3 }
      ],
      [
        { content: 'Média' },
        { content: 'Individual' },
        { content: 'Desvio Padrão' },
      ]
    ];

    // --- Cálculos das colunas de elasticidade ---
    if (amostra_detalhes_selecionada.elasticidade) {
      const elasticidadeModulos = amostra_detalhes_selecionada.elasticidade
        .map((item: any) => item.modulo)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const elasticidadeDesvios = amostra_detalhes_selecionada.elasticidade
        .map((item: any) => item.desvio_maximo)
        .filter((valor: any): valor is number => typeof valor === 'number' && !isNaN(valor));

      const mediaElasticidade = elasticidadeModulos.length
        ? elasticidadeModulos.reduce((a: number, b: number) => a + b, 0) / elasticidadeModulos.length
        : 0;

      const maxElasticidade = elasticidadeModulos.length ? Math.max(...elasticidadeModulos) : 0;
      const minElasticidade = elasticidadeModulos.length ? Math.min(...elasticidadeModulos) : 0;

      const desvioMedioElasticidade = elasticidadeDesvios.length
        ? elasticidadeDesvios.reduce((a: number, b: number) => a + b, 0) / elasticidadeDesvios.length
        : 0;

      const bodyElasticidade = [
        ...amostra_detalhes_selecionada.elasticidade.map((item: any) => [
          item.media ?? '',
          item.individual ?? '',
          item.desvio_padrao ?? '',
        ]),

        [
          { content: 'Média Módulo (MPa)', colSpan: 2, styles: { halign: 'left' } },
          mediaElasticidade.toFixed(2)
        ],
        [
          { content: 'Resultado Máx (MPa)', colSpan: 2, styles: { halign: 'left' } },
          maxElasticidade.toFixed(2)
        ],
        [
          { content: 'Resultado Mín (MPa)', colSpan: 2, styles: { halign: 'left' } },
          minElasticidade.toFixed(2)
        ],
        [
          { content: 'Desvio Médio (%)', colSpan: 2, styles: { halign: 'left' } },
          desvioMedioElasticidade.toFixed(2)
        ],
      ];

      autoTable(doc, {
        head: headElasticidade,
        body: bodyElasticidade,
        startY: contadorLinhas,
        styles: {
          fontSize: 8,
          halign: 'center',
          valign: 'middle',
          cellPadding: 1,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
      });

      contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
    }

    //Calculos flexao, etc ensaio detalhes
    if(amostra_detalhes_selecionada.amostra_detalhes?.ordem_detalhes?.calculo_ensaio_detalhes){
      const resultado = amostra_detalhes_selecionada.amostra_detalhes.ordem_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 140);

      if(resultado){

        const flexao_cp1 = resultado.ensaios_detalhes.find((item: any) => item.id === 315);
        let ruptura_cp1 = flexao_cp1.variavel_detalhes.find((item: any) => item.id === 127);
        ruptura_cp1 = ruptura_cp1.valor;

        let tracao_cp1 = flexao_cp1.variavel_detalhes.find((item: any) => item.id === 128);
        tracao_cp1 = tracao_cp1.valor;

        const flexao_cp2 = resultado.ensaios_detalhes.find((item: any) => item.id === 316);
        let ruptura_cp2 = flexao_cp2.variavel_detalhes.find((item: any) => item.id === 133);
        ruptura_cp2 = ruptura_cp2.valor;

        let tracao_cp2 = flexao_cp2.variavel_detalhes.find((item: any) => item.id === 135);
        tracao_cp2 = tracao_cp2.valor;

        const flexao_cp3 = resultado.ensaios_detalhes.find((item: any) => item.id === 321);
        let ruptura_cp3 = flexao_cp3.variavel_detalhes.find((item: any) => item.id === 134);
        ruptura_cp3 = ruptura_cp3.valor;

        let tracao_cp3 = flexao_cp3.variavel_detalhes.find((item: any) => item.id === 136);
        tracao_cp3 = tracao_cp3.valor;

        let resistencia_media_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 318);
        resistencia_media_flexao = resistencia_media_flexao.valor;

        let desvio_padrao_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 319);
        desvio_padrao_flexao = desvio_padrao_flexao.valor;

        let desvio_absoluto_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 320);
        desvio_absoluto_flexao = desvio_absoluto_flexao.valor;

        const data_rompimento_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 312);
        let data_rompimento_flexao_moldagem = data_rompimento_flexao.variavel_detalhes.find((item: any) => item.id === 43);
        data_rompimento_flexao_moldagem = data_rompimento_flexao_moldagem.valor;


        let data_rompimento_flexao_valor = data_rompimento_flexao.variavel_detalhes.find((item: any) => item.id === 85);
        data_rompimento_flexao_valor = data_rompimento_flexao_valor.valor;

        const headFlexao = [
          [
            { content: 'CP', rowSpan: 2 },
            { content: 'Carga de Ruptura à Flexão (N)', rowSpan: 2 },
            { content: 'Resis. À Tração na Flexão (Mpa)', rowSpan: 2 },
            { content: 'Resis. Média (Mpa)', colSpan: 1 },
          ],
          [
            { content: 'Resist. Tração Flexão' },
          ],
        ];

        const bodyFlexao = [
          ['1', ruptura_cp1, tracao_cp1, '1,8'],
          ['2', ruptura_cp2, tracao_cp2, ''],
          ['3', ruptura_cp3, tracao_cp3, ''],
          [{ content: 'Desvio - padrão (Mpa):', colSpan: 3 }, desvio_padrao_flexao],
          [{ content: 'Desvio absoluto máximo (Mpa):', colSpan: 3 }, desvio_absoluto_flexao],
          [{ content: 'Coeficiente de variação (%):', colSpan: 3 }, ''],
          [{ content: 'Data de Rompimento Moldagem:', colSpan: 3 }, data_rompimento_flexao_moldagem],
          [{ content: 'Data de Rompimento Valor:', colSpan: 3 }, data_rompimento_flexao_valor],
        ];

        autoTable(doc, {
          head: headFlexao,
          body: bodyFlexao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }


      //"(Argamassa) - Ensaios Variação Dimensional Linear"
      const resultado_linear = amostra_detalhes_selecionada.amostra_detalhes.ordem_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 138);

      if(resultado_linear){
        const linear_cp1 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 299);
        let deforma_cp1 = linear_cp1.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp1 = deforma_cp1.valor;

        let idade_cp1 = linear_cp1.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp1 = idade_cp1.valor;

        const linear_cp2 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 300);
        let deforma_cp2 = linear_cp2.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp2 = deforma_cp2.valor;

        let idade_cp2 = linear_cp2.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp2 = idade_cp2.valor;

        const linear_cp3 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 301);
        let deforma_cp3 = linear_cp3.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp3 = deforma_cp3.valor;

        let idade_cp3 = linear_cp3.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp3 = idade_cp3.valor;

        let desvio_padrao_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 306);
        desvio_padrao_linear = desvio_padrao_linear.valor;

        let variacao_dimensional_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 305);
        variacao_dimensional_linear = variacao_dimensional_linear.valor;

        let data_1_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 307);
        data_1_linear = data_1_linear.valor;

        let data_7_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 308);
        data_7_linear = data_7_linear.valor;

        let data_28_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 309);
        data_28_linear = data_28_linear.valor;

        const headDimensionalLinear = [
          [
            { content: 'CP'},
            { content: 'Leitura Desforma LO (mm)' },
            { content: 'Leitura Idade Li (mm)' },
          ],
        ];

        const bodyDimensionalLinear = [
          ['1', deforma_cp1, idade_cp1],
          ['2', deforma_cp2, idade_cp2],
          ['3', deforma_cp3, idade_cp3],
          [{ content: 'Desvio Padrão (Variação Dimencional:', colSpan: 2 }, desvio_padrao_linear],
          [{ content: 'Variação dimensinal:', colSpan: 2 }, variacao_dimensional_linear],
          [{ content: 'Data pós (1 Dia):', colSpan: 2 }, data_1_linear],
          [{ content: 'Data pós (7 Dias):', colSpan: 2 }, data_7_linear],
          [{ content: 'Data pós (28 Dias):', colSpan: 2 }, data_28_linear],
        ];

        autoTable(doc, {
          head: headDimensionalLinear,
          body: bodyDimensionalLinear,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"(Argamassa) - Ensaios Variação de Massa"
      const resultado_variacao = amostra_detalhes_selecionada.amostra_detalhes.ordem_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 139);

      if(resultado_variacao){
        const linear_cp1_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 302);
        let deforma_cp1_variacao = linear_cp1_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp1_variacao = deforma_cp1_variacao.valor;

        let idade_cp1_variacao = linear_cp1_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp1_variacao = idade_cp1_variacao.valor;

        const linear_cp2_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 303);
        let deforma_cp2_variacao = linear_cp2_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp2_variacao = deforma_cp2_variacao.valor;

        let idade_cp2_variacao = linear_cp2_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp2_variacao = idade_cp2_variacao.valor;

        const linear_cp3_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 304);
        let deforma_cp3_variacao = linear_cp3_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp3_variacao = deforma_cp3_variacao.valor;

        let idade_cp3_variacao = linear_cp3_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp3_variacao = idade_cp3_variacao.valor;

        let desvio_padrao_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 311);
        desvio_padrao_variacao = desvio_padrao_variacao.valor;

        let variacao_massa = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 310);
        variacao_massa = variacao_massa.valor;

        let data_1_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 307);
        data_1_variacao = data_1_variacao.valor;

        let data_7_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 308);
        data_7_variacao = data_7_variacao.valor;

        let data_28_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 309);
        data_28_variacao = data_28_variacao.valor;

        let data_desmoldagem = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 281);
        data_desmoldagem = data_desmoldagem.valor;

        const headVariacao = [
          [
            { content: 'CP'},
            { content: 'Massa após desforma m0(g)' },
            { content: 'Massa na idade mi(g)' },
          ],
        ];

        const bodyVariacao = [
          ['1', deforma_cp1_variacao, idade_cp1_variacao],
          ['2', deforma_cp2_variacao, idade_cp2_variacao],
          ['3', deforma_cp3_variacao, idade_cp3_variacao],
          [{ content: 'Desvio Padrão (Variação de Massa:', colSpan: 2 }, desvio_padrao_variacao],
          [{ content: 'Variação de Massa:', colSpan: 2 }, variacao_massa],
          [{ content: 'Data pós (1 Dia):', colSpan: 2 }, data_1_variacao],
          [{ content: 'Data pós (7 Dias):', colSpan: 2 }, data_7_variacao],
          [{ content: 'Data pós (28 Dias):', colSpan: 2 }, data_28_variacao],
          [{ content: 'Data de Desmoldagem:', colSpan: 2 }, data_desmoldagem],
        ];

        autoTable(doc, {
          head: headVariacao,
          body: bodyVariacao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

       //"Argamassa) - Ensaios Compressão
      const resultado_compressao = amostra_detalhes_selecionada.amostra_detalhes.ordem_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 141);

      if(resultado_compressao){
        const linear_cp1_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 322);
        let ruptura_cp1_compressao = linear_cp1_compressao.variavel_detalhes.find((item: any) => item.id === 129);
        ruptura_cp1_compressao = ruptura_cp1_compressao.valor;

        let tracao_cp1_compressao = linear_cp1_compressao.variavel_detalhes.find((item: any) => item.id === 132);
        tracao_cp1_compressao = tracao_cp1_compressao.valor;

        const linear_cp2_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 323);
        let ruptura_cp2_compressao = linear_cp2_compressao.variavel_detalhes.find((item: any) => item.id === 137);
        ruptura_cp2_compressao = ruptura_cp2_compressao.valor;

        let tracao_cp2_compressao = linear_cp2_compressao.variavel_detalhes.find((item: any) => item.id === 139);
        tracao_cp2_compressao = tracao_cp2_compressao.valor;

        const linear_cp3_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 324);
        let ruptura_cp3_compressao = linear_cp3_compressao.variavel_detalhes.find((item: any) => item.id === 138);
        ruptura_cp3_compressao = ruptura_cp3_compressao.valor;

        let tracao_cp3_compressao = linear_cp3_compressao.variavel_detalhes.find((item: any) => item.id === 140);
        tracao_cp3_compressao = tracao_cp3_compressao.valor;

        let desvio_padrao_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 326);
        desvio_padrao_compressao = desvio_padrao_compressao.valor;

        const data_rompimento_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 312);
        let data_rompimento_moldagem = data_rompimento_compressao.variavel_detalhes.find((item: any) => item.id === 43);
        data_rompimento_moldagem = data_rompimento_moldagem.valor;

        let data_rompimento_valor = data_rompimento_compressao.variavel_detalhes.find((item: any) => item.id === 85);
        data_rompimento_valor = data_rompimento_valor.valor;

        let resistencia_media_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 325);
        resistencia_media_compressao = resistencia_media_compressao.valor;

        let desvio_absoluto_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 327);
        desvio_absoluto_compressao = desvio_absoluto_compressao.valor;

        const headCompressao = [
          [
            { content: 'CP'},
            { content: 'Carga de Ruptura à Compressão (N)' },
            { content: 'Resist. Tração Compressão (Mpa)' },
          ],
        ];

        const bodyCompressao = [
          ['1', ruptura_cp1_compressao, tracao_cp1_compressao],
          ['2', ruptura_cp2_compressao, tracao_cp2_compressao],
          ['3', ruptura_cp3_compressao, tracao_cp3_compressao],
          [{ content: 'Desvio Padrão (Ruptura/Tração Compressão:', colSpan: 2 }, desvio_padrao_compressao],
          [{ content: 'Desvio Absoluto Máximo (Ruptura/Tração Compressão):', colSpan: 2 }, desvio_absoluto_compressao],
          [{ content: 'Resistência Média (Ruptura/Tração Compressão):', colSpan: 2 }, resistencia_media_compressao],
          [{ content: 'Data de Rompimento (Flexão/Compressão) - Moldagem:', colSpan: 2 }, data_rompimento_moldagem],
          [{ content: 'Data de Rompimento (Flexão/Compressão) - Valor:', colSpan: 2 }, data_rompimento_valor],
        ];

        autoTable(doc, {
          head: headCompressao,
          body: bodyCompressao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"(Argamassa) Módulo de elasticidade dinâmico - Média/Desvio Padrão
      const resultado_elasticidade = amostra_detalhes_selecionada.amostra_detalhes.ordem_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 142);

      if(resultado_elasticidade){
        const media_elasticidade = resultado_elasticidade.ensaios_detalhes.find((item: any) => item.id === 328);
        let media_individual_1 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 141);
        media_individual_1 = media_individual_1.valor;

        let media_individual_2 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 142);
        media_individual_2 = media_individual_2.valor;

        let media_individual_3 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 143);
        media_individual_3 = media_individual_3.valor;

        const headIndividual = [
          [
            { content: ''},
            { content: 'Média'},
          ],
        ];

        const bodyIndividual = [
          ['Individual - 1', media_individual_1],
          ['Individual - 2', media_individual_2],
          ['Individual - 3', media_individual_3],
        ];

        autoTable(doc, {
          head: headIndividual,
          body: bodyIndividual,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }


    }

    //Calculos flexao, etc expressa
    if(amostra_detalhes_selecionada.amostra_detalhes?.expressa_detalhes?.calculo_ensaio_detalhes){
      const resultado = amostra_detalhes_selecionada.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 140);

      if(resultado){
        const flexao_cp1 = resultado.ensaios_detalhes.find((item: any) => item.id === 315);
        let ruptura_cp1 = flexao_cp1.variavel_detalhes.find((item: any) => item.id === 127);
        ruptura_cp1 = ruptura_cp1.valor;

        let tracao_cp1 = flexao_cp1.variavel_detalhes.find((item: any) => item.id === 128);
        tracao_cp1 = tracao_cp1.valor;

        const flexao_cp2 = resultado.ensaios_detalhes.find((item: any) => item.id === 316);
        let ruptura_cp2 = flexao_cp2.variavel_detalhes.find((item: any) => item.id === 133);
        ruptura_cp2 = ruptura_cp2.valor;

        let tracao_cp2 = flexao_cp2.variavel_detalhes.find((item: any) => item.id === 135);
        tracao_cp2 = tracao_cp2.valor;

        const flexao_cp3 = resultado.ensaios_detalhes.find((item: any) => item.id === 321);
        let ruptura_cp3 = flexao_cp3.variavel_detalhes.find((item: any) => item.id === 134);
        ruptura_cp3 = ruptura_cp3.valor;

        let tracao_cp3 = flexao_cp3.variavel_detalhes.find((item: any) => item.id === 136);
        tracao_cp3 = tracao_cp3.valor;

        let resistencia_media_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 318);
        resistencia_media_flexao = resistencia_media_flexao.valor;

        let desvio_padrao_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 319);
        desvio_padrao_flexao = desvio_padrao_flexao.valor;

        let desvio_absoluto_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 320);
        desvio_absoluto_flexao = desvio_absoluto_flexao.valor;

        const data_rompimento_flexao = resultado.ensaios_detalhes.find((item: any) => item.id === 312);
        let data_rompimento_flexao_moldagem = data_rompimento_flexao.variavel_detalhes.find((item: any) => item.id === 43);
        data_rompimento_flexao_moldagem = data_rompimento_flexao_moldagem.valor;


        let data_rompimento_flexao_valor = data_rompimento_flexao.variavel_detalhes.find((item: any) => item.id === 85);
        data_rompimento_flexao_valor = data_rompimento_flexao_valor.valor;



        const headFlexao = [
          [
            { content: 'CP', rowSpan: 2 },
            { content: 'Carga de Ruptura à Flexão (N)', rowSpan: 2 },
            { content: 'Resis. À Tração na Flexão (Mpa)', rowSpan: 2 },
            { content: 'Resis. Média (Mpa)', colSpan: 1 },
          ],
          [
            { content: 'Resist. Tração Flexão' },
          ],
        ];

        const bodyFlexao = [
          ['1', ruptura_cp1, tracao_cp1, '1,8'],
          ['2', ruptura_cp2, tracao_cp2, ''],
          ['3', ruptura_cp3, tracao_cp3, ''],
          [{ content: 'Desvio - padrão (Mpa):', colSpan: 3 }, desvio_padrao_flexao],
          [{ content: 'Desvio absoluto máximo (Mpa):', colSpan: 3 }, desvio_absoluto_flexao],
          [{ content: 'Coeficiente de variação (%):', colSpan: 3 }, ''],
          [{ content: 'Data de Rompimento Moldagem:', colSpan: 3 }, data_rompimento_flexao_moldagem],
          [{ content: 'Data de Rompimento Valor:', colSpan: 3 }, data_rompimento_flexao_valor],
        ];

        autoTable(doc, {
          head: headFlexao,
          body: bodyFlexao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"(Argamassa) - Ensaios Variação Dimensional Linear"
      const resultado_linear = amostra_detalhes_selecionada.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 138);

      if(resultado_linear){
        const linear_cp1 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 299);
        let deforma_cp1 = linear_cp1.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp1 = deforma_cp1.valor;

        let idade_cp1 = linear_cp1.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp1 = idade_cp1.valor;

        const linear_cp2 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 300);
        let deforma_cp2 = linear_cp2.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp2 = deforma_cp2.valor;

        let idade_cp2 = linear_cp2.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp2 = idade_cp2.valor;

        const linear_cp3 = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 301);
        let deforma_cp3 = linear_cp3.variavel_detalhes.find((item: any) => item.id === 123);
        deforma_cp3 = deforma_cp3.valor;

        let idade_cp3 = linear_cp3.variavel_detalhes.find((item: any) => item.id === 124);
        idade_cp3 = idade_cp3.valor;

        let desvio_padrao_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 306);
        desvio_padrao_linear = desvio_padrao_linear.valor;

        let variacao_dimensional_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 305);
        variacao_dimensional_linear = variacao_dimensional_linear.valor;

        let data_1_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 307);
        data_1_linear = data_1_linear.valor;

        let data_7_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 308);
        data_7_linear = data_7_linear.valor;

        let data_28_linear = resultado_linear.ensaios_detalhes.find((item: any) => item.id === 309);
        data_28_linear = data_28_linear.valor;

        const headDimensionalLinear = [
          [
            { content: 'CP'},
            { content: 'Leitura Desforma LO (mm)' },
            { content: 'Leitura Idade Li (mm)' },
          ],
        ];

        const bodyDimensionalLinear = [
          ['1', deforma_cp1, idade_cp1],
          ['2', deforma_cp2, idade_cp2],
          ['3', deforma_cp3, idade_cp3],
          [{ content: 'Desvio Padrão (Variação Dimencional:', colSpan: 2 }, desvio_padrao_linear],
          [{ content: 'Variação dimensinal:', colSpan: 2 }, variacao_dimensional_linear],
          [{ content: 'Data pós (1 Dia):', colSpan: 2 }, data_1_linear],
          [{ content: 'Data pós (7 Dias):', colSpan: 2 }, data_7_linear],
          [{ content: 'Data pós (28 Dias):', colSpan: 2 }, data_28_linear],
        ];

        autoTable(doc, {
          head: headDimensionalLinear,
          body: bodyDimensionalLinear,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"(Argamassa) - Ensaios Variação de Massa"
      const resultado_variacao = amostra_detalhes_selecionada.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 139);

      if(resultado_variacao){
        const linear_cp1_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 302);
        let deforma_cp1_variacao = linear_cp1_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp1_variacao = deforma_cp1_variacao.valor;

        let idade_cp1_variacao = linear_cp1_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp1_variacao = idade_cp1_variacao.valor;

        const linear_cp2_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 303);
        let deforma_cp2_variacao = linear_cp2_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp2_variacao = deforma_cp2_variacao.valor;

        let idade_cp2_variacao = linear_cp2_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp2_variacao = idade_cp2_variacao.valor;

        const linear_cp3_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 304);
        let deforma_cp3_variacao = linear_cp3_variacao.variavel_detalhes.find((item: any) => item.id === 125);
        deforma_cp3_variacao = deforma_cp3_variacao.valor;

        let idade_cp3_variacao = linear_cp3_variacao.variavel_detalhes.find((item: any) => item.id === 126);
        idade_cp3_variacao = idade_cp3_variacao.valor;

        let desvio_padrao_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 311);
        desvio_padrao_variacao = desvio_padrao_variacao.valor;

        let variacao_massa = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 310);
        variacao_massa = variacao_massa.valor;

        let data_1_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 307);
        data_1_variacao = data_1_variacao.valor;

        let data_7_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 308);
        data_7_variacao = data_7_variacao.valor;

        let data_28_variacao = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 309);
        data_28_variacao = data_28_variacao.valor;

        let data_desmoldagem = resultado_variacao.ensaios_detalhes.find((item: any) => item.id === 281);
        data_desmoldagem = data_desmoldagem.valor;

        const headVariacao = [
          [
            { content: 'CP'},
            { content: 'Massa após desforma m0(g)' },
            { content: 'Massa na idade mi(g)' },
          ],
        ];

        const bodyVariacao = [
          ['1', deforma_cp1_variacao, idade_cp1_variacao],
          ['2', deforma_cp2_variacao, idade_cp2_variacao],
          ['3', deforma_cp3_variacao, idade_cp3_variacao],
          [{ content: 'Desvio Padrão (Variação de Massa:', colSpan: 2 }, desvio_padrao_variacao],
          [{ content: 'Variação de Massa:', colSpan: 2 }, variacao_massa],
          [{ content: 'Data pós (1 Dia):', colSpan: 2 }, data_1_variacao],
          [{ content: 'Data pós (7 Dias):', colSpan: 2 }, data_7_variacao],
          [{ content: 'Data pós (28 Dias):', colSpan: 2 }, data_28_variacao],
          [{ content: 'Data de Desmoldagem:', colSpan: 2 }, data_desmoldagem],
        ];

        autoTable(doc, {
          head: headVariacao,
          body: bodyVariacao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"Argamassa) - Ensaios Compressão
      const resultado_compressao = amostra_detalhes_selecionada.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 141);

      if(resultado_compressao){
        const linear_cp1_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 322);
        let ruptura_cp1_compressao = linear_cp1_compressao.variavel_detalhes.find((item: any) => item.id === 129);
        ruptura_cp1_compressao = ruptura_cp1_compressao.valor;

        let tracao_cp1_compressao = linear_cp1_compressao.variavel_detalhes.find((item: any) => item.id === 132);
        tracao_cp1_compressao = tracao_cp1_compressao.valor;

        const linear_cp2_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 323);
        let ruptura_cp2_compressao = linear_cp2_compressao.variavel_detalhes.find((item: any) => item.id === 137);
        ruptura_cp2_compressao = ruptura_cp2_compressao.valor;

        let tracao_cp2_compressao = linear_cp2_compressao.variavel_detalhes.find((item: any) => item.id === 139);
        tracao_cp2_compressao = tracao_cp2_compressao.valor;

        const linear_cp3_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 324);
        let ruptura_cp3_compressao = linear_cp3_compressao.variavel_detalhes.find((item: any) => item.id === 138);
        ruptura_cp3_compressao = ruptura_cp3_compressao.valor;

        let tracao_cp3_compressao = linear_cp3_compressao.variavel_detalhes.find((item: any) => item.id === 140);
        tracao_cp3_compressao = tracao_cp3_compressao.valor;

        let desvio_padrao_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 326);
        desvio_padrao_compressao = desvio_padrao_compressao.valor;

        const data_rompimento_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 312);
        let data_rompimento_moldagem = data_rompimento_compressao.variavel_detalhes.find((item: any) => item.id === 43);
        data_rompimento_moldagem = data_rompimento_moldagem.valor;

        let data_rompimento_valor = data_rompimento_compressao.variavel_detalhes.find((item: any) => item.id === 85);
        data_rompimento_valor = data_rompimento_valor.valor;

        let resistencia_media_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 325);
        resistencia_media_compressao = resistencia_media_compressao.valor;

        let desvio_absoluto_compressao = resultado_compressao.ensaios_detalhes.find((item: any) => item.id === 327);
        desvio_absoluto_compressao = desvio_absoluto_compressao.valor;

        const headCompressao = [
          [
            { content: 'CP'},
            { content: 'Carga de Ruptura à Compressão (N)' },
            { content: 'Resist. Tração Compressão (Mpa)' },
          ],
        ];

        const bodyCompressao = [
          ['1', ruptura_cp1_compressao, tracao_cp1_compressao],
          ['2', ruptura_cp2_compressao, tracao_cp2_compressao],
          ['3', ruptura_cp3_compressao, tracao_cp3_compressao],
          [{ content: 'Desvio Padrão (Ruptura/Tração Compressão:', colSpan: 2 }, desvio_padrao_compressao],
          [{ content: 'Desvio Absoluto Máximo (Ruptura/Tração Compressão):', colSpan: 2 }, desvio_absoluto_compressao],
          [{ content: 'Resistência Média (Ruptura/Tração Compressão):', colSpan: 2 }, resistencia_media_compressao],
          [{ content: 'Data de Rompimento (Flexão/Compressão) - Moldagem:', colSpan: 2 }, data_rompimento_moldagem],
          [{ content: 'Data de Rompimento (Flexão/Compressão) - Valor:', colSpan: 2 }, data_rompimento_valor],
        ];

        autoTable(doc, {
          head: headCompressao,
          body: bodyCompressao,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }

      //"(Argamassa) Módulo de elasticidade dinâmico - Média/Desvio Padrão
      const resultado_elasticidade = amostra_detalhes_selecionada.amostra_detalhes.expressa_detalhes.calculo_ensaio_detalhes.find((item: any) => item.id === 142);

      if(resultado_elasticidade){
        const media_elasticidade = resultado_elasticidade.ensaios_detalhes.find((item: any) => item.id === 328);
        let media_individual_1 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 141);
        media_individual_1 = media_individual_1.valor;

        let media_individual_2 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 142);
        media_individual_2 = media_individual_2.valor;

        let media_individual_3 = media_elasticidade.variavel_detalhes.find((item: any) => item.id === 143);
        media_individual_3 = media_individual_3.valor;

        const headIndividual = [
          [
            { content: ''},
            { content: 'Média'},
          ],
        ];

        const bodyIndividual = [
          ['Individual - 1', media_individual_1],
          ['Individual - 2', media_individual_2],
          ['Individual - 3', media_individual_3],
        ];

        autoTable(doc, {
          head: headIndividual,
          body: bodyIndividual,
          startY: contadorLinhas,
          styles: {
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
            cellPadding: 1,
          },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: 0,
            lineWidth: 0.1,
            fontStyle: 'bold',
          },
          bodyStyles: {
            lineWidth: 0.1,
          },
          theme: 'grid',
        });
        
        contadorLinhas = (doc as any).lastAutoTable.finalY + 10;
      }
    }


    const imagens = amostra_detalhes_selecionada.amostra_detalhes.imagens;

    const ultimaImagem = imagens.length ? imagens.reduce((prev: any, curr: any) => (curr.id > prev.id ? curr : prev)) : null;

    if (ultimaImagem && ultimaImagem.image_url) {
      const imageUrl = ultimaImagem.image_url;

      try {
        const img = await fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }));

        const imgWidth = 100;
        const imgHeight = 60;
        const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
        const y = contadorLinhas;

        doc.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);

        contadorLinhas = y + imgHeight + 10;

      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    }

    // ====== Segunda página: Observações e rodapé ===============================
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, contadorLinhas, 40, 30); // assinatura

    contadorLinhas +=42;
    // Moldura Observações
    doc.rect(14, contadorLinhas, 182, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 95, contadorLinhas);

    contadorLinhas +=30;
    autoTable(doc, {
      body: [[this.bodyTabelaObs]],
      startY: contadorLinhas,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      }
    });

    contadorLinhas +=5;

    // Aviso original assinado
    autoTable(doc, {
      body: [
        ['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']
      ],
      startY: contadorLinhas,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    contadorLinhas +=12;

    // Rodapé
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: ' + dataFormatadaValidade, 16, contadorLinhas);
    doc.text("DB Arg Plan", 100, contadorLinhas);
    doc.text("Vesão: 9.0", 180, contadorLinhas);

    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  }

  async imprimirLaudoArgPDF2(amostra_detalhes_selecionada: any) {

    const doc = new jsPDF({ 
      unit: "mm", 
      format: "a4" 
    });

    const logoBase64 = 'data:image/png;base64,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';
    
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19); // x, y, largura, altura

    //cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(amostra_detalhes_selecionada.numero+' | 1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR'); // exemplo: 07/08/2025 13:35:22

    const agora_validade = new Date();
    agora_validade.setDate(agora_validade.getDate() + 60); // adiciona 60 dias
    // Formata para dd/MM/yy
    const dataFormatadaValidade = agora_validade.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const dataColetaFormatada = new Date(amostra_detalhes_selecionada.data_coleta);
    const dataColetaFormatada2 = dataColetaFormatada.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('Data de Emissão: '+dataHoraFormatada, 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    let y = 52;

    this.descricaoApi = 'Produto: '+amostra_detalhes_selecionada.amostra_detalhes.produto_amostra_detalhes.nome+'; ';

    //Dados amostra
    const linhas = [
      ['Material: '+amostra_detalhes_selecionada.material, "Tipo: "+amostra_detalhes_selecionada.tipo_amostragem, ""],
      ['Sub-Tipo: '+amostra_detalhes_selecionada.subtipo, "Fornecedor: "+amostra_detalhes_selecionada.fornecedor, ""],
      ['Local de Coleta: '+amostra_detalhes_selecionada.local_coleta, "", "Data Coleta / Fabricação: "+dataColetaFormatada2],
      ['Registro EP: '+amostra_detalhes_selecionada.registro_ep, "Registro do Produto: "+amostra_detalhes_selecionada.registro_produto, ""],
      ['Identif. Complemento: '+amostra_detalhes_selecionada.identificacao_complementar, "", ""],
    ];

    doc.rect(15, 48, 182, 35); //tabela dados amostra
    linhas.forEach((linha, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 140, y);
      y += 7;
    });


    //tabela de ensaios
    let contadorLinhas = y;
    y = 0;
    const head = [['Ensaio', 'Unid', 'Resultado', 'Método']];
    if(amostra_detalhes_selecionada.expressa_detalhes){
      const body: any[] = [];

      amostra_detalhes_selecionada.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
        this.ensaios_selecionados.forEach((selected: any) => {
          if (selected.id === ensaio_detalhes.id) {
            const norma = 'N/D';
            if(ensaio_detalhes.norma){
              const norma = ensaio_detalhes.norma;
            }
            const unidade = 'N/D';
            if(ensaio_detalhes.unidade){
              const unidade = ensaio_detalhes.unidade;
            }
            
            const linha: any[] = [];
            linha.push({ content: ensaio_detalhes.descricao });
            linha.push({ content: unidade });
            linha.push({ content: 'N/D' });
            linha.push({ content: norma });
            body.push(linha);

            y += 7;
          }
        });

      });
        autoTable(doc, {
          startY: contadorLinhas,
          head: head,
          body: body,
          theme: "grid",
          styles: {
            fontSize: 8,
            halign: 'left',
            cellPadding: 1,
            
          },
          headStyles: {
            halign: 'left',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
        });


    }else{
      amostra_detalhes_selecionada.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {   
        const body: any[] = [];

        plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
          this.ensaios_selecionados.forEach((selected: any) => {

            if (selected.id === ensaio_detalhes.id) {
              const linha: any[] = [];
              const norma = 'N/D';
              if(ensaio_detalhes.norma){
                const norma = ensaio_detalhes.norma;
              }
              const unidade = 'N/D';
              if(ensaio_detalhes.unidade){
                const unidade = ensaio_detalhes.unidade;
              }
              linha.push({ content: ensaio_detalhes.descricao });
              linha.push({ content: unidade });
              linha.push({ content: 'N/D' });
              linha.push({ content: norma });
              body.push(linha);

              y += 7;

            }
          });
        });

        autoTable(doc, {
          startY: contadorLinhas,
          head: head,
          body: body,
          theme: "grid",
          styles: {
            fontSize: 8,
            halign: 'left',
            cellPadding: 1,
            
          },
          headStyles: {
            halign: 'left',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
        });

      });
    }

    contadorLinhas = contadorLinhas + y;
    // doc.addPage();

    // Dados da tabela
    const head2 = [
      [
        {content: 'Determinação da resistência potencial de aderência à tração ao substrato', colSpan: 14}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
        { content: 'Forma de Ruptura (%)', colSpan: 5 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    const body2 = [
        ['1', '48', '1810', '0,00', '0,00', '0,00', '25,0', '0,14', 'VÁLIDO', '0%', '100%', '0%', '0%', '0%'],
      ...Array(11).fill(['', '', '', '', '', '', '', '', '', '', '', '', '', '']),
      [
        { content: 'Média Resistência Substrato', colSpan: 9, styles: { halign: 'right' } },
        '0,25', {content: 'Observações', colSpan: 4, rowSpan: 5, styles: { halign: 'left', valign: 'top' }}
      ],
      [
        { content: 'Resultado MAX', colSpan: 9, styles: { halign: 'right' } },
        '0,31'
      ],
      [
        { content: 'Resultado MIN', colSpan: 9, styles: { halign: 'right' } },
        '0,18'
      ],
      [
        { content: 'Tipo de Ruptura', colSpan: 9 }
      ],
      
    ];

    // Renderizar tabela
    autoTable(doc, {
      head: head2,
      body: body2,
      startY: contadorLinhas,
      styles: {
        fontSize: 8,
        halign: 'center',
        valign: 'middle',
        cellPadding: 1,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        lineWidth: 0.1,
      },
      bodyStyles: {
        lineWidth: 0.1,
      },
    });
  

    const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';

    const primeira_imgagem_arg = 'data:image/png;base64,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t771rQceeGDkyJHDhw8fNmwYuzeWGjVqnD9/PhIZKgcuX77cuHFjnju2Xweeu/vuu483byQyGCoH7CRgyAvLeAsbOvHkRZFlvOQ8999//5AhQ1R98cUX//Vf//XAgQOqGooJynj/8A//MPZx7qlTp77zne/Ur1//ypUrkclQjLhz586YMWM4ag8aNOjMmTNXr17liu/du5es6f/8n//z1ltvRboqCW3vUaUQsG/fvv/1v/7X6NGjo/pXX127dm3ixIm/8zu/s3DhwshkqBy4ePEiT9l//a//9eGHH3788ccfCwFv3749TZHIYKgcKKyd0HBPYBlvYUMnnrwosox31apVf/RHf9SzZ08I4EBMddq0aVGzoYiQlPF+8MEHf/qnf9qlSxf7bL+4cfLkyR/96EdPPvnkp59+GplCrF69+oc//OGKFSuiepWEtveoUghQxjtq1KioHuKLL774yU9+UqNGjcKaS9Hj0qVL999/P0nv559/fu3ataspwO0PKBgqG2z3MOSFZbyFjfDAkx/F9H66fft29+7df/VXf/W3f/u3OTyRC/3e7/3er/zKr1SrVo03dCQyFAuU8XKtFy1atHv37l0h3nzzzVatWv393//9mjVrIp2hSLF+/Xqe8eyfZ3Hyfuedd86ePRvVqyS0vUeVQkDOjBd069bte9/73oULF6K6oRKA9+nPf/7zRx555NatW5HJYKisKKyd0HBPYBlvYUMnnrwopoz3xIkTP/jBDzge1a5du2YIyH333fcnf/In27Zti0SGYgEZb4cOHX71V3/1d3/3dzkrCyTAv/7rv96/f3/7N4qKHlOnTv2DP/iDDRs2RHWDB23vUaUQkJTxDh48GPvhw4ejuqESQBnvAw888Nlnn10Nf5tAsK/VGCohCmsnNNwTWMZb2NCJJy+KKeNduHDhd77znTfeeOP27du8egHkwIEDf/M3fzNkyBAmG+kMRQGuLxnvf/yP//Gf//mff/azn/00xI9+9KP//b//92OPPbZ3795IZyhGsHH17duXjHfnzp2RyeBB23tUKQQkZbzDhg377d/+bftbDJUKZLwPPvjgb/3Wbz3zzDO1atXSz5erVau2YMGCSGEwVBrY2c+QF5bxFjZ04smLosl4r1692qhRI/3UOTKFuHXrVp06dX7+85+fPn06MhmKAmS87dq1U87z+eefnwnx6aef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YUMnnryoiIz3woUL3bp169y5MwcRDoXjQohwIOZ4ATiGTggBmThxIk2cHbEjwwjhQEkpu0rZJXABpZFeESBY0NCX4ASy0yNVQBNV4vhEgwFEo4rM6TUSILsEOKprCEYsnPOaNWs2aNCgKvKtZk4hXG7yPX17vE2bNky/VatWqrZt27Zp+LX21q1bq0pr8+bNRSSDcKTW18iRNW7cmCBwyfQFclcls4LLgpgq8UWwuCogLFWUgCp2qrJTqjsCNmnSBDugyjBohfizcMOTjDiqAg0PMeWPfvSjF198MVqUKoZPP/20UaNGrGTXEN27d+fxpxTh9oC4JlJEiIyyU2rHkFEEhB5RK17OAnr06EHpeqHVl6kLAAeOi/Ts2ZMSXwhGxLI4KCBErUDdASmdBSWXvkaNGkWc8e7YsaNBgwb16tVr2LChfnuWKoADrrvsEBlVInMcgVoB3G8SwagSyAL0W7gQp1EQCKU/DJHQO4AzUvoyv1WE1tq1a1fZH1QZDFUB5bUTGooYlvEWNnTiyYuKyHi/+OILjiYkAI888siDDz5ILiTyxBNPPProow899NDjjz+O5eGHH37ssccosWB33OkhsuAIAThShaBXBEoZgfTOETg9wUXUNZwIrhU9BDhHelQTGgJCiKDBZzs6osGg/8d//MehQ4fevJn+O41FDKY5ePDgAQMGrF27Vt8SX5X5nfDg294h3HfI14R//hGLvhnu7FgoV69erao0Akp5yU5VrcuXL1dVWLFiBVWATF5EU0DZsVDiFUaNxikxdtydEgQRw35FgFopAS5YwjBBHPLeKpvxnjlzpkOHDlOnTn3zzTfXhX8pdP369SKvpUBVgDs7aysiiwT4UpXSb1JVAgi+fi8QAInpAdwp5SsSOKRcRJxFkF1KdYdRFjW98cYb06ZNa9GixWeffRatReWAtveoUjZcv3791KlTJyoex48fj1gW/KYSZF8DJ0+evHz5cjRVg8FQdCivndBQxLCMt7ChE09eVETGe/78+X79+i1duvTdd999++23jx07tn//fpH33ntv+/btR44c+eCDD3bs2EEJx4Ly6NGjb7311t69e5G98847ECyUu3fvhhw4cGDXrl2HDx/GZevWrR9++OGhQ4dwfP/992klOBFwRLxv3z7Inj175EjXdEQvKCE4EgQix507d4oQXBEIhS8W4jAeHA8e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';
    contadorLinhas += 105;

    let proximaY = (doc as any).lastAutoTable.finalY + 10; // +10mm de margem

    doc.addImage(primeira_imgagem_arg, 'PNG', 14, proximaY, 182, 40) // x, y, largura, altura

    contadorLinhas = proximaY + 40;


    // Dados da tabela
    const head3 = [
      [
        {content: 'Determinação da resistência potencial de aderência à tração superficial', colSpan: 14}
      ],
      [
        { content: 'N°', rowSpan: 2 },
        { content: 'Diâmetro mm', rowSpan: 2 },
        { content: 'Área mm²', rowSpan: 2 },
        { content: 'Espessura mm', rowSpan: 2 },
        { content: 'Subst', rowSpan: 2 },
        { content: 'Junta', rowSpan: 2 },
        { content: 'Carga kgf', rowSpan: 2 },
        { content: 'RESIST. Mpa', rowSpan: 2 },
        { content: 'Validação', rowSpan: 2 },
        { content: 'Forma de Ruptura (%)', colSpan: 5 },
      ],
      [
        { content: '(A) Sub' },
        { content: '(B) Sub/Arga' },
        { content: '(C) Rup Arga' },
        { content: '(D) Arga Cola' },
        { content: '(E) Colar pastilha' },
      ],
    ];

    const body3 = [
        ['1', '', '1963', '0', 'jan-00', 'jan-00', '65,0', '0,33', 'VÁLIDO', '0%', '100%', '0%', '0%', '0%'],
      ...Array(11).fill(['', '', '', '', '', '', '', '', '', '', '', '', '', '']),
      [
        { content: 'Média Resistência Superfície', colSpan: 9, styles: { halign: 'right' } },
        '0,25', {content: 'Observações', colSpan: 4, rowSpan: 5, styles: { halign: 'left', valign: 'top' }}
      ],
      [
        { content: 'Resultado MAX', colSpan: 9, styles: { halign: 'right' } },
        '0,31'
      ],
      [
        { content: 'Resultado MIN', colSpan: 9, styles: { halign: 'right' } },
        '0,18'
      ],
      [
        { content: 'Tipo de Ruptura', colSpan: 9 }
      ],
      
    ];

    // Renderizar tabela
    autoTable(doc, {
      head: head3,
      body: body3,
      startY: contadorLinhas,
      styles: {
        fontSize: 8,
        halign: 'center',
        valign: 'middle',
        cellPadding: 1,
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        lineWidth: 0.1,
      },
      bodyStyles: {
        lineWidth: 0.1,
      },
    });

    const segunda_imagem_arg = 'data:image/png;base64,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Gkku6Vmb1JNMnqGJXsxBBGydOnXiHEHldbbooosnb775Zll4qiSLVI+K/yjag+iJTm1KUinUiC6a00RqKOGuuQtdqXb55ZebV4IeEjxjWTt06KDIadWqVbkM8wSOOvLII/fee+9zzz33mmuuufbaa+3cFi1a7LnnnhZU1XrZZZepaUHXmWeeuf322++8884aXvlZAYOhadOmqrXdd99d2abkNopW2ocffniTJk1OPvlkbCEEVGWHHXaYIWeddZbClZCLL74Y/bTTTkNUb2vTgZCrr75aVaBhRkWFs0Ubv16znHDCCeQ3b9780ksvjUnNovG3v/1t//33Nyk5KLyHeOGFFx500EF77bWX+uTGG2+kHmPJIXPfffdVeNBB0YifXbrwM//ggw/GQwdEIIrhlGeC6chHDNOOO+44PsRvILVJQKcqZvJNSgevugi84IILGjduvNZaa6266qqVT4XmEALA1IaTJoqEhKewsYmEln0knGqhKLaddUOGDIlvTRExB5x7d999twMkJMyOua++EmlCXZQ6iCL+AYN9ob4St3Ho1egOXmoIAxvB9icHUZyrb1nKQO2Q7yluSR45ciRVg0gIacoPO875bxOZVFfId1907dpVtYlSmxScljbLmDFjyKltUhMxx3qJalYjxqQMcebUJi0EzAaF1YqGqMy91jyATTGmeOaK2qSstpet4zbbbNOoUSMnWLkYcwxe2mijjUT4+eefL5CEiotyxRVXXH/99Y8++mgRJQjPO+88G0eArVsgXvGfffbZ+I8//njM9sI555xjw6ILfvR99tnHtWvbBrMu7TPOOMPGIUR1h0iUHadhrg022GDDDTe0UywQzvgLGsccc8zGG29sI9uJZHpito9snC222ELEIlplcsi3cQQ8+f/85z/pgBKq4rHLNt98c3uThFDpkksuYfVuu+2mCz00YaNRNs7qq6/+5z//+aSTTgqj9NovW2+9NbojBQVCc08byhFEVZPaj9xiCgw40XnVLqMDOn/iJ3mRRRb55S9/edRRRzlay5XIyPgZI5e4GRnzAtmJm2ydddbZYYcdBg4cWCnwQArywgsvyGbSSiwgvZA83XvvvfW/bISol+pfUaZQAj377LMyHsJLah1kNhK7Nm3aEJuWcCAruu222yS7yiftklogKkB6SnTqywQ1mxSK8PK9DpInBUm3bt0kgvGB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';
    contadorLinhas += 105;
    doc.addImage(segunda_imagem_arg, 'PNG', 14, contadorLinhas, 182, 40) // x, y, largura, altura

      await this.montarGrafico();

    const canvas = this.graficoCanvas.nativeElement;
    const imgData = canvas.toDataURL('image/png');

    contadorLinhas += 55;
    // --- tabela de dados (só 2 colunas)
    autoTable(doc, {
      startY: contadorLinhas,
      head: [['t', 'Δmt (kg/m²)']],
      body: this.dadosTabela.map(d => [d.tempo, d.valor.toString()]),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2, halign: 'center' },
      headStyles: { fontStyle: 'bold', fillColor: [255, 255, 255], textColor: 0 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 }
      },
      tableWidth: 55, // largura fixa da tabela
      margin: { left: 14 } // margem esquerda
    } as any);


    // --- posição da tabela e do gráfico lado a lado
    const tableY = contadorLinhas;
    const tableX = 14;
    const graphX = tableX + 60; // posição do gráfico à direita da tabela
    const graphY = 180;
    const graphW = 120;
    const graphH = tableY - graphY;
    // --- legenda embaixo
    let finalY = 250;

    doc.addImage(imgData, 'PNG', graphX, graphY, graphW, graphH);

    // Texto principal com borda centralizado
    const textoPrincipal = 'Coeficiente de absorção de água por capilaridade (Wh): 5,4   kg/m²·h^0.5';
    doc.setFontSize(10);

    // largura da página (A4 = 210mm) com margens
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 14;
    const boxWidth = pageWidth - marginX * 2; // largura da caixa
    const boxHeight = 8; // altura fixa da caixa

    // desenha borda
    doc.rect(marginX, finalY - 5, boxWidth, boxHeight);

    // centraliza texto dentro da caixa
    doc.text(textoPrincipal, pageWidth / 2, finalY, { align: 'center' });

    // avança depois da caixa
    finalY += boxHeight + 2;

    // --- bloco de informações alinhado à esquerda
    doc.setFontSize(9);
    const lineSpacing = 4.5; // diminui o espaço entre linhas

    doc.text('Data do ensaio: 1 e 2/7/2025', marginX, finalY);
    finalY += lineSpacing;
    doc.text('Tipo de gráfico: Tipo A', marginX, finalY);
    finalY += lineSpacing;
    doc.text('Quantidade de corpos de prova (CP): 05', marginX, finalY);
    finalY += lineSpacing;
    doc.text(
      'Duração do ensaio: 6h   Na medição de 6h, foi verificada umidade nas faces superiores dos CP\'s.',
      marginX,
      finalY
    );
    finalY += lineSpacing;
    doc.text(
      'Não foram registrados valores com diferença superior a +/- 20% da média entre os CP\'s.',
      marginX,
      finalY
    );

    // doc.addPage();
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, 238, 40, 30); // x, y, largura, altura

    doc.rect(14, 215, 182, 20); //tabela obs
    //observações
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 95, 213);
    autoTable(doc, {
      body: [[this.bodyTabelaObs]],
      startY: 216,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      }
    });
    //original assinado...
    autoTable(doc, {
      body: [
        ['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']
      ],
      startY: 270,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    //rodape
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: '+dataFormatadaValidade, 16, 281);
    doc.text("DB Arg Plan", 100, 281);
    doc.text("Vesão: 9.0", 180, 281);

    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }

  abrirModalLaudo(amostra_detalhes: any) {
  
    this.amostra_detalhes_selecionada = amostra_detalhes;

    while (this.ensaios_laudo.length > 0) {
        this.ensaios_laudo.pop(); // Removes elements one by one from the end
    }

    if(amostra_detalhes.ultimo_ensaio){
      amostra_detalhes.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        this.ensaios_laudo.push({
            id: ensaios_utilizados.id,
            descricao: ensaios_utilizados.descricao,
            garantia: ensaios_utilizados.garantia
          });
      });
    }
    if(amostra_detalhes.ultimo_calculo){
      amostra_detalhes.ultimo_calculo.forEach((ultimo_calculo: any) => {
        ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
          this.ensaios_laudo.push({
            id: ensaios_utilizados.id,
            descricao: ensaios_utilizados.descricao,
            garantia: ensaios_utilizados.garantia
          });
        });
      });
    }
    this.modalLaudo = true;
  }

  abrirModalDadosLaudoSubstrato(analise: any) {
    this.amostra_detalhes_selecionada = analise;

    if(this.parecer_substrato){
      this.linhas = this.parecer_substrato.map((item: any, index: number) => ({
        numero: item.numero ?? index + 1,
        diametro: item.diametro ?? null,
        area: item.area ?? null,
        espessura: item.espessura ?? null,
        subst: item.subst ?? null,
        junta: item.junta ?? null,
        carga: item.carga ?? null,
        resist: item.resist ?? null,
        validacao: item.validacao ?? "",
        rupturas: {
          sub: item.rupturas?.sub ?? null,
          subArga: item.rupturas?.subArga ?? null,
          rupArga: item.rupturas?.rupArga ?? null,
          argaCola: item.rupturas?.argaCola ?? null,
          colarPastilha: item.rupturas?.colarPastilha ?? null
        }
      }));
    }else if (analise?.substrato && Array.isArray(analise.substrato)) {
      this.linhas = analise.substrato.map((item: any, index: number) => ({
        numero: item.numero ?? index + 1,
        diametro: item.diametro ?? null,
        area: item.area ?? null,
        espessura: item.espessura ?? null,
        subst: item.subst ?? null,
        junta: item.junta ?? null,
        carga: item.carga ?? null,
        resist: item.resist ?? null,
        validacao: item.validacao ?? "",
        rupturas: {
          sub: item.rupturas?.sub ?? null,
          subArga: item.rupturas?.subArga ?? null,
          rupArga: item.rupturas?.rupArga ?? null,
          argaCola: item.rupturas?.argaCola ?? null,
          colarPastilha: item.rupturas?.colarPastilha ?? null
        }
      }));
      while (this.linhas.length < 10) {
        const numero = this.linhas.length + 1;
        this.linhas.push({
          numero,
          diametro: null,
          area: null,
          espessura: null,
          subst: null,
          junta: null,
          carga: null,
          resist: null,
          validacao: "",
          rupturas: {
            sub: null,
            subArga: null,
            rupArga: null,
            argaCola: null,
            colarPastilha: null
          }
        });
      }
    } else {
      // Caso não exista parecer ou substrato, cria as 10 linhas padrão
      this.linhas = [];
      for (let i = 1; i <= 10; i++) {
        this.linhas.push({
          numero: i,
          diametro: null,
          area: null,
          espessura: null,
          subst: null,
          junta: null,
          carga: null,
          resist: null,
          validacao: "",
          rupturas: {
            sub: null,
            subArga: null,
            rupArga: null,
            argaCola: null,
            colarPastilha: null
          }
        });
      }
    }
    
    this.laudoAnaliseLinhasId = analise.id;
    this.modalDadosLaudoSubstrato = true;
  }

  abrirModalDadosLaudoSuperficial() {

    this.jsonModal.substrato = this.linhas;   
    this.parecer_substrato = this.linhas;
    if (this.amostra_detalhes_selecionada?.superficial){
      this.jsonModal.superficial = this.amostra_detalhes_selecionada?.superficial;
    }

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
   
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Determinação da resistência potencial de aderência a tração ao substrato salvo com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });
    
    if(this.parecer_superficial){
      this.linhasSuperficial = this.parecer_superficial.map((item: any, index: number) => ({
        numero: item.numero ?? index + 1,
        diametro: item.diametro ?? null,
        area: item.area ?? null,
        espessura: item.espessura ?? null,
        subst: item.subst ?? null,
        junta: item.junta ?? null,
        carga: item.carga ?? null,
        resist: item.resist ?? null,
        validacao: item.validacao ?? "",
        rupturas: {
          sub: item.rupturas?.sub ?? null,
          subArga: item.rupturas?.subArga ?? null,
          rupArga: item.rupturas?.rupArga ?? null,
          argaCola: item.rupturas?.argaCola ?? null,
          colarPastilha: item.rupturas?.colarPastilha ?? null
        }
      }));
    }else if (this.amostra_detalhes_selecionada?.superficial && Array.isArray(this.amostra_detalhes_selecionada.superficial)) {
      this.linhasSuperficial = this.amostra_detalhes_selecionada.superficial.map((item: any, index: number) => ({
        numero: item.numero ?? index + 1,
        diametro: item.diametro ?? null,
        area: item.area ?? null,
        espessura: item.espessura ?? null,
        subst: item.subst ?? null,
        junta: item.junta ?? null,
        carga: item.carga ?? null,
        resist: item.resist ?? null,
        validacao: item.validacao ?? "",
        rupturas: {
          sub: item.rupturas?.sub ?? null,
          subArga: item.rupturas?.subArga ?? null,
          rupArga: item.rupturas?.rupArga ?? null,
          argaCola: item.rupturas?.argaCola ?? null,
          colarPastilha: item.rupturas?.colarPastilha ?? null
        }
      }));
      while (this.linhas.length < 10) {
        const numero = this.linhas.length + 1;
        this.linhasSuperficial.push({
          numero,
          diametro: null,
          area: null,
          espessura: null,
          subst: null,
          junta: null,
          carga: null,
          resist: null,
          validacao: "",
          rupturas: {
            sub: null,
            subArga: null,
            rupArga: null,
            argaCola: null,
            colarPastilha: null
          }
        });
      }
    } else {
      // Caso não exista parecer ou substrato, cria as 10 linhas padrão
      this.linhasSuperficial = [];
      for (let i = 1; i <= 10; i++) {
        this.linhasSuperficial.push({
          numero: i,
          diametro: null,
          area: null,
          espessura: null,
          subst: null,
          junta: null,
          carga: null,
          resist: null,
          validacao: "",
          rupturas: {
            sub: null,
            subArga: null,
            rupArga: null,
            argaCola: null,
            colarPastilha: null
          }
        });
      }
    }

    this.modalDadosLaudoSubstrato = false;
    this.modalDadosLaudoSuperficial = true;
  }

  salvarSuperficial() {

    this.jsonModal.superficial = this.linhasSuperficial;
    this.parecer_superficial = this.linhasSuperficial;

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Determinação da resistência potencial de aderência a tração ao superfical salvo com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });

    if(this.parecer_flexao){
      this.linhasFlexao = this.parecer_flexao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        flexao_n: item.flexao_n ?? null,
        flexao_mpa: item.flexao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_flexao: item.tracao_flexao ?? null
      }));
    }else if (this.amostra_detalhes_selecionada?.flexao && Array.isArray(this.amostra_detalhes_selecionada.flexao)) {
      this.linhasFlexao = this.amostra_detalhes_selecionada.flexao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        flexao_n: item.flexao_n ?? null,
        flexao_mpa: item.flexao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_flexao: item.tracao_flexao ?? null
      }));
      while (this.linhasFlexao.length < 3) {
        const cp = this.linhasFlexao.length + 1;
        this.linhasFlexao.push({
          cp,
          flexao_n: null,
          flexao_mpa: null,
          media_mpa: null,
          tracao_flexao: null,      
        });
      }
    } else {
      // Caso não exista parecer ou substrato, cria as 10 linhas padrão
      this.linhasFlexao = [];
      for (let i = 1; i <= 3; i++) {
        this.linhasFlexao.push({
          cp: i,
          flexao_n: null,
          flexao_mpa: null,
          media_mpa: null,
          tracao_flexao: null,   
        });
      }
    }

    this.modalDadosLaudoSuperficial = false;
    this.modalDadosLaudoFlexao = true;
    
  }


  salvarRupturaFlexao() {
    this.jsonModal.flexao = this.linhasFlexao;
    this.parecer_flexao = this.linhasFlexao;

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Carga de Ruptura a Flexão salva com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });

    if(this.parecer_compressao){
      this.linhasCompressao = this.parecer_compressao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        compressao_n: item.compressao_n ?? null,
        compressao_mpa: item.compressao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_compressao: item.tracao_compressao ?? null
      }));
    }else if (this.amostra_detalhes_selecionada?.compressao && Array.isArray(this.amostra_detalhes_selecionada.compressao)) {
      this.linhasCompressao = this.amostra_detalhes_selecionada.compressao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        compressao_n: item.compressao_n ?? null,
        compressao_mpa: item.compressao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_compressao: item.tracao_compressao ?? null
      }));
      while (this.linhasCompressao.length < 3) {
        const cp = this.linhasCompressao.length + 1;
        this.linhasCompressao.push({
          cp,
          compressao_n: null,
          compressao_mpa: null,
          media_mpa: null,
          tracao_compressao: null,      
        });
      }
    } else {
      // Caso não exista parecer ou substrato, cria as 10 linhas padrão
      this.linhasCompressao = [];
      for (let i = 1; i <= 3; i++) {
        this.linhasCompressao.push({
          cp: i,
          compressao_n: null,
          compressao_mpa: null,
          media_mpa: null,
          tracao_compressao: null,   
        });
      }
    }

    this.modalDadosLaudoFlexao = false;
    this.modalDadosLaudoCompressao = true;
  }

  salvarRupturaCompressao(){
    this.jsonModal.compressao = this.linhasCompressao;
    this.parecer_compressao = this.linhasCompressao;

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Carga de Ruptura a Compressão salva com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });
    
    if(this.parecer_retracao){
      this.linhasRetracao = this.parecer_retracao.map((item: any, index: number) => ({
        data: item.data ?? '',
        idade: item.idade ?? null,
        media: item.media ?? null,
        desvio_maximo: item.desvio_maximo ?? null
      }));
    }else if (this.amostra_detalhes_selecionada?.retracao && Array.isArray(this.amostra_detalhes_selecionada.retracao)) {
      this.linhasRetracao = this.amostra_detalhes_selecionada.retracao.map((item: any, index: number) => ({
        data: item.data ?? '',
        idade: item.idade ?? null,
        media: item.media ?? null,
        desvio_maximo: item.desvio_maximo ?? null
      }));
      while (this.linhasRetracao.length < 3) {
        this.linhasRetracao.push({
          data: '',
          idade: null,
          media: null,
          desvio_maximo: null,      
        });
      }
    } else {
      this.linhasRetracao = [];
      for (let i = 1; i <= 3; i++) {
        this.linhasRetracao.push({
          data: '',
          idade: null,
          media: null,
          desvio_maximo: null,   
        });
      }
    }

    this.modalDadosLaudoCompressao = false;

    this.modalDadosLaudoRetracao = true;
    // this.abrirModalLaudo(this.amostra_detalhes_selecionada);

  }

  salvarRetracao(){
    this.jsonModal.retracao = this.linhasRetracao;
    this.parecer_retracao = this.linhasRetracao;

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Determinação da Variação Dimencional Linear (Retação/Expansão) salva com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });

    if(this.parecer_elasticidade){
      this.linhasElasticidade = this.parecer_elasticidade.map((item: any, index: number) => ({
        individual: item.individual ?? null,
        media: item.media ?? null,
        desvio_padrao: item.desvio_padrao ?? null
      }));
    }else if (this.amostra_detalhes_selecionada?.elasticidade && Array.isArray(this.amostra_detalhes_selecionada.elasticidade)) {
      this.linhasElasticidade = this.amostra_detalhes_selecionada.elasticidade.map((item: any, index: number) => ({
        individual: item.individual ?? null,
        media: item.media ?? null,
        desvio_padrao: item.desvio_padrao ?? null
      }));
      while (this.linhasElasticidade.length < 3) {
        this.linhasElasticidade.push({
          individual: null,
          media: null,
          desvio_padrao: null,      
        });
      }
    } else {
      this.linhasElasticidade = [];
      for (let i = 1; i <= 3; i++) {
        this.linhasElasticidade.push({
          individual: null,
          media: null,
          desvio_padrao: null,   
        });
      }
    }
    

    this.modalDadosLaudoRetracao = false;

    this.modalDadosLaudoElasticidade = true;
    // this.abrirModalLaudo(this.amostra_detalhes_selecionada);

  }
  
  salvarElasticidade(){
    this.jsonModal.elasticidade = this.linhasElasticidade;
    this.parecer_elasticidade = this.linhasElasticidade;

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
    this.analiseService.editAnaliseSuperficial(this.laudoAnaliseLinhasId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Módulo de Elasticidade Dinâmico salvo com sucesso!'
        });
        setTimeout(() => {
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });

    this.modalDadosLaudoElasticidade = false;
    this.abrirModalLaudo(this.amostra_detalhes_selecionada);

  }

  getStatusIcon(status: boolean): string {
    // Evita recálculo durante inicialização
    if (this.isInitializing) {
      return 'pi-circle';
    }
    return status ? 'pi-check-circle' : 'pi-times-circle';
  }

  getStatusColor(status: boolean): string {
    // Evita recálculo durante inicialização
    if (this.isInitializing) {
      return '#6b7280';
    }
    return status ? '#22c55e' : '#ef4444';
  }

  // Método otimizado para formatar o parecer rapidamente
  formatarParecer(texto: string): string {
    if (!texto) return '';

    // Limpeza básica e rápida
    let textoLimpo = texto.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    if (textoLimpo.startsWith('"') && textoLimpo.endsWith('"')) {
      textoLimpo = textoLimpo.slice(1, -1);
    }

    // Formatação simples 
    return textoLimpo
      .replace(/\n/g, '<br>')
      .replace(/•\s*([^\n]+)/g, '<div style="margin: 5px 0;">• $1</div>')
      .replace(/(Norma aplicada|Resultado|Verificação|Conclusão)/gi, '<strong style="color: #2563eb;">$1</strong>')
      .replace(/(\d+[,.]?\d*\s*%)/g, '<span style="background: #dbeafe; color: #1e40af; padding: 2px 4px; border-radius: 3px;">$1</span>');
  }

  // Método para fechar o modal do parecer
  fecharParecer(): void {
    this.mostrarParecer = false;
    this.parecerResposta = '';
    this.parecerCarregando = false;
  }

  // Método para copiar o parecer para a área de transferência
  copiarParecer(): void {
    if (this.parecerResposta) {
      navigator.clipboard.writeText(this.parecerResposta).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copiado!',
          detail: 'Parecer copiado para a área de transferência'
        });
      }).catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível copiar o texto'
        });
      });
    }
  }

  // Métodos para evitar loops infinitos com two-way binding
  updateLinhaProperty(linha: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (linha && linha.hasOwnProperty(property) && target) {
      linha[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateLinhaRuptura(linha: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (linha && linha.rupturas && linha.rupturas.hasOwnProperty(property) && target) {
      linha.rupturas[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateNumeroProperty(numero: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (numero && numero.hasOwnProperty(property) && target) {
      numero[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateNumeroRuptura(numero: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (numero && numero.rupturas && numero.rupturas.hasOwnProperty(property) && target) {
      numero.rupturas[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateFlexaoProperty(flexao: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (flexao && flexao.hasOwnProperty(property) && target) {
      flexao[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateCompressaoProperty(compressao: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (compressao && compressao.hasOwnProperty(property) && target) {
      compressao[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  updateRetacaoProperty(retacao: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (retacao && retacao.hasOwnProperty(property) && target) {
      retacao[property] = target.type === 'number' || target.type === 'date' ? 
        (target.type === 'number' ? Number(target.value) : target.value) : target.value;
    }
  }

  updateElasticidadeProperty(elasticidade: any, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (elasticidade && elasticidade.hasOwnProperty(property) && target) {
      elasticidade[property] = target.type === 'number' ? Number(target.value) : target.value;
    }
  }

  ngOnDestroy(): void {
    // Limpar timeout do filtro para evitar vazamentos de memória
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
  }

}  
