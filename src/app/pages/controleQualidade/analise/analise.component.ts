import { ChangeDetectorRef, Component, OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule, IconField } from 'primeng/iconfield';
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
import { ToastModule } from 'primeng/toast';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { evaluate, create, all, to } from 'mathjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ProjecaoService } from '../../../services/baseOrcamentariaServices/dre/projecao.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { Plano } from '../plano/plano.component';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';
import { Produto } from '../../baseOrcamentaria/dre/produto/produto.component';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { HttpClient } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';
import { HotTableModule } from '@handsontable/angular-wrapper';
//
import { Chart, ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend, plugins } from 'chart.js';
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';
import AnnotationPlugin from 'chartjs-plugin-annotation';

Chart.register(ScatterController, LinearScale, PointElement, LineElement, Tooltip, Legend, AnnotationPlugin);

interface DataPoint {
  x: number;
  y: number;
}

interface LinhaSubstrato {
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

interface LinhaRetacao {
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

export interface Analise {
  id: number;
  data: string;
  amostra: any;
  estado: string;
  metodoModelagem: string;
  metodoMuro: string;
  observacoesMuro: string;
  parecer: any;
}
interface FileWithInfo {
  file: File;
  descricao: string;
}
@Component({
  selector: 'app-analise',
  imports:[
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, 
    CardModule,InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, 
    StepperModule,InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule,
    SpeedDialModule, AvatarModule, PopoverModule, BadgeModule, TooltipModule,HotTableModule,

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
    MessageService, ConfirmationService, DatePipe
  ],
  templateUrl: './analise.component.html',
  styleUrl: './analise.component.scss'
})
export class AnaliseComponent implements OnInit,OnDestroy, CanComponentDeactivate {  
  planosAnalise: Plano[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  materiais: Produto[] = [];
  ensaioSelecionado: any;
  modalOrdemVariaveisVisible: any;
  dataForm!: FormGroup;
  analise: any;
  idAnalise: any;
  analisesSimplificadas: any[] = [];
  amostraImagensSelecionada: any;
  analiseId: number | undefined;
  analiseAndamento: any;
  digitador: any;
  planos: any;
  amostraNumero: any;
  planoDescricao: any;
  resultadosAnteriores: any[] = [];
  //images
  imagensAmostra: any[] = [];
  imagemAtualIndex: number = 0;
  
  // Instância personalizada do MathJS com funções bitwise seguras
  private mathjs: any;
  modalImagensVisible = false;
  uploadedFilesWithInfo: FileWithInfo[] = [];
  // Controle de mudanças não salvas
  public hasUnsavedChanges = false;
  private lastSavedState: string = '';
  ///
  public ultimoResultadoGravado: any = null;
  mostrandoResultadosAnteriores = false;
  mostrandoEnsaiosAnteriores = false;
  calculoSelecionadoParaPesquisa: any = null;
  ensaioSelecionadoParaPesquisa: any = null;
  carregandoResultados = false;
  drawerResultadosVisivel = false;
  drawerResultadosEnsaioVisivel = false;
  amostraId: any;
  planoEnsaioId: any;
  // Expor Math para o template
  Math = Math;
  ensaiosSelecionadosParaAdicionar: any[] = [];
  calculosSelecionadosParaAdicionar: any[] = [];
  // Controle de expansão das linhas
  todasExpandidas: boolean = false;
  todasCalculosExpandidas: boolean = false;
  calculoSelecionado: any = null;

  // Sistema de alertas de rompimento
  alertasRompimento: any[] = [];
  intervaloPadrao = 9500000; // 5 minutos
  intervalId: any = null;
  configAlerta = {
    diasAviso: 3, // Avisar 3 dias antes
    diasCritico: 0, // Crítico no dia
    horarioVerificacao: '09:00', // Verificar as 9h
    ativo: true
  };
   
   // Controle de campos para adicionar/remover ensaios e cálculos
  modalAdicionarEnsaioVisible = false;
  modalAdicionarCalculoVisible = false;

  // Controle de alertas para evitar duplicações
  private alertasExibidos = new Set<string>();
  private timerLimpezaAlertas: any;
  editFormVisible = false;
  ensaiosDisponiveis: any[] = [];
  calculosDisponiveis: any[] = [];
  
  inputValue: string = '';
  inputCalculos: string = '';

  produtoId: any;

  responsaveis = [
    { value: 'Antonio Carlos Vargas Sito' },
    { value: 'Fabiula Bueno' },
    { value: 'Janice Castro de Oliveira'},
    { value: 'Karine Urruth Kaizer'},
    { value: 'Luciana de Oliveira' },
    { value: 'Kaua Morales Silbershlach'},
    { value: 'Marco Alan Lopes'},
    { value: 'Maria Eduarda da Silva'},
    { value: 'Monique Barcelos Moreira'},
    { value: 'Renata Rodrigues Machado Pinto'},
    { value: 'Sâmella de Campos Moreira'},
    { value: 'David Weslei Sprada'},
    { value: 'Camila Vitoria Carneiro Alves Santos'},
  ]
  metodosModelagem = [
    { value: 'ARG' },
    { value: 'BET' },
    { value: 'MAC' },
    { value: 'MAE' },
    { value: 'MMV' },
  ];
  
  @ViewChild('dt1') dt1!: Table;
  garantias: any;
  modalGarantiasVisible: any;
  modalDadosLaudoSubstrato = false;
  linhasSubstrato: LinhaSubstrato[] = [];
  parecer_substrato: any = null;

  modalDadosLaudoSuperficial = false;
  linhasSuperficial: LinhaSuperficial[] = [];
  parecer_superficial: any = null;

  modalDadosLaudoRetacao = false;
  linhasRetacao: LinhaRetacao[] = [];
  parecer_retacao: any = null;

  modalDadosLaudoElasticidade = false;
  linhasElasticidade: LinhaElasticidade[] = [];
  parecer_elasticidade: any = null;

  modalDadosLaudoFlexao = false;
  linhasFlexao: LinhaFlexao[] = [];
  parecer_flexao: any = null;

  modalDadosLaudoCompressao = false;
  linhasCompressao: LinhaCompressao[] = [];
  parecer_compressao: any = null;

  jsonModal: {
    substrato: any[];
    superficial: any[];
    flexao: any[];
    compressao: any[];
    retacao: any[];
    elasticidade: any[];
  } = {
    substrato: [],
    superficial: [],
    flexao: [],
    compressao: [],
    retacao: [],
    elasticidade: [],
  };

  menuArgamassa: any[] = [];

  // GRAFICO
  @ViewChild('meuGrafico') chartRef!: ElementRef<HTMLCanvasElement>;
  chartInstance: any;
  awCalculado: number | null = null;
  r2Calculado: number | null = null;
  modalGrafico: boolean = false;
  awLaboratorioCalculado: number | null = null;
  bIntercepto: number | null = null;
  
  // Controle para salvamento de imagem do gráfico
  salvandoImagemGrafico: boolean = false;
  
  // Dados Experimentais filtrados para a fase linear
 dadosIniciais: { raizT: number | string | null, deltaMt: number | string | null, tLabel: string }[] = [
    { raizT: 0.29, deltaMt: 2.30, tLabel: '5min' },
    { raizT: 0.57, deltaMt: 4.10, tLabel: '20min' },
    { raizT: 1.00, deltaMt: 6.85, tLabel: '1h' },
    { raizT: 1.41, deltaMt: 8.35, tLabel: '2h' },
    { raizT: 1.41, deltaMt: 12.00, tLabel: '4h' },
    { raizT: '', deltaMt: '', tLabel: '6h' },
    { raizT: '', deltaMt: '', tLabel: '8h' },
    { raizT: '', deltaMt: '', tLabel: '22:30h' },
    { raizT: '', deltaMt: '', tLabel: '24h' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analiseService: AnaliseService,
    private colaboradorService: ColaboradorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private produtoLinhaService: ProjecaoService,
    private amostraService: AmostraService,
    private ordemService: OrdemService,
    private ensaioService: EnsaioService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    // Configurar funções bitwise seguras globalmente
    this.configurarFuncoesBitwiseSeguras();
  }
  
   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.analiseId = Number(this.route.snapshot.paramMap.get('id'));
    this.getDigitadorInfo();
    this.getAnalise();
    this.carregarEnsaiosECalculosDisponiveis();
    // Inicializar sistema de alertas
    // this.iniciarSistemaAlertas();

    //chamo os itens aqui para não ficar chamamdo toda hora
    //AQUI NÃO FUNCIONOU______na linha 454 funcionou
    // this.menuArgamassa = this.getItensArgamassa(this.analise);

    // Inicializar o formulário de dados do gráfico
    this.createForm();
  }

//==============================GRAFICO====================================
exibirGrafico(): void {
    this.modalGrafico = true;
    this.calculateAndDrawRegression();
  }
createForm() {
    this.dataForm = this.fb.group({
      dataRows: this.fb.array([]) // O FormArray que conterá as linhas de input
    });
    // Popula o FormArray com os dados iniciais
    this.dadosIniciais.forEach(data => this.addDataRow(data));

    // Monitora as mudanças no formulário para recalcular o gráfico
    this.dataForm.valueChanges.subscribe(() => {
        // Atraso para evitar recalculo excessivo durante a digitação
        setTimeout(() => this.calculateAndDrawRegression(), 100); 
    });
  }
 
get dataRows(): FormArray {
    if (!this.dataForm) {
      return this.fb.array([]);
    }
    return this.dataForm.get('dataRows') as FormArray;
  }  

// Cria um FormGroup para uma nova linha de dados
  private createDataRowGroup(data: { raizT: number | string | null, deltaMt: number | string | null, tLabel: string }): FormGroup {
    const parseFlex = (v: number | string | null): number | null => {
      if (v === null || v === '') return null;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const s = v.replace(',', '.').trim();
        const n = Number(s);
        return isNaN(n) ? null : n;
      }
      return null;
    };
    const raiz = parseFlex(data.raizT);
    const delta = parseFlex(data.deltaMt);
    return this.fb.group({
      // valores inputáveis raizT e deltaMt
      raizT: [raiz, [Validators.required, Validators.min(0)]], 
      deltaMt: [delta, [Validators.required, Validators.min(0)]],
      tLabel: [data.tLabel] 
    });
  }
  // Adiciona uma nova linha
  addDataRow(data?: { raizT: number | string | null, deltaMt: number | string | null, tLabel: string }) {
    const defaultData = data || { 
      raizT: 0, 
      deltaMt: 0, 
      tLabel: `Extra ${this.dataRows.length - this.dadosIniciais.length + 1}` 
    };
    this.dataRows.push(this.createDataRowGroup(defaultData));
  }
  removeDataRow(index: number) {
    // Adiciona uma trava para não permitir remover as linhas de dados obrigatórios
    if (index >= this.dadosIniciais.length) { 
        this.dataRows.removeAt(index);
    } else {
        alert('Não é possível remover dados de ensaios obrigatórios.');
    }
  }
  // Função para Regressão Forçada Pela Origem (b=0)
calculateRegressionThroughOrigin(points: [number, number][]): number {
    let sumXY = 0;
    let sumXX = 0;
    for (const p of points) {
        sumXY += p[0] * p[1]; // Soma de x * y
        sumXX += p[0] * p[0]; // Soma de x * x
    }
    if (sumXX === 0) {
        return 0; // Evita divisão por zero
    }
    return sumXY / sumXX; // m = (Soma XY) / (Soma X²)
}

calculateAndDrawRegression(): void {
    const rawData = this.dataRows.value;
    const AW_INTERCEPTO_FIXO = 0.8807; // Mantemos a constante para o cálculo final do Aw Lab
    
    // 1. Extração de Dados
    const todosOsPontos: DataPoint[] = rawData
        .filter((row: any) => parseFloat(row.raizT) > 0 && parseFloat(row.deltaMt) >= 0)
        .map((row: any) => ({ x: parseFloat(row.raizT), y: parseFloat(row.deltaMt) }));

    if (todosOsPontos.length < 2) { 
        // Lógica de limpeza em caso de erro/poucos dados
        this.awCalculado = null;
        this.bIntercepto = null;
        this.r2Calculado = null;
        this.awLaboratorioCalculado = null;
        if (this.chartInstance) this.chartInstance.destroy();
        this.renderChart(todosOsPontos, []);
        return;
    }

    // 2. DEFINIR DADOS PARA REGRESSÃO
    // Usa todos os pontos exceto o 5min para obter a linha 15.44x
    const dadosParaRegressao = todosOsPontos;
    const dataForRegression: [number, number][] = dadosParaRegressao.map(p => [p.x, p.y]);
    
    // --- 3. CÁLCULO ESTATÍSTICO (REGRESSÃO NORMAL - LINHA DE TENDÊNCIA) ---
    // Esta regressão calcula o melhor 'm' (15.44) e o melhor 'b' (-0.337)
    const regression = linearRegression(dataForRegression);
    const lineFunction = linearRegressionLine(regression);
    
    // VARIÁVEIS PARA A ANOTAÇÃO DO GRÁFICO:
    this.awCalculado = regression.m;  
    this.bIntercepto = regression.b; 

    const interceptoB = regression.b; 
    this.r2Calculado = rSquared(dataForRegression, lineFunction);

    // --- 4. CÁLCULO Aw PELA FÓRMULA DO EXCEL/LABORATÓRIO (VALOR FINAL) ---
    
    const pontoMaximo = todosOsPontos.reduce((max, p) => {
        if (p.x > max.x) return p;
        if (p.x === max.x && p.y > max.y) return p;
        return max;
    }, todosOsPontos[0]); 
    
    const deltaM_max = pontoMaximo.y;
    const raizT_max = pontoMaximo.x;     
  
    // Fórmula final do laboratório: Aw = (Máximo Delta M - Coeficiente Fixo) / Máxima Raiz t
    if (raizT_max > 0) {
        this.awLaboratorioCalculado = (deltaM_max - AW_INTERCEPTO_FIXO) / raizT_max; 
    } else {
        this.awLaboratorioCalculado = 0;
    }
    
    // 5. Gerar pontos da Linha (usa a Regressão Normal para desenhar)
    const xMin = 0; 
    const xMax = raizT_max + 0.1;

    const regressionLineData = [
        // A linha começa no intercepto normal (-0.337)
        { x: xMin, y: interceptoB }, 
        { x: xMax, y: lineFunction(xMax) } 
    ];

    // 6. Renderizar o Gráfico
    this.renderChart(todosOsPontos, regressionLineData);
}

renderChart(todosOsPontos: DataPoint[], regressionLineData: DataPoint[]) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    
    // 1. DADOS PROTEGIDOS PARA FORMATAÇÃO
    const m = this.awLaboratorioCalculado ?? 0; 
    const b = this.bIntercepto ?? 0; 
    let equacaoFormatada: string;

    // Garante que o cálculo Aw da Inclinação seja válido
    if (this.awLaboratorioCalculado !== null && !isNaN(this.awLaboratorioCalculado)) {
        equacaoFormatada = `f(x) = ${m.toFixed(8)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(4)}`;
    } else {
        equacaoFormatada = 'f(x) = Cálculo Indisponível';
    }
    
    // 2. CÁLCULO DE POSICIONAMENTO PROTEGIDO
    let xPos = 0.5; // Valor padrão seguro
    let yPos = 25.0; // Valor padrão seguro (topo do gráfico)
    let regressionDataLabel = 'Linha de Tendência Linear'; // Rótulo padrão

    if (todosOsPontos.length >= 2) {
        const primeiroPonto = todosOsPontos[0];
        const ultimoPonto = todosOsPontos[todosOsPontos.length - 1];

        // Centraliza o rótulo da anotação entre o primeiro e último ponto
        xPos = (primeiroPonto.x + ultimoPonto.x) / 6;
        yPos = ultimoPonto.y * 0.90; // 90% do Delta M máximo (para posicionar no topo)
    }

    // Rótulo da linha de tendência (Usamos o Aw Lab para exibir o resultado final)
    if (this.awLaboratorioCalculado !== null && this.awLaboratorioCalculado !== undefined) {
        regressionDataLabel = `Linha de Tendência Linear (Aw=${this.awLaboratorioCalculado.toFixed(2)})`;
    }

    // 3. DEFINIR O OBJETO DE CONFIGURAÇÃO DO GRÁFICO
    const config: any = { 
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Pontos Experimentais',
                    data: todosOsPontos, 
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    pointRadius: 5,
                    pointStyle: 'circle'
                },
                // Dataset 2: Linha de Regressão
                {
                    label: regressionDataLabel,
                    data: regressionLineData,
                    type: 'line', 
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    showLine: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0 // Desabilita animação para melhor exportação
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                 x: {
                     type: 'linear', 
                     title: { display: true, text: 'Raiz t (h¹/²)' },
                     grid: {
                         display: true,
                         color: 'rgba(0, 0, 0, 0.1)',
                         lineWidth: 1,
                         drawOnChartArea: true,
                         drawTicks: true
                     },
                     ticks: {
                         display: true,
                         color: '#666'
                     }
                 },
                 y: {
                     type: 'linear', 
                     title: { display: true, text: 'Δm (kg/m²)' }, 
                     beginAtZero: true,
                     grid: {
                         display: true,
                         color: 'rgba(0, 0, 0, 0.1)',
                         lineWidth: 1,
                         drawOnChartArea: true,
                         drawTicks: true
                     },
                     ticks: {
                         display: true,
                         color: '#666'
                     }
                 }
             },
            plugins: {
                legend:{
                  display:true,
                  position: 'top'
                },
                tooltip:{
                  mode: 'index',
                  intersect: false
                },
                annotation: {
                    annotations: {
                        formulaLabel: {
                            type: 'label',
                            xValue: xPos, 
                            yValue: yPos, 
                            content: equacaoFormatada,
                            font: { size: 14, weight: 'bold' },
                            color: 'green',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: 'green',
                            padding: 8
                        }
                    }
                }
            }
        }
    };

    // 4. ATUALIZAR/CRIAR GRÁFICO
    if (this.chartInstance) {
        this.chartInstance.data = config.data;
        this.chartInstance.options = config.options;
        this.chartInstance.update();
    } else {
        this.chartInstance = new Chart(ctx!, config);
    }
}

/**
 * Gera uma imagem PNG do gráfico atual e salva no banco de dados
 */
gerarESalvarImagemGrafico(): void {
  if (!this.chartInstance) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Nenhum gráfico disponível para capturar. Por favor, gere o gráfico primeiro.'
    });
    return;
  }

  if (!this.analise?.amostra_detalhes?.id) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Amostra não identificada. Não é possível salvar a imagem.'
    });
    return;
  }

  this.salvandoImagemGrafico = true;

  try {
    // Gerar imagem JPEG do gráfico
    const canvas = this.chartRef.nativeElement;
    
    // Forçar re-renderização para garantir que as linhas de grade estejam visíveis
    if (this.chartInstance) {
      this.chartInstance.update('none'); // Update sem animação
    }
    
    // Aguardar a renderização completa do gráfico incluindo linhas de grade
    setTimeout(() => {
      try {
        // Converter canvas para blob PNG
        canvas.toBlob((blob: Blob | null) => {
          if (!blob) {
            this.salvandoImagemGrafico = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao gerar imagem do gráfico.'
            });
            return;
          }

          // Criar FormData para envio
          const formData = new FormData();
          
          // Gerar nome descritivo para o arquivo
          const timestamp = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
          const nomeArquivo = `grafico-capilaridade-${timestamp}.png`;
          
          // Adicionar arquivo ao FormData
          formData.append('images', blob, nomeArquivo);
          
          // Adicionar descrição detalhada
          const descricao = this.gerarDescricaoGrafico();
          formData.append('descricoes', descricao);

          // Enviar para o servidor
          this.amostraService.uploadImagens(this.analise.amostra_detalhes.id, formData).subscribe({
            next: (response) => {
              this.salvandoImagemGrafico = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Imagem do gráfico salva com sucesso!'
              });
              
              // Atualizar lista de imagens se estiver visualizando
              if (this.modalImagensVisible && this.amostraImagensSelecionada) {
                this.carregarImagensAmostra(this.amostraImagensSelecionada.id);
              }
            },
            error: (error) => {
              this.salvandoImagemGrafico = false;
              console.error('Erro ao salvar imagem do gráfico:', error);
              
              if (error.status === 401) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro de Autenticação',
                  detail: 'Sessão expirada. Faça login novamente.'
                });
              } else if (error.status === 413) {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Arquivo muito grande',
                  detail: 'A imagem gerada é muito grande. Tente reduzir a resolução.'
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: 'Falha ao salvar imagem do gráfico. Tente novamente.'
                });
              }
            }
          });
        }, 'image/png', 0.95); // Qualidade 95% para PNG
      } catch (error) {
        this.salvandoImagemGrafico = false;
        console.error('Erro ao converter gráfico para imagem:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao processar imagem do gráfico.'
        });
      }
    }, 800); // Aguardar 800ms para garantir renderização completa das linhas de grade
    
  } catch (error) {
    this.salvandoImagemGrafico = false;
    console.error('Erro geral ao gerar imagem:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro inesperado ao gerar imagem do gráfico.'
    });
  }
}

/**
 * Gera descrição detalhada do gráfico para salvar junto com a imagem
 */
private gerarDescricaoGrafico(): string {
  const dados = this.dataRows.value || [];
  const pontosValidos = dados.filter((row: any) => 
    parseFloat(row.raizT) > 0 && parseFloat(row.deltaMt) >= 0
  );

  let descricao = `Gráfico de Absorção de Água por Capilaridade\n`;
  descricao += `Data de geração: ${new Date().toLocaleString('pt-BR')}\n`;
  descricao += `Amostra: ${this.analise?.amostra_detalhes?.numero || 'N/A'}\n`;
  descricao += `Formato: PNG (Qualidade 95%)\n\n`;
  
  // Informações dos resultados calculados
  if (this.awLaboratorioCalculado !== null) {
    descricao += `Coeficiente Aw (Laboratório): ${this.awLaboratorioCalculado.toFixed(4)}\n`;
  }
  if (this.awCalculado !== null) {
    descricao += `Inclinação da linha: ${this.awCalculado.toFixed(4)}\n`;
  }
  if (this.bIntercepto !== null) {
    descricao += `Intercepto: ${this.bIntercepto.toFixed(4)}\n`;
  }
  if (this.r2Calculado !== null) {
    descricao += `R²: ${this.r2Calculado.toFixed(4)}\n`;
  }
  
  descricao += `\nPontos experimentais utilizados: ${pontosValidos.length}\n`;
  
  // Adicionar dados dos pontos se não for muitos
  if (pontosValidos.length <= 10) {
    descricao += `\nDados experimentais:\n`;
    pontosValidos.forEach((ponto: any, index: number) => {
      descricao += `${ponto.tLabel}: Raiz t = ${ponto.raizT}, Δm = ${ponto.deltaMt}\n`;
    });
  }

  return descricao;
}

/**
 * Download direto da imagem do gráfico (sem salvar no banco)
 */
downloadImagemGrafico(): void {
  if (!this.chartInstance) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Nenhum gráfico disponível para download.'
    });
    return;
  }

  try {
    const canvas = this.chartRef.nativeElement;
    const timestamp = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `grafico-capilaridade-${timestamp}.png`;

    // Forçar re-renderização para garantir linhas de grade visíveis
    if (this.chartInstance) {
      this.chartInstance.update('none');
    }

    // Aguardar renderização e criar link de download
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = nomeArquivo;
      link.href = canvas.toDataURL('image/png', 0.95);
      
      // Triggerar download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.messageService.add({
        severity: 'success',
        summary: 'Download iniciado',
        detail: 'Imagem do gráfico baixada com sucesso!'
      });
    }, 200); // Pequeno delay para garantir renderização
  } catch (error) {
    console.error('Erro ao fazer download da imagem:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao baixar imagem do gráfico.'
    });
  }
}


//===========================================================================
  getDigitadorInfo(): void {
  this.colaboradorService.getColaboradorInfo().subscribe(
    data => {
      this.digitador = data.nome;
      // Verificar se o nome do usuário logado está na lista de responsáveis
      const responsavelEncontrado = this.responsaveis.find(r => r.value === data.nome);
      // Preencher o campo digitador e responsável em todos os ensaios já carregados
      this.analisesSimplificadas[0]?.planoDetalhes.forEach((plano: any) => {
        plano.ensaio_detalhes?.forEach((ensaio: any) => {
          ensaio.digitador = this.digitador;
          // NOVO: Definir responsável automaticamente se não estiver definido
          if (!ensaio.responsavel && responsavelEncontrado) {
            ensaio.responsavel = responsavelEncontrado.value;
          }
        });
        plano.calculo_ensaio_detalhes?.forEach((calc: any) => {
          calc.digitador = this.digitador;
          // Definir responsável automaticamente para cálculos se não estiver definido
          if (!calc.responsavel && responsavelEncontrado) {
            calc.responsavel = responsavelEncontrado.value;
          }
          //  mostrar também nos ensaios de cálculo:
          calc.ensaios_detalhes?.forEach((calc: any) => {
            calc.digitador = this.digitador;
            if (!calc.responsavel && responsavelEncontrado) {
              calc.responsavel = responsavelEncontrado.value;
            }
          });
        });
      });
    },
    error => {
      this.digitador = null;
    }
  );
}

 private configurarFuncoesBitwiseSeguras() {
    // Criar instância personalizada do MathJS com funções bitwise seguras
    this.mathjs = create(all, {});
    
    // Sobrescrever funções bitwise para lidar com decimais
    this.mathjs.import({
      bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
      bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
      bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
      bitNot: (a: number) => ~Math.trunc(a)
    }, { override: true });
  }

  // Método de evaluate seguro para usar em toda a aplicação
  private evaluateSeguro(expressao: string, escopo?: any): any {
    return this.mathjs.evaluate(expressao, escopo);
  }
//===============================GET ANALISE==================================
  getAnalise(): void {
    if (this.analiseId !== undefined) {
      this.analiseService.getAnaliseById(this.analiseId).subscribe(
        (analise) => {
          this.analise = analise;
          // Mapear campos snake_case do backend para camelCase usados no front
          if (this.analise) {
            (this.analise as any).metodoModelagem = (this.analise as any).metodoModelagem ?? (this.analise as any).metodo_modelagem ?? '';
            (this.analise as any).metodoMuro = (this.analise as any).metodoMuro ?? (this.analise as any).metodo_muro ?? '';
            (this.analise as any).observacoesMuro = (this.analise as any).observacoesMuro ?? (this.analise as any).observacoes_muro ?? '';
          }
          this.idAnalise = analise.id;
          this.loadAnalisePorId(analise);
          // Forçar detecção de mudanças após atualização dos dados
          this.cd.detectChanges();
          this.cd.markForCheck();
          // Caso loadAnalisePorId seja assíncrona, garantir detecção após ela também
          setTimeout(() => {
            this.cd.detectChanges();
            this.cd.markForCheck();
          }, 0);
          //AQUI CARREGOU
          this.menuArgamassa = this.getItensArgamassa(analise);
        },
        (error) => {
          // console.error('Erro ao buscar análise:', error);
        }
      );
    }

  }
/////////==========CONSULTAR GARANTIA POR PRODUTO ===========///////////////////////////////////////
  consultarGarantia(): void{
    this.modalGarantiasVisible = true;
    this.amostraService.consultarGarantiaPorProduto(this.produtoId).subscribe(
      response => {
        this.garantias = response;
      },
      error => {
        console.log('Erro ao carregar garantias de produto:', error);
      }
    )
  }

//================================= GET ANÁLISE POR ID ===========================
loadAnalisePorId(analise: any) {  
  this.produtoId = analise.amostra_detalhes.produto_amostra_detalhes?.id || null;
  if (!analise || !analise.amostra_detalhes) {
    this.analisesSimplificadas = [];
    return;
  }
  // Garantir que os campos camelCase estejam sincronizados com os snake_case do backend
  try {
    if (this.analise) {
      (this.analise as any).metodoModelagem = (this.analise as any).metodoModelagem ?? (this.analise as any).metodo_modelagem ?? '';
      (this.analise as any).metodoMuro = (this.analise as any).metodoMuro ?? (this.analise as any).metodo_muro ?? '';
      (this.analise as any).observacoesMuro = (this.analise as any).observacoesMuro ?? (this.analise as any).observacoes_muro ?? '';
    }
  } catch {}
  let planoDetalhes: any[] = [];
  const isOrdemExpressa = analise.amostra_detalhes.expressa_detalhes !== null;
  const isOrdemNormal = analise.amostra_detalhes.ordem_detalhes !== null;
  let detalhesOrdem: any = {};
  let ensaioDetalhes: any[] = [];
  let calculoDetalhes: any[] = [];
  
  if (isOrdemExpressa) {
    // Processar dados da ordem expressa
    const expressaDetalhes = analise.amostra_detalhes.expressa_detalhes;
    detalhesOrdem = {
      id: expressaDetalhes.id,
      numero: expressaDetalhes.numero,
      data: expressaDetalhes.data,
      responsavel: expressaDetalhes.responsavel,
      digitador: expressaDetalhes.digitador,
      classificacao: expressaDetalhes.classificacao,
      tipo: 'EXPRESSA'
    };
    ensaioDetalhes = expressaDetalhes.ensaio_detalhes || [];
    calculoDetalhes = expressaDetalhes.calculo_ensaio_detalhes || [];
    this.planoEnsaioId = null;
  } else if (isOrdemNormal) {
    // Processar dados da ordem normal
    const ordemDetalhes = analise.amostra_detalhes.ordem_detalhes;
    planoDetalhes = ordemDetalhes.plano_detalhes || [];
    detalhesOrdem = {
      id: ordemDetalhes.id,
      numero: ordemDetalhes.numero,
      data: ordemDetalhes.data,
      responsavel: ordemDetalhes.responsavel,
      digitador: ordemDetalhes.digitador,
      classificacao: ordemDetalhes.classificacao,
      planoAnalise: planoDetalhes[0]?.descricao,
      planoId: planoDetalhes[0]?.id,
      tipo: 'NORMAL'
    };
    ensaioDetalhes = planoDetalhes[0]?.ensaio_detalhes || [];
    calculoDetalhes = planoDetalhes[0]?.calculo_ensaio_detalhes || [];
    this.planoEnsaioId = planoDetalhes[0]?.id || null;
  } else {
    this.analisesSimplificadas = [];
    return;
  }
  // CORREÇÃO: Buscar dados salvos tanto em ultimo_ensaio quanto em ensaios_detalhes
  let dadosSalvos: any[] = [];
  
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados) {
    dadosSalvos = analise.ultimo_ensaio.ensaios_utilizados;
  } else if (analise.ensaios_detalhes && analise.ensaios_detalhes.length > 0) {
    // Buscar o último registro de ensaios salvos
    const ultimoEnsaioSalvo = analise.ensaios_detalhes
      .sort((a: any, b: any) => b.id - a.id)[0]; // Pegar o mais recente
    
    if (ultimoEnsaioSalvo && ultimoEnsaioSalvo.ensaios_utilizados) {
      // Parse do JSON se necessário
      dadosSalvos = typeof ultimoEnsaioSalvo.ensaios_utilizados === 'string' 
        ? JSON.parse(ultimoEnsaioSalvo.ensaios_utilizados)
        : ultimoEnsaioSalvo.ensaios_utilizados;
    }
  }
    
  if (dadosSalvos.length > 0 && ensaioDetalhes.length > 0) {
    const ultimoUtilizados = dadosSalvos;
    ensaioDetalhes = ensaioDetalhes.map((ensaio: any) => {
      const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));          
      // Buscar valor pré-cadastrado nas variáveis do ensaio
      let valorPreCadastrado = null;
      if (ensaio.variavel_detalhes && ensaio.variavel_detalhes.length > 0) {
        // Procurar por uma variável que tenha valor diferente de 0/null
        const variavelComValor = ensaio.variavel_detalhes.find((v: any) => 
          v.valor !== null && v.valor !== undefined && v.valor !== 0 && v.valor !== ''
        );
        if (variavelComValor) {
          valorPreCadastrado = variavelComValor.valor;
        }
      }

      // Se não há dados salvos mas o ensaio tem valor pré-cadastrado, usar esse valor
      let valorFinal = 0; // Valor padrão      
      if (valorRecente) {
        // Prioridade 1: Dados salvos anteriormente na análise
        valorFinal = valorRecente.valor;
      } else if (valorPreCadastrado !== null) {
        // Prioridade 2: Valor pré-cadastrado nas variáveis do ensaio
        valorFinal = valorPreCadastrado;
      } else {
        // Prioridade 3: Sem valor (0 ou vazio)
        valorFinal = 0;
      }
      // Mapear responsável salvo para o objeto do dropdown, se existir
      const respDiretoSalvo = valorRecente?.responsavel || valorRecente?.responsavel1;
      const respDiretoObj = this.responsaveis.find(r => r.value === respDiretoSalvo);

      return {
        ...ensaio,
        valor: valorFinal, // Usa o valor salvo do banco
        numero_cadinho: valorRecente?.numero_cadinho || ensaio.numero_cadinho, //Restaurar número do cadinho
        // manter ngModel como string (optionValue = 'value')
        responsavel: (respDiretoObj?.value) || valorRecente?.responsavel || valorRecente?.responsavel1 || ensaio.responsavel,
        digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
      };
    });
  }
  // 2. Se há dados de ensaios salvos, também carregar as variáveis dos ensaios diretos
  if (dadosSalvos.length > 0) {
    dadosSalvos.forEach((ensaioSalvo: any) => {
      // Encontra o ensaio correspondente
      const ensaioOriginal = ensaioDetalhes.find((e: any) => String(e.id) === String(ensaioSalvo.id));
        if (ensaioOriginal) {
        // NOVO: Restaurar número do cadinho mesmo para ensaios sem função
        if (ensaioSalvo.numero_cadinho !== undefined && ensaioSalvo.numero_cadinho !== null) {
          ensaioOriginal.numero_cadinho = ensaioSalvo.numero_cadinho;
        }
        // Processar variáveis se for ensaio com função
        if (ensaioOriginal.funcao && Array.isArray(ensaioSalvo.variaveis_utilizadas)) {
          // Cria um mapa por tecnica para lookup rápido
          const mapSalvas: Record<string, any> = {};
          ensaioSalvo.variaveis_utilizadas.forEach((v: any) => {
            if (v.tecnica) mapSalvas[v.tecnica] = v;
          });
          // Atualiza cada variável do ensaio pelo valor correspondente salvo, usando campo tecnica
          ensaioOriginal.variavel_detalhes?.forEach((variavel: any) => {
            if (mapSalvas[variavel.tecnica] !== undefined) {
              const valorSalvo = mapSalvas[variavel.tecnica].valor;
              variavel.valor = valorSalvo;
              // Se for variável de data, inicializar objeto Date
              if (this.isVariavelTipoData(variavel) && valorSalvo) {
                try {
                  let dataObj: Date | null = null;
                  if (typeof valorSalvo === 'string') {
                    if (valorSalvo.includes('/')) {
                      // Formato brasileiro DD/MM/YYYY (local)
                      const [dia, mes, ano] = valorSalvo.split('/');
                      dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                    } else {
                      // Formato ISO local yyyy-mm-dd ou outro
                      dataObj = this.parseDateLocal(valorSalvo);
                    }
                  } else {
                    dataObj = this.parseDateLocal(valorSalvo);
                  }
                  if (dataObj && !isNaN(dataObj.getTime())) {
                    variavel.valorData = dataObj;
                    variavel.valorTimestamp = dataObj.getTime();
                  }
                } catch (error) {
                }
              }
            }
          });
          ensaioOriginal.variavel_detalhes.forEach((v: any, idx: number) => {
          });
        }
      }
    });
  }
  // 3. Processar cálculos (mesmo para ambos os tipos)
  if (calculoDetalhes.length > 0) {
    const calculosDetalhes = analise.calculos_detalhes || [];
    calculoDetalhes = calculoDetalhes.map((calc: any) => {
    const calcBanco = calculosDetalhes
        .filter((c: any) => c.calculos === calc.descricao)
        .sort((a: any, b: any) => b.id - a.id)[0];
    const ensaiosUtilizados = calcBanco?.ensaios_utilizados || calc.ensaios_detalhes || [];

      // Helper local: cria variáveis varNN a partir da função
      const criarVariaveisPorFuncaoLocal = (funcao: string, ensaioDesc: string) => {
        const varMatches = (funcao?.match(/var\d+/g) || []);
        const varList: string[] = Array.from(new Set(varMatches));
        return varList.map((varName, index) => ({
          nome: `${varName} (${ensaioDesc || ''})`.trim(),
          tecnica: varName,
          valor: 0,
          varTecnica: varName,
          id: `${ensaioDesc || 'ensaio'}_${varName}`
        }));
      };

      const aplicarValoresVariaveis = (variavelDetalhes: any[], salvo: any) => {
        if (!Array.isArray(variavelDetalhes)) return [];
        // 1) Array variaveis_utilizadas
        const mapArray: Record<string, any> = {};
        if (Array.isArray(salvo?.variaveis_utilizadas)) {
          salvo.variaveis_utilizadas.forEach((v: any) => {
            if (v && v.tecnica) mapArray[v.tecnica] = v.valor;
          });
        }
        // 2) Objeto variaveis { varNN: {valor, descricao} }
        const mapObj: Record<string, any> = {};
        if (salvo?.variaveis && typeof salvo.variaveis === 'object') {
          Object.keys(salvo.variaveis).forEach(k => {
            const entry = salvo.variaveis[k];
            if (entry) mapObj[k] = entry.valor;
          });
        }
        // 3) Top-level varNN em salvo
        const mapTop: Record<string, any> = {};
        if (salvo) {
          Object.keys(salvo).forEach(k => {
            if (/^var\d+$/.test(k)) mapTop[k] = (salvo as any)[k];
          });
        }
        // Aplicar na lista
        variavelDetalhes.forEach((v: any) => {
          const key = v.tecnica || v.varTecnica || v.nome;
          let valor = undefined;
          if (key in mapArray) valor = mapArray[key];
          else if (key in mapObj) valor = mapObj[key];
          else if (key in mapTop) valor = mapTop[key];
          if (valor !== undefined) {
            // Tratar datas
            if (this.isVariavelTipoData(v)) {
              try {
                let dataObj: Date | null = null;
                if (typeof valor === 'string') {
                  if (valor.includes('/')) {
                    const [dia, mes, ano] = valor.split('/');
                    dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                  } else {
                    dataObj = this.parseDateLocal(valor);
                  }
                } else if (typeof valor === 'number') {
                  const dTmp = this.parseDateLocal(valor);
                  dataObj = isNaN(dTmp?.getTime() || NaN) ? null : dTmp;
                }
                if (dataObj && !isNaN(dataObj.getTime())) {
                  v.valor = this.toLocalYYYYMMDD(dataObj);
                  v.valorData = dataObj;
                  v.valorTimestamp = dataObj.getTime();
                } else {
                  v.valor = valor;
                }
              } catch {
                v.valor = valor;
              }
            } else {
              v.valor = typeof valor === 'number' ? valor : Number(valor);
              if (isNaN(v.valor)) v.valor = valor;
            }
          }
        });
        return variavelDetalhes;
      };

      let novosEnsaios: any[];
      if (ensaiosUtilizados.length) {
        novosEnsaios = ensaiosUtilizados.map((u: any) => {
          const original = (calc.ensaio_detalhes_original || calc.ensaios_detalhes || []).find((e: any) => String(e.id) === String(u.id));
          const responsavelObj = this.responsaveis.find(r => r.value === u.responsavel);
          // construir variavel_detalhes
          let variavelDetalhes = Array.isArray(original?.variavel_detalhes)
            ? original.variavel_detalhes.map((x: any) => ({ ...x }))
            : [];
          const funcaoEnsaio = u.funcao || original?.funcao;
          if ((!variavelDetalhes || variavelDetalhes.length === 0) && funcaoEnsaio) {
            variavelDetalhes = criarVariaveisPorFuncaoLocal(funcaoEnsaio, u.descricao || original?.descricao);
          }
          // aplicar valores salvos
          variavelDetalhes = aplicarValoresVariaveis(variavelDetalhes, u);

          return {
            ...u,
            valor: u.valor,
            // manter como string para o p-select (optionValue='value')
            responsavel: (responsavelObj?.value) || u.responsavel || null,
            digitador: calcBanco?.digitador || this.digitador,
            tempo_previsto: original?.tempo_previsto ?? null,
            tipo_ensaio_detalhes: original?.tipo_ensaio_detalhes ?? null,
            variavel: u.variavel || original?.variavel,
            numero_cadinho: u.numero_cadinho ?? original?.numero_cadinho ?? null,
            variavel_detalhes: variavelDetalhes,
            funcao: funcaoEnsaio || null
          };
        });
      } else {
        // Sem dados salvos: apenas garantir que variavel_detalhes exista a partir da função
        novosEnsaios = (calc.ensaios_detalhes || []).map((e: any) => {
          if (e?.funcao && (!Array.isArray(e.variavel_detalhes) || e.variavel_detalhes.length === 0)) {
            e.variavel_detalhes = criarVariaveisPorFuncaoLocal(e.funcao, e.descricao);
          }
          return e;
        });
      }

      // Responsável do cálculo (nível cálculo)
      const responsavelCalcObj = this.responsaveis.find(r => r.value === (calcBanco?.responsavel || calc.responsavel));

      return {
        ...calc,
        ensaios_detalhes: novosEnsaios,
        resultado: calcBanco?.resultados ?? calc.resultado,
        // manter responsavel no cálculo como string
        responsavel: (responsavelCalcObj?.value) || calcBanco?.responsavel || calc.responsavel || null,
        digitador: calcBanco?.digitador || calc.digitador || this.digitador,
      };
    });
  }
  // Monta estrutura final unificada
  this.analisesSimplificadas = [{
    // Dados da amostra (comum para ambos os tipos)
    amostraId: analise.amostra_detalhes?.id,
    amostraDataEntrada: analise.amostra_detalhes?.data_entrada,
    amostraDataColeta: analise.amostra_detalhes?.data_coleta,
    amostraDigitador: analise.amostra_detalhes?.digitador,
    amostraFornecedor: analise.amostra_detalhes?.fornecedor,
    amostraIdentificacaoComplementar: analise.amostra_detalhes?.identificacao_complementar,
    amostraImagens: analise.amostra_detalhes?.image,
    amostraComplemento: analise.amostra_detalhes?.complemento,
    amostraLocalColeta: analise.amostra_detalhes?.local_coleta,
    amostraMaterial: analise.amostra_detalhes?.material_detalhes?.nome,
    amostraNumero: analise.amostra_detalhes?.numero,
    amostraPeriodoHora: analise.amostra_detalhes?.periodo_hora,
    amostraPeriodoTurno: analise.amostra_detalhes?.periodo_turno,
    amostraRepresentatividadeLote: analise.amostra_detalhes?.representatividade_lote,
    amostraStatus: analise.amostra_detalhes?.status,
    amostraSubtipo: analise.amostra_detalhes?.subtipo,
    amostraTipoAmostra: analise.amostra_detalhes?.tipo_amostra_detalhes?.nome,
    amostraNatureza: analise.amostra_detalhes?.tipo_amostra_detalhes?.natureza,
    amostraTipoAmostragem: analise.amostra_detalhes?.tipo_amostragem,
    amostraProdutoAmostra: analise.amostra_detalhes?.produto_amostra_detalhes?.nome,
    amostraRegistroEmpresa: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_empresa,
    amostraRegistroProduto: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_produto,
    // Estado da análise
    estado: analise.estado,
    // Dados da ordem (unificados)
    ordemId: detalhesOrdem.id,
    ordemNumero: detalhesOrdem.numero,
    ordemData: detalhesOrdem.data,
    ordemResponsavel: detalhesOrdem.responsavel,
    ordemDigitador: detalhesOrdem.digitador,
    ordemClassificacao: detalhesOrdem.classificacao,
    ordemTipo: detalhesOrdem.tipo,
    ordemPlanoAnalise: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
    // Dados dos ensaios e cálculos (unificados)
    planoEnsaios: ensaioDetalhes,
    planoCalculos: calculoDetalhes,
    // Estrutura para compatibilidade com código existente
    planoDetalhes: [{
      id: detalhesOrdem.id,
      descricao: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
      ensaio_detalhes: ensaioDetalhes,
      calculo_ensaio_detalhes: calculoDetalhes,
      tipo: detalhesOrdem.tipo,
      idPlano: detalhesOrdem.planoId || null,
    }]
  }];
  // Inicializar datas após carregar os dados
    setTimeout(() => {
      this.inicializarDatasVariaveis();
      // Inicializar estado salvo após carregar os dados
      this.markAsSaved();
    }, 100);
    
    planoDetalhes.forEach((plano: any) => {
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any, idx: number) => {
        if (!ensaio.variavel) {
          ensaio.variavel = `var${idx}`;
        }
      });
    }
  });
    // Após processar todos os dados, inicializa variáveis dos ensaios diretos (só se não foram carregadas do banco)
    setTimeout(() => {
        this.inicializarVariaveisEnsaios();
        this.mapearEnsaiosParaCalculos();
        // Aplicar responsável padrão (primeiro do histórico, depois usuário logado)
        this.aplicarResponsavelPadrao();
        // O processamento dos ensaios diretos e recálculo dos cálculos deve acontecer após aplicar os valores restaurados
    }, 1000);
  }  

//---------------------------------INICIALIZAÇÃO DE VARIÁVEIS DOS ENSAIOS DIRETOS E MAPEARENSAIOSPARACALCULOS-------------------
inicializarVariaveisEnsaios() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  // Função auxiliar para criar variavel_detalhes a partir dos varX da função
  function criarVariaveisPorFuncao(funcao: string, ensaioDescricao: string) {
    const varMatches = (funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    return varList.map((varName, index) => ({
      nome: `${varName} (${ensaioDescricao})`, // Nome descritivo incluindo o ensaio
      tecnica: varName,
      valor: 0,
      varTecnica: varName,
      id: `${ensaioDescricao}_${varName}` // ID único
    }));
  }
  planoDetalhes.forEach((plano: any, planoIdx: number) => {
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any, ensaioIdx: number) => {
        if (ensaio.funcao) {
          // Só inicializa variáveis se variavel_detalhes não existir ou está vazia
          if (!Array.isArray(ensaio.variavel_detalhes) || ensaio.variavel_detalhes.length === 0) {
            ensaio.variavel_detalhes = criarVariaveisPorFuncao(ensaio.funcao, ensaio.descricao);
          } else {
            // Se já existem variáveis, verificar se têm nomes descritivos adequados
            ensaio.variavel_detalhes.forEach((variavel: any, index: number) => {
              if (!variavel.nome || variavel.nome === variavel.tecnica) {
                variavel.nome = `${variavel.tecnica} (${ensaio.descricao})`;
              }
              if (!variavel.id) {
                variavel.id = `${ensaio.id}_${variavel.tecnica}`;
              }
            });
          }
          // Se a função não contém nenhum varX, mas contém nomes amigáveis, converte para nomes técnicos
          const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
          const varList: string[] = Array.from(new Set(varMatches));
          if (varList.length === 0 && Array.isArray(ensaio.variavel_detalhes)) {
            let funcaoConvertida = ensaio.funcao;
            ensaio.variavel_detalhes.forEach((variavel: any) => {
              if (variavel.nome && variavel.tecnica) {
                // Substitui todas as ocorrências do nome amigável pelo nome técnico
                const regex = new RegExp(variavel.nome, 'g');
                funcaoConvertida = funcaoConvertida.replace(regex, variavel.tecnica);
              }
            });
            // Se converteu pelo menos um nome, atualiza a função
            if (funcaoConvertida !== ensaio.funcao) {
              ensaio.funcao = funcaoConvertida;
            }
          }
        }
      });
    }
  });
}
// Mapeia o tipo (ou descrição) do ensaio para uma classe de cor
getClasseTipoEnsaio(ensaio: any): string | undefined {
    if (!ensaio) return undefined;
    const tipo = (ensaio.tipo || ensaio.tipo_ensaio_detalhes?.nome || ensaio.descricao || '').toString().toLowerCase();
    if (!tipo) return undefined;
    if (tipo.includes('calculado')) return 'row-tipo-calculado';
    if (tipo.includes('informativo')) return 'row-tipo-informativo';
    if (tipo.includes('fator')) return 'row-tipo-fator';
    if (tipo.includes('composto')) return 'row-tipo-composto';
    if (tipo.includes('data') || tipo.includes('data')) return 'row-tipo-data';
    return undefined;
  }
  ////====================== drag and drop para ensaios=======================================
  onDragStart(event: DragEvent, ensaio: any, index: number, plano: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify({ index, type: 'ensaio', planoId: plano.id }));
    // Fechar todas as linhas expandidas
    plano.ensaio_detalhes.forEach((e: any) => e.expanded = false);
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent, targetEnsaio: any, targetIndex: number, plano: any) {
    event.preventDefault(); 
    try {
      const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
      if (data.type !== 'ensaio' || data.planoId !== plano.id) {
        return;
      }
      const sourceIndex = data.index;
      if (sourceIndex === targetIndex) {
        return;
      }
      // Criar nova ordem
      const newArray = [...plano.ensaio_detalhes];
      const [movedItem] = newArray.splice(sourceIndex, 1);
      newArray.splice(targetIndex, 0, movedItem);
      // Atualizar o array
      plano.ensaio_detalhes = newArray;
      this.cd.detectChanges();
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: `Ensaio movido da posição ${sourceIndex + 1} para ${targetIndex + 1}` 
      });
    } catch (e) {
      // console.error('Erro no drop:', e);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Falha ao reordenar ensaio' 
      });
    }
  }
  /**
   * Implementação de drag and drop para cálculos
   * @param event - Evento de drag
   * @param calculo - Objeto do cálculo sendo arrastado
   * @param index - Índice do cálculo na lista
   * @param plano - Plano que contém o cálculo
   */
  onDragStartCalculo(event: DragEvent, calculo: any, index: number, plano: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify({ index, type: 'calculo', planoId: plano.id }));
    // Fechar todas as linhas expandidas
    plano.calculo_ensaio_detalhes.forEach((c: any) => c.expanded = false);
  }
  onDropCalculo(event: DragEvent, targetCalculo: any, targetIndex: number, plano: any) {
    event.preventDefault();
    try {
      const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
      if (data.type !== 'calculo' || data.planoId !== plano.id) {
        return;
      }
      const sourceIndex = data.index;
      if (sourceIndex === targetIndex) {
        return;
      }
      // Criar nova ordem
      const newArray = [...plano.calculo_ensaio_detalhes];
      const [movedItem] = newArray.splice(sourceIndex, 1);
      newArray.splice(targetIndex, 0, movedItem);
      // Atualizar o array
      plano.calculo_ensaio_detalhes = newArray;      
      this.cd.detectChanges();
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: `Cálculo movido da posição ${sourceIndex + 1} para ${targetIndex + 1}` 
      });
    } catch (e) {
      // console.error('Erro no drop (cálculo):', e);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Falha ao reordenar cálculo' 
      });
    }
  }
  /**
   * Drag-and-drop para reordenar ensaios internos dentro de um cálculo
   * @param event - Evento de drag
   * @param ensaio - Ensaio sendo arrastado
   * @param index - Índice do ensaio
   * @param calc - Cálculo que contém o ensaio
   * @param plano - Plano que contém o cálculo
   */
  onDragStartEnsaioInterno(event: DragEvent, ensaio: any, index: number, calc: any, plano: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify({ type: 'ensaioInterno', index, calcId: calc?.id, planoId: plano?.id }));
  }
  onDropEnsaioInterno(event: DragEvent, targetEnsaio: any, targetIndex: number, calc: any, plano: any) {
    event.preventDefault();
    try {
      const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
      if (data.type !== 'ensaioInterno' || data.calcId !== calc?.id || data.planoId !== plano?.id) {
        return;
      }
      const sourceIndex = data.index;
      if (typeof sourceIndex !== 'number' || typeof targetIndex !== 'number' || !Array.isArray(calc?.ensaios_detalhes)) {
        return;
      }
      if (sourceIndex === targetIndex) return;
      const newArray = [...calc.ensaios_detalhes];
      const [movedItem] = newArray.splice(sourceIndex, 1);
      newArray.splice(targetIndex, 0, movedItem);
      calc.ensaios_detalhes = newArray;
      // Forçar atualização e feedback
      this.cd.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Ordem atualizada',
        detail: `Ensaio interno movido da posição ${sourceIndex + 1} para ${targetIndex + 1}`
      });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao reordenar ensaio interno' });
    }
  }
  /**
   * Reordenação de linhas (Ensaios Diretos) - Mantido como fallback
   * @param event - Evento de reordenação do PrimeNG
   * @param plano - Plano que contém os ensaios
   */
  onRowReorderEnsaios(event: any, plano: any) {
    try {      
      if (!plano || !Array.isArray(plano.ensaio_detalhes)) {
        // console.warn('Plano ou ensaio_detalhes inválido');
        return;
      }
      // Temporariamente colapsar todas as linhas expandidas para evitar conflitos
      plano.ensaio_detalhes.forEach((ensaio: any) => {
        ensaio.expanded = false;
      });
      // PrimeNG 19 - usa event.value que contém o array reordenado
      if (event && event.value && Array.isArray(event.value)) {
        plano.ensaio_detalhes = [...event.value];
      } 
      // Fallback para versões anteriores com índices
      else if (
        event &&
        typeof event.dragIndex === 'number' &&
        typeof event.dropIndex === 'number'
      ) {
        // Criar cópia do array
        const newArray = [...plano.ensaio_detalhes];
        // Mover o item
        const draggedItem = newArray.splice(event.dragIndex, 1)[0];
        newArray.splice(event.dropIndex, 0, draggedItem);
        // Atualizar o array
        plano.ensaio_detalhes = newArray;
      }
      else {
        return;
      }
      // Forçar atualização da interface
      this.cd.detectChanges();
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Ordem atualizada', 
        detail: 'Ensaios reordenados com sucesso' 
      });
    } catch (e) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Falha ao reordenar ensaios' 
      });
    }
  }
  /**
   * Reordenação de linhas (Cálculos)
   * @param event - Evento de reordenação do PrimeNG
   * @param plano - Plano que contém os cálculos
   */
  onRowReorderCalculos(event: any, plano: any) {
    try {
      if (!plano || !Array.isArray(plano.calculo_ensaio_detalhes)) {
        return;
      }
      // Temporariamente colapsar todas as linhas expandidas para evitar conflitos
      plano.calculo_ensaio_detalhes.forEach((calculo: any) => {
        calculo.expanded = false;
      });

      // PrimeNG 19 - usa event.value que contém o array reordenado
      if (event && event.value && Array.isArray(event.value)) {
        plano.calculo_ensaio_detalhes = [...event.value];
      } 
      // Fallback para versões anteriores com índices
      else if (
        event &&
        typeof event.dragIndex === 'number' &&
        typeof event.dropIndex === 'number'
      ) {
        // Criar cópia do array
        const newArray = [...plano.calculo_ensaio_detalhes];
        // Mover o item
        const draggedItem = newArray.splice(event.dragIndex, 1)[0];
        newArray.splice(event.dropIndex, 0, draggedItem);
        // Atualizar o array
        plano.calculo_ensaio_detalhes = newArray;
      }
      else {
        return;
      }
      // Forçar atualização da interface
      this.cd.detectChanges();
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Ordem atualizada', 
        detail: 'Cálculos reordenados com sucesso' 
      });
    } catch (e) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Falha ao reordenar cálculos' 
      });
    }
  }
///======================fim drag and drop para ensaios=======================================
  // Filtra os ensaios dentro de um cálculo com base no termo de busca
  getEnsaiosFiltrados(calc: any) {
    const lista = Array.isArray(calc?.ensaios_detalhes) ? calc.ensaios_detalhes : [];
    const termo = (calc?._filtroEnsaios || '').toString().trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((e: any) => {
      const desc = (e?.descricao || '').toString().toLowerCase();
      const und = (e?.unidade || '').toString().toLowerCase();
      const norma = (e?.norma || '').toString().toLowerCase();
      const estado = (e?.estado || '').toString().toLowerCase();
      const resp = (e?.responsavel || '').toString().toLowerCase();
      const cad = (e?.numero_cadinho ?? '').toString().toLowerCase();
      const val = (e?.valor ?? '').toString().toLowerCase();
      return (
        desc.includes(termo) ||
        und.includes(termo) ||
        norma.includes(termo) ||
        estado.includes(termo) ||
        resp.includes(termo) ||
        cad.includes(termo) ||
        val.includes(termo)
      );
    });
  }
  onDescricaoEnsaioChange(ensaio: any): void {
    this.atualizarNomesVariaveisEnsaio(ensaio);
  }
//filtro TABELA  
  filterTable() {
    this.dt1.filterGlobal(this.inputValue,'contains');
  }
  // Verifica se todas as variáveis exigidas por uma função possuem valores numéricos default
  private deveCalcularEnsaioComDefaults(ensaio: any): boolean {
    try {
      if (!ensaio || !ensaio.funcao) return false;
      const tokens: string[] = (ensaio.funcao.match(/var\d+/g) as string[]) || [];
      const uniques: string[] = Array.from(new Set(tokens)) as string[];
      // Caso a função não use variáveis técnicas (varX), mas apenas constantes e/ou outros ensaios,
      // não bloqueie o cálculo aqui. Deixe o fluxo calcular normalmente usando os tokens ensaioNN.
      if (uniques.length === 0) return true;
      // Se houver varX, precisamos ter variáveis detalhadas para checar os defaults
      if (!Array.isArray(ensaio.variavel_detalhes) || ensaio.variavel_detalhes.length === 0) return false;
      // Criar mapa tecnica->valor
      const map: any = {};
      ensaio.variavel_detalhes.forEach((v: any) => {
        const key = v.tecnica || v.varTecnica || v.nome;
        map[key] = v.valor;
      });
      // Todas as técnicas presentes e com número válido (zero é permitido)
      return uniques.every((tk: string) => {
        const val = (map as any)[tk as any];
        const num = typeof val === 'number' ? val : Number(val);
        return !isNaN(num) && val !== null && val !== undefined && val !== '';
      });
    } catch {
      return false;
    }
  }
  // Converte número vindo como string com vírgula ou ponto; se não for número, retorna original
  private parseNumeroFlex(valor: any): any {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const s = valor.replace(',', '.');
      const n = Number(s);
      return isNaN(n) ? valor : n;
    }
    return valor;
  }
  // Arredonda números para 4 casas decimais
  private round2(value: any): number {
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num)) return 0;
    return Math.round(num * 10000) / 10000;
  }
  // Arredonda números para 4 casas decimais (função adicional para clareza)
  private round4(value: any): number {
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num)) return 0;
    return Math.round(num * 10000) / 10000;
  }
  /**
   * Formata números para exibição removendo zeros desnecessários
   * Usado apenas para mostrar o resultado na interface, sem afetar os cálculos internos
   */
  formatForDisplay(value: any): string {
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num)) return '0';
    // Usar até 4 casas decimais, mas remover zeros à direita
    return parseFloat(num.toFixed(4)).toString();
  }
  // Formata valores (timestamp/Date/string) em DD/MM/YYYY para exibição
  formatarDataExibicao(value: any): string {
    if (!value) return '';
    let date: Date | null = null;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      // assume timestamp em ms
      date = new Date(value);
    } else if (typeof value === 'string') {
      const s = value.trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
        const [d, m, y] = s.split('/').map(v => parseInt(v, 10));
        date = new Date(y, m - 1, d);
      } else {
        // tentar parse ISO ou genérico
        const parsed = new Date(s);
        if (!isNaN(parsed.getTime())) date = parsed;
      }
    }
    if (!date || isNaN(date.getTime())) return '';
    try {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    } catch {
      return '';
    }
  }
  // Detecta se o resultado de um cálculo representa uma data
  calcResultadoEhData(calc: any): boolean {
    if (!calc) return false;
    const v = calc.resultado;
    if (!v && v !== 0) return false;
    if (typeof v === 'number') {
      // timestamp após 2000 e antes de 2100
      return v > 946684800000 && v < 4102444800000; // ~ ano 2100
    }
    if (typeof v === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return true;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return true;
    }
    return false;
  }
  // Arredonda números para N casas decimais
  private roundN(value: any, n: number): number {
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num)) return 0;
    const f = Math.pow(10, n);
    return Math.round(num * f) / f;
  }

  // ===== Utilidades de Data (local) =====
  private toLocalYYYYMMDD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  private parseDateLocal(value: any): Date | null {
    if (!value && value !== 0) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof value === 'string') {
      const s = value.trim();
      // DD/MM/YYYY
      const br = s.match(/^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/);
      if (br) {
        const dd = parseInt(br[1], 10);
        const mm = parseInt(br[2], 10);
        const yy = parseInt(br[3], 10);
        const d = new Date(yy, mm - 1, dd);
        return isNaN(d.getTime()) ? null : d;
      }
      // YYYY-MM-DD (tratar como LOCAL, não UTC)
      const isoLocal = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoLocal) {
        const yy = parseInt(isoLocal[1], 10);
        const mm = parseInt(isoLocal[2], 10);
        const dd = parseInt(isoLocal[3], 10);
        const d = new Date(yy, mm - 1, dd);
        return isNaN(d.getTime()) ? null : d;
      }
      // Fallback
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }
  // Normaliza strings removendo acentuação, convertendo para minúsculas e removendo espaços extras
  private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
  // Escapa caracteres especiais para uso seguro em RegExp
  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  // Compara tokens do tipo "ensaioNN" ignorando zeros à esquerda (ensaio7 === ensaio07)
  private tokensIguais(a?: string, b?: string): boolean {
    if (!a || !b) return false;
    const norm = (t: string) => {
      const m = String(t).match(/^ensaio(\d+)$/i);
      if (m) return `ensaio${parseInt(m[1], 10)}`; // remove zeros à esquerda
      return String(t).toLowerCase();
    };
    return norm(a) === norm(b);
  }
  // Garante que cada ensaio direto do plano tenha uma 'tecnica' no formato ensaioNN
  private garantirTecnicasDoPlano(plano: any): void {
    if (!plano || !Array.isArray(plano.ensaio_detalhes)) return;
    plano.ensaio_detalhes.forEach((e: any, idx: number) => {
      if (!e.tecnica || !/^ensaio\d+$/i.test(String(e.tecnica))) {
        e.tecnica = `ensaio${String(idx + 1).padStart(2, '0')}`;
      }
    });
  }
//Obtém o responsável padrão baseado primeiro nos ensaios_utilizados salvos, 
private obterResponsavelPadrao(): string | null {
  // 1. Tentar obter responsável dos ensaios_utilizados salvos
  const responsavelDoHistorico = this.obterResponsavelDoHistorico();
  if (responsavelDoHistorico) {
    return responsavelDoHistorico;
  }
  // 2. Fallback: usar o usuário logado
  if (this.digitador) {
    const responsavelEncontrado = this.responsaveis.find(r => r.value === this.digitador);
    if (responsavelEncontrado) {
      return responsavelEncontrado.value;
    }
  }
  return null;
}
//Busca responsável nos dados salvos (ultimo_ensaio ou ensaios_detalhes)
private obterResponsavelDoHistorico(): string | null {
  try {    
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
      return null;
    }
    const analise = this.analisesSimplificadas[0];
    let dadosSalvos: any[] = [];
    // Buscar em ultimo_ensaio.ensaios_utilizados primeiro
    if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados) {
      dadosSalvos = analise.ultimo_ensaio.ensaios_utilizados;   
    } 
    // Fallback: buscar em ensaios_detalhes
    else if (analise.ensaios_detalhes && analise.ensaios_detalhes.length > 0) {
      const ultimoEnsaioSalvo = analise.ensaios_detalhes
        .sort((a: any, b: any) => b.id - a.id)[0];
      if (ultimoEnsaioSalvo && ultimoEnsaioSalvo.ensaios_utilizados) {
        dadosSalvos = typeof ultimoEnsaioSalvo.ensaios_utilizados === 'string' 
          ? JSON.parse(ultimoEnsaioSalvo.ensaios_utilizados)
          : ultimoEnsaioSalvo.ensaios_utilizados;
      }
    }
    // Procurar primeiro responsável válido nos dados salvos
    if (Array.isArray(dadosSalvos)) {
      for (let i = 0; i < dadosSalvos.length; i++) {
        const ensaio = dadosSalvos[i];
        // Verificar responsavel primeiro
        if (ensaio.responsavel && ensaio.responsavel !== 'N/A' && ensaio.responsavel !== '') {
          return ensaio.responsavel;
        }
        // NOVO: Verificar responsavel1 como fallback
        if (ensaio.responsavel1 && ensaio.responsavel1 !== 'N/A' && ensaio.responsavel1 !== '') {
          return ensaio.responsavel1;
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}
//Aplica o responsável padrão em todos os ensaios e cálculos que não têm responsável definido
aplicarResponsavelPadrao(): void {  
  const responsavelPadrao = this.obterResponsavelPadrao();
  if (!responsavelPadrao) {
      return;
  }
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
    return;
  }
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  // Aplicar responsável nos ensaios diretos
  planoDetalhes.forEach((plano: any, planoIndex: number) => { 
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any, ensaioIndex: number) => {
        if (!ensaio.responsavel || ensaio.responsavel === 'N/A' || ensaio.responsavel === '' || ensaio.responsavel === null || ensaio.responsavel === undefined) {
          ensaio.responsavel = responsavelPadrao;
        }
      });
    }
    // Aplicar responsável nos cálculos
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any, calcIndex: number) => {      
        if (!calc.responsavel || calc.responsavel === 'N/A' || calc.responsavel === '' || calc.responsavel === null || calc.responsavel === undefined) {
          calc.responsavel = responsavelPadrao;
        } 
        // Aplicar responsável nos ensaios dos cálculos
        if (calc.ensaios_detalhes) {
          calc.ensaios_detalhes.forEach((ensaioCalc: any, ensaioCalcIndex: number) => {
            if (!ensaioCalc.responsavel || ensaioCalc.responsavel === 'N/A' || ensaioCalc.responsavel === '' || ensaioCalc.responsavel === null || ensaioCalc.responsavel === undefined) {
              ensaioCalc.responsavel = responsavelPadrao;
            }
          });
        }
      });
    }
  });   
  // Forçar detecção de mudanças
  this.cd.detectChanges();
}
  loadPlanosAnalise() {
    this.ensaioService.getPlanoAnalise().subscribe(
      response => {
        this.planosAnalise = response;
      },
      error => {
      }
    );
  }
  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }
      , error => {
      }
    )
  }
gerarNumero(materialNome: string, sequencial: number): string {
  const ano = new Date().getFullYear().toString().slice(-2); // Ex: '25'
  const sequencialFormatado = sequencial.toString().padStart(6, '0'); // Ex: '000008'
  // Formata como 08.392 ( ajusta conforme a lógica sequencial)
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' -> '392' 
  return `${materialNome}${ano} ${parte1}.${parte2}`;
}
formatarDatas(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string' && this.isDate(value)) {
        obj[key] = this.datePipe.transform(value, 'dd/MM/yyyy');
      } else if (typeof value === 'object' && value !== null) {
        this.formatarDatas(value); // Formatar objetos aninhados recursivamente
      }
    }
  }
}
isDate(value: string): boolean {
  return !isNaN(Date.parse(value));
}
isOrdemExpressa(analise: any): boolean {
  return analise?.amostra_detalhes?.expressa_detalhes !== null;
}
isOrdemNormal(analise: any): boolean {
  return analise?.amostra_detalhes?.ordem_detalhes !== null;
}
// Método auxiliar para obter dados da ordem (normal ou expressa)
getOrdemData(analise: any): any {
  if (this.isOrdemExpressa(analise)) {
    return {
      detalhes: analise.amostra_detalhes.expressa_detalhes,
      tipo: 'EXPRESSA'
    };
  } else if (this.isOrdemNormal(analise)) {
    return {
      detalhes: analise.amostra_detalhes.ordem_detalhes,
      tipo: 'NORMAL'
    };
  }
  return null;
}
//========================================= GESTÃO DE IMAGENS =========================
visualizarImagens(amostraId: any): void {
  this.amostraImagensSelecionada = amostraId;
  this.carregarImagensAmostra(amostraId);
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
deletarImagem(imageId: number): void {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja deletar esta imagem?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.amostraService.deleteImagem(this.amostraImagensSelecionada.id, imageId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Imagem deletada com sucesso!'
          });
          this.carregarImagensAmostra(this.amostraImagensSelecionada.id);
        },
        error: (error) => {
          console.error('Erro ao deletar imagem:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar imagem.'
          });
        }
      });
    }
  });
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
//========================================= FIM GESTÃO DE IMAGENS =========================

// Método para mapear ensaios para cálculos (garante que cada cálculo tenha os ensaios corretos associados)
  mapearEnsaiosParaCalculos() {
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    planoDetalhes.forEach((plano: any) => {
      // Mantém os ensaios definidos no próprio cálculo (internos).
      // Não substituir por ensaios do plano para preservar independência.
      if (plano.calculo_ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calculo: any) => {
          if (Array.isArray(calculo.ensaios_detalhes)) {
            // Enriquecer ensaios internos com definição (função/variáveis)
            calculo.ensaios_detalhes.forEach((e: any) => {
              // 1) Se não houver função, tentar obter do catálogo ou do próprio plano
              if (!e.funcao) {
                const base = (this.ensaiosDisponiveis || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao))
                           || (plano.ensaio_detalhes || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao));
                if (base?.funcao) {
                  e.funcao = base.funcao;
                }
                if (!e.unidade && base?.unidade) e.unidade = base.unidade;
                // Propagar identificadores para permitir resolução por token (ensaioNN)
                if (!e.tecnica && base?.tecnica) e.tecnica = base.tecnica;
                if (!e.variavel && base?.tecnica) e.variavel = base.tecnica; // compat
                if (!e.id && base?.id) e.id = base.id;
              }
              // Garanta tecnica/variavel/id mesmo quando já existe função/variáveis
              const baseAll = (this.ensaiosDisponiveis || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao))
                           || (plano.ensaio_detalhes || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao));
              if (!e.id && baseAll?.id) e.id = baseAll.id;
              if (!e.tecnica && baseAll?.tecnica) e.tecnica = baseAll.tecnica;
              if (!e.variavel && baseAll?.tecnica) e.variavel = baseAll.tecnica;
              // Se ainda faltar tecnica, derive de id (ensaioNN)
              const idNum = Number(e.id || baseAll?.id);
              if (!e.tecnica && !isNaN(idNum)) {
                e.tecnica = `ensaio${String(idNum).padStart(2, '0')}`;
              }
              if (!e.variavel && e.tecnica) e.variavel = e.tecnica;
              // 2) Inicializa variáveis técnicas a partir da função do ensaio interno
              if (e.funcao && (!Array.isArray(e.variavel_detalhes) || e.variavel_detalhes.length === 0)) {
                const varMatches = (e.funcao.match(/var\d+/g) || []);
                const varList: string[] = Array.from(new Set(varMatches));
                // Tentar nomes/infos do base
                const base = (this.ensaiosDisponiveis || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao))
                           || (plano.ensaio_detalhes || []).find((b: any) => String(b.id) === String(e.id) || this.normalize(b.descricao) === this.normalize(e.descricao));
                const baseVars = Array.isArray(base?.variavel_detalhes) ? base.variavel_detalhes : [];
                // Também garanta técnica/id mesmo quando já havia função
                if (!e.tecnica && base?.tecnica) e.tecnica = base.tecnica;
                if (!e.variavel && base?.tecnica) e.variavel = base.tecnica;
                if (!e.id && base?.id) e.id = base.id;
                e.variavel_detalhes = varList.map((varName: string, idx: number) => {
                  const bv = baseVars[idx];
                  const nomeAmigavel = bv?.nome && !/^var\d+$/.test(bv.nome) ? bv.nome : undefined;
                  const tipo = bv?.tipo;
                  const item: any = {
                    nome: nomeAmigavel || varName,
                    tecnica: varName,
                    varTecnica: varName,
                    id: `${e.descricao || e.id}_${varName}`,
                    valor: 0
                  };
                  if (tipo) item.tipo = tipo;
                  return item;
                });
                // Se base trouxer valores default, use-os
                if (Array.isArray(baseVars) && baseVars.length === e.variavel_detalhes.length) {
                  e.variavel_detalhes.forEach((v: any, i: number) => {
                    const bv = baseVars[i];
                    if (typeof bv?.valor !== 'undefined') v.valor = Number(bv.valor) || 0;
                    if (typeof bv?.valorTimestamp === 'number') v.valorTimestamp = bv.valorTimestamp;
                  });
                }
              }
            });
          }
        });
      }
    });
  }

// ---------------------------CARREGAR ULTIMO RESULTADO GRAVADO---------------/////
// Método para carregar o último resultado gravado da análise atual
  public carregarUltimoResultadoGravado(): void {
    if (!this.analiseId) {
      this.messageService?.add({ severity: 'warn', summary: 'Aviso', detail: 'Nenhuma análise selecionada.' });
      return;
    }
    // Buscar o primeiro cálculo e os ids dos ensaios relacionados
    let calculoNome = '';
    let ensaioIds: any[] = [];
    if (this.analisesSimplificadas.length > 0) {
      const planoDetalhes = this.analisesSimplificadas[0]?.planoDetalhes || [];
      if (planoDetalhes.length > 0 && planoDetalhes[0].calculo_ensaio_detalhes?.length > 0) {
        const calc = planoDetalhes[0].calculo_ensaio_detalhes[0];
        calculoNome = calc.descricao || '';
        ensaioIds = (calc.ensaios_detalhes || []).map((e: any) => e.id);
      }
    }
    if (!calculoNome || !Array.isArray(ensaioIds) || ensaioIds.length === 0) {
      this.messageService?.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível identificar cálculo e ensaios para buscar resultados anteriores.' });
      return;
    }
    this.analiseService?.getResultadosAnteriores(calculoNome, ensaioIds, this.analiseId).subscribe({
      next: (resultados: any[]) => {
        this.processarResultadosAnteriores(resultados, { ensaios_detalhes: [] });
        if (Array.isArray(this.resultadosAnteriores) && this.resultadosAnteriores.length > 0) {
          this.ultimoResultadoGravado = this.resultadosAnteriores[0];
          this.aplicarUltimoResultadoGravado();
        } else {
          this.ultimoResultadoGravado = null;
          this.messageService?.add({ severity: 'info', summary: 'Info', detail: 'Nenhum resultado gravado encontrado.' });
        }
      },
      error: (err: any) => {
        this.ultimoResultadoGravado = null;
        this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar resultados anteriores.' });
        console.error('Erro ao buscar resultados anteriores:', err);
      }
    });
  }
  // Aplica os valores do último resultado gravado nos ensaios e variáveis do modelo
  public aplicarUltimoResultadoGravado(): void {
    if (!this.analisesSimplificadas.length) return;
    const analise0 = this.analisesSimplificadas[0];
    const planoDetalhes = analise0?.planoDetalhes || [];
    // Fonte de dados salvos (flexível): usa ultimoResultadoGravado.ensaiosUtilizados,
    // senão cai para analise0.ultimo_ensaio.ensaios_utilizados, senão analise0.ensaiosUtilizados
    const savedList: any[] = (this.ultimoResultadoGravado?.ensaiosUtilizados && Array.isArray(this.ultimoResultadoGravado.ensaiosUtilizados))
      ? this.ultimoResultadoGravado.ensaiosUtilizados
      : (Array.isArray((analise0 as any)?.ultimo_ensaio?.ensaios_utilizados)
          ? (analise0 as any).ultimo_ensaio.ensaios_utilizados
          : (Array.isArray((analise0 as any)?.ensaiosUtilizados) ? (analise0 as any).ensaiosUtilizados : []));
    // Fonte de dados salvos para cálculos: usa ultimoResultadoGravado.calculosUtilizados ou ultimo_calculo diretamente
    let savedCalculosList: any[] = [];
    // Primeiro tenta buscar nos calculosUtilizados
    if (this.ultimoResultadoGravado?.calculosUtilizados && Array.isArray(this.ultimoResultadoGravado.calculosUtilizados)) {
      savedCalculosList = this.ultimoResultadoGravado.calculosUtilizados;
    }
    // Se não encontrar, tenta buscar no ultimo_calculo diretamente
    else if (this.ultimoResultadoGravado?.ultimo_calculo) {
      savedCalculosList = [this.ultimoResultadoGravado.ultimo_calculo];
    }
    // Senão tenta buscar no analise0.ultimo_calculo
    else if ((analise0 as any)?.ultimo_calculo) {
      savedCalculosList = [(analise0 as any).ultimo_calculo];
    }
    if (!savedList.length && !savedCalculosList.length) return;
    // Atualiza ensaios
    planoDetalhes.forEach((plano: any) => {
      if (plano.ensaio_detalhes) {
        plano.ensaio_detalhes.forEach((ensaio: any) => {
          const ensaioSalvo = savedList.find((e: any) => String(e.id) === String(ensaio.id));
          if (ensaioSalvo) {
            const vFlex = this.parseNumeroFlex(ensaioSalvo.valor);
            ensaio.valor = typeof vFlex === 'number' ? vFlex : (Number(vFlex) || ensaioSalvo.valor);
            if (Array.isArray(ensaio.variavel_detalhes)) {
              if (Array.isArray(ensaioSalvo.variaveis_utilizadas) && ensaioSalvo.variaveis_utilizadas.length > 0) {
                // Garante que cada variavel_detalhes tenha o campo tecnica correto
                // 1. Descobre os nomes técnicos da expressão (varX)
                const varMatches = (ensaio.funcao && ensaio.funcao.match(/var\d+/g)) || [];
                const tecnicaList = Array.from(new Set(varMatches));
                // 2. Atualiza cada variavel_detalhes
                ensaioSalvo.variaveis_utilizadas.forEach((vSalva: any, idx: number) => {
                  let vAtual = null;
                  // Se vier tecnica do backend, usa
                  if (vSalva.tecnica) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.tecnica === vSalva.tecnica);
                  }
                  // Se não vier tecnica, tenta associar pelo nome técnico da expressão
                  if (!vAtual && tecnicaList[idx]) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.tecnica === tecnicaList[idx]);
                    if (vAtual && !vAtual.tecnica) vAtual.tecnica = tecnicaList[idx];
                  }
                  // Se não, tenta por nome
                  if (!vAtual && vSalva.nome) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.nome === vSalva.nome);
                  }
                  // Se não, por ordem
                  if (!vAtual && ensaio.variavel_detalhes[idx]) {
                    vAtual = ensaio.variavel_detalhes[idx];
                  }
                  if (vAtual) {
                    vAtual.valor = vSalva.valor;
                    // Força o campo tecnica se não existir
                    if (!vAtual.tecnica && tecnicaList[idx]) vAtual.tecnica = tecnicaList[idx];
                  }
                });
                // Se houver variáveis extras no array, preenche com o valor do ensaio salvo
                ensaio.variavel_detalhes.forEach((v: any, idx: number) => {
                  if (typeof v.valor === 'undefined' || v.valor === null) v.valor = ensaioSalvo.valor;
                  // Força o campo tecnica se não existir
                  if (!v.tecnica && tecnicaList[idx]) v.tecnica = tecnicaList[idx];
                });
              } else {
                ensaio.variavel_detalhes.forEach((v: any, idx: number) => {
                  v.valor = ensaioSalvo.valor;
                  // Força o campo tecnica se não existir
                  const varMatches = (ensaio.funcao && ensaio.funcao.match(/var\d+/g)) || [];
                  if (!v.tecnica && varMatches[idx]) v.tecnica = varMatches[idx];
                });
              }
            }
          }
        });
      }
      // Atualiza ensaios internos dos cálculos com os últimos valores salvos
      if (Array.isArray(plano.calculo_ensaio_detalhes)) {
        plano.calculo_ensaio_detalhes.forEach((calc: any) => {
          if (!Array.isArray(calc.ensaios_detalhes)) return;
          calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
          const salvo = savedList.find((e: any) =>
              String(e.id) === String(ensaioCalc.id) ||
              this.tokensIguais(e.variavel, ensaioCalc.tecnica || ensaioCalc.variavel) ||
              (e.descricao && ensaioCalc.descricao && this.normalize(e.descricao) === this.normalize(ensaioCalc.descricao))
            );
            if (!salvo) return;
            const vFlexCalc = this.parseNumeroFlex(salvo.valor);
            ensaioCalc.valor = typeof vFlexCalc === 'number' ? vFlexCalc : (Number(vFlexCalc) || salvo.valor);
            // metadata
            if (typeof salvo.numero_cadinho !== 'undefined') ensaioCalc.numero_cadinho = salvo.numero_cadinho;
            if (salvo.responsavel) ensaioCalc.responsavel = salvo.responsavel;
            // Variáveis do ensaio interno
            if (Array.isArray(ensaioCalc.variavel_detalhes)) {
              if (Array.isArray(salvo.variaveis_utilizadas) && salvo.variaveis_utilizadas.length > 0) {
                const varMatchesCalc = (ensaioCalc.funcao && ensaioCalc.funcao.match(/var\d+/g)) || [];
                const tecnicaListCalc = Array.from(new Set(varMatchesCalc));
                salvo.variaveis_utilizadas.forEach((vSalva: any, idx: number) => {
                  let vAtual = null;
                  if (vSalva.tecnica) vAtual = ensaioCalc.variavel_detalhes.find((v: any) => v.tecnica === vSalva.tecnica);
                  if (!vAtual && tecnicaListCalc[idx]) {
                    vAtual = ensaioCalc.variavel_detalhes.find((v: any) => v.tecnica === tecnicaListCalc[idx]);
                    if (vAtual && !vAtual.tecnica) vAtual.tecnica = tecnicaListCalc[idx];
                  }
                  if (!vAtual && vSalva.nome) vAtual = ensaioCalc.variavel_detalhes.find((v: any) => v.nome === vSalva.nome);
                  if (!vAtual && ensaioCalc.variavel_detalhes[idx]) vAtual = ensaioCalc.variavel_detalhes[idx];
                  if (vAtual) {
                    vAtual.valor = vSalva.valor;
                    if (!vAtual.tecnica && tecnicaListCalc[idx]) vAtual.tecnica = tecnicaListCalc[idx];
                  }
                });
                ensaioCalc.variavel_detalhes.forEach((v: any, idx: number) => {
                  if (typeof v.valor === 'undefined' || v.valor === null) v.valor = ensaioCalc.valor;
                  if (!v.tecnica && tecnicaListCalc[idx]) v.tecnica = tecnicaListCalc[idx];
                });
              } else {
                ensaioCalc.variavel_detalhes.forEach((v: any, idx: number) => {
                  v.valor = ensaioCalc.valor;
                  const varMatchesCalc = (ensaioCalc.funcao && ensaioCalc.funcao.match(/var\d+/g)) || [];
                  if (!v.tecnica && varMatchesCalc[idx]) v.tecnica = varMatchesCalc[idx];
                });
              }
            }
          });
        });
      }
    });
    // Aplica dados específicos dos cálculos salvos (ultimo_calculo)
    savedCalculosList.forEach((calculoSalvo: any) => {
      if (Array.isArray(calculoSalvo.ensaios_utilizados)) {
        planoDetalhes.forEach((plano: any) => {
          if (Array.isArray(plano.calculo_ensaio_detalhes)) {
            plano.calculo_ensaio_detalhes.forEach((calc: any) => {
              // Identifica o cálculo correspondente
              const isCalculoCorrespondente = calc.id === calculoSalvo.id || 
                                            calc.descricao === calculoSalvo.descricao ||
                                            calc.calculos === calculoSalvo.calculos;
              if (isCalculoCorrespondente && Array.isArray(calc.ensaios_detalhes)) {
                // Aplica os valores dos ensaios internos salvos
                calculoSalvo.ensaios_utilizados.forEach((ensaioSalvo: any) => {
                  const ensaioInterno = calc.ensaios_detalhes.find((e: any) => 
                    String(e.id) === String(ensaioSalvo.id) ||
                    this.tokensIguais(e.tecnica || e.variavel, ensaioSalvo.variavel) ||
                    (e.descricao && ensaioSalvo.descricao && this.normalize(e.descricao) === this.normalize(ensaioSalvo.descricao))
                  );
                  if (ensaioInterno) {
                    // Aplica valor principal
                    const vFlex = this.parseNumeroFlex(ensaioSalvo.valor);
                    ensaioInterno.valor = typeof vFlex === 'number' ? vFlex : (Number(vFlex) || ensaioSalvo.valor);
                    // Aplica metadata
                    if (typeof ensaioSalvo.numero_cadinho !== 'undefined') ensaioInterno.numero_cadinho = ensaioSalvo.numero_cadinho;
                    if (ensaioSalvo.responsavel) ensaioInterno.responsavel = ensaioSalvo.responsavel;
                    // Aplica variáveis utilizadas
                    if (Array.isArray(ensaioInterno.variavel_detalhes) && Array.isArray(ensaioSalvo.variaveis_utilizadas)) {
                      const varMatches = (ensaioInterno.funcao && ensaioInterno.funcao.match(/var\d+/g)) || [];
                      const tecnicaList = Array.from(new Set(varMatches));
                      ensaioSalvo.variaveis_utilizadas.forEach((vSalva: any, idx: number) => {
                        let vAtual = null;
                        // Busca por técnica
                        if (vSalva.tecnica) {
                          vAtual = ensaioInterno.variavel_detalhes.find((v: any) => v.tecnica === vSalva.tecnica);
                        }
                        // Busca pela técnica da expressão
                        if (!vAtual && tecnicaList[idx]) {
                          vAtual = ensaioInterno.variavel_detalhes.find((v: any) => v.tecnica === tecnicaList[idx]);
                          if (vAtual && !vAtual.tecnica) vAtual.tecnica = tecnicaList[idx];
                        }
                        // Busca por nome
                        if (!vAtual && vSalva.nome) {
                          vAtual = ensaioInterno.variavel_detalhes.find((v: any) => v.nome === vSalva.nome);
                        }
                        // Busca por posição
                        if (!vAtual && ensaioInterno.variavel_detalhes[idx]) {
                          vAtual = ensaioInterno.variavel_detalhes[idx];
                        }
                        if (vAtual) {
                          vAtual.valor = vSalva.valor;
                          if (!vAtual.tecnica && tecnicaList[idx]) vAtual.tecnica = tecnicaList[idx];
                        }
                      });
                      // Preenche variáveis restantes se necessário
                      ensaioInterno.variavel_detalhes.forEach((v: any, idx: number) => {
                        if (typeof v.valor === 'undefined' || v.valor === null) {
                          v.valor = ensaioInterno.valor;
                        }
                        if (!v.tecnica && tecnicaList[idx]) {
                          v.tecnica = tecnicaList[idx];
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });

    // 1. Processa todos os ensaios diretos (atualiza valores)
    this.processarTodosEnsaiosDiretos();

  // 2. (Opcional/Legado) Propaga o valor dos ensaios diretos para os cálculos dependentes
    const analiseData_aplicar = this.analisesSimplificadas[0];
    const planoDetalhes_aplicar = analiseData_aplicar?.planoDetalhes || [];
    planoDetalhes_aplicar.forEach((plano: any) => {
      if (plano.calculo_ensaio_detalhes && plano.ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calc: any) => {
          // Sincroniza valores dos ensaios diretos para os cálculos
          calc.ensaios_detalhes?.forEach((ensaioCalc: any) => {
            const ensaioDireto = plano.ensaio_detalhes.find((e: any) => e.id === ensaioCalc.id || e.tecnica === ensaioCalc.tecnica || e.descricao === ensaioCalc.descricao);
            if (ensaioDireto && typeof ensaioDireto.valor !== 'undefined') {
              ensaioCalc.valor = ensaioDireto.valor;
            }
          });
        });
      }
    });

    // 3. Recalcula todos os cálculos
    this.recalcularTodosCalculos();
    
    // 4. Inicializar datas após aplicar resultados salvos
    setTimeout(() => {
      this.inicializarDatasVariaveis();
    }, 100);
    
    this.cd.detectChanges();
  }
//----------------------------------------PROCESSAMENTO DE RESULTADOS ANTERIORES E REPROCESSAMENTO DE CÁLCULOS-------------------
processarTodosEnsaiosDiretos() {
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    planoDetalhes.forEach((plano: any) => {
      if (plano.ensaio_detalhes) {
        // Usa a rotina que resolve dependências entre ensaios
        this.recalcularTodosEnsaiosDirectos(plano);
      }
    });
  }
recalcularTodosCalculos() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  planoDetalhes.forEach((plano: any) => {
    if (plano.calculo_ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        // Primeiro recalcula as dependências internas entre ensaios do próprio cálculo
        this.recalcularEnsaiosInternosDoCalculo(calc, plano);
        // Agora calcular com os valores atualizados
        this.calcular(calc, plano);
            });
          }
        });
  }
//----------------------------CALCULAR ENSAIOS DIRETOS-----------------------------------------------------------------------
  // Calcula um ensaio direto (ou interno de cálculo) usando suas variáveis técnicas varX
  calcularEnsaioDiretoCorrigido(ensaio: any) {
    if (!ensaio || !ensaio.funcao || !Array.isArray(ensaio.variavel_detalhes)) return;
    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    const safeVars: any = {};
    varList.forEach((varName, idx) => {
      const variavel = ensaio.variavel_detalhes.find((v: any) => v.tecnica === varName || v.nome === varName);
      let valor = 0;
      if (variavel) {
        if (typeof variavel.valorTimestamp === 'number') valor = variavel.valorTimestamp;
        else if (typeof variavel.valor === 'string') {
          const d = new Date(variavel.valor);
          valor = isNaN(d.getTime()) ? Number(variavel.valor) || 0 : d.getTime();
        } else {
          valor = typeof variavel.valor === 'number' ? variavel.valor : Number(variavel.valor) || 0;
        }
      }
      safeVars[varName] = valor;
    });
    const funcoesDatas = {
      adicionarDias: (data: string | number, dias: number) => {
        const dataBase = new Date(data);
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + dias);
        return novaData.getTime();
      },
      diasEntre: (data1: string | number, data2: string | number) => {
        const d1 = new Date(data2);
        const d2 = new Date(data2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      hoje: () => new Date().getTime()
    };
    const funcoesBitwise = {
      bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
      bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
      bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
      bitNot: (a: number) => ~Math.trunc(a)
    };
    const scope = { ...safeVars, ...funcoesDatas, ...funcoesBitwise };
    try {
      const resultado = this.evaluateSeguro(ensaio.funcao, scope);
      if (ensaio.funcao.includes('adicionarDias') || ensaio.funcao.includes('hoje')) {
        if (typeof resultado === 'number' && resultado > 946684800000) {
          const dataResultado = new Date(resultado);
          ensaio.valor = dataResultado.toLocaleDateString('pt-BR');
          ensaio.valorTimestamp = resultado;
        } else {
          ensaio.valor = resultado;
        }
      } else {
        ensaio.valor = (typeof resultado === 'number' && isFinite(resultado)) ? resultado : 0;
      }
    } catch (e) {
      ensaio.valor = 'Erro no cálculo';
    }
  }
//---------------------- CALCULAR (CÁLCULO ENSAIO)-------------------------------------------------------------
  calcular(calc: any, produtoOuPlano?: any) {
  // Antes de avaliar a expressão do cálculo, garanta que os ensaios internos estejam atualizados
  this.recalcularEnsaiosInternosDoCalculo(calc, produtoOuPlano);
    // Plano base apenas como contexto (sem sincronizar valores)
    let planoBase: any | undefined = undefined;
    if (produtoOuPlano && Array.isArray(produtoOuPlano.ensaio_detalhes)) {
      planoBase = produtoOuPlano;
    } else if (produtoOuPlano && Array.isArray(produtoOuPlano.planoEnsaios)) {
      planoBase = { ensaio_detalhes: produtoOuPlano.planoEnsaios };
    } else if (this.analisesSimplificadas?.[0]?.planoDetalhes?.length) {
      const analise0 = this.analisesSimplificadas[0];
      planoBase = analise0.planoDetalhes.find((p: any) => Array.isArray(p.calculo_ensaio_detalhes) && p.calculo_ensaio_detalhes.includes(calc))
                || analise0.planoDetalhes[0];
    }
    if (!calc.ensaios_detalhes || !Array.isArray(calc.ensaios_detalhes)) {
      calc.resultado = 'Sem ensaios para calcular';
      return;
    }
    const varMatches = (calc.funcao.match(/\b(var\d+|ensaio\d+|calculo\d+)\b/g) || []);
    const varList = Array.from(new Set(varMatches)) as string[];
    const safeVars: any = {};
    varList.forEach((tk: string) => {
      if (/^var\d+$/.test(tk)) {
        const ens = calc.ensaios_detalhes.find((e: any) => e.tecnica === tk || e.variavel === tk);
        const valor = ens && typeof ens.valor !== 'undefined' ? (typeof ens.valor === 'number' ? ens.valor : Number(ens.valor) || 0) : 0;
        safeVars[tk] = valor;
      } else if (/^calculo\d+$/.test(tk)) {
        // Buscar valor de outros cálculos por código técnico
        let valor = 0;
        // Buscar em todos os planos por cálculos com o código técnico correspondente
        if (this.analisesSimplificadas?.[0]?.planoDetalhes) {
          for (const plano of this.analisesSimplificadas[0].planoDetalhes) {
            if (Array.isArray(plano.calculo_ensaio_detalhes)) {
              const calculoRef = plano.calculo_ensaio_detalhes.find((c: any) => 
                c.tecnica === tk || this.tokensIguais(c.tecnica, tk)
              );
              if (calculoRef && typeof calculoRef.resultado !== 'undefined') {
                valor = typeof calculoRef.resultado === 'number' ? calculoRef.resultado : Number(calculoRef.resultado) || 0;
                break;
              }
            }
          }
        }
        safeVars[tk] = isNaN(valor) ? 0 : valor;
      } else if (/^ensaio\d+$/.test(tk)) {
        let valor = 0;
        // 1) técnica/variável no próprio cálculo (comparando tokens com tolerância a zeros à esquerda)
        let porCalcTec = calc.ensaios_detalhes.find((e: any) => this.tokensIguais(e.tecnica, tk) || this.tokensIguais(e.variavel, tk));
        // fallback por descrição contendo o token (casos legados onde técnica não veio)
        if (!porCalcTec) {
          porCalcTec = calc.ensaios_detalhes.find((e: any) =>
            typeof e.descricao === 'string' && (
              e.descricao.includes(tk) || this.normalize(e.descricao) === this.normalize(tk)
            )
          );
        }
        if (porCalcTec) {
          if (typeof porCalcTec.valorTimestamp === 'number') valor = porCalcTec.valorTimestamp;
          else if (typeof porCalcTec.valor === 'string') {
            const d = new Date(porCalcTec.valor);
            valor = isNaN(d.getTime()) ? Number(porCalcTec.valor) || 0 : d.getTime();
          } else {
            valor = typeof porCalcTec.valor === 'number' ? porCalcTec.valor : Number(porCalcTec.valor) || 0;
          }
        }
        // 2) por id no token (ensaio{id})
        if (!valor) {
          const m = tk.match(/ensaio(\d+)/);
          const idNum = m ? parseInt(m[1], 10) : NaN;
          if (!isNaN(idNum)) {
            const porId = calc.ensaios_detalhes.find((e: any) => String(e.id) === String(idNum));
            if (porId) {
              if (typeof porId.valorTimestamp === 'number') valor = porId.valorTimestamp;
              else if (typeof porId.valor === 'string') {
                const d = new Date(porId.valor);
                valor = isNaN(d.getTime()) ? Number(porId.valor) || 0 : d.getTime();
              } else {
                valor = typeof porId.valor === 'number' ? porId.valor : Number(porId.valor) || 0;
              }
            }
          }
        }
        // 3) Fallback: plano base
        if (!valor && planoBase && Array.isArray(planoBase.ensaio_detalhes)) {
          const porTecPlano = planoBase.ensaio_detalhes.find((e: any) => this.tokensIguais(e.tecnica, tk) || this.tokensIguais(e.variavel, tk));
          if (porTecPlano) {
            if (typeof porTecPlano.valorTimestamp === 'number') valor = porTecPlano.valorTimestamp;
            else if (typeof porTecPlano.valor === 'string') {
              const d = new Date(porTecPlano.valor);
              valor = isNaN(d.getTime()) ? Number(porTecPlano.valor) || 0 : d.getTime();
            } else {
              valor = typeof porTecPlano.valor === 'number' ? porTecPlano.valor : Number(porTecPlano.valor) || 0;
            }
          }
        }
        safeVars[tk] = isNaN(valor) ? 0 : valor;
      } else {
        safeVars[tk] = 0;
      }
    });
    const funcoesDatas = {
      adicionarDias: (data: string | number, dias: number) => {
        const dataBase = new Date(data);
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + dias);
        return novaData.getTime();
      },
      diasEntre: (data1: string | number, data2: string | number) => {
        const d1 = new Date(data1);
        const d2 = new Date(data2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      hoje: () => new Date().getTime()
    };
    const funcoesBitwise = {
      bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
      bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
      bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
      bitNot: (a: number) => ~Math.trunc(a)
    };
    const scope = { ...safeVars, ...funcoesDatas, ...funcoesBitwise };
    try {
      const resultado = this.evaluateSeguro(calc.funcao, scope);
      if (calc.funcao.includes('adicionarDias') || calc.funcao.includes('hoje')) {
        if (typeof resultado === 'number' && resultado > 946684800000) {
          const dataResultado = new Date(resultado);
          calc.resultado = dataResultado.toLocaleDateString('pt-BR');
          calc.valorTimestamp = resultado;
        } else {
          calc.resultado = resultado;
        }
      } else {
        // MUDANÇA: Armazenar valor sem arredondamento para cálculos precisos
        calc.resultado = (typeof resultado === 'number' && isFinite(resultado)) ? resultado : 0;
      }
      // Verificar alertas após o cálculo
      this.verificarAlertaPRNT(calc);
    } catch (e) {
      calc.resultado = 'Erro no cálculo';
      console.error('Erro no cálculo:', e);
    }
  }
  // Verificar alerta PRNT após o cálculo
  private verificarAlertaPRNT(calc: any) {  
    if (!calc || !calc.descricao) {
      return;
    }
    // CORREÇÃO: Permitir resultado 0 - remover verificação !calc.resultado
    if (calc.resultado === null || calc.resultado === undefined) {
      return;
    }
    // Verificar se é um cálculo PRNT (por descrição)
    const descricaoLower = calc.descricao.toLowerCase();  
    const isPRNT = descricaoLower.includes('prnt calcário') || 
                   descricaoLower.includes('poder relativo de neutralização total') ||
                   descricaoLower.includes('neutralização');
    if (isPRNT) {
      const resultado = typeof calc.resultado === 'number' ? calc.resultado : Number(calc.resultado);
      if (!isNaN(resultado)) {
        if (resultado < 73) {
          // PRNT abaixo de 73 - REPROVADO
          if (this.podeExibirAlerta('PRNT_REPROVADO', resultado)) {
            this.messageService.add({
              severity: 'error',
              summary: 'REPROVADO - Baixo PRNT',
              detail: `O resultado do cálculo PRNT (${resultado.toFixed(4)}) está abaixo de 73. Material reprovado!`,
              life: 8000,
              sticky: true
            });
          }
        } else {
          // PRNT >= 73 - OK
          if (this.podeExibirAlerta('PRNT_OK', resultado)) {            
            this.messageService.add({
              severity: 'success',
              summary: 'PRNT OK',
              detail: `O resultado do cálculo PRNT (${resultado.toFixed(4)}) está dentro do padrão (≥ 73).`,
              life: 5000
            });
          }
        }
      } else {
        console.error('❌ Resultado não é um número válido:', calc.resultado);
      }
    }
  }
  // Controlar alertas duplicados
  private podeExibirAlerta(tipo: string, valor: number): boolean {
    const chave = `${tipo}_${valor.toFixed(4)}`; 
    if (this.alertasExibidos.has(chave)) {
      return false;
    }
    this.alertasExibidos.add(chave);
    // Limpar alertas após 30 segundos para permitir novos alertas se o valor mudar
    if (this.timerLimpezaAlertas) {
      clearTimeout(this.timerLimpezaAlertas);
    }
    this.timerLimpezaAlertas = setTimeout(() => {
      this.alertasExibidos.clear();
    }, 30000); 
    return true;
  }
  // Método para limpar cache de alertas manualmente
  public limparCacheAlertas() {
    this.alertasExibidos.clear();
  }
  // Método público para testar alertas manualmente (pode ser chamado no console do browser)
  public testarAlertas() {
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
      return;
    }
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    let calculosEncontrados = 0;
    let ensaiosEncontrados = 0;
    planoDetalhes.forEach((plano: any) => {
      // Verificar cálculos (PRNT)
      if (plano.calculo_ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calc: any) => {
          calculosEncontrados++;
          this.verificarAlertaPRNT(calc);
        });
      }
      // Verificar ensaios (Fechamento)
      if (plano.ensaio_detalhes) {
        plano.ensaio_detalhes.forEach((ensaio: any) => {
          ensaiosEncontrados++;
          this.verificarAlertaFechamento(ensaio, plano);
        });
      }
    });
  }
  // Método específico para testar apenas PRNT 
  public testarAlertaPRNT() {
    this.testarAlertas();
  }
  //============================ Verificar alerta Fechamento para ensaios com regras específicas=====================
  private verificarAlertaFechamento(ensaio: any, planoBase?: any) {
    if (!ensaio || !ensaio.descricao) {
      return;
    }
    // Verificar se é um ensaio Fechamento (por descrição)
    const descricaoLower = ensaio.descricao.toLowerCase();
    const isFechamento = descricaoLower.includes('fechamento') || 
                         descricaoLower.includes('fechament') ||
                         descricaoLower.includes('balanço');
    if (isFechamento) {
      // Primeiro verificar se há ensaios obrigatórios
      const ensaiosObrigatorios = ['ri + sio₂', 'cao', 'mgo', 'perda ao fogo'];
      const ensaiosEncontrados = this.verificarEnsaiosObrigatoriosFechamento(null, planoBase, ensaiosObrigatorios);
      if (ensaiosEncontrados.faltantes.length > 0) {
        // Análise incompleta
        const chaveIncompleta = `FECHAMENTO_INCOMPLETO_${ensaiosEncontrados.faltantes.join('_')}`;
        if (!this.alertasExibidos.has(chaveIncompleta)) {
          this.alertasExibidos.add(chaveIncompleta);
          this.messageService.add({
            severity: 'warn',
            summary: 'Análise Parcial ou Incompleta',
            detail: `Fechamento não pode ser validado. Faltam ensaios: ${ensaiosEncontrados.faltantes.join(', ')}`,
            life: 8000,
            sticky: true
          });
        }
        return;
      }
      // Se chegou aqui, todos os ensaios obrigatórios estão presentes
      if (ensaio.valor === null || ensaio.valor === undefined) {
        return;
      }
      const resultado = typeof ensaio.valor === 'number' ? ensaio.valor : Number(ensaio.valor);
      if (!isNaN(resultado)) {
        if (resultado < 97.5) {
          // Fechamento baixo - REPROVADO
          if (this.podeExibirAlerta('FECHAMENTO_BAIXO', resultado)) {
            this.messageService.add({
              severity: 'error',
              summary: 'REPROVADO - Fechamento Baixo',
              detail: `O resultado do Fechamento (${resultado.toFixed(4)}%) está abaixo de 97,5%. Material reprovado!`,
              life: 8000,
              sticky: true
            });
          }
        } else if (resultado >= 99) {
          // Fechamento alto - REPROVADO
          if (this.podeExibirAlerta('FECHAMENTO_ALTO', resultado)) {
            this.messageService.add({
              severity: 'error',
              summary: 'REPROVADO - Fechamento Alto',
              detail: `O resultado do Fechamento (${resultado.toFixed(4)}%) está acima de 99%. Material reprovado!`,
              life: 8000,
              sticky: true
            });
          }
        } else {
          // Fechamento OK (97.5 <= resultado < 99)
          if (this.podeExibirAlerta('FECHAMENTO_OK', resultado)) {
            this.messageService.add({
              severity: 'success',
              summary: 'Fechamento OK',
              detail: `O resultado do Fechamento (${resultado.toFixed(4)}%) está dentro do padrão (97,5% - 99%).`,
              life: 5000
            });
          }
        }
      } 
    } 
  }
  // Verificar se todos os ensaios obrigatórios para Fechamento estão presentes
  private verificarEnsaiosObrigatoriosFechamento(calc: any, planoBase: any, ensaiosObrigatorios: string[]): {encontrados: string[], faltantes: string[]} {
    const encontrados: string[] = [];
    const faltantes: string[] = [];  
    ensaiosObrigatorios.forEach(ensaioObrigatorio => {
      let encontrado = false;
      // Buscar no plano base primeiro
      if (planoBase && Array.isArray(planoBase.ensaio_detalhes)) {
        encontrado = planoBase.ensaio_detalhes.some((ensaio: any) => {
          const descricaoEnsaio = (ensaio.descricao || '').toLowerCase();
          const match = this.verificarMatchEnsaio(descricaoEnsaio, ensaioObrigatorio);
          if (match) {
          }
          return match;
        });
      }
      // Se não encontrou, buscar em todos os planos
      if (!encontrado && this.analisesSimplificadas?.[0]?.planoDetalhes) {
        for (const plano of this.analisesSimplificadas[0].planoDetalhes) {
          if (Array.isArray(plano.ensaio_detalhes)) {
            encontrado = plano.ensaio_detalhes.some((ensaio: any) => {
              const descricaoEnsaio = (ensaio.descricao || '').toLowerCase();
              const match = this.verificarMatchEnsaio(descricaoEnsaio, ensaioObrigatorio);
              if (match) {
              }
              return match;
            });
          }
          if (encontrado) break;
        }
      }
      // Também buscar nos cálculos (ensaios internos) se necessário
      if (!encontrado && this.analisesSimplificadas?.[0]?.planoDetalhes) {
        for (const plano of this.analisesSimplificadas[0].planoDetalhes) {
          if (Array.isArray(plano.calculo_ensaio_detalhes)) {
            for (const calculo of plano.calculo_ensaio_detalhes) {
              if (Array.isArray(calculo.ensaios_detalhes)) {
                encontrado = calculo.ensaios_detalhes.some((ensaio: any) => {
                  const descricaoEnsaio = (ensaio.descricao || '').toLowerCase();
                  const match = this.verificarMatchEnsaio(descricaoEnsaio, ensaioObrigatorio);
                  if (match) {
                  }
                  return match;
                });
                if (encontrado) break;
              }
            }
            if (encontrado) break;
          }
        }
      }
      if (encontrado) {
        encontrados.push(ensaioObrigatorio);
      } else {
        faltantes.push(ensaioObrigatorio);
      }
    });
    return { encontrados, faltantes };
  }
  // Verificar se a descrição do ensaio corresponde ao ensaio obrigatório
  private verificarMatchEnsaio(descricaoEnsaio: string, ensaioObrigatorio: string): boolean {
    // Normalizar strings para comparação
    const normalize = (str: string) => str.toLowerCase()
      .replace(/[áàâãä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôõö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[₂]/g, '2')
      .replace(/\s+/g, ' ')
      .trim();
    const descricaoNorm = normalize(descricaoEnsaio);
    const obrigatorioNorm = normalize(ensaioObrigatorio); 
    // Verificações específicas por tipo de ensaio
    switch (obrigatorioNorm) {
      case 'ri + sio2':
      case 'ri + sio₂':
        return descricaoNorm.includes('ri') || 
               descricaoNorm.includes('sio2') || 
               descricaoNorm.includes('sio₂') ||
               descricaoNorm.includes('silica') ||
               descricaoNorm.includes('residuo insolúvel');
      case 'cao':
        return descricaoNorm.includes('cao') || 
               descricaoNorm.includes('calcio') ||
               descricaoNorm.includes('cálcio');
      case 'mgo':
        return descricaoNorm.includes('mgo') || 
               descricaoNorm.includes('magnesio') ||
               descricaoNorm.includes('magnésio');
      case 'perda ao fogo':
        return descricaoNorm.includes('perda') || 
               descricaoNorm.includes('pf') ||
               descricaoNorm.includes('fogo');
      default:
        return descricaoNorm.includes(obrigatorioNorm);
    }
  }
  //========================FIM Verificar alerta Fechamento para ensaios com regras específicas=====================
  // Resolve dependências entre ensaios internos de um cálculo (como Ensaios Diretos)
  private recalcularEnsaiosInternosDoCalculo(calc: any, planoBase?: any) {
    if (!calc || !Array.isArray(calc.ensaios_detalhes)) return;
    const MAX_PASSOS = 5;
    for (let passo = 0; passo < MAX_PASSOS; passo++) {
      let alterou = false;
      calc.ensaios_detalhes.forEach((ensaio: any) => {
        if (ensaio?.funcao) {
          if (this.deveCalcularEnsaioComDefaults(ensaio)) {
            const antes = ensaio.valor;
            this.calcularEnsaioInterno(ensaio, calc, planoBase);
            if (antes !== ensaio.valor) alterou = true;
          }
        }
      });
      if (!alterou) break;
    }
  }
  // Calcula um ensaio interno (dentro de um cálculo), suportando varX, ensaioNN e calculoNN
  private calcularEnsaioInterno(ensaio: any, calc: any, planoBase?: any) {
    if (!ensaio || !ensaio.funcao) return;
    try {
      const tokenMatches = (ensaio.funcao.match(/\b(var\d+|ensaio\d+|calculo\d+)\b/g) || []);
      const uniqueTokens = Array.from(new Set(tokenMatches)) as string[];
      const safeVars: any = {};
      uniqueTokens.forEach((tk: string) => {
        if (/^var\d+$/.test(tk)) {
          const variavel = Array.isArray(ensaio.variavel_detalhes)
            ? ensaio.variavel_detalhes.find((v: any) => v.tecnica === tk || v.nome === tk)
            : null;
          let valor = 0;
          if (variavel) {
            if (typeof variavel.valorTimestamp === 'number') valor = variavel.valorTimestamp;
            else if (typeof variavel.valor === 'string') {
              const d = new Date(variavel.valor);
              valor = isNaN(d.getTime()) ? Number(variavel.valor) || 0 : d.getTime();
            } else {
              valor = typeof variavel.valor === 'number' ? variavel.valor : Number(variavel.valor) || 0;
            }
          }
          safeVars[tk] = isNaN(valor) ? 0 : valor;
        } else if (/^calculo\d+$/.test(tk)) {
          // Buscar valor de outros cálculos por código técnico
          let valor = 0;
          // Buscar em todos os planos por cálculos com o código técnico correspondente
          if (this.analisesSimplificadas?.[0]?.planoDetalhes) {
            for (const plano of this.analisesSimplificadas[0].planoDetalhes) {
              if (Array.isArray(plano.calculo_ensaio_detalhes)) {
                const calculoRef = plano.calculo_ensaio_detalhes.find((c: any) => 
                  c.tecnica === tk || this.tokensIguais(c.tecnica, tk)
                );
                if (calculoRef && typeof calculoRef.resultado !== 'undefined') {
                  valor = typeof calculoRef.resultado === 'number' ? calculoRef.resultado : Number(calculoRef.resultado) || 0;
                  break;
                }
              }
            }
          }
          safeVars[tk] = isNaN(valor) ? 0 : valor;
        } else if (/^ensaio\d+$/.test(tk)) {
          const valor = this.obterValorEnsaioDeContexto(calc, planoBase, tk);
          safeVars[tk] = isNaN(valor) ? 0 : valor;
        } else {
          safeVars[tk] = 0;
        }
      });
      const funcoesDatas = {
        adicionarDias: (data: string | number, dias: number) => {
          const dataBase = new Date(data);
          const novaData = new Date(dataBase);
          novaData.setDate(novaData.getDate() + dias);
          return novaData.getTime();
        },
        diasEntre: (data1: string | number, data2: string | number) => {
          const d1 = new Date(data1);
          const d2 = new Date(data2);
          const diffTime = Math.abs(d2.getTime() - d1.getTime());
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        hoje: () => new Date().getTime()
      };
      const funcoesBitwise = {
        bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
        bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
        bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
        bitNot: (a: number) => ~Math.trunc(a)
      };
      const scope = { ...safeVars, ...funcoesDatas, ...funcoesBitwise };
      const resultado = this.evaluateSeguro(ensaio.funcao, scope);
      if (ensaio.funcao.includes('adicionarDias') || ensaio.funcao.includes('hoje') || ensaio.funcao.includes('diasEntre')) {
        if (typeof resultado === 'number' && resultado > 946684800000) {
          const dataResultado = new Date(resultado);
          ensaio.valor = dataResultado.toLocaleDateString('pt-BR');
          ensaio.valorTimestamp = resultado;
        } else {
          ensaio.valor = resultado;
        }
      } else {
        ensaio.valor = (typeof resultado === 'number' && isFinite(resultado)) ? this.round2(resultado) : 0;
      }
    } catch (e) {
      console.error('Erro ao calcular ensaio interno:', e);
    }
  }
  // Busca valor para um token ensaioNN priorizando o contexto do cálculo, com fallback ao plano
  private obterValorEnsaioDeContexto(calc: any, planoBase: any, token: string): number {
    let valor = 0;
    if (calc && Array.isArray(calc.ensaios_detalhes)) {
  let porCalcTec = calc.ensaios_detalhes.find((e: any) => this.tokensIguais(e.tecnica, token) || this.tokensIguais(e.variavel, token));
      if (!porCalcTec) {
        porCalcTec = calc.ensaios_detalhes.find((e: any) => typeof e.descricao === 'string' && (e.descricao.includes(token) || this.normalize(e.descricao) === this.normalize(token)));
      }
      if (porCalcTec) {
        if (typeof porCalcTec.valorTimestamp === 'number') valor = porCalcTec.valorTimestamp;
        else if (typeof porCalcTec.valor === 'string') {
          const d = new Date(porCalcTec.valor);
          valor = isNaN(d.getTime()) ? Number(porCalcTec.valor) || 0 : d.getTime();
        } else {
          valor = typeof porCalcTec.valor === 'number' ? porCalcTec.valor : Number(porCalcTec.valor) || 0;
        }
      }
      if (!valor) {
        const m = token.match(/ensaio(\d+)/);
        const idNum = m ? parseInt(m[1], 10) : NaN;
        if (!isNaN(idNum)) {
          const porId = calc.ensaios_detalhes.find((e: any) => String(e.id) === String(idNum));
          if (porId) {
            if (typeof porId.valorTimestamp === 'number') valor = porId.valorTimestamp;
            else if (typeof porId.valor === 'string') {
              const d = new Date(porId.valor);
              valor = isNaN(d.getTime()) ? Number(porId.valor) || 0 : d.getTime();
            } else {
              valor = typeof porId.valor === 'number' ? porId.valor : Number(porId.valor) || 0;
            }
          }
        }
      }
    }
    if (!valor && planoBase && Array.isArray(planoBase.ensaio_detalhes)) {
  const porTecPlano = planoBase.ensaio_detalhes.find((e: any) => this.tokensIguais(e.tecnica, token) || this.tokensIguais(e.variavel, token));
      if (porTecPlano) {
        if (typeof porTecPlano.valorTimestamp === 'number') valor = porTecPlano.valorTimestamp;
        else if (typeof porTecPlano.valor === 'string') {
          const d = new Date(porTecPlano.valor);
          valor = isNaN(d.getTime()) ? Number(porTecPlano.valor) || 0 : d.getTime();
        } else {
          valor = typeof porTecPlano.valor === 'number' ? porTecPlano.valor : Number(porTecPlano.valor) || 0;
        }
      }
    }
    return isNaN(valor) ? 0 : valor;
  }
sincronizarValoresEnsaios(produto: any, calc: any) {
  if (!produto.planoEnsaios || !calc.ensaios_detalhes) return;
  calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
    const ensaioPlano = produto.planoEnsaios.find((e: any) => e.descricao === ensaioCalc.descricao);
    if (ensaioPlano) {
      ensaioCalc.valor = ensaioPlano.valor;
    }
  });
}
calcularEnsaios(ensaios: any[], produto: any) {
  const planoCalculos = produto.planoCalculos || [];
  if (!planoCalculos.length) {
    produto.resultado = 'Sem função';
    return;
  }
  planoCalculos.forEach((calc: { funcao: any; ensaios_detalhes: any[]; resultado: string; }) => {
    let funcaoSubstituida = calc.funcao;
    calc.ensaios_detalhes.forEach((ensaio: any) => {
      const valor = ensaio.valor !== undefined && ensaio.valor !== null ? ensaio.valor : 0;
      funcaoSubstituida = funcaoSubstituida.replace(
        new RegExp('\\b' + ensaio.descricao + '\\b', 'gi'),
        valor
      );
    });
    try {
      const funcoesBitwise = {
        bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
        bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
        bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
        bitNot: (a: number) => ~Math.trunc(a)
      };
      calc.resultado = this.evaluateSeguro(funcaoSubstituida);
    } catch (e) {
      calc.resultado = 'Erro no cálculo';
    }
  });

  produto.resultado = planoCalculos[0]?.resultado;
}
calcularTodosCalculosDoPlano(plano: any) {
  if (plano && plano.calculo_ensaio_detalhes) {
    plano.calculo_ensaio_detalhes.forEach((calc: any) => this.calcular(calc, plano));
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
atualizarVariavelEnsaio(ensaio: any, variavel: any, novoValor: any) {
  // Atualiza o valor na lista de variáveis descritivas (garante referência correta)
  const idx = ensaio.variavel_detalhes.findIndex((v: any) => v === variavel || v.nome === variavel.nome);
  const valorNum = parseFloat(novoValor) || 0;
  if (idx !== -1) {
    ensaio.variavel_detalhes[idx].valor = valorNum;
  }
  variavel.valor = valorNum;
  // Sincronizar valor para variável técnica (varX) correspondente, se existir
  if (variavel.nome && !/^var\d+$/.test(variavel.nome)) {
    // Procurar se existe uma variável técnica (varX) que deve receber esse valor
    const varTecnica = ensaio.variavel_detalhes.find((v: any) => /^var\d+$/.test(v.nome) && (variavel.nome.includes(v.nome) || v.nome.includes(variavel.nome)));
    if (varTecnica) {
      varTecnica.valor = valorNum;
    }
  }
  // Recalcular dependências do plano (ensaio atual e ensaios que dependem dele)
  const plano = this.encontrarPlanoDoEnsaio(ensaio);
  if (plano) {
    this.recalcularTodosEnsaiosDirectos(plano);
  } else {
    // Fallback mínimo: recalcular apenas o ensaio
    this.calcularEnsaioDireto(ensaio);
  }
  // Recalcular todos os cálculos que dependem dos ensaios
  this.recalcularTodosCalculos();
  this.markAsChanged(); // Marcar mudanças
  this.cd.detectChanges();
}
// Verificar se a variável é do tipo data
isVariavelTipoData(variavel: any): boolean {
  return variavel.tipo === 'data' || 
         variavel.nome?.toLowerCase().includes('data') || 
         variavel.tecnica?.toLowerCase().includes('data') ||
         variavel.nome?.toLowerCase().includes('modelagem') ||
         variavel.nome?.toLowerCase().includes('rompimento');
}
// Verificar se o ensaio tem pelo menos uma variável de data
ensaioTemVariavelData(ensaio: any): boolean {
  if (!ensaio || !ensaio.variavel_detalhes) return false;
  return ensaio.variavel_detalhes.some((variavel: any) => this.isVariavelTipoData(variavel));
}
// Verificar se o plano tem pelo menos um ensaio com variável de data
planoTemEnsaioComVariavelData(plano: any): boolean {
  if (!plano || !plano.ensaio_detalhes) return false;
  return plano.ensaio_detalhes.some((ensaio: any) => this.ensaioTemVariavelData(ensaio));
}
// Atualizar variável do tipo data
atualizarVariavelData(ensaio: any, variavel: any, novaData: Date) {
  // Atualiza o valor da data
  variavel.valorData = novaData;
  // Converte a data para string no formato local YYYY-MM-DD (sem timezone) e timestamp para cálculos
  if (novaData) {
    variavel.valor = this.toLocalYYYYMMDD(novaData); // formato YYYY-MM-DD (local) para backend
    variavel.valorTimestamp = novaData.getTime(); // timestamp para cálculos matemáticos
  } else {
    variavel.valor = null;
    variavel.valorTimestamp = null;
  }
  // Sincronizar com variável técnica correspondente se existir
  const idx = ensaio.variavel_detalhes.findIndex((v: any) => v === variavel || v.nome === variavel.nome);
  if (idx !== -1) {
    ensaio.variavel_detalhes[idx] = variavel;
  }
  // Chama cálculos automáticos de data
  this.calcularDatasAutomaticas(ensaio, variavel);
  // Recalcula ensaios dependentes e cálculos
  const plano = this.encontrarPlanoDoEnsaio(ensaio);
  if (plano) {
    this.recalcularTodosEnsaiosDirectos(plano);
  } else {
    this.calcularEnsaioDireto(ensaio);
  }
  this.recalcularTodosCalculos();
  this.cd.detectChanges();
}
// Quando o valor de um ensaio simples (sem variáveis) é alterado
private _ensaioChangeTimer: any;
onValorEnsaioChange(ensaio: any, novoValor: any) {
  if (this._ensaioChangeTimer) clearTimeout(this._ensaioChangeTimer);
  this._ensaioChangeTimer = setTimeout(() => {
  const num = typeof novoValor === 'number' ? novoValor : Number(novoValor?.toString().replace(',', '.')) || 0;
  ensaio.valor = this.round2(num);
    const plano = this.encontrarPlanoDoEnsaio(ensaio);
    // Verificar alerta Fechamento após alteração manual
    this.verificarAlertaFechamento(ensaio, plano);
    if (plano) {
      this.recalcularTodosEnsaiosDirectos(plano);
    }
    this.recalcularTodosCalculos();
    this.markAsChanged(); // Marcar mudanças
    this.cd.detectChanges();
  }, 120);
}
// Quando o resultado de um cálculo é alterado manualmente
private _calculoChangeTimer: any;
onResultadoCalculoChange(calculo: any, novoValor: any) {
    if (this._calculoChangeTimer) clearTimeout(this._calculoChangeTimer);
    this._calculoChangeTimer = setTimeout(() => {
    const num = typeof novoValor === 'number' ? novoValor : Number(novoValor?.toString().replace(',', '.')) || 0;
    calculo.resultado = this.round2(num);
    // Verificar alerta PRNT após alteração manual
    this.verificarAlertaPRNT(calculo);
    this.recalcularTodosCalculos();
    this.cd.detectChanges();
  }, 120);
}

// Calcular datas automáticas baseadas em outras datas
calcularDatasAutomaticas(ensaio: any, variavelAlterada: any) {
  // Exemplo: se dataModelagem foi alterada, calcular dataRompimento (+28 dias)
  if (variavelAlterada.nome?.toLowerCase().includes('modelagem')) {
    const dataRompimentoVar = ensaio.variavel_detalhes?.find((v: any) => 
      v.nome?.toLowerCase().includes('rompimento')
    );
    if (dataRompimentoVar && variavelAlterada.valorData) {
      const dataModelagem = this.parseDateLocal(variavelAlterada.valorData) || new Date(variavelAlterada.valorData);
      const dataRompimento = new Date(dataModelagem);
      dataRompimento.setDate(dataRompimento.getDate() + 28);
      // Atualiza a data de rompimento automaticamente
      dataRompimentoVar.valorData = dataRompimento;
      dataRompimentoVar.valor = this.toLocalYYYYMMDD(dataRompimento);
      dataRompimentoVar.valorTimestamp = dataRompimento.getTime(); 
      this.messageService.add({
        severity: 'info',
        summary: 'Data calculada!',
        detail: `Data de rompimento definida automaticamente para ${dataRompimento.toLocaleDateString('pt-BR')}`,
        life: 3000
      });
    }
  }
}
  // Permite editar o valor de um ensaio listado dentro do cálculo expandido
  onValorEnsaioDentroCalculoChange(plano: any, ensaioCalc: any, novoValor: any) {
  const num = typeof novoValor === 'number' ? novoValor : Number(novoValor?.toString().replace(',', '.')) || 0;
  ensaioCalc.valor = this.round2(num);
    // Recalcula apenas os cálculos deste plano (o cálculo atual certamente será recalculado)
    if (plano?.calculo_ensaio_detalhes) {
      const calcRef = plano.calculo_ensaio_detalhes.find((c: any) => Array.isArray(c.ensaios_detalhes) && c.ensaios_detalhes.includes(ensaioCalc));
      if (calcRef) {
        this.recalcularEnsaiosInternosDoCalculo(calcRef, plano);
        this.calcular(calcRef, plano);
      }
      plano.calculo_ensaio_detalhes.forEach((c: any) => {
        if (c !== calcRef) {
          this.recalcularEnsaiosInternosDoCalculo(c, plano);
          this.calcular(c, plano);
        }
      });
    }
    this.cd.detectChanges();
  }
  // Atualiza variável de um ensaio dentro do cálculo expandido (numérica ou data)
  atualizarVariavelEnsaioDentroCalculo(plano: any, ensaioCalc: any, variavelCalc: any, novoValor: any) {
    // Atualiza apenas no ensaio interno do cálculo
    if (Array.isArray(ensaioCalc.variavel_detalhes)) {
      const variavelLocal = ensaioCalc.variavel_detalhes.find((v: any) => v.tecnica === variavelCalc.tecnica || v.nome === variavelCalc.nome);
      if (variavelLocal) {
        if (this.isVariavelTipoData(variavelLocal)) {
          // novaData é do tipo Date
          this.atualizarVariavelData(ensaioCalc, variavelLocal, novoValor);
        } else {
          this.atualizarVariavelEnsaio(ensaioCalc, variavelLocal, novoValor);
        }
        // Recalcula os cálculos deste plano
        if (plano?.calculo_ensaio_detalhes) {
          // Recalcula o cálculo que contém este ensaio primeiro
          const calcRef = plano.calculo_ensaio_detalhes.find((c: any) => Array.isArray(c.ensaios_detalhes) && c.ensaios_detalhes.includes(ensaioCalc));
          if (calcRef) {
            this.recalcularEnsaiosInternosDoCalculo(calcRef, plano);
            this.calcular(calcRef, plano);
          }
          // Recalcula demais cálculos
          plano.calculo_ensaio_detalhes.forEach((c: any) => {
            if (c !== calcRef) {
              this.recalcularEnsaiosInternosDoCalculo(c, plano);
              this.calcular(c, plano);
            }
          });
        }
        this.cd.detectChanges();
      }
    }
  }
  // Atualiza o responsável de um ensaio dentro do cálculo e sincroniza com o ensaio direto
  onResponsavelEnsaioDentroCalculoChange(plano: any, ensaioCalc: any, novoResponsavel: any) {
    ensaioCalc.responsavel = novoResponsavel;
    this.cd.detectChanges();
  }
// Atualiza o número do cadinho do ensaio dentro do cálculo e sincroniza com o ensaio direto
  onNumeroCadinhoDentroCalculoChange(plano: any, ensaioCalc: any, novoNumero: any) {
    const num = typeof novoNumero === 'number' ? novoNumero : Number(novoNumero) || 0;
    ensaioCalc.numero_cadinho = num;
    this.cd.detectChanges();
  }
// Helper: encontra o ensaio do plano correspondente ao ensaio listado no cálculo
  private encontrarEnsaioNoPlanoPorCalc(plano: any, ensaioCalc: any): any | undefined {
    if (!plano || !Array.isArray(plano.ensaio_detalhes)) return undefined;
    return plano.ensaio_detalhes.find((e: any) =>
      String(e.id) === String(ensaioCalc.id) ||
      e.descricao === ensaioCalc.descricao ||
      e.tecnica === ensaioCalc.tecnica ||
      e.variavel === ensaioCalc.variavel
    );
}
// Inicializar datas nas variáveis
private inicializarDatasDeEnsaio(ensaio: any): boolean {
  let hasDateVariables = false;
  ensaio?.variavel_detalhes?.forEach((variavel: any) => {
    if (this.isVariavelTipoData(variavel)) {
      hasDateVariables = true;
      if (variavel.valor) {
        try {
          let dataObj: Date | null = null;
          if (typeof variavel.valor === 'string') {
            if (variavel.valor.includes('/')) {
              const [d, m, y] = variavel.valor.split('/');
              dataObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            } else if (variavel.valor.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dataObj = this.parseDateLocal(variavel.valor);
            } else {
              const tmp = new Date(variavel.valor);
              dataObj = isNaN(tmp.getTime()) ? null : tmp;
            }
          } else if (typeof variavel.valor === 'number') {
            // segundos -> ms
            const valNum = variavel.valor < 1e11 ? variavel.valor * 1000 : variavel.valor;
            const tmp = new Date(valNum);
            dataObj = isNaN(tmp.getTime()) ? null : tmp;
          } else if (variavel.valorData instanceof Date) {
            dataObj = variavel.valorData;
          }
          if (dataObj && !isNaN(dataObj.getTime())) {
            // normalizar para meia-noite local para evitar -1 dia
            dataObj = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate());
            variavel.valorData = dataObj;
            variavel.valorTimestamp = dataObj.getTime();
            variavel.valor = this.toLocalYYYYMMDD(dataObj);
          }
        } catch {}
      }
    }
  });
  return hasDateVariables;
}
//INICIALIZA DATS VAR
inicializarDatasVariaveis() {
  this.analisesSimplificadas?.forEach(analise => {
    analise.planoDetalhes?.forEach((plano: any) => {
      // Ensaios diretos
      plano.ensaio_detalhes?.forEach((ensaio: any) => {
        const has = this.inicializarDatasDeEnsaio(ensaio);
        if (has && ensaio.funcao) {
          this.calcularEnsaioDireto(ensaio, plano);
        }
      });
      // Ensaios internos de cada cálculo
      plano.calculo_ensaio_detalhes?.forEach((calc: any) => {
        let precisaRecalcularInternos = false;
        calc.ensaios_detalhes?.forEach((ensaioInt: any) => {
          const has = this.inicializarDatasDeEnsaio(ensaioInt);
            if (has && ensaioInt.funcao) {
              precisaRecalcularInternos = true;
            }
        });
        // Recalcula cadeia interna apenas uma vez se alguma variável de data mudou
        if (precisaRecalcularInternos) {
          this.recalcularEnsaiosInternosDoCalculo(calc, plano);
          // Recalcula o próprio cálculo para refletir mudanças de datas
          this.calcular(calc, plano);
        }
      });
    });
  });
  // Recalcular todos os cálculos novamente para garantir consistência cruzada
  setTimeout(() => {
    this.recalcularTodosCalculos();
    this.cd.detectChanges();
  }, 150);
}
//DETECÇÃO DE MUDANÇAS MANUAL
forcarDeteccaoMudancas() {
  this.cd.detectChanges();
}
//========================================CALCULO ENSAIOS DIRETOS================================ 
calcularEnsaioDireto(ensaio: any, planoRef?: any) {
  // Ensaio sem função: é valor fixo vindo do backend ou digitado manualmente.
  // Não sobrescrever para 0; apenas sair preservando o valor existente.
  if (!ensaio.funcao) {
    return;
  }
  try {
    // Captura tanto varX quanto ensaioNN
    const tokenMatches = (ensaio.funcao.match(/\b(var\d+|ensaio\d+)\b/g) || []);
    const uniqueTokens = Array.from(new Set(tokenMatches)) as string[];
    // Monta o objeto de variáveis usando apenas tecnica
    const safeVars: any = {};
    uniqueTokens.forEach((tk: string) => {
      if (/^var\d+$/.test(tk)) {
        const variavel = ensaio.variavel_detalhes?.find((v: any) => v.tecnica === tk);
        if (variavel) {
        // Se é uma variável de data, usar o timestamp da data
          if (this.isVariavelTipoData(variavel)) {
          if (variavel.valorData) {
            safeVars[tk] = variavel.valorData.getTime();
          } else if (variavel.valorTimestamp) {
            safeVars[tk] = variavel.valorTimestamp;
          } else if (variavel.valor) {
            // Tentar converter o valor para timestamp
            try {
              const dataObj = new Date(variavel.valor);
              if (!isNaN(dataObj.getTime())) {
                safeVars[tk] = dataObj.getTime();
              } else {
                safeVars[tk] = 0;
                console.warn(`⚠️ Data inválida para ${tk}: ${variavel.valor}`);
              }
            } catch (error) {
              safeVars[tk] = 0;
            }
          } else {
            safeVars[tk] = 0;
          }
        } else {
          safeVars[tk] = typeof variavel.valor !== 'undefined' ? Number(variavel.valor) : 0;
        }
        } else {
          safeVars[tk] = 0;
        }
      } else if (/^ensaio\d+$/.test(tk)) {
        // Token de outro ensaio: buscar no plano
        const plano = planoRef || this.encontrarPlanoDoEnsaio(ensaio);
        const valorEnsaio = this.obterValorEnsaioPorToken(plano, tk);
        safeVars[tk] = valorEnsaio;
      } else {
        safeVars[tk] = 0;
      }
    });
    // Adicionar funções de data ao escopo
    const funcoesDatas = {
      adicionarDias: (data: string | number, dias: number) => {
        let dataBase: Date;
        if (typeof data === 'string') {
          dataBase = new Date(data);
        } else {
          dataBase = new Date(data); // timestamp
        }
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + dias);
        return novaData.getTime(); // retorna timestamp para cálculos
      },
      diasEntre: (data1: string | number, data2: string | number) => {
        const d1 = new Date(data1);
        const d2 = new Date(data2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      hoje: () => {
        return new Date().getTime();
      }
    };
    const funcoesBitwise = {
      bitOr: (a: number, b: number) => Math.trunc(a) | Math.trunc(b),
      bitAnd: (a: number, b: number) => Math.trunc(a) & Math.trunc(b),
      bitXor: (a: number, b: number) => Math.trunc(a) ^ Math.trunc(b),
      bitNot: (a: number) => ~Math.trunc(a)
    };
    // Combinar variáveis e funções de data
    const scope = {
      ...safeVars,
      ...funcoesDatas,
      ...funcoesBitwise
    } as any;
    // Permitir referências por descrição de outros ensaios (ex.: "Ensaio A * 10").
    // Substitui ocorrências exatas da descrição por seus valores numéricos antes de avaliar.
    let expressao = ensaio.funcao;
    try {
      const plano = planoRef || this.encontrarPlanoDoEnsaio(ensaio);
      const ensaiosPlano: any[] = Array.isArray(plano?.ensaio_detalhes) ? plano.ensaio_detalhes : [];
      ensaiosPlano.forEach((eOut: any) => {
        const desc = (eOut?.descricao || '').trim();
        if (!desc) return;
        // Valor preferindo timestamp para datas
        let valorNum: number = 0;
        if (typeof eOut?.valorTimestamp === 'number') {
          valorNum = eOut.valorTimestamp;
        } else if (typeof eOut?.valor === 'string') {
          const d = new Date(eOut.valor);
          valorNum = !isNaN(d.getTime()) ? d.getTime() : Number(eOut.valor) || 0;
        } else {
          valorNum = typeof eOut?.valor === 'number' ? eOut.valor : Number(eOut?.valor) || 0;
        }
        if (desc && isFinite(valorNum)) {
          const rx = new RegExp(`\\b${this.escapeRegExp(desc)}\\b`, 'g');
          expressao = expressao.replace(rx, String(valorNum));
        }
      });
    } catch (re) {
      console.warn('Falha ao substituir descrições de ensaio na expressão:', re);
    }
    // Se não há tokens (varX/ensaioNN), ainda assim avalie a expressão.
    // Ex.: função "1.2794" (constante) ou somente funções de data.
    const resultado = this.evaluateSeguro(expressao, scope);
    // Se o resultado é um timestamp (resultado de função de data), converter para data legível
  if (ensaio.funcao.includes('adicionarDias') || ensaio.funcao.includes('hoje') || ensaio.funcao.includes('diasEntre')) {
      // Verificar se o resultado é um timestamp válido
      if (typeof resultado === 'number' && resultado > 946684800000) { // timestamp após ano 2000
        const dataResultado = new Date(resultado);
        ensaio.valor = dataResultado.toLocaleDateString('pt-BR');
        ensaio.valorTimestamp = resultado; // manter timestamp para cálculos
      } else {
        ensaio.valor = resultado;
      }
    } else {
      if (typeof resultado === 'number' && isFinite(resultado)) {
        // Arredondar sempre para 4 casas decimais
        const arredondado = this.roundN(resultado, 4);
        ensaio.valor = arredondado;
      } else {
        ensaio.valor = 0;
      }
    }
    // Verificar alerta Fechamento após cálculo do ensaio
    const plano = planoRef || this.encontrarPlanoDoEnsaio(ensaio);
    this.verificarAlertaFechamento(ensaio, plano);
    // Remover recálculo automático aqui para evitar loops de alertas
    this.forcarDeteccaoMudancas();
  } catch (error) {
    ensaio.valor = 0;
    console.error(`❌ Erro no cálculo do ensaio ${ensaio.descricao}:`, error);
  }
}
// Localiza o plano que contém o ensaio informado
private encontrarPlanoDoEnsaio(ensaio: any): any | undefined {
  const analiseData = this.analisesSimplificadas && this.analisesSimplificadas[0];
  const planos = analiseData?.planoDetalhes || [];
  return planos.find((pl: any) => (pl.ensaio_detalhes || []).some((e: any) => e.id === ensaio.id || e.descricao === ensaio.descricao));
}
// Dado um token 'ensaioNN', encontra o valor do ensaio correspondente no plano
private obterValorEnsaioPorToken(plano: any, token: string): number {
  if (!plano || !Array.isArray(plano.ensaio_detalhes)) return 0;
  // 1) Tentar por tecnica com comparação tolerant a zeros à esquerda (ensaio7 == ensaio07)
  let alvo = plano.ensaio_detalhes.find((e: any) => this.tokensIguais(e?.tecnica, token));
  // 2) Fallback por id numérico contido no token (ensaio{id})
  if (!alvo) {
    const m = token.match(/ensaio(\d+)/i);
    const idNum = m ? parseInt(m[1], 10) : NaN;
    if (!isNaN(idNum)) {
      // 2a) Por id (quando IDs são numéricos e estáveis)
      alvo = plano.ensaio_detalhes.find((e: any) => String(e?.id) === String(idNum));
      // 2b) Fallback por índice (ensaio12 -> index 11)
      if (!alvo) {
        const byIndex = plano.ensaio_detalhes[idNum - 1];
        if (byIndex) alvo = byIndex;
      }
    }
  }
  if (!alvo) return 0;
  // Preferir timestamp quando for data
  if (typeof alvo.valorTimestamp === 'number') return alvo.valorTimestamp;
  // Converter string para número ou data
  if (typeof alvo.valor === 'string') {
    // Tentar data primeiro
    const d = new Date(alvo.valor);
    if (!isNaN(d.getTime())) return d.getTime();
    // Tentar número flexível
    const n = this.parseNumeroFlex(alvo.valor);
    const num = typeof n === 'number' ? n : Number(n);
    return isNaN(num) ? 0 : num;
  }
  const num = typeof alvo.valor === 'number' ? alvo.valor : Number(alvo.valor);
  return isNaN(num) ? 0 : num;
}
//RECALCULAR DEPENDENTES
recalcularCalculosDependentes(ensaioAlterado: any) {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  planoDetalhes.forEach((plano: any) => {
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        // Verificar se este cálculo usa o ensaio alterado
          const usaEnsaio = calc.ensaios_detalhes?.some((e: any) => {
          const idMatch = String(e.id) === String(ensaioAlterado.id);
          const descMatch = this.normalize(String(e.descricao || '')) === this.normalize(String(ensaioAlterado.descricao || ''));
          const tecMatch = e.tecnica && ensaioAlterado.tecnica && String(e.tecnica) === String(ensaioAlterado.tecnica);
          const varMatch = e.variavel && ensaioAlterado.variavel && String(e.variavel) === String(ensaioAlterado.variavel);
          return idMatch || descMatch || tecMatch || varMatch;
        });
        if (usaEnsaio) {
          // Sincronizar o valor do ensaio alterado no cálculo
          calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
            const idMatch = String(ensaioCalc.id) === String(ensaioAlterado.id);
            const descMatch = this.normalize(String(ensaioCalc.descricao || '')) === this.normalize(String(ensaioAlterado.descricao || ''));
            const tecMatch = ensaioCalc.tecnica && ensaioAlterado.tecnica && String(ensaioCalc.tecnica) === String(ensaioAlterado.tecnica);
            const varMatch = ensaioCalc.variavel && ensaioAlterado.variavel && String(ensaioCalc.variavel) === String(ensaioAlterado.variavel);
            if (idMatch || descMatch || tecMatch || varMatch) {
              ensaioCalc.valor = ensaioAlterado.valor;
            }
          });
          // Recalcular o cálculo com os novos valores
          this.calcular(calc, plano);
        }
      });
    }
  });
}
// RECALCULAR
recalcularTodosEnsaiosDirectos(plano: any) {
  if (!plano || !plano.ensaio_detalhes) return;
  // Antes de recalcular, garanta tokens de técnica consistentes (ensaioNN)
  this.garantirTecnicasDoPlano(plano);
  // Faz múltiplas passagens para resolver dependências entre ensaios
  const MAX_PASSOS = 5;
  for (let passo = 0; passo < MAX_PASSOS; passo++) {
    let alterou = false;
    plano.ensaio_detalhes.forEach((ensaio: any) => {
        if (ensaio.funcao) {
          // Só calcula se todas as variáveis da função tiverem defaults numéricos
          if (this.deveCalcularEnsaioComDefaults(ensaio)) {
            const antes = ensaio.valor;
            this.calcularEnsaioDireto(ensaio, plano);
            if (antes !== ensaio.valor) alterou = true;
          } else {
            // Sem defaults completos, preserva o valor atual (ex.: o 'valor' vindo do backend)
          }
        }
    });
    if (!alterou) break;
  }
}
//=======================================================SALVAR ANALISE e RESULTADOS=========================================================
salvarAnaliseResultados() {
  // Verificar se há dados para salvar
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Aviso', 
      detail: 'Nenhum dado de análise encontrado para salvar.' 
    });
    return;
  }
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  // PASSO 0: Normalização antecipada de todos os ensaios e variáveis de data
  planoDetalhes.forEach((pl: any) => {
    (pl.ensaio_detalhes || []).forEach((ensaio: any) => {
      const tipoEnsaioLowerNorm = ((ensaio.tipo_ensaio_detalhes?.nome || ensaio.tipo_ensaio || '')+'').toLowerCase();
      const ehData = tipoEnsaioLowerNorm === 'data' || /data|rompimento|modelagem|moldagem/.test(ensaio.unidade || '') || /adicionarDias|hoje|diasEntre/i.test(ensaio.funcao || '');
      // Variáveis
      if (Array.isArray(ensaio.variavel_detalhes)) {
        ensaio.variavel_detalhes.forEach((v: any) => {
          if (this.isVariavelTipoData(v)) {
            // Se tem valorData
            if (v.valorData instanceof Date && !isNaN(v.valorData.getTime())) {
              const d = new Date(v.valorData.getFullYear(), v.valorData.getMonth(), v.valorData.getDate());
              v.valorTimestamp = d.getTime();
              v.valor = this.toLocalYYYYMMDD(d);
            } else if (typeof v.valorTimestamp === 'number' && v.valorTimestamp > 946684800000) {
              const d = new Date(v.valorTimestamp);
              v.valor = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            } else if (typeof v.valor === 'string' && /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/.test(v.valor)) {
              const d = this.parseDateLocal(v.valor);
              if (d) {
                v.valorTimestamp = d.getTime();
                v.valor = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
              }
            }
          }
        });
      }
      // Ensaio de data: garantir timestamp antes de qualquer transformação
      if (ehData) {
        if (typeof ensaio.valorTimestamp !== 'number' || ensaio.valorTimestamp < 946684800000) {
          // Tentar extrair de valor se string de data
          if (typeof ensaio.valor === 'string' && /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/.test(ensaio.valor)) {
            const d = this.parseDateLocal(ensaio.valor);
            if (d) {
              const dLoc = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              ensaio.valorTimestamp = dLoc.getTime();
              ensaio.valor = this.toLocalYYYYMMDD(dLoc); // manter normalizado internamente
            }
          }
        }
        // Se ainda não há timestamp e tem função adicionarDias reconstruir
        if ((typeof ensaio.valorTimestamp !== 'number' || ensaio.valorTimestamp < 946684800000) && /adicionarDias/i.test(ensaio.funcao || '')) {
          try {
            const mDias = (ensaio.funcao || '').match(/adicionarDias\s*\(\s*(var\d+)\s*,\s*(\d+)\s*\)/i);
            if (mDias) {
              const varTk = mDias[1];
              const dias = parseInt(mDias[2], 10) || 0;
              const variavelBase = ensaio.variavel_detalhes?.find((v: any) => v.tecnica === varTk);
              if (variavelBase) {
                let baseDate: Date | null = null;
                if (variavelBase.valorData instanceof Date) baseDate = variavelBase.valorData;
                else if (typeof variavelBase.valorTimestamp === 'number') baseDate = new Date(variavelBase.valorTimestamp);
                else if (typeof variavelBase.valor === 'string') baseDate = this.parseDateLocal(variavelBase.valor);
                if (baseDate) {
                  const nrm = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                  const res = new Date(nrm.getFullYear(), nrm.getMonth(), nrm.getDate() + dias);
                  ensaio.valorTimestamp = res.getTime();
                  ensaio.valor = this.toLocalYYYYMMDD(res);
                }
              }
            }
          } catch(errN) {
            console.warn('[Normalize][EnsaioData] Falha reconstruindo', ensaio.descricao, errN);
          }
        }
      }
    });
  });
  // Montar ensaios (incluindo valores calculados dos ensaios diretos)
  const todosEnsaios = planoDetalhes.flatMap((plano: any) =>
    (plano.ensaio_detalhes || []).map((ensaio: any) => {
      // Normalizar variáveis de data antes de qualquer reconstrução
      if (Array.isArray(ensaio.variavel_detalhes)) {
        ensaio.variavel_detalhes.forEach((v: any) => {
          const nomeLower = (v?.nome || '').toLowerCase();
          const isVarData = this.isVariavelTipoData(v) || /data|modelagem|moldagem|rompimento/.test(nomeLower);
          if (isVarData) {
            if (!v.valor || v.valor === 0) {
              if (v.valorData instanceof Date) {
                const d = new Date(v.valorData.getFullYear(), v.valorData.getMonth(), v.valorData.getDate());
                v.valorTimestamp = d.getTime();
                v.valorData = d;
                v.valor = this.toLocalYYYYMMDD(d);
              } else if (typeof v.valorTimestamp === 'number') {
                const d = new Date(v.valorTimestamp);
                if (!isNaN(d.getTime())) {
                  const dLoc = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                  v.valorData = dLoc;
                  v.valor = this.toLocalYYYYMMDD(dLoc);
                }
              } else if (typeof v.valor === 'string' && /^(\d{4}-\d{2}-\d{2})$/.test(v.valor)) {
                // já está ok
              }
            }
          }
        });
      }
      // Se o próprio ensaio é de data e possui timestamp mas valor textual vazio/0, gerar a string
      const tipoEnsaioLower = ((ensaio.tipo_ensaio_detalhes?.nome || ensaio.tipo_ensaio || '')+'').toLowerCase();
      if ((tipoEnsaioLower === 'data' || /data/.test(ensaio.unidade || '')) && (ensaio.valor === 0 || ensaio.valor === null || ensaio.valor === '' || typeof ensaio.valor === 'number' && ensaio.valor > 946684800000)) {
        if (typeof ensaio.valorTimestamp === 'number' && ensaio.valorTimestamp > 946684800000) {
          const d = new Date(ensaio.valorTimestamp);
          if (!isNaN(d.getTime())) {
            ensaio.valor = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
          }
        } else if (typeof ensaio.valor === 'number' && ensaio.valor > 946684800000) {
          const d = new Date(ensaio.valor);
          if (!isNaN(d.getTime())) {
            ensaio.valorTimestamp = ensaio.valor;
            ensaio.valor = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
          }
        }
      }
//=== ====== Reconstrução/garantia de resultado para ensaios de DATA com função adicionarDias ======
      const isFuncaoAdicionarDias = typeof ensaio.funcao === 'string' && /adicionarDias/i.test(ensaio.funcao || '');
      const isTipoData = ((ensaio.tipo_ensaio_detalhes?.nome || ensaio.tipo_ensaio || '') + '').toLowerCase() === 'data'
        || /data|rompimento|modelagem|moldagem/i.test(ensaio.unidade || '')
        || isFuncaoAdicionarDias;
      // Se for data e ainda não temos valor string de data, tentar reconstruir
      if (isTipoData && (!ensaio.valor || ensaio.valor === 0)) {
        try {
          // Extrair dias da função: adicionarDias ( varXX , 28 )
          let diasAdd = 0;
          const mDias = (ensaio.funcao || '').match(/adicionarDias\s*\(\s*var\d+\s*,\s*(\d+)\s*\)/i);
          if (mDias) diasAdd = parseInt(mDias[1], 10) || 0;
          // Achar variável base (primeira var citada na função ou nomes conhecidos)
          let baseVarToken: string | null = null;
          const mVar = (ensaio.funcao || '').match(/adicionarDias\s*\(\s*(var\d+)/i);
          if (mVar) baseVarToken = mVar[1];
          let baseDate: Date | null = null;
          if (baseVarToken && Array.isArray(ensaio.variavel_detalhes)) {
            const variavelBase = ensaio.variavel_detalhes.find((v: any) => v.tecnica === baseVarToken || v.nome === baseVarToken);
            if (variavelBase) {
              if (variavelBase.valorData instanceof Date) baseDate = variavelBase.valorData;
              else if (typeof variavelBase.valorTimestamp === 'number') baseDate = new Date(variavelBase.valorTimestamp);
              else if (typeof variavelBase.valor === 'string' && variavelBase.valor) {
                baseDate = this.parseDateLocal(variavelBase.valor) || null;
              }
            }
          }
          // fallback: variaveis_utilizadas (payload anterior)
            if (!baseDate && Array.isArray(ensaio.variaveis_utilizadas)) {
              const vU = ensaio.variaveis_utilizadas.find((vu: any) => /modelagem|moldagem|data/i.test(vu.nome || '')) || ensaio.variaveis_utilizadas[0];
              if (vU && typeof vU.valor === 'string') {
                baseDate = this.parseDateLocal(vU.valor) || null;
              }
            }
          if (baseDate) {
            const normalizada = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
            const dataResultado = new Date(normalizada.getFullYear(), normalizada.getMonth(), normalizada.getDate() + diasAdd);
            const pad = (n:number)=>String(n).padStart(2,'0');
            ensaio.valorTimestamp = dataResultado.getTime();
            ensaio.valor = `${dataResultado.getFullYear()}-${pad(dataResultado.getMonth()+1)}-${pad(dataResultado.getDate())}`;
          }
        } catch (re) {
          console.warn('Falha ao reconstruir data de ensaio:', ensaio.descricao, re);
        }
      }
      // Para ensaios diretos (com função), usar o valor calculado (já potencialmente reconstruído)
      const valorFinal = ensaio.valor;
      // Salvar sempre o campo tecnica nas variáveis utilizadas
      const variaveisUtilizadas = ensaio.funcao && ensaio.variavel_detalhes
        ? ensaio.variavel_detalhes.map((v: any) => ({
            nome: v.nome,
            valor: v.valor,
            tecnica: v.tecnica // garante que tecnica sempre vai para o backend
          }))
        : [];
      // Filtrar apenas as variáveis que são usadas na função deste ensaio específico
      let variaveisDoEnsaio: any[] = [];
      if (ensaio.funcao && ensaio.variavel_detalhes) {
        // Extrair as variáveis mencionadas na função (var01, var02, etc.)
        const variaveisNaFuncao = ensaio.funcao.match(/var\d+/g) || [];        
        // Filtrar apenas as variáveis que estão na função
        variaveisDoEnsaio = ensaio.variavel_detalhes.filter((v: any) => 
          variaveisNaFuncao.includes(v.tecnica)
        );
      }
      if (variaveisDoEnsaio.length > 0) {
        variaveisDoEnsaio.forEach((v: any, idx: number) => {
        });
      } 
  // Se o valorFinal é uma data normalizada (YYYY-MM-DD) ou DD/MM/YYYY preservar como string e gerar timestamp
      let valorParaSalvar: any;
      let valorTimestampSalvar: number | null = null;
      if (typeof valorFinal === 'string' && /^(\d{4}-\d{2}-\d{2})$/.test(valorFinal)) {
        const [y,m,d] = valorFinal.split('-').map(n=>parseInt(n,10));
        const dt = new Date(y, m-1, d);
        valorParaSalvar = valorFinal; // manter formato YYYY-MM-DD
        valorTimestampSalvar = dt.getTime();
      } else if (typeof valorFinal === 'string' && /^(\d{2}\/\d{2}\/\d{4})$/.test(valorFinal)) {
        const [d,m,y] = valorFinal.split('/').map(n=>parseInt(n,10));
        const dt = new Date(y, m-1, d);
        valorParaSalvar = valorFinal; // manter como entrou
        valorTimestampSalvar = dt.getTime();
      } else if (typeof valorFinal === 'number' && valorFinal > 946684800000) { // timestamp ms
        const dt = new Date(valorFinal);
        const pad = (n:number)=>String(n).padStart(2,'0');
        valorParaSalvar = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
        valorTimestampSalvar = valorFinal;
      } else {
        // numérico comum
        valorParaSalvar = this.round2(this.parseNumeroFlex(valorFinal));
      }
      // Fallback extra: se é data e ainda ficou 0 ou inválido, tentar reconstruir novamente
      if (isTipoData && (valorParaSalvar === 0 || valorParaSalvar === null || valorParaSalvar === ''
          || (typeof valorParaSalvar === 'number' && valorParaSalvar < 946684800000))) {
        // 1) Se já existe timestamp no ensaio, usar
        const stampCandidate = (typeof valorTimestampSalvar === 'number' ? valorTimestampSalvar : (typeof ensaio.valorTimestamp === 'number' ? ensaio.valorTimestamp : null));
        if (stampCandidate && stampCandidate > 946684800000) {
          const d = new Date(stampCandidate);
          valorParaSalvar = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
          valorTimestampSalvar = stampCandidate;
        } else {
          // 2) Tentar reconstruir manualmente a partir da função adicionarDias (se não ocorreu antes)
          try {
            if (ensaio.funcao && /adicionarDias/i.test(ensaio.funcao)) {
              let diasAdd2 = 0;
              const mDias2 = (ensaio.funcao || '').match(/adicionarDias\s*\(\s*var\d+\s*,\s*(\d+)\s*\)/i);
              if (mDias2) diasAdd2 = parseInt(mDias2[1], 10) || 0;
              const mVar2 = (ensaio.funcao || '').match(/adicionarDias\s*\(\s*(var\d+)/i);
              let baseDate2: Date | null = null;
              if (mVar2 && Array.isArray(ensaio.variavel_detalhes)) {
                const baseVarToken2 = mVar2[1];
                const variavelBase2 = ensaio.variavel_detalhes.find((v: any) => v.tecnica === baseVarToken2);
                  if (variavelBase2) {
                  if (variavelBase2.valorData instanceof Date) baseDate2 = variavelBase2.valorData;
                  else if (typeof variavelBase2.valorTimestamp === 'number') baseDate2 = new Date(variavelBase2.valorTimestamp);
                  else if (typeof variavelBase2.valor === 'string') baseDate2 = this.parseDateLocal(variavelBase2.valor);
                }
              }
              // fallback: procurar primeira variável de data se token não encontrado
              if (!baseDate2 && Array.isArray(ensaio.variavel_detalhes)) {
                const varData = ensaio.variavel_detalhes.find((v: any) => this.isVariavelTipoData(v));
                if (varData) {
                  if (varData.valorData instanceof Date) baseDate2 = varData.valorData;
                  else if (typeof varData.valorTimestamp === 'number') baseDate2 = new Date(varData.valorTimestamp);
                  else if (typeof varData.valor === 'string') baseDate2 = this.parseDateLocal(varData.valor);
                }
              }
              if (baseDate2) {
                const norm = new Date(baseDate2.getFullYear(), baseDate2.getMonth(), baseDate2.getDate());
                const res = new Date(norm.getFullYear(), norm.getMonth(), norm.getDate() + diasAdd2);
                valorTimestampSalvar = res.getTime();
                valorParaSalvar = this.toLocalYYYYMMDD(res);
              }
            }
          } catch (errFb) {
            console.warn('[Fallback-Data] Falha reconstruindo data final para', ensaio.descricao, errFb);
          }
        }
      }
      const isData = isTipoData;
      // Timestamp final consolidado para ensaio de data
      const tsFinal = isData
        ? (valorTimestampSalvar !== null
            ? valorTimestampSalvar
            : (typeof ensaio.valorTimestamp === 'number'
                ? ensaio.valorTimestamp
                : (typeof valorParaSalvar === 'string'
                    ? (this.parseDateLocal(valorParaSalvar)?.getTime() || undefined)
                    : undefined)))
        : undefined;
      return {
    id: ensaio.id,
    descricao: ensaio.descricao,
        // Para ensaio de data: 'valor' = timestamp (ou 0 se falhou) e 'valor_data' = string
        valor: isData ? (tsFinal || 0) : valorParaSalvar,
        valor_data: isData
          ? (typeof valorParaSalvar === 'string'
              ? valorParaSalvar
              : (tsFinal
                  ? this.toLocalYYYYMMDD(new Date(tsFinal))
                  : (typeof ensaio.valorTimestamp === 'number'
                      ? this.toLocalYYYYMMDD(new Date(ensaio.valorTimestamp))
                      : (typeof ensaio.valor === 'string'
                          ? ensaio.valor
                          : ''))))
          : undefined,
        // Removidos valorTimestamp / valor_bruto conforme solicitado
        tecnica: ensaio.tecnica || `ensaio${String(ensaio.id).padStart(2, '0')}`,
        tipo: 'ENSAIO',
        responsavel: typeof ensaio.responsavel === 'object' && ensaio.responsavel !== null
          ? ensaio.responsavel.value
          : ensaio.responsavel,
        digitador: this.digitador,
        tempo_previsto: ensaio.tempo_previsto,
        tipo_ensaio: ensaio.tipo_ensaio_detalhes?.nome,
        funcao: ensaio.funcao || null,
        norma: ensaio.norma || null,
        estado: ensaio.estado || null,
        unidade: ensaio.unidade || null,
        garantia: ensaio.garantia || null,
        numero_cadinho: ensaio.numero_cadinho || null, // NOVO: Adicionar número do cadinho
        variaveis_utilizadas: variaveisUtilizadas,
        variaveis: variaveisDoEnsaio.reduce((acc: any, v: any) => {
          const isVarData = this.isVariavelTipoData(v) || /data|modelagem|moldagem|rompimento/i.test(v.nome || '');
          let valorStr: string | null = null;
          let valorTs: number | null = null;
          // Normalizar origem
          if (isVarData) {
            if (v.valorData instanceof Date && !isNaN(v.valorData.getTime())) {
              const d = new Date(v.valorData.getFullYear(), v.valorData.getMonth(), v.valorData.getDate());
              valorTs = d.getTime();
              valorStr = this.toLocalYYYYMMDD(d);
            } else if (typeof v.valorTimestamp === 'number' && v.valorTimestamp > 946684800000) {
              const d = new Date(v.valorTimestamp);
              valorTs = v.valorTimestamp;
              valorStr = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            } else if (typeof v.valor === 'string' && /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/.test(v.valor)) {
              const d = this.parseDateLocal(v.valor);
              if (d) {
                valorTs = d.getTime();
                valorStr = /(\d{4}-\d{2}-\d{2})/.test(v.valor) ? v.valor : this.toLocalYYYYMMDD(d);
              }
            }
          }
          let valorSerializado: any;
            if (isVarData) {
              // Para variável de data: valor numérico = timestamp, valor_data separado
              valorSerializado = valorTs !== null ? valorTs : (valorStr || null);
            } else {
              if (v.valor !== undefined && v.valor !== null) {
                const n = Number(v.valor);
                valorSerializado = isNaN(n) ? v.valor : n;
              } else {
                valorSerializado = null;
              }
            }
          acc[v.tecnica] = {
            descricao: v.nome,
            valor: valorSerializado,
            valor_data: isVarData ? valorStr : undefined
          };
          return acc;
        }, {})
      };
    })
  );
  // Criar um único registro com todos os ensaios
  const ensaios = [{
    descricao: `Análise Completa - ${analiseData.ordemTipo}`,
    valores: 'MULTIPLOS', // Indicar que há múltiplos valores
    responsavel: this.digitador,
    digitador: this.digitador,
    tempo_previsto: '1 Hora',
    tipo: 'ANALISE_COMPLETA',
    funcao: null,
    variaveis_utilizadas: [],
    ensaios_utilizados: todosEnsaios
  }];
  // Montar cálculos (funciona para ambos os tipos)
 const calculos = planoDetalhes.flatMap((plano: any) =>
  (plano.calculo_ensaio_detalhes || []).map((calc: any) => ({
    calculos: calc.descricao,
    resultados: (() => {
      const r = calc.resultado;
      if (typeof r === 'string' && /^(\d{4}-\d{2}-\d{2})$/.test(r)) return r;
      if (typeof r === 'string' && /^(\d{2}\/\d{2}\/\d{4})$/.test(r)) return r;
      if (typeof r === 'number') return parseFloat(this.formatForDisplay(r));
      return r;
    })(),
    responsavel: (typeof calc.responsavel === 'object' && calc.responsavel !== null) ? (calc.responsavel as any).value : (calc.responsavel || null),
    digitador: this.digitador,
    ensaios_utilizados: (calc.ensaios_detalhes || []).map((e: any) => {
      // Buscar dados completos do ensaio nos ensaios diretos do plano
      const ensaioDireto = plano.ensaio_detalhes?.find((ed: any) => 
        ed.id === e.id || 
        ed.descricao === e.descricao ||
        ed.tecnica === e.tecnica
      );
      // Buscar dados nos ensaios disponíveis como fallback
      const ensaioCompleto = ensaioDireto || this.ensaiosDisponiveis?.find((disp: any) =>
        disp.id === e.id ||
        disp.descricao === e.descricao ||
        this.normalize(disp.descricao) === this.normalize(e.descricao)
      );
      // Montar variáveis utilizadas
      const variaveisTodas = Array.isArray(e.variavel_detalhes)
        ? e.variavel_detalhes.map((v: any) => ({
            nome: v.nome,
            valor: v.valor,
            tecnica: v.tecnica || v.varTecnica || v.nome
          }))
        : [];
      let variaveisFiltradas = variaveisTodas;
      if (e.funcao) {
        const varsNaFuncao = Array.from(new Set((e.funcao.match(/var\d+/g) || [])));
        variaveisFiltradas = variaveisTodas.filter((v: any) => varsNaFuncao.includes(v.tecnica));
      }
        const variaveisDict = variaveisFiltradas.reduce((acc: any, v: any) => {
        const varEhData = this.isVariavelTipoData(v) || /data|modelagem|moldagem|rompimento/i.test(v.nome || '');
        let valorTs: number | null = null;
        let valorStr: string | null = null;
        if (varEhData) {
          if (v.valorData instanceof Date && !isNaN(v.valorData.getTime())) {
            const d = new Date(v.valorData.getFullYear(), v.valorData.getMonth(), v.valorData.getDate());
            valorTs = d.getTime();
            valorStr = this.toLocalYYYYMMDD(d);
          } else if (typeof v.valorTimestamp === 'number' && v.valorTimestamp > 946684800000) {
            const d = new Date(v.valorTimestamp);
            valorTs = v.valorTimestamp;
            valorStr = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
          } else if (typeof v.valor === 'string' && /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/.test(v.valor)) {
            const d = this.parseDateLocal(v.valor);
            if (d) {
              valorTs = d.getTime();
              valorStr = this.toLocalYYYYMMDD(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            }
          }
        }
        acc[v.tecnica] = {
          descricao: v.nome,
          valor: varEhData ? (valorTs !== null ? valorTs : (valorStr || null)) : (v.valor !== undefined && v.valor !== null ? Number(v.valor) : 0),
          valor_data: varEhData ? valorStr : undefined,
          valorTimestamp: varEhData && valorTs !== null ? valorTs : undefined
        };
        return acc;
      }, {});
      // Determinar se o ensaio interno é de data
      const eEhData = ((e.tipo_ensaio_detalhes?.nome || e.tipo_ensaio || '')+ '').toLowerCase() === 'data'
        || /data|modelagem|moldagem|rompimento/.test(e.unidade || '')
        || /adicionarDias|hoje|diasEntre/i.test(e.funcao || '');
      // Consolidar timestamp final para ensaio interno
      let tsInterno: number | null = null;
      if (typeof e.valorTimestamp === 'number' && e.valorTimestamp > 946684800000) tsInterno = e.valorTimestamp;
      else if (typeof e.valor === 'number' && e.valor > 946684800000) tsInterno = e.valor;
      else if (typeof e.valor === 'string' && /(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})/.test(e.valor)) {
        const d = this.parseDateLocal(e.valor);
        if (d) tsInterno = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      }
      // Se ainda não tem e há função adicionarDias, tentar reconstruir
      if (eEhData && (tsInterno === null || tsInterno < 946684800000) && /adicionarDias/i.test(e.funcao || '') && Array.isArray(e.variavel_detalhes)) {
        try {
          const mDias = (e.funcao || '').match(/adicionarDias\s*\(\s*(var\d+)\s*,\s*(\d+)\s*\)/i);
          if (mDias) {
            const varTk = mDias[1];
            const diasAdd = parseInt(mDias[2], 10) || 0;
            const varBase = e.variavel_detalhes.find((v: any) => v.tecnica === varTk);
            if (varBase) {
              let baseDate: Date | null = null;
              if (varBase.valorData instanceof Date) baseDate = varBase.valorData;
              else if (typeof varBase.valorTimestamp === 'number') baseDate = new Date(varBase.valorTimestamp);
              else if (typeof varBase.valor === 'string') baseDate = this.parseDateLocal(varBase.valor);
              if (baseDate) {
                const norm = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                const res = new Date(norm.getFullYear(), norm.getMonth(), norm.getDate() + diasAdd);
                tsInterno = res.getTime();
              }
            }
          }
        } catch {}
      }
      const valorDataInterno = eEhData && tsInterno ? this.toLocalYYYYMMDD(new Date(tsInterno)) : undefined;
      return {
        id: e.id,
        descricao: e.descricao,
        valor: eEhData ? (tsInterno || 0) : this.round2(e.valor),
        valor_data: eEhData ? valorDataInterno : undefined,
        variavel: e.variavel || e.tecnica,
        responsavel: typeof e.responsavel === 'object' && e.responsavel !== null
          ? e.responsavel.value
          : e.responsavel,
        digitador: e.digitador || this.digitador,
        numero_cadinho: e.numero_cadinho || null,
        funcao: e.funcao || null,       
        // Buscar dados completos com fallbacks**
        garantia: e.garantia || ensaioCompleto?.garantia || ensaioDireto?.garantia || null,
        tipo_ensaio: e.tipo_ensaio_detalhes?.nome || ensaioCompleto?.tipo_ensaio_detalhes?.nome || ensaioDireto?.tipo_ensaio_detalhes?.nome || null,
        norma: e.norma || ensaioCompleto?.norma || ensaioDireto?.norma || null,
        estado: e.estado || ensaioCompleto?.estado || ensaioDireto?.estado || null,
        unidade: e.unidade || ensaioCompleto?.unidade || ensaioDireto?.unidade || null,    
        // Campos adicionais que podem ser úteis**
        tempo_previsto: e.tempo_previsto || ensaioCompleto?.tempo_previsto || ensaioDireto?.tempo_previsto || null,
        tecnica: e.tecnica || ensaioCompleto?.tecnica || ensaioDireto?.tecnica || `ensaio${String(e.id).padStart(2, '0')}`,
        variaveis_utilizadas: variaveisFiltradas,
        variaveis: variaveisDict,
      };
    })
  }))
);
  const idAnalise = this.analiseId ?? 0;
  const payload = {
    estado: 'PENDENTE',
    ensaios: ensaios,
    calculos: calculos,
    // Campos adicionais (snake_case) esperados pelo backend
    metodo_modelagem: this.analise?.metodoModelagem ?? null,
    metodo_muro: this.analise?.metodoMuro ?? null,
    observacoes_muro: this.analise?.observacoesMuro ?? null
  };
  // Chamada para salvar a análise no backend
  this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    next: () => {
      this.markAsSaved(); // Marcar como salvo após sucesso
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Análise salva com sucesso!' });
      setTimeout(() => {
        this.router.navigate(['/welcome/controleQualidade/ordem']);
      }, 1000);
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar análise.' });
    }
  });
}
//================================================FIM=================================
// ============================Processar resultados anteriores ==========================
processarResultadosAnteriores(resultados: any[], calcAtual: any) { 
  if (!resultados || !Array.isArray(resultados) || resultados.length === 0) {
    this.resultadosAnteriores = [];
    return;
  }
  // Agrupar por análise_id
  const analiseMap = new Map();
  resultados.forEach((item: any, index: number) => {
    const analiseId = item.analise_id;
    if (!analiseMap.has(analiseId)) {
      // Inicializar dados da análise
      analiseMap.set(analiseId, {
        analiseId: analiseId,
        amostraNumero: item.amostra_numero || 'N/A',
        dataAnalise: item.data_analise || new Date(),
        dataFormatada: this.datePipe.transform(item.data_analise || new Date(), 'dd/MM/yyyy HH:mm') || 'Data não disponível',
        responsavel: item.responsavel || item.ensaio_responsavel || 'N/A',
        digitador: item.digitador || item.ensaio_digitador || 'N/A',
        resultadoCalculo: null,
        ensaiosUtilizados: []
      });
    }
    const analiseData = analiseMap.get(analiseId);
    // CORREÇÃO: Processar qualquer item que tenha resultado_calculo válido
    if (item.resultado_calculo !== null && item.resultado_calculo !== undefined && item.resultado_calculo !== '') {
      analiseData.resultadoCalculo = item.resultado_calculo;
      // Adicionar o próprio cálculo como "ensaio" para aparecer na lista
      const descricaoCalculo = item.calculo_descricao || item.descricao || calcAtual.descricao || 'Cálculo';
      // Construir lista de variáveis do cálculo (varNN e ensaioNN) com seus valores atuais
      const tokens = Array.from(new Set((calcAtual.funcao?.match(/\b(var\d+|ensaio\d+)\b/g) || []))) as string[];
      const variaveis: any[] = [];
      const variaveisUtilizadas: any[] = [];
      // Criar mapa de ensaios do cálculo para incluir variavel_detalhes
      const ensaiosUtilizadosMap: any[] = [];
      tokens.forEach((tk) => {
        let valor = 0;
        let desc = '';
        let ensaioRef = null;  
        if (/^var\d+$/.test(tk)) {
          const ens = Array.isArray(calcAtual.ensaios_detalhes) ? calcAtual.ensaios_detalhes.find((e: any) => e.tecnica === tk || e.variavel === tk) : null;
          if (ens) {
            ensaioRef = ens;
            if (typeof ens.valorTimestamp === 'number') valor = ens.valorTimestamp;
            else if (typeof ens.valor === 'string') {
              const d = new Date(ens.valor);
              valor = isNaN(d.getTime()) ? Number(ens.valor) || 0 : d.getTime();
            } else {
              valor = typeof ens.valor === 'number' ? ens.valor : Number(ens.valor) || 0;
            }
            desc = ens.descricao || '';
          }
          variaveis.push({ nome: tk, valor, tecnica: tk, descricao: desc });
          variaveisUtilizadas.push({ nome: tk, valor, tecnica: tk, descricao: desc });
        } else if (/^ensaio\d+$/.test(tk)) {
          // procurar dentro do cálculo por tecnica/variavel/descricao ou id no token
          let ens = Array.isArray(calcAtual.ensaios_detalhes)
            ? calcAtual.ensaios_detalhes.find((e: any) => this.tokensIguais(e.tecnica, tk) || this.tokensIguais(e.variavel, tk))
            : null;
          if (!ens && Array.isArray(calcAtual.ensaios_detalhes)) {
            ens = calcAtual.ensaios_detalhes.find((e: any) => typeof e.descricao === 'string' && (e.descricao.includes(tk) || this.normalize(e.descricao) === this.normalize(tk)));
          }
          if (!ens && Array.isArray(calcAtual.ensaios_detalhes)) {
            const m = tk.match(/ensaio(\d+)/);
            const idNum = m ? parseInt(m[1], 10) : NaN;
            if (!isNaN(idNum)) ens = calcAtual.ensaios_detalhes.find((e: any) => String(e.id) === String(idNum));
          }
          if (ens) {
            ensaioRef = ens;
            if (typeof ens.valorTimestamp === 'number') valor = ens.valorTimestamp;
            else if (typeof ens.valor === 'string') {
              const d = new Date(ens.valor);
              valor = isNaN(d.getTime()) ? Number(ens.valor) || 0 : d.getTime();
            } else {
              valor = typeof ens.valor === 'number' ? ens.valor : Number(ens.valor) || 0;
            }
            desc = ens.descricao || '';
          }
          variaveisUtilizadas.push({ nome: tk, valor, tecnica: tk, descricao: desc });
        }
        // Adicionar ensaio aos ensaios_utilizados se não existir ainda
        if (ensaioRef && !ensaiosUtilizadosMap.find(e => e.id === ensaioRef.id)) {
          ensaiosUtilizadosMap.push({
            id: ensaioRef.id,
            descricao: ensaioRef.descricao || '',
            valor: ensaioRef.valor || 0,
            responsavel: ensaioRef.responsavel || item.responsavel || 'N/A',
            digitador: ensaioRef.digitador || item.digitador || 'N/A',
            numero_cadinho: ensaioRef.numero_cadinho || null,
            variaveis_utilizadas: Array.isArray(ensaioRef.variavel_detalhes) ? ensaioRef.variavel_detalhes.map((v: any) => ({
              nome: v.nome || v.tecnica || '',
              valor: v.valor || 0,
              tecnica: v.tecnica || '',
              descricao: v.descricao || '',
              tipo: v.tipo || 'number'
            })) : []
          });
        }
      });
      const jaExisteCalculo = analiseData.ensaiosUtilizados.find((e: any) => 
        e.tipo === 'CALCULO' && e.descricao === descricaoCalculo
      ); 
      if (!jaExisteCalculo) {
        const calculoItem = {
          id: `calculo_${analiseId}`,
          descricao: descricaoCalculo,
          valor: item.resultado_calculo,
          responsavel: item.responsavel || item.digitador || 'N/A',
          digitador: item.digitador || 'N/A',
          tipo: 'CALCULO',
          funcao: calcAtual.funcao,
          variaveis,
          variaveis_utilizadas: variaveisUtilizadas,
          ensaios_utilizados: ensaiosUtilizadosMap,
          estado: item.estado || 'N/A',
        };
        analiseData.ensaiosUtilizados.push(calculoItem);
      }
      // Espelhar um objeto ultimo_calculo com os mesmos dados para fácil acesso
      (analiseData as any).ultimo_calculo = {
        id: `calculo_${analiseId}`,
        descricao: descricaoCalculo,
        valor: item.resultado_calculo,
        responsavel: item.responsavel || item.digitador || 'N/A',
        digitador: item.digitador || 'N/A',
        tipo: 'CALCULO',
        funcao: calcAtual.funcao,
        variaveis,
        variaveis_utilizadas: variaveisUtilizadas,
        ensaios_utilizados: ensaiosUtilizadosMap,
      };
    } 
    if (item.tipo === 'ENSAIO' && item.ensaio_descricao) {
      // CORREÇÃO AQUI: tratar valor_ensaio como array
      if (item.valor_ensaio && Array.isArray(item.valor_ensaio)) {
        item.valor_ensaio.forEach((valorItem: any) => {
          // Verificar se este ensaio é usado no cálculo atual
          const ensaioUsado = calcAtual.ensaios_detalhes?.some((e: any) => 
            e.id === valorItem.id || 
            e.descricao === valorItem.descricao ||
            this.normalize(e.descricao) === this.normalize(valorItem.descricao)
          );
          if (ensaioUsado) {
            // Verificar se já existe este ensaio na lista
            const ensaioExistente = analiseData.ensaiosUtilizados.find((e: any) => 
              e.id === valorItem.id || e.descricao === valorItem.descricao
            );
            if (!ensaioExistente) {
              analiseData.ensaiosUtilizados.push({
                id: valorItem.id,
                descricao: valorItem.descricao,
                valor: valorItem.valor, // Usar o valor do objeto
                responsavel: item.ensaio_responsavel || 'N/A',
                digitador: item.ensaio_digitador || 'N/A',
                numero_cadinho: item.numero_cadinho || valorItem.numero_cadinho || null // NOVO: Número do cadinho
              });
            }
          }
        });
      } else if (item.valor_ensaio) {
        // Se não for array, tratar como valor simples (fallback)
        const ensaioUsado = calcAtual.ensaios_detalhes?.some((e: any) => 
          e.id === item.ensaio_id || 
          e.descricao === item.ensaio_descricao ||
          this.normalize(e.descricao) === this.normalize(item.ensaio_descricao)
        );
        if (ensaioUsado) {
          const ensaioExistente = analiseData.ensaiosUtilizados.find((e: any) => 
            e.id === item.ensaio_id || e.descricao === item.ensaio_descricao
          );
          if (!ensaioExistente) {
            analiseData.ensaiosUtilizados.push({
              id: item.ensaio_id,
              descricao: item.ensaio_descricao,
              valor: item.valor_ensaio,
              responsavel: item.ensaio_responsavel || 'N/A',
              digitador: item.ensaio_digitador || 'N/A',
              numero_cadinho: item.numero_cadinho || null // NOVO: Número do cadinho
            });
          }
        }
      }
      // Atualizar dados básicos se não foram definidos
      if (analiseData.responsavel === 'N/A' && item.ensaio_responsavel) {
        analiseData.responsavel = item.ensaio_responsavel;
      }
    }

    // Processar ensaios do campo ensaios_utilizados (JSON parseado)
    if (item.ensaios_utilizados_parsed && Array.isArray(item.ensaios_utilizados_parsed)) {
        item.ensaios_utilizados_parsed.forEach((ensaioParsed: any, ensaioIndex: number) => {
        // Verificar se este ensaio deve ser incluído (baseado no contexto)
        let adicionar = true;
        if (calcAtual.ensaios_detalhes) {
          adicionar = calcAtual.ensaios_detalhes.some((e: any) =>
            e.id === ensaioParsed.id ||
            e.descricao === ensaioParsed.descricao ||
            this.normalize(e.descricao) === this.normalize(ensaioParsed.descricao)
          );
        } else if (calcAtual.id) {
          adicionar = ensaioParsed.id === calcAtual.id ||
                      ensaioParsed.descricao === calcAtual.descricao;
        }
        if (adicionar) {
          const jaExiste = analiseData.ensaiosUtilizados.find((e: any) =>
          e.id === ensaioParsed.id || e.descricao === ensaioParsed.descricao
        );  
        if (!jaExiste) {
            analiseData.ensaiosUtilizados.push({
              id: ensaioParsed.id,
              descricao: ensaioParsed.descricao,
              valor: ensaioParsed.valor,
              responsavel: ensaioParsed.responsavel || 'N/A',
              digitador: ensaioParsed.digitador || 'N/A',
              numero_cadinho: ensaioParsed.numero_cadinho || null // NOVO: Número do cadinho do JSON parseado
            });
          } 
        } 
      });
    }
  });
  // Exibe históricos de cálculo OU ensaio direto
  const resultadosProcessados = Array.from(analiseMap.values());
  this.resultadosAnteriores = resultadosProcessados
    .filter((item: any) => {
      const temEnsaios = item.ensaiosUtilizados.length > 0;
      return temEnsaios;
    })
    .sort((a: any, b: any) => new Date(b.dataAnalise).getTime() - new Date(a.dataAnalise).getTime());
  // DEBUG: Verificar se a variável está sendo atualizada
  if (this.resultadosAnteriores.length > 0) {
    this.resultadosAnteriores.forEach((resultado: any, idx: number) => {
    });
  } 
}
  // ============================= MÉTODOS PARA ADICIONAR/REMOVER ENSAIOS E CÁLCULOS =============================

  carregarEnsaiosECalculosDisponiveis(): void {
    // Carregar ensaios disponíveis
    this.ensaioService.getEnsaios().subscribe({
      next: (ensaios) => {
        this.ensaiosDisponiveis = ensaios;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar ensaios disponíveis.'
        });
      }
    });
    // Carregar cálculos disponíveis
    this.ensaioService.getCalculoEnsaio().subscribe({
      next: (calculos) => {
        this.calculosDisponiveis = calculos;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar cálculos disponíveis.'
        });
      }
    });
  }
  // Abre o modal para adicionar novos ensaios à análise   
  abrirModalAdicionarEnsaios(): void {
    if (!this.ensaiosDisponiveis.length) {
      this.carregarEnsaiosECalculosDisponiveis();
    }
    this.ensaiosSelecionadosParaAdicionar = [];
    this.modalAdicionarEnsaioVisible = true;
  }
  // Abre o modal para adicionar novos cálculos à análise
  abrirModalAdicionarCalculos(): void {
    if (!this.calculosDisponiveis.length) {
      this.carregarEnsaiosECalculosDisponiveis();
    }
    this.calculosSelecionadosParaAdicionar = [];
    this.modalAdicionarCalculoVisible = true;
  }
  //Adiciona os ensaios selecionados à análise atual
  adicionarEnsaios(): void {
    if (!this.ensaiosSelecionadosParaAdicionar.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione pelo menos um ensaio para adicionar.'
      });
      return;
    }
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma análise carregada.'
      });
      return;
    }
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    if (!planoDetalhes.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Estrutura da análise inválida.'
      });
      return;
    }
    const plano = planoDetalhes[0];
    if (!plano.ensaio_detalhes) {
      plano.ensaio_detalhes = [];
    }
    // Filtrar ensaios que já não estão na análise
    const ensaiosExistentesIds = plano.ensaio_detalhes.map((e: any) => e.id);
    const novosEnsaios = this.ensaiosSelecionadosParaAdicionar.filter(
      ensaio => !ensaiosExistentesIds.includes(ensaio.id)
    );
    if (!novosEnsaios.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Todos os ensaios selecionados já estão na análise.'
      });
      return;
    }
    // Adicionar novos ensaios com preenchimento automático de valores
      novosEnsaios.forEach(ensaio => {
      const responsavelPadrao = this.obterResponsavelPadrao();
      // 1) Montar variáveis com defaults se existirem
      let variaveisComDefaults: any[] = [];
      if (Array.isArray((ensaio as any).variavel_detalhes) && (ensaio as any).variavel_detalhes.length > 0) {
        // Clonar e normalizar estrutura esperada
        variaveisComDefaults = (ensaio as any).variavel_detalhes.map((v: any, idx: number) => ({
          nome: v.nome || `${v.tecnica || v.varTecnica || `var${idx+1}`}${ensaio.descricao ? ` (${ensaio.descricao})` : ''}`,
          tecnica: v.tecnica || v.varTecnica || v.nome || `var${idx+1}`,
          valor: typeof v.valor !== 'undefined' && v.valor !== null ? v.valor : 0,
          varTecnica: v.varTecnica || v.tecnica || `var${idx+1}`,
          tipo: v.tipo,
          id: v.id || `${ensaio.id}_${v.tecnica || v.varTecnica || `var${idx+1}`}`
        }));
      } else if ((ensaio as any).funcao) {
        // Criar variáveis pelos tokens da função
        variaveisComDefaults = this.criarVariaveisParaEnsaio(ensaio);
      }
      const valorBackend = (ensaio as any).valor;
      const valorFlex = this.parseNumeroFlex(valorBackend);
      const valorPrefill = (valorFlex !== null && valorFlex !== undefined && !isNaN(Number(valorFlex))) ? Number(valorFlex) : 0;
      const novoEnsaio = {
        ...ensaio,
      // 2) Prefill do valor: sempre preferir o valor que vem do backend, mesmo com função
      valor: valorPrefill,
      responsavel: (ensaio as any).responsavel || responsavelPadrao,
      digitador: this.digitador || '',
      variavel_detalhes: variaveisComDefaults
      } as any;
      // 3) Se houver função, calcular imediatamente SOMENTE se todas as variáveis tiverem defaults
      if (novoEnsaio.funcao && this.deveCalcularEnsaioComDefaults(novoEnsaio)) {
        try {
          this.calcularEnsaioDireto(novoEnsaio, plano);
        } catch (e) {
          console.warn('Falha ao calcular ensaio recém-adicionado com defaults:', e);
        }
      }
      plano.ensaio_detalhes.push(novoEnsaio);
    });
    // Atualizar referências nos cálculos e recalcular com os novos valores
    this.mapearEnsaiosParaCalculos();
    this.recalcularTodosEnsaiosDirectos(plano);
    this.recalcularTodosCalculos();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${novosEnsaios.length} ensaio(s) adicionado(s) com valores padrão aplicados.`
    });
    this.modalAdicionarEnsaioVisible = false;
    this.ensaiosSelecionadosParaAdicionar = [];
    // Sincronizar com a ordem expressa se for análise expressa
    if (this.isAnaliseExpressa()) {
      this.sincronizarComOrdemExpressa();
    }
    // Salvar imediatamente para garantir persistência dos valores padrão
    window.location.reload();
    this.getAnalise();
  }
  /**
   * Adiciona um novo ensaio diretamente ao plano, se ordem for EXPRESSA
   * @param planoIdx índice do plano em planoDetalhes
   * @param ensaio objeto do novo ensaio (pode ser vazio para template)
   */
  adicionarEnsaioDireto(planoIdx: number, ensaio?: any): void {
    const analiseData = this.analisesSimplificadas[0];
    if (!analiseData || analiseData.ordemTipo !== 'EXPRESSA') return;
    const planoDetalhes = analiseData.planoDetalhes || [];
    if (!planoDetalhes[planoIdx]) return;
    if (!planoDetalhes[planoIdx].ensaio_detalhes) planoDetalhes[planoIdx].ensaio_detalhes = [];
    const responsavelPadrao = this.obterResponsavelPadrao();
    // Quando vier um ensaio com defaults, respeitar
    let variaveisComDefaults: any[] = [];
    if (ensaio && Array.isArray(ensaio.variavel_detalhes) && ensaio.variavel_detalhes.length > 0) {
      variaveisComDefaults = ensaio.variavel_detalhes.map((v: any, idx: number) => ({
        nome: v.nome || `${v.tecnica || v.varTecnica || `var${idx+1}`}${ensaio.descricao ? ` (${ensaio.descricao})` : ''}`,
        tecnica: v.tecnica || v.varTecnica || v.nome || `var${idx+1}`,
        valor: typeof v.valor !== 'undefined' && v.valor !== null ? v.valor : 0,
        varTecnica: v.varTecnica || v.tecnica || `var${idx+1}`,
        tipo: v.tipo,
        id: v.id || `${ensaio.id}_${v.tecnica || v.varTecnica || `var${idx+1}`}`
      }));
    } else if (ensaio && ensaio.funcao) {
      variaveisComDefaults = this.criarVariaveisParaEnsaio(ensaio);
    }
    const valorBackend = ensaio ? ensaio.valor : undefined;
    const valorFlex = this.parseNumeroFlex(valorBackend);
    const valorPrefill = (valorFlex !== null && valorFlex !== undefined && !isNaN(Number(valorFlex))) ? Number(valorFlex) : 0;
    const novoEnsaio = ensaio ? {
      ...ensaio,
      // Preferir valor do backend; só recalcular se todas variáveis possuem defaults
      valor: valorPrefill,
      responsavel: ensaio.responsavel || responsavelPadrao || this.digitador || '',
      digitador: this.digitador || '',
      variavel_detalhes: variaveisComDefaults
    } : {
      id: Date.now(),
      descricao: '',
      valor: 0,
      responsavel: responsavelPadrao || this.digitador || '',
      variavel_detalhes: [],
      funcao: '',
      tipo_ensaio_detalhes: { nome: 'EXPRESSA' }
    };
    // Calcular imediatamente se houver função E todas as variáveis tiverem defaults
    if (novoEnsaio.funcao && this.deveCalcularEnsaioComDefaults(novoEnsaio)) {
      try { this.calcularEnsaioDireto(novoEnsaio, planoDetalhes[planoIdx]); } catch {}
    }
    planoDetalhes[planoIdx].ensaio_detalhes.push(novoEnsaio);
    // Recalcular dependências e salvar automaticamente
    this.recalcularTodosEnsaiosDirectos(planoDetalhes[planoIdx]);
    this.recalcularTodosCalculos();
    this.salvarAnaliseResultados();
    // Atualização visual: reconsultar análise após salvar para não perder valores
    this.getAnalise();
    window.location.reload();
  }
  /**
   * Remove um ensaio do plano, se ordem for EXPRESSA
   * @param planoIdx índice do plano em planoDetalhes
   * @param ensaioIdx índice do ensaio em ensaio_detalhes
   */
  removerEnsaioDireto(planoIdx: number, ensaioIdx: number): void {
    const analiseData = this.analisesSimplificadas[0];
    if (!analiseData || analiseData.ordemTipo !== 'EXPRESSA') return;
    const planoDetalhes = analiseData.planoDetalhes || [];
    if (!planoDetalhes[planoIdx] || !planoDetalhes[planoIdx].ensaio_detalhes) return;
    planoDetalhes[planoIdx].ensaio_detalhes.splice(ensaioIdx, 1);
    window.location.reload();
  }
  adicionarCalculos(): void {
    if (!this.calculosSelecionadosParaAdicionar.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione pelo menos um cálculo para adicionar.'
      });
      return;
    }
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma análise carregada.'
      });
      return;
    }
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    if (!planoDetalhes.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Estrutura da análise inválida.'
      });
      return;
    }
    const plano = planoDetalhes[0];
    if (!plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes = [];
    }
    // Filtrar cálculos que já não estão na análise
    const calculosExistentesIds = plano.calculo_ensaio_detalhes.map((c: any) => c.id);
    const novosCalculos = this.calculosSelecionadosParaAdicionar.filter(
      calculo => !calculosExistentesIds.includes(calculo.id)
    );
    if (!novosCalculos.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Todos os cálculos selecionados já estão na análise.'
      });
      return;
    }
    // Adicionar novos cálculos com estrutura padrão
    novosCalculos.forEach(calculo => {
      const novoCalculo = {
        ...calculo,
        resultado: null,
        responsavel: calculo.responsavel || null,
        digitador: this.digitador || '',
        // Associar os ensaios disponíveis na análise se o cálculo não tem ensaios específicos
        ensaios_detalhes: calculo.ensaios_detalhes && calculo.ensaios_detalhes.length > 0
          ? calculo.ensaios_detalhes
          : (plano.ensaio_detalhes || []).map((e: any) => ({ ...e }))
      };
      
      plano.calculo_ensaio_detalhes.push(novoCalculo);
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${novosCalculos.length} cálculo(s) adicionado(s) com sucesso.`
    });
    this.modalAdicionarCalculoVisible = false;
    this.calculosSelecionadosParaAdicionar = [];
    // Sincronizar com a ordem expressa se for análise expressa
    if (this.isAnaliseExpressa()) {
      this.sincronizarComOrdemExpressa();
    }
    // Recarregar toda a análise para forçar atualização total da página
    this.getAnalise();
    window.location.reload();
    this.cd.detectChanges();
  }
  removerEnsaio(ensaio: any, plano: any): void {    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o ensaio "${ensaio.descricao}" da análise?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (!plano.ensaio_detalhes) {
          return;
        }
        const index = plano.ensaio_detalhes.findIndex((e: any) => e.id === ensaio.id);
        if (index !== -1) {
          plano.ensaio_detalhes.splice(index, 1);
          // Remover referências deste ensaio dos cálculos
          if (plano.calculo_ensaio_detalhes) {
            plano.calculo_ensaio_detalhes.forEach((calc: any) => {
              if (calc.ensaios_detalhes) {
                calc.ensaios_detalhes = calc.ensaios_detalhes.filter((e: any) => e.id !== ensaio.id);
              }
            });
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Ensaio "${ensaio.descricao}" removido com sucesso.`
          });
          // Sincronizar com a ordem expressa se for análise expressa
          if (this.isAnaliseExpressa()) {
            this.sincronizarComOrdemExpressa();
          }
          this.cd.detectChanges();
        }
      }
    });
  }
  //Remove um cálculo da análise
  removerCalculo(calculo: any, plano: any): void {    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o cálculo "${calculo.descricao}" da análise?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        if (!plano.calculo_ensaio_detalhes) {
          return;
        }
        const index = plano.calculo_ensaio_detalhes.findIndex((c: any) => c.id === calculo.id);
        if (index !== -1) {
          plano.calculo_ensaio_detalhes.splice(index, 1);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Cálculo "${calculo.descricao}" removido com sucesso.`
          });
          // Sincronizar com a ordem expressa se for análise expressa
          if (this.isAnaliseExpressa()) {
            this.sincronizarComOrdemExpressa();
          }
          this.cd.detectChanges();
        }
      }
    });
  }
  //Verifica se a análise é do tipo expressa (pode adicionar/remover ensaios e cálculos) 
  isAnaliseExpressa(): boolean {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) return false;
    const analiseData = this.analisesSimplificadas[0];
    return analiseData?.ordemTipo === 'EXPRESSA';
  }
  //Verifica se a análise permite edição (apenas para análises expressas)
  podeEditarEnsaiosCalculos(): boolean {
    const isExpressa = this.isAnaliseExpressa();
    const hasPermission = this.hasGroup(['Admin', 'Master', 'LabGestor']);    
    return isExpressa && hasPermission;
  }
  // Cria variáveis iniciais para um ensaio com função
  private criarVariaveisParaEnsaio(ensaio: any): any[] {
    if (!ensaio.funcao) return [];
    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    const descricao = ensaio.descricao || '';
    return varList.map((varName, index) => ({
      nome: descricao ? `${varName} (${descricao})` : varName,
      tecnica: varName,
      valor: 0,
      varTecnica: varName,
      id: `${ensaio.id}_${varName}`
    }));
  }
  // Atualiza os nomes das variáveis de um ensaio quando a descrição muda
  atualizarNomesVariaveisEnsaio(ensaio: any): void {
    if (!ensaio || !Array.isArray(ensaio.variavel_detalhes)) return;
    const descricao = ensaio.descricao || '';
    ensaio.variavel_detalhes.forEach((v: any) => {
      v.nome = descricao ? `${v.tecnica} (${descricao})` : v.tecnica;
    });
  }
  //Obtém o nome de exibição amigável para uma variável
  getVariavelDisplayName(variavel: any, ensaio: any): string {
    if (!variavel.nome || variavel.nome === variavel.tecnica) {
      // Se o nome não existe ou é igual ao técnico, criar um nome amigável
      return `${variavel.tecnica} (${ensaio.descricao})`;
    }
    return variavel.nome;
  }
  // Obtém ensaios disponíveis para adicionar (exclui os já presentes na análise)
  getEnsaiosDisponiveis(): any[] {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      return this.ensaiosDisponiveis;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    const ensaiosExistentesIds = planoDetalhes.flatMap((plano: any) => 
      (plano.ensaio_detalhes || []).map((e: any) => e.id)
    );
    return this.ensaiosDisponiveis.filter(ensaio => 
      !ensaiosExistentesIds.includes(ensaio.id) && 
      ensaio.tipo_ensaio_detalhes?.nome !== 'Auxiliar' && 
      ensaio.tipo_ensaio_detalhes?.nome !== 'Resistencia'
    );
  }
  // Obtém cálculos disponíveis para adicionar (exclui os já presentes na análise)
  getCalculosDisponiveis(): any[] {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      return this.calculosDisponiveis;
    }
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    const calculosExistentesIds = planoDetalhes.flatMap((plano: any) => 
      (plano.calculo_ensaio_detalhes || []).map((c: any) => c.id)
    );
    return this.calculosDisponiveis.filter(calculo => 
      !calculosExistentesIds.includes(calculo.id) && 
      !calculo.descricao.includes('(Cálculo composto Cal)') && 
      !calculo.descricao.includes('(Calc PN Cal)') && 
      !calculo.descricao.includes('(Calc PN Calc Cal)')
    );
  }
  //Fecha o modal de adicionar ensaios
  fecharModalAdicionarEnsaios(): void {
    this.modalAdicionarEnsaioVisible = false;
    this.ensaiosSelecionadosParaAdicionar = [];
  }
  //Sincroniza ensaios e cálculos adicionados manualmente com a ordem expressa
  private sincronizarComOrdemExpressa(): void {
    if (!this.isAnaliseExpressa() || !this.analisesSimplificadas.length) {
      return;
    }
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    if (!planoDetalhes.length) return;
    const plano = planoDetalhes[0];
    const ordemExpressaId = analiseData.ordemId;
    // Preparar IDs dos ensaios e cálculos atuais
    const ensaiosIds = (plano.ensaio_detalhes || []).map((e: any) => e.id).filter((id: any) => id);
    const calculosIds = (plano.calculo_ensaio_detalhes || []).map((c: any) => c.id).filter((id: any) => id);
    // Chamar o backend para atualizar a ordem expressa
    this.ordemService.atualizarEnsaiosCalculosExpressa(ordemExpressaId, ensaiosIds, calculosIds).subscribe({
      next: (response: any) => {
        // ...
      },
      error: (error: any) => {
        // ...
      }
    });
  }
//Atualiza a ordem de uma variável dentro do ensaio
atualizarOrdemVariavel(variavel: any, novaOrdem: number): void {
  variavel.ordem = novaOrdem;
  // Reordenar array baseado na nova ordem
  this.ensaioSelecionado.variavel_detalhes.sort((a: { ordem: any; }, b: { ordem: any; }) => (a.ordem || 0) - (b.ordem || 0));
}
//Obtém as variáveis ordenadas de um ensaio
getVariaveisOrdenadas(variaveis: any[]): any[] {
  if (!variaveis) return []; 
  return variaveis.sort((a, b) => {
    // Se tem campo ordem definido, usa ele
    if (a.ordem !== undefined && b.ordem !== undefined) {
      return a.ordem - b.ordem;
    }
    // Caso contrário, ordena por nome
    if (a.nome && b.nome) {
      return a.nome.localeCompare(b.nome);
    }
    // Fallback por ID se existir
    if (a.id && b.id) {
      return a.id - b.id;
    }
    return 0;
  });
}
//Abre o modal para ordenar variáveis de um ensaio
abrirModalOrdemVariaveis(ensaio: any): void {
  this.ensaioSelecionado = ensaio; 
  // Inicializar campo ordem se não existir
  if (ensaio.variavel_detalhes && ensaio.variavel_detalhes.length > 0) {
    ensaio.variavel_detalhes.forEach((variavel: any, index: number) => {
      if (variavel.ordem === undefined || variavel.ordem === null) {
        variavel.ordem = index + 1;
      }
    });
  }
  this.modalOrdemVariaveisVisible = true;
}
//Move uma variável para cima ou para baixo na lista
moverVariavelPara(direcao: 'cima' | 'baixo', index: number): void {
  if (!this.ensaioSelecionado?.variavel_detalhes) return;
  const variaveis = this.ensaioSelecionado.variavel_detalhes;
  if (direcao === 'cima' && index > 0) {
    [variaveis[index], variaveis[index - 1]] = [variaveis[index - 1], variaveis[index]];
  } else if (direcao === 'baixo' && index < variaveis.length - 1) {
    [variaveis[index], variaveis[index + 1]] = [variaveis[index + 1], variaveis[index]];
  }
  // Atualizar campo ordem baseado na nova posição
    variaveis.forEach((variavel: any, i: number) => {
    variavel.ordem = i + 1;
  });
}
// =========================================== SISTEMA DE ALERTAS DE ROMPIMENTO ======
ngOnDestroy(): void {
  this.pararSistemaAlertas();
  // Limpar timers de controle de alertas
  if (this.timerLimpezaAlertas) {
    clearTimeout(this.timerLimpezaAlertas);
  }
  if (this._ensaioChangeTimer) {
    clearTimeout(this._ensaioChangeTimer);
  }
  if (this._calculoChangeTimer) {
    clearTimeout(this._calculoChangeTimer);
  }
  this.alertasExibidos.clear();
}
//Inicializa o sistema de alertas de rompimento
iniciarSistemaAlertas(): void {
  if (!this.configAlerta.ativo) return;
  // Verificação inicial
  setTimeout(() => {
    this.verificarRompimentos();
  }, 9000); // Aguarda 3 segundos para dados carregarem
  // Configurar verificações periódicas
  this.intervalId = setInterval(() => {
    this.verificarRompimentos();
  }, this.intervaloPadrao);
}
//Para o sistema de alertas
pararSistemaAlertas(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
//Verifica todas as datas de rompimento e gera alertas
verificarRompimentos(): void {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return; 
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const novosAlertas: any[] = [];
  const chaveUnica = new Set<string>();
  this.analisesSimplificadas.forEach(analise => {
    analise.planoDetalhes?.forEach((plano: any) => {
      plano.ensaio_detalhes?.forEach((ensaio: any) => {
        if (this.ensaioTemVariavelData(ensaio) && ensaio.valor) {
          const alerta = this.analisarDataRompimento(ensaio, hoje);
          if (alerta) {
            if (!chaveUnica.has(alerta.id)) {
              chaveUnica.add(alerta.id);
              novosAlertas.push(alerta);
            }
          }
        }
      });
      // Incluir ensaios internos dos cálculos
      (plano.calculo_ensaio_detalhes || []).forEach((calc: any) => {
        (calc.ensaios_detalhes || []).forEach((ensaioInt: any) => {
          // Considerar como data se possui valor_data, valor timestamp grande ou unidade/descricao sugestiva
          const ehData = this.ensaioTemVariavelData(ensaioInt) ||
            (typeof ensaioInt.valor === 'number' && ensaioInt.valor > 946684800000) ||
            (typeof ensaioInt.valor_data === 'string' && /\d{4}-\d{2}-\d{2}/.test(ensaioInt.valor_data)) ||
            /(data|rompimento|modelagem|moldagem)/i.test(ensaioInt.unidade || '');
          if (ehData && (ensaioInt.valor || ensaioInt.valor_data)) {
            const alerta = this.analisarDataRompimento(ensaioInt, hoje, true, calc);
            if (alerta && !chaveUnica.has(alerta.id)) {
              chaveUnica.add(alerta.id);
              novosAlertas.push(alerta);
            }
          }
        });
      });
    });
  });
  // Atualizar alertas apenas se houver mudanças
  if (JSON.stringify(novosAlertas) !== JSON.stringify(this.alertasRompimento)) {
    this.alertasRompimento = novosAlertas;
    this.processarAlertas(novosAlertas);
  }
}
//Analisa uma data de rompimento específica
analisarDataRompimento(ensaio: any, hoje: Date, interno: boolean = false, calcRef?: any): any | null {
  try {
    // Estratégias de obtenção da data:
    // 1. Se houver valor_data (YYYY-MM-DD) usar
    // 2. Se valor é timestamp numérico grande, usar
    // 3. Se valor string DD/MM/YYYY ou YYYY-MM-DD, parsear
    // 4. fallback: tentar Date(valor)
    let dataRompimento: Date | null = null;
    const brute = ensaio.valor;
    const valorDataStr = ensaio.valor_data;
    if (typeof valorDataStr === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.test(valorDataStr)) {
      const [y,m,d] = valorDataStr.split('-').map((n: string)=>parseInt(n,10));
      dataRompimento = new Date(y, m-1, d);
    } else if (typeof brute === 'number' && brute > 946684800000) {
      dataRompimento = new Date(brute);
    } else if (typeof brute === 'string') {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(brute)) {
        const [d,m,y] = brute.split('/').map(n=>parseInt(n,10));
        dataRompimento = new Date(y, m-1, d);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(brute)) {
        const [y,m,d] = brute.split('-').map(n=>parseInt(n,10));
        dataRompimento = new Date(y, m-1, d);
      } else {
        const t = new Date(brute);
        if (!isNaN(t.getTime())) dataRompimento = t; else dataRompimento = null;
      }
    } else if (brute) {
      const t = new Date(brute);
      if (!isNaN(t.getTime())) dataRompimento = t;
    }
    if (!dataRompimento || isNaN(dataRompimento.getTime())) return null;
    dataRompimento.setHours(0, 0, 0, 0);
    const diferencaDias = Math.ceil((dataRompimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    let tipo: 'critico' | 'aviso' | 'vencido' | null = null;
    let mensagem = '';
    if (diferencaDias < 0) {
      tipo = 'vencido';
      mensagem = `Ensaio ${ensaio.descricao}${interno && calcRef ? ' (Cálculo: ' + calcRef.descricao + ')' : ''} VENCIDO há ${Math.abs(diferencaDias)} dia(s)!`;
    } else if (diferencaDias <= this.configAlerta.diasCritico) {
      tipo = 'critico';
      mensagem = `Ensaio ${ensaio.descricao}${interno && calcRef ? ' (Cálculo: ' + calcRef.descricao + ')' : ''} deve ser rompido HOJE!`;
    } else if (diferencaDias <= this.configAlerta.diasAviso) {
      tipo = 'aviso';
      mensagem = `Ensaio ${ensaio.descricao}${interno && calcRef ? ' (Cálculo: ' + calcRef.descricao + ')' : ''} deve ser rompido em ${diferencaDias} dia(s)`;
    }
    if (tipo) {
      return {
        id: `${interno ? 'INT' : 'DIR'}_${ensaio.id}_${dataRompimento.getTime()}`,
        ensaio: ensaio.descricao,
        dataRompimento: dataRompimento.toLocaleDateString('pt-BR'),
        diasRestantes: diferencaDias,
        tipo,
        mensagem,
        timestamp: new Date(),
        interno: interno,
        calculo: interno && calcRef ? calcRef.descricao : undefined
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao analisar data de rompimento:', error);
    return null;
  }
}
//Processa e exibe os alertas
processarAlertas(alertas: any[]): void {
  alertas.forEach(alerta => {
    this.exibirAlerta(alerta);
  });
}
//Exibe um alerta usando Toast
exibirAlerta(alerta: any): void {
  if (!this.messageService) return; 
  const severityMap: { [key: string]: string } = {
    'vencido': 'error',
    'critico': 'warn', 
    'aviso': 'info'
  };
  const titleMap: { [key: string]: string } = {
    'vencido': 'VENCIDO',
    'critico': 'CRÍTICO',
    'aviso': 'AVISO'
  };
  this.messageService.add({
    severity: severityMap[alerta.tipo] as any,
    summary: `Rompimento ${titleMap[alerta.tipo]}`,
    detail: alerta.mensagem,
    life: alerta.tipo === 'vencido' ? 0 : 10000, // Alertas vencidos ficam até serem fechados
    sticky: alerta.tipo === 'vencido'
  });
}
//Conta alertas por tipo
contarAlertas(tipo: string): number {
  return this.alertasRompimento.filter(a => a.tipo === tipo).length;
}
//Remove um alerta específico
removerAlerta(alertaId: string): void {
  this.alertasRompimento = this.alertasRompimento.filter(a => a.id !== alertaId);
}
//Limpa todos os alertas
limparTodosAlertas(): void {
  this.alertasRompimento = [];
}
//Alterna o estado de expansão de um ensaio
toggleEnsaioExpansion(ensaio: any): void {
  ensaio.expanded = !ensaio.expanded;
  this.verificarEstadoTodasLinhas();
  this.cd.detectChanges();
}
//=======================================================LINHAS EXPANDABLES=================================
//Expande ou recolhe todas as linhas de ensaios
toggleTodasLinhas(): void {
  this.todasExpandidas = !this.todasExpandidas;
  if (this.analisesSimplificadas && this.analisesSimplificadas.length > 0) {
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    planoDetalhes.forEach((plano: any) => {
      if (plano.ensaio_detalhes && Array.isArray(plano.ensaio_detalhes)) {
        plano.ensaio_detalhes.forEach((ensaio: any) => {
          ensaio.expanded = this.todasExpandidas;
        });
      }
    });
  }
  this.cd.detectChanges();
}
//Verifica se todas as linhas estão expandidas e atualiza o estado
private verificarEstadoTodasLinhas(): void {
  if (this.analisesSimplificadas && this.analisesSimplificadas.length > 0) {
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];  
    let totalEnsaios = 0;
    let ensaiosExpandidos = 0;
    planoDetalhes.forEach((plano: any) => {
      if (plano.ensaio_detalhes && Array.isArray(plano.ensaio_detalhes)) {
        totalEnsaios += plano.ensaio_detalhes.length;
        ensaiosExpandidos += plano.ensaio_detalhes.filter((ensaio: any) => ensaio.expanded).length;
      }
    });
    this.todasExpandidas = totalEnsaios > 0 && ensaiosExpandidos === totalEnsaios;
  }
}
//Alterna o estado de expansão de um cálculo
toggleCalculoExpansion(calculo: any): void {
  calculo.expanded = !calculo.expanded;
  this.verificarEstadoTodasCalculos();
  this.cd.detectChanges();
}
//Expande ou recolhe todas as linhas de cálculos
toggleTodasCalculos(): void {
  this.todasCalculosExpandidas = !this.todasCalculosExpandidas; 
  if (this.analisesSimplificadas && this.analisesSimplificadas.length > 0) {
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    planoDetalhes.forEach((plano: any) => {
      if (plano.calculo_ensaio_detalhes && Array.isArray(plano.calculo_ensaio_detalhes)) {
        plano.calculo_ensaio_detalhes.forEach((calculo: any) => {
          calculo.expanded = this.todasCalculosExpandidas;
        });
      }
    });
  }
  this.cd.detectChanges();
}
//Verifica se todas as linhas de cálculos estão expandidas e atualiza o estado
private verificarEstadoTodasCalculos(): void {
  if (this.analisesSimplificadas && this.analisesSimplificadas.length > 0) {
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];  
    let totalCalculos = 0;
    let calculosExpandidos = 0;
    planoDetalhes.forEach((plano: any) => {
      if (plano.calculo_ensaio_detalhes && Array.isArray(plano.calculo_ensaio_detalhes)) {
        totalCalculos += plano.calculo_ensaio_detalhes.length;
        calculosExpandidos += plano.calculo_ensaio_detalhes.filter((calculo: any) => calculo.expanded).length;
      }
    });
    this.todasCalculosExpandidas = totalCalculos > 0 && calculosExpandidos === totalCalculos;
  }
}

// =============================== Drawer de Resultados (Cálculos) =============================
abrirDrawerResultados(calculo: any, plano?: any): void {
  this.calculoSelecionadoParaPesquisa = calculo;
  this.drawerResultadosVisivel = true;
  this.carregandoResultados = true;
  this.resultadosAnteriores = [];
  // Descobrir quais ensaios devem ser usados na busca do histórico
  let ensaioIds: number[] = [];
  if (Array.isArray(calculo?.ensaios_detalhes) && calculo.ensaios_detalhes.length > 0) {
    ensaioIds = calculo.ensaios_detalhes.map((e: any) => Number(e.id)).filter((id: any) => !!id);
  } else if (plano?.ensaio_detalhes) {
    ensaioIds = (plano.ensaio_detalhes || []).map((e: any) => Number(e.id)).filter((id: any) => !!id);
  } else if (this.analisesSimplificadas?.[0]?.planoDetalhes?.[0]?.ensaio_detalhes) {
    ensaioIds = (this.analisesSimplificadas[0].planoDetalhes[0].ensaio_detalhes || []).map((e: any) => Number(e.id)).filter((id: any) => !!id);
  }
  const descricao = calculo?.descricao || '';
  if (!descricao || ensaioIds.length === 0) {
    this.carregandoResultados = false;
    this.cd.detectChanges();
    return;
  }
  this.analiseService?.getResultadosAnteriores(descricao, ensaioIds, 10).subscribe({
    next: (resultados: any[]) => {
      try {
        this.processarResultadosAnteriores(resultados, calculo);
      } finally {
        this.carregandoResultados = false;
        this.cd.detectChanges();
      }
    },
    error: (err: any) => {
      console.error('Erro ao carregar resultados anteriores (cálculo):', err);
      this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar histórico do cálculo.' });
      this.carregandoResultados = false;
      this.resultadosAnteriores = [];
      this.cd.detectChanges();
    }
  });
}
fecharDrawerResultados(): void {
  this.drawerResultadosVisivel = false;
  this.calculoSelecionadoParaPesquisa = null;
  this.cd.detectChanges();
}
fecharDrawerGarantias(): void {
  this.modalGarantiasVisible = false;
  this.cd.detectChanges();
}
// =============================== Drawer de Resultados (Ensaios) =============================
abrirDrawerResultadosEnsaios(ensaio: any): void {
  this.ensaioSelecionadoParaPesquisa = ensaio;
  this.drawerResultadosEnsaioVisivel = true;
  this.carregandoResultados = true;
  this.resultadosAnteriores = [];
  const ensaioId = Number(ensaio?.id);
  const descricao = ensaio?.descricao || '';
  if (!descricao || !ensaioId) {
    this.carregandoResultados = false;
    this.cd.detectChanges();
    return;
  }
  this.analiseService?.getResultadosAnterioresEnsaios(descricao, [ensaioId], 10).subscribe({
    next: (resultados: any[]) => {
      try {
        // Reuse do mesmo processador para padronizar a visualização
        this.processarResultadosAnteriores(resultados, { ensaios_detalhes: [{ id: ensaioId, descricao }] });
      } finally {
        this.carregandoResultados = false;
        this.cd.detectChanges();
      }
    },
    error: (err: any) => {
      console.error('Erro ao carregar resultados anteriores (ensaio):', err);
      this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar histórico do ensaio.' });
      this.carregandoResultados = false;
      this.resultadosAnteriores = [];
      this.cd.detectChanges();
    }
  });
}
fecharDrawerResultadosEnsaios(): void {
  this.drawerResultadosEnsaioVisivel = false;
  this.ensaioSelecionadoParaPesquisa = null;
  this.cd.detectChanges();
}
// Implementação do CanComponentDeactivate
canDeactivate(): boolean | Promise<boolean> {
    if (!this.hasUnsavedChanges) {
      return true;
    }
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: 'Você tem alterações não salvas. Deseja sair sem salvar?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sair sem salvar',
        rejectLabel: 'Continuar editando',
        accept: () => resolve(true),
        reject: () => resolve(false)
      });
    });
}
// Detectar tentativa de fechar janela/aba
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges) {
      $event.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
    }
  }
  // Marcar mudanças como não salvas
  private markAsChanged(): void {
    this.hasUnsavedChanges = true;
  }
  // Marcar como salvo
  private markAsSaved(): void {
    this.hasUnsavedChanges = false;
    this.lastSavedState = this.getCurrentState();
  }
  // Obter estado atual dos dados
  private getCurrentState(): string {
    try {
      return JSON.stringify({
        analisesSimplificadas: this.analisesSimplificadas,
        timestamp: new Date().getTime()
      });
    } catch (e) {
      return '';
    }
  }
  // Verificar se há mudanças
  private checkForChanges(): void {
    const currentState = this.getCurrentState();
    if (currentState !== this.lastSavedState && this.lastSavedState !== '') {
      this.hasUnsavedChanges = true;
    }
  }

  getItensArgamassa(analise: any) {
    return [
      { label: 'Determinação da Resistência Potencial de Aderência à Tração ao Substrato - Mpa', icon: 'pi pi-eye', command: () => this.abrirModalSubstrato(analise) },
      { label: 'Determinação da Resistência Potencial de Aderência à Tração Superficial', icon: 'pi pi-eye', command: () => this.abrirModalSuperficial(analise) },
      { label: 'Determinação da Variação Dimencional Linear (Retação/Expansão)', icon: 'pi pi-eye', command: () => this.abrirModalRetacao(analise) },
      { label: 'Módulo de Elasticidade Dinâmico', icon: 'pi pi-eye', command: () => this.abrirModalElasticidade(analise) },
      { label: 'Flexão', icon: 'pi pi-eye', command: () => this.abrirModalFlexao(analise) },
      { label: 'Compressão', icon: 'pi pi-eye', command: () => this.abrirModalCompressao(analise) },
      { label: 'Determinação do Coeficiente de Absorção de Água por Capilaridade', icon: 'pi pi-eye' },
      { label: 'Gráfico Capilaridade', icon: 'pi pi-eye', command: () => this.exibirGrafico() },
    ];
  }

  getAnaliseParecer(id: any){
     this.analiseService.getAnaliseById(id).subscribe
    (
      (analise) => {
        console.log('dentro',analise);
        console.log('dentro_parecer',analise.parecer);
        return analise.parecer;
      },
    );
  }


  abrirModalSubstrato(analise: any){

    if(this.parecer_substrato){
      this.linhasSubstrato = this.parecer_substrato.map((item: any, index: number) => ({
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
    }else if (analise?.parecer?.substrato && Array.isArray(analise.parecer.substrato)) {
      this.linhasSubstrato = analise.parecer.substrato.map((item: any, index: number) => ({
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
      while (this.linhasSubstrato.length < 10) {
        const numero = this.linhasSubstrato.length + 1;
        this.linhasSubstrato.push({
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
      this.linhasSubstrato = [];
      for (let i = 1; i <= 10; i++) {
        this.linhasSubstrato.push({
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
    this.modalDadosLaudoSubstrato = true;
  }
  salvarSubstrato(analise: any){
    let parecer = this.getAnaliseParecer(analise.id);

 
    console.log('prearfeder', parecer);
    this.parecer_substrato = this.linhasSubstrato;
    this.modalDadosLaudoSubstrato = false;


    this.jsonModal.substrato = this.linhasSubstrato;   

    const dadosAtualizados: Partial<Analise> = {
      parecer: this.jsonModal
    };
   
    this.analiseService.editAnaliseSuperficial(analise.id, dadosAtualizados).subscribe({
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
  }


  abrirModalSuperficial(analise: any){
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
    }else if (analise?.parecer?.superficial && Array.isArray(analise.parecer.superficial)) {
      this.linhasSuperficial = analise.parecer.superficial.map((item: any, index: number) => ({
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
      while (this.linhasSuperficial.length < 10) {
        const numero = this.linhasSuperficial.length + 1;
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
    this.modalDadosLaudoSuperficial = true;
  }
  salvarSuperficial(analise: any){
    this.parecer_superficial = this.linhasSuperficial;
    this.modalDadosLaudoSuperficial = false;
    alert('Salvo!');
  }


  abrirModalRetacao(analise: any){
    if(this.parecer_retacao){
      this.linhasRetacao = this.parecer_retacao.map((item: any, index: number) => ({
        data: item.data ?? '',
        idade: item.idade ?? null,
        media: item.media ?? null,
        desvio_maximo: item.desvio_maximo ?? null
      }));
    }else if (analise?.parecer?.retacao && Array.isArray(analise.parecer.retacao)) {
      this.linhasRetacao = analise.parecer.retacao.map((item: any, index: number) => ({
        data: item.data ?? '',
        idade: item.idade ?? null,
        media: item.media ?? null,
        desvio_maximo: item.desvio_maximo ?? null
      }));
      while (this.linhasRetacao.length < 3) {
        this.linhasRetacao.push({
          data: '',
          idade: null,
          media: null,
          desvio_maximo: null,      
        });
      }
    } else {
      this.linhasRetacao = [];
      for (let i = 1; i <= 3; i++) {
        this.linhasRetacao.push({
          data: '',
          idade: null,
          media: null,
          desvio_maximo: null,   
        });
      }
    }
    this.modalDadosLaudoRetacao = true;
  }
  salvarRetacao(analise: any){
    this.parecer_retacao = this.linhasRetacao;
    this.modalDadosLaudoRetacao = false;
    alert('Salvo!');
  }


  abrirModalElasticidade(analise: any){
    if(this.parecer_elasticidade){
      this.linhasElasticidade = this.parecer_elasticidade.map((item: any, index: number) => ({
        individual: item.individual ?? null,
        media: item.media ?? null,
        desvio_padrao: item.desvio_padrao ?? null
      }));
    }else if (analise?.parecer?.elasticidade && Array.isArray(analise.parecer.elasticidade)) {
      this.linhasElasticidade = analise.parecer.elasticidade.map((item: any, index: number) => ({
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
    this.modalDadosLaudoElasticidade = true;
  }
  salvarElasticidade(analise: any){
    this.parecer_elasticidade = this.linhasElasticidade;
    this.modalDadosLaudoElasticidade = false;
    alert('Salvo!');
  }


  abrirModalFlexao(analise: any){
    if(this.parecer_flexao){
      this.linhasFlexao = this.parecer_flexao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        flexao_n: item.flexao_n ?? null,
        flexao_mpa: item.flexao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_flexao: item.tracao_flexao ?? null
      }));
    }else if (analise?.parecer?.flexao && Array.isArray(analise.parecer.flexao)) {
      this.linhasFlexao = analise.parecer.flexao.map((item: any, index: number) => ({
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
    this.modalDadosLaudoFlexao = true;
  }
  salvarFlexao(analise: any){
    this.parecer_flexao = this.linhasFlexao;
    this.modalDadosLaudoFlexao = false;
    alert('Salvo!');
  }


  abrirModalCompressao(analise: any){
    if(this.parecer_compressao){
      this.linhasCompressao = this.parecer_compressao.map((item: any, index: number) => ({
        cp: item.cp ?? index + 1,
        compressao_n: item.compressao_n ?? null,
        compressao_mpa: item.compressao_mpa ?? null,
        media_mpa: item.media_mpa ?? null,
        tracao_compressao: item.tracao_compressao ?? null
      }));
    }else if (analise?.parecer?.compressao && Array.isArray(analise.parecer.compressao)) {
      this.linhasCompressao = analise.parecer.compressao.map((item: any, index: number) => ({
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
    this.modalDadosLaudoCompressao = true;
  }
  salvarCompressao(analise: any){

    this.parecer_compressao = this.linhasCompressao;
    this.modalDadosLaudoCompressao = false;
    alert('Salvo!');
  }

  // Getters para resolver erros de template
  get detalhesDialogo(): any {
    return this.analise || {};
  }

  get planoDetails(): any {
    return this.analisesSimplificadas?.[0]?.planoDetalhes || [];
  }

  get detalhesInternalAttached(): any {
    return this.analise?.detalhes || {};
  }

  get detalhesChangeInternalAttached(): any {
    return this.analise?.mudancas || {};
  }

  get detalhesCardQualifyComponent(): any {
    return this.analise?.qualificacao || {};
  }

  get detalhesInlineView(): any {
    return this.analise?.visualizacao || {};
  }

  get detalhesChangeInlineView(): any {
    return this.analise?.mudancas_visualizacao || {};
  }

  get detalhesInlineChange(): any {
    return this.analise?.mudancas_inline || {};
  }

  get detalhesDialogueShowContent(): any {
    return this.analise?.conteudo || {};
  }

  get detalhesExecuteTemplate(): any {
    return this.analise?.template || {};
  }

  get detalhesChangeDialogueShowContent(): any {
    return this.analise?.mudancas_conteudo || {};
  }

  get detalhesChangeExecuteTemplate(): any {
    return this.analise?.mudancas_template || {};
  }

  get welcomeComponentDialog(): any {
    return { visible: false };
  }

}
