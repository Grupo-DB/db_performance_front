import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { DatePickerModule } from 'primeng/datepicker';
import { ProjecaoService } from '../../../services/baseOrcamentariaServices/dre/projecao.service';
import { Produto } from '../../baseOrcamentaria/dre/produto/produto.component';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TipoAmostra } from '../tipo-amostra/tipo-amostra.component';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';
import { StepperModule } from 'primeng/stepper';
import { ToggleButton, ToggleButtonModule } from 'primeng/togglebutton';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Plano } from '../plano/plano.component';
import { Colaborador } from '../../avaliacoes/colaborador/colaborador.component';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { FieldsetModule } from 'primeng/fieldset';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDial, SpeedDialModule } from 'primeng/speeddial';
import { Ordem } from '../ordem/ordem.component';
import { Analise } from '../analise/analise.component';
import { evaluate } from 'mathjs';
import { InplaceModule } from 'primeng/inplace';
import { CardModule } from 'primeng/card';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface FileWithInfo {
  file: File;
  descricao: string;
}import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TooltipModule } from 'primeng/tooltip';



import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';
import { Avaliador } from '../../avaliacoes/avaliador/avaliador.component';


interface AmostraForm{
  especie: FormControl,
  finalidade: FormControl,
  numeroSac: FormControl,
  dataEnvio: FormControl,
  destinoEnvio: FormControl,
  dataRecebimento: FormControl,
  reter: FormControl,
  registroEp: FormControl,
  registroProduto: FormControl,
  numeroLote: FormControl,
  dataColeta: FormControl,
  dataEntrada: FormControl,
  material:FormControl,
  numero:FormControl,
  tipoAmostra: FormControl,
  subtipo: FormControl,
  produtoAmostra: FormControl,
  periodoHora: FormControl,
  periodoTurno: FormControl,
  tipoAmostragem: FormControl,
  localColeta: FormControl,
  fornecedor: FormControl,
  representatividadeLote: FormControl,
  identificacaoComplementar: FormControl,
  complemento: FormControl,
  observacoes: FormControl,
  ordem: FormControl,
  digitador: FormControl,
  status: FormControl
}

interface OrdemForm {
  data: FormControl,
  numero: FormControl,
  planoAnalise: FormControl,
  responsavel: FormControl,
  digitador: FormControl,
  classificacao: FormControl
}

interface AnaliseForm{
  amostra: FormControl,
  estado: FormControl
}

export interface Amostra {
  id: number;
  nome: string;
}

export interface Especie{
  value: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
}

export interface Periodo {
  id: number;
  nome: string;
}

export interface LocalColeta {
  id: number;
  nome: string;
}
export interface Responsaveis {
  value: string;
}
export interface Status {
  id: number;
  nome: string;
}
interface Column {
    field: string;
    header: string;
}
@Component({
  selector: 'app-amostra',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,
    InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule, CdkDragPlaceholder,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule
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
  providers:[
    MessageService,ConfirmationService,DatePipe
  ],
  templateUrl: './amostra.component.html',
  styleUrl: './amostra.component.scss'
})
export class AmostraComponent implements OnInit {

  avaliadores: Avaliador [] | undefined;
  cols!: Column[];
  selectedColumns!: Column[];  
  amostras: Amostra[] = [];
  registerForm!: FormGroup<AmostraForm>;
  registerOrdemForm!: FormGroup<OrdemForm>;
  materiais: Produto[] = [];
  tiposAmostra: TipoAmostra[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  planosAnalise: Plano[] = [];
  ordens: Ordem[] = [];
  analises:Analise[] = [];
  producaoLote: any = null;
  activeStep: number = 1;
  analisesSimplificadas: any[] = [];
  digitador: any;
  idUltimaAanalise: any;
  responsavelEnsaio: any;
  responsavelCalculo: any;
  checked: boolean = true;
  // upload das imagens
  uploadedFilesWithInfo: FileWithInfo[] = [];
  amostraId: any;
  // Propriedades para visualização de imagens
  modalImagensVisible: boolean = false;
  imagensAmostra: any[] = [];
  amostraImagensSelecionada: any = null;
  imagemAtualIndex: number = 0;

  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  modalImagens: boolean = false;
  modalVisualizar: boolean = false;

tipos = [
  { value: 'Media' },
  { value: 'Pontual' }
]

especies = [
  { value: 'Aditivos' },
  { value: 'Areia' },
  { value: 'Argamassa' },
  { value: 'Cal' },
  { value: 'Calcário' },
  { value: 'Cimento' },
  { value: 'Cinza Pozolana' },
  { value: 'Fertilizante' },
  { value: 'Finaliza' },
  { value: 'Aditivos' },
  { value: 'Mineração' },
  
]

  fornecedores = [
    { id: 0, nome:'Cibracal' },
    { id: 1, nome:'Cliente' },
    { id: 2, nome:'Coradassi' },
    { id: 3, nome:'Cotrisul' },
    { id: 4, nome:'DB' },
    { id: 5, nome:'DB ATM' },
    { id: 6, nome:'Felinto' },
    { id: 7, nome:'Fida'  },
    { id: 8, nome:'Garay' },
  ];

  periodos = [
    { id: 0, nome: 'Manhã' },
    { id: 1, nome: 'Tarde' },
    { id: 2, nome: 'Noite' },
    { id: 3, nome: 'Pontual' },
    { id: 4, nome: 'Diário' },
  ]

  locaisColeta = [
    { id: 0, nome: '1 hora na estufa' },
    { id: 1, nome: '30 minutos na estufa' },
    { id: 2, nome: 'Área da Indústria' },
    { id: 3, nome: 'Argamassa' },
    { id: 4, nome: 'Arroio Grande' },
    { id: 5, nome: 'Bag Cliente' },
    { id: 6, nome: 'Big Bag' },
    { id: 7, nome: 'Britagem' },
    { id: 8, nome: 'Cascalho Britagem' },
    { id: 9, nome: 'Cliente' },
    { id: 10, nome: 'Cliente do Everton' },
    { id: 11, nome: 'Cliente Lavoura' },
    { id: 12, nome: 'Cliente/Lavoura' },
    { id: 13, nome: 'CT-10' },
    { id: 14, nome: 'CT-09' },
    { id: 15, nome: 'Despoeiramento CT-16' },
    { id: 16, nome: 'Estoque' },
    { id: 17, nome: 'FAB' },
    { id: 18, nome: 'FAB I' },
    { id: 19, nome: 'FAB I Carregamento' },
    { id: 20, nome: 'FAB II' },
    { id: 21, nome: 'Saco' },
  ]
  status = [
    { id: 0, nome: 'Pendente' },
    { id: 1, nome: 'Em Análise' },
    { id: 2, nome: 'Aprovada' },
    { id: 3, nome: 'Reprovada' },
    { id: 4, nome: 'Cancelada' },
    { id: 5, nome: 'Finalizada' },
  ]

  finalidades = [
    { id: 0, nome: 'Controle de Qualidade' },
    { id: 1, nome: 'SAC' },
    { id: 2, nome: 'Desenvolvimento de Produtos' },
  ]

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

  reter = [
    { id: 1, nome: 'Sim' },
    { id: 2, nome: 'Não' },
  ]

  //analises: any;
  planoCalculos: any;
  items: MenuItem[] | undefined;
  analiseSelecionada: any;
  amostraSelecionada: any;
  
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private produtoLinhaService: ProjecaoService,
    private amostraService: AmostraService,
    private ordemService: OrdemService,
    private ensaioService: EnsaioService,
    private colaboradorService: ColaboradorService,
    private datePipe: DatePipe,
    private analiseService: AnaliseService,
    private cd: ChangeDetectorRef,
    private router: Router 
)
{
  this.registerForm = new FormGroup<AmostraForm>({
    especie: new FormControl('',[Validators.required]),
    finalidade: new FormControl('',[Validators.required]),
    numeroSac: new FormControl('',),
    dataEnvio: new FormControl('',),
    destinoEnvio: new FormControl('',),
    dataRecebimento: new FormControl('',),
    reter: new FormControl('1',[Validators.required]),
    registroEp: new FormControl('',),
    registroProduto: new FormControl('',),
    numeroLote: new FormControl('',[Validators.required]),
    dataColeta: new FormControl('',[Validators.required]),
    dataEntrada: new FormControl('',[Validators.required]),
    material: new FormControl('',[Validators.required]),
    numero: new FormControl(''),
    tipoAmostra: new FormControl('',[Validators.required]),
    subtipo: new FormControl(''),
    produtoAmostra: new FormControl(''),
    periodoHora: new FormControl(''),
    periodoTurno: new FormControl(''),
    tipoAmostragem: new FormControl('',[Validators.required]),
    localColeta: new FormControl('',[Validators.required]),
    fornecedor: new FormControl('',[Validators.required]),
    representatividadeLote: new FormControl('',[Validators.required]),
    identificacaoComplementar: new FormControl(''),
    complemento: new FormControl(''),
    observacoes: new FormControl(''),
    ordem: new FormControl(''),
    digitador: new FormControl(''),
    status: new FormControl('',[Validators.required]),
  });
  this.registerOrdemForm = new FormGroup<OrdemForm>({
    data: new FormControl('',[Validators.required]),
    numero: new FormControl('',[Validators.required]),
    planoAnalise: new FormControl('',[Validators.required]),
    responsavel: new FormControl('',[Validators.required]),
    digitador: new FormControl('',[Validators.required]),
    classificacao: new FormControl('',[Validators.required])
  });
 
}
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  ngOnInit(): void {
    this.loadLinhaProdutos();
    this.loadTiposAmostra();
    this.loadProdutosAmostra();
    this.loadPlanosAnalise();
    this.getDigitadorInfo();
    //this.loadAnalises();
    this.loadAmostras();
    this.cd.markForCheck();
    //número da OS
    this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.get('numero')?.setValue(numero);
    console.log('Número da ordem de serviço gerado:', numero);   
  });

    // Chama sempre que algum campo relevante mudar
  this.registerForm.get('material')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  this.registerForm.get('tipoAmostragem')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  this.registerForm.get('dataColeta')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());

    // Configuração das colunas da tabela
    this.cols = [
      { field: 'planoEnsaios', header: 'Ensaios do Plano' },
    ];
    // Inicializa as colunas selecionadas com todas as colunas
    this.selectedColumns = this.cols;// Copia todas as colunas para a seleção inicial
  
  }

  loadAmostras(): void {
    this.amostraService.getAmostras().subscribe(
      response => {
        this.amostras = response;
        console.log('Amostras carregadas:', this.amostras);
      },
      error => {
        console.error('Erro ao carregar amostras:', error);
      }
    );
  }

  loadOrdens(): void{
    this.ordemService.getOrdens().subscribe(
      response => {
        this.ordens = response;
        console.log('Ordens carregadas:', this.ordens);
      },
      error => {
        console.error('Erro ao carregar ordens:', error);
      }
    );
  }

  filterTable() {
    this.dt1.filterGlobal(this.inputValue,'contains');
  }
  
  clear(table: Table) {
    table.clear();
  }
  clearForm(){
    this.registerForm.reset();
  }
  clearEditForm(){
    //this.editForm.reset();
  }

  getDigitadorInfo(): void {
  this.colaboradorService.getColaboradorInfo().subscribe(
    data => {
      this.digitador = data.nome;
      this.registerOrdemForm.get('digitador')?.setValue(data.nome);
      this.registerForm.get('digitador')?.setValue(data.nome);

      // Verificar se existe análises simplificadas e plano detalhes antes de acessar
      if (this.analisesSimplificadas && 
          this.analisesSimplificadas.length > 0 && 
          this.analisesSimplificadas[0] && 
          this.analisesSimplificadas[0].planoDetalhes) {
        
        console.log('Preenchendo digitador nos ensaios já carregados...');
        
        this.analisesSimplificadas[0].planoDetalhes.forEach((plano: any) => {
          // Verificar se existem ensaios antes de iterar
          if (plano.ensaio_detalhes && Array.isArray(plano.ensaio_detalhes)) {
            plano.ensaio_detalhes.forEach((ensaio: any) => {
              ensaio.digitador = this.digitador;
              console.log('Digitador do ensaio:', ensaio.digitador);
            });
          }
          
          // Verificar se existem cálculos antes de iterar
          if (plano.calculo_ensaio_detalhes && Array.isArray(plano.calculo_ensaio_detalhes)) {
            plano.calculo_ensaio_detalhes.forEach((calc: any) => {
              calc.digitador = this.digitador;
              
              // Se quiser mostrar também nos ensaios de cálculo:
              if (calc.ensaios_detalhes && Array.isArray(calc.ensaios_detalhes)) {
                calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
                  ensaioCalc.digitador = this.digitador;
                });
              }
            });
          }
        });
      } else {
        console.log('Nenhuma análise simplificada carregada ainda. Digitador será preenchido quando as análises forem carregadas.');
      }
    },
    error => {
      console.error('Erro ao obter informações do colaborador:', error);
      this.digitador = null;
    }
  );
}

  loadPlanosAnalise() {
    this.ensaioService.getPlanoAnalise().subscribe(
      response => {
        this.planosAnalise = response;
      },
      error => {
        console.log('Erro ao carregar planos de análise', error);
      }
    );
  }

  loadLinhaProdutos(){
    this.produtoLinhaService.getProdutos().subscribe(
      response => {
        this.materiais = response;
      },
      error => {
        console.log('Erro ao carregar produtos', error);
      }
    );
  }

onMaterialChange(materialId: number) {
  console.log('Material selecionado:', materialId);
  const material = this.materiais.find(m => m.id === materialId);
  if (material) {
    // Chama o service para buscar o próximo sequencial do backend
    this.amostraService.getProximoSequencial(material.id).subscribe({
      next: (sequencial) => {
        console.log('Sequencial recebido do backend:', sequencial);
        const numero = this.gerarNumero(material.nome, sequencial);
        this.registerForm.get('numero')?.setValue(numero);
        console.log('Número da amostra gerado:', numero);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível gerar o número da amostra.' });
      }
    });
  }
}

  loadTiposAmostra() {
    this.amostraService.getTiposAmostra().subscribe(
      response => {
        this.tiposAmostra = response;
      },
      error => {
        console.log('Erro ao carregar tipos de amostra', error);
      }
    );
  }

  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }
      , error => {
        console.log('Erro ao carregar produtos de amostra', error);
      }
    )
  }
  
  
gerarNumero(materialNome: string, sequencial: number): string {
  //const ano = new Date().getFullYear().toString().slice(-2); // 
  const sequencialFormatado = sequencial.toString().padStart(6, '0'); // Ex: '000008'
  // Formata como 08.392 
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' 
  return `${materialNome} ${parte1}.${parte2}`;
}

onCamposRelevantesChange() {
  console.log('Campos relevantes alterados, verificando exibição de representatividade do lote...');
  if (this.exibirRepresentatividadeLote()) {
    this.consultarProducao();
  } else {
    this.registerForm.get('representatividadeLote')?.setValue('');
  }
}

getMenuItems(analise: any) {
  return [
    { label: 'Visualizar', icon: 'pi pi-eye', command: () => this.visualizar(analise) },
    { label: 'Abrir OS', icon: 'pi pi-folder-open', command: () => this.abrirOS(analise) },
    { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editar(analise) },
    { label: 'Excluir', icon: 'pi pi-trash', command: () => this.excluir(analise) },
    { label: 'Imagens', icon: 'pi pi-image', command: () => this.visualizarImagens(analise) },
  ];
}

irLinkExterno(analise: any) {
  window.open(`/welcome/controleQualidade/analise`, analise.id);
}

visualizar(amostra: any) {
  this.amostraSelecionada = amostra;
  this.modalVisualizar = true;
  console.log('Drawer deve abrir', amostra); 
}

abrirOS(amostra: any) {
  this.amostraSelecionada = amostra;
  this.activeStep = 2;
}

editar(amostra: any) {
  // lógica para editar
}

excluir(amostra: any) {
  // lógica para excluir
}

  exibirRepresentatividadeLote(): boolean {
  const materialId = this.registerForm.get('material')?.value;
  const tipoAmostragem = this.registerForm.get('tipoAmostragem')?.value?.toLowerCase();
  const material = this.materiais.find(m => m.id === materialId);
  if (!material || !tipoAmostragem) return false;
  const nomeMaterial = this.normalize(material.nome);
  return (
    (nomeMaterial === 'calcario' || nomeMaterial === 'finaliza') &&
    tipoAmostragem === 'media'
  );
}

consultarProducao() {
  const materialId = this.registerForm.get('material')?.value;
  const dataColeta = this.registerForm.get('dataColeta')?.value;
  if (materialId && dataColeta) {
    this.amostraService.getRrepresentatividade(dataColeta).subscribe({
      next: (producao) => {
        this.producaoLote = producao; 
        this.registerForm.get('representatividadeLote')?.setValue(producao.total);
      },
      error: () => {
        this.producaoLote = null;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível consultar a produção.' });
      }
    });
  }
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

// Método para quando o produto de amostra for selecionado
onProdutoAmostraChange(produtoId: number) {
  const produtoSelecionado = this.produtosAmostra.find(produto => produto.id === produtoId);
  
  if (produtoSelecionado) {
    // Preenche os campos do formulário com os dados do produto
    this.registerForm.patchValue({
      registroEp: produtoSelecionado.registro_empresa,
      registroProduto: produtoSelecionado.registro_produto
    });
  }
}

submitOrdem(){ 
  const formData = new FormData();

  let dataFormatada = '';
  const dataValue = this.registerOrdemForm.value.data;
      if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
      dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
  }

  this.ordemService.registerOrdem(
    //this.registerOrdemForm.value.data,
    dataFormatada,
    this.registerOrdemForm.value.numero,
    this.registerOrdemForm.value.planoAnalise,
    this.registerOrdemForm.value.responsavel,
    this.registerOrdemForm.value.digitador,
    this.registerOrdemForm.value.classificacao,
    
  ).subscribe({
    next:() =>{
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ordem de serviço registrada com sucesso.' });
      this.registerOrdemForm.reset();
      this.activeStep = 3; // Avança para o próximo passo
    }

    , error: (err) => {
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

  })
}

submitAmostra() {
  const formData = new FormData();

  let dataColetaFormatada = null;
  const dataColetaValue = this.registerForm.value.dataColeta;
  if (dataColetaValue instanceof Date && !isNaN(dataColetaValue.getTime())) {
    dataColetaFormatada = formatDate(dataColetaValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataEntradaFormatada = null;
  const dataEntradaValue = this.registerForm.value.dataEntrada;
  if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
    dataEntradaFormatada = formatDate(dataEntradaValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataEnvioFormatada = null;
  const dataEnvioValue = this.registerForm.value.dataEnvio;
  if (dataEnvioValue instanceof Date && !isNaN(dataEnvioValue.getTime())) {
    dataEnvioFormatada = formatDate(dataEnvioValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataRecebimentoFormatada = null;
  const dataRecebimentoValue = this.registerForm.value.dataRecebimento;
  if (dataRecebimentoValue instanceof Date && !isNaN(dataRecebimentoValue.getTime())) {
    dataRecebimentoFormatada = formatDate(dataRecebimentoValue, 'yyyy-MM-dd', 'en-US');
  }

  this.amostraService.registerAmostra(
    this.registerForm.value.especie,
    this.registerForm.value.finalidade,
    this.registerForm.value.numeroSac,
    dataEnvioFormatada,
    this.registerForm.value.destinoEnvio,
    dataRecebimentoFormatada,
    this.registerForm.value.reter,
    this.registerForm.value.registroEp,
    this.registerForm.value.registroProduto,
    this.registerForm.value.numeroLote,
    dataColetaFormatada,
    dataEntradaFormatada,
    this.registerForm.value.material,
    this.registerForm.value.numero,
    this.registerForm.value.tipoAmostra,
    this.registerForm.value.subtipo,
    this.registerForm.value.produtoAmostra,
    this.registerForm.value.periodoHora,
    this.registerForm.value.periodoTurno,
    this.registerForm.value.tipoAmostragem,
    this.registerForm.value.localColeta,
    this.registerForm.value.fornecedor,
    this.registerForm.value.representatividadeLote,
    this.registerForm.value.identificacaoComplementar,
    this.registerForm.value.complemento,
    this.registerForm.value.observacoes,
    this.registerForm.value.ordem,
    null,
    this.registerForm.value.digitador,
    this.registerForm.value.status
  ).subscribe({
    next: (amostraCriada) => {
      console.log('Amostra criada:', amostraCriada);
      this.amostraId = amostraCriada.id; // Armazena o ID da amostra criada
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: 'Amostra registrada com sucesso.' 
      });
      
      // Faz upload das imagens se houver 
      if (this.uploadedFilesWithInfo.length > 0) {
        this.uploadImages();
      } else {
        this.activeStep = 3; // Avança para o próximo passo se não há imagens
      }
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
}

// Método para fazer upload das imagens
uploadImages(): void {
    if (!this.amostraId || this.uploadedFilesWithInfo.length === 0) {
      console.log('Sem amostra ID ou arquivos para upload');
      this.activeStep = 3;
      return;
    }

    // Verificar estado dos arquivos antes do upload
    this.verificarEstadoArquivos();

    const formData = new FormData();
    
    // Adiciona arquivos com suas descrições
    this.uploadedFilesWithInfo.forEach((fileInfo, index) => {
      formData.append('images', fileInfo.file, fileInfo.file.name);
      // Garante que a descrição não seja undefined ou null
      const descricao = fileInfo.descricao || '';
      formData.append(`descricao_${index}`, descricao);
      
      // verificar o que está sendo enviado
      console.log(`Arquivo ${index}: ${fileInfo.file.name}`);
      console.log(`Descrição ${index}: "${descricao}"`);
    });

    console.log('Fazendo upload de', this.uploadedFilesWithInfo.length, 'arquivos para amostra', this.amostraId);

    this.amostraService.uploadImagens(this.amostraId, formData).subscribe({
      next: (response) => {
        console.log('Imagens enviadas com sucesso:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.uploadedFilesWithInfo.length} imagem(ns) enviada(s) com sucesso!`
        });
        
        this.uploadedFilesWithInfo = [];
        this.activeStep = 3;
      },
      error: (error) => {
        console.error('Erro ao enviar imagens:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar imagens. A amostra foi salva, mas as imagens não foram anexadas.'
        });
        this.activeStep = 3;
      }
    });
  }

// Método para remover arquivo da lista antes do envio
removeFile(index: number): void {
    this.uploadedFilesWithInfo.splice(index, 1);
  }

// Previne o upload automático
beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
  console.log('Arquivo selecionado:', file.name);
  return false; // Retorna false para não fazer upload automático
};

navegarParaExpressa() {
  const formData = this.registerForm.value;
  const dadosEnriquecidos = this.enriquecerDadosFormulario(formData);
  
  // Adiciona as imagens aos dados enriquecidos
  dadosEnriquecidos.imagens = this.uploadedFilesWithInfo.map(fileInfo => ({
    file: fileInfo.file,
    descricao: fileInfo.descricao,
    nome: fileInfo.file.name,
    tamanho: fileInfo.file.size,
    tipo: fileInfo.file.type
  }));
  
  // Debug
  // console.log('Estado do formulário antes de navegar:', formData);
  // console.log('Dados enriquecidos com imagens:', dadosEnriquecidos);
  // console.log('Número de imagens:', this.uploadedFilesWithInfo.length);
  // console.log('Formulário válido?', this.registerForm.valid);
  // console.log('Formulário pristine?', this.registerForm.pristine);
  
  // Salva no sessionStorage como backup (sem as imagens por limitação de tamanho)
  const dadosSemImagens = { ...dadosEnriquecidos };
  delete dadosSemImagens.imagens;
  sessionStorage.setItem('amostraData', JSON.stringify(dadosSemImagens));
  
  console.log('Enviando dados para expressa:', dadosEnriquecidos);
  
  // Navega para a rota expressa passando os dados via state
  this.router.navigate(['/welcome/controleQualidade/expressa'], {
    state: { amostraData: dadosEnriquecidos }
  });
}

// Método para preencher os dados do formulário
enriquecerDadosFormulario(formData: any): any {
  const dadosEnriquecidos = { ...formData };
  
  if (formData.material && this.materiais.length > 0) {
    const materialSelecionado = this.materiais.find(m => m.id === formData.material);
    dadosEnriquecidos.materialInfo = {
      id: formData.material,
      nome: materialSelecionado?.nome || 'Material não encontrado'
    };
  }
  
  if (formData.tipoAmostra && this.tiposAmostra.length > 0) {
    const tipoSelecionado = this.tiposAmostra.find(t => t.id === formData.tipoAmostra);
    dadosEnriquecidos.tipoAmostraInfo = {
      id: formData.tipoAmostra,
      nome: tipoSelecionado?.nome || 'Tipo não encontrado'
    };
  }
  
  if (formData.produtoAmostra && this.produtosAmostra.length > 0) {
    const produtoSelecionado = this.produtosAmostra.find(p => p.id === formData.produtoAmostra);
    dadosEnriquecidos.produtoAmostraInfo = {
      id: formData.produtoAmostra,
      nome: produtoSelecionado?.nome || 'Produto não encontrado'
    };
  }
  
  if (formData.periodoTurno !== null && formData.periodoTurno !== undefined) {
    const periodoSelecionado = this.periodos.find(p => p.id === formData.periodoTurno);
    dadosEnriquecidos.periodoTurnoInfo = {
      id: formData.periodoTurno,
      nome: periodoSelecionado?.nome || 'Período não encontrado'
    };
  }
  
  // CAMPOS QUE JÁ SÃO NOMES (optionValue="nome") - não precisam enriquecimento
  if (formData.fornecedores) {
    dadosEnriquecidos.fornecedorInfo = {
      nome: formData.fornecedor
    };
  }
  
  if (formData.locaisColeta) {
    dadosEnriquecidos.localColetaInfo = {
      nome: formData.localColeta
    };
  }
  
  if (formData.status) {
    dadosEnriquecidos.statusInfo = {
      nome: formData.status
    };
  }
  
  if (formData.classificacao) {
    dadosEnriquecidos.classificacaoInfo = {
      nome: formData.classificacao
    };
  }
    
  return dadosEnriquecidos;
}


montarAnalise(){
  this.activeStep = 3;
}

salvarOrdemEAmostra() {
  // Se houver uma análise selecionada, preencha o formulário de amostra com seus dados
  if (this.amostraSelecionada ) {
    const a = this.amostraSelecionada;
    this.registerForm.patchValue({
      dataColeta: a.data_coleta ? new Date(a.data_coleta) : '',
      dataEntrada: a.data_entrada ? new Date(a.data_entrada) : '',
      material: a.material_detalhes?.id || '',
      numero: a.numero || '',
      tipoAmostra: a.tipo_amostra_detalhes?.id || '',
      subtipo: a.subtipo || '',
      produtoAmostra: a.produto_amostra_detalhes?.id || '',
      periodoHora: a.periodo_hora || '',
      periodoTurno: a.periodo_turno || '',
      tipoAmostragem: a.tipo_amostragem || '',
      localColeta: a.local_coleta || '',
      representatividadeLote: a.representatividade_lote || '',
      identificacaoComplementar: a.identificacao_complementar || '',
      complemento: a.complemento || '',
      digitador: a.digitador || '',
      status: a.status || ''
    });
  }

  // 1. Formata a data da ordem
  let dataFormatada = '';
  const dataValue = this.registerOrdemForm.value.data;
  if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
    dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
  }

  // 2. Salve a ordem
  this.ordemService.registerOrdem(
    dataFormatada,
    this.registerOrdemForm.value.numero,
    this.registerOrdemForm.value.planoAnalise,
    this.registerOrdemForm.value.responsavel,
    this.registerOrdemForm.value.digitador,
    this.registerOrdemForm.value.classificacao
  ).subscribe({
    next: (ordemSalva) => {
      // 3. Pegua o número ou ID da ordem salva
      const numeroOrdem = ordemSalva.numero; // ou ordemSalva.id

      // 4. Formata as datas da amostra
      let dataColetaFormatada = '';
      const dataColetaValue = this.registerForm.value.dataColeta;
      if (dataColetaValue instanceof Date && !isNaN(dataColetaValue.getTime())) {
        dataColetaFormatada = formatDate(dataColetaValue, 'yyyy-MM-dd', 'en-US');
      }
      let dataEntradaFormatada = '';
      const dataEntradaValue = this.registerForm.value.dataEntrada;
      if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
        dataEntradaFormatada = formatDate(dataEntradaValue, 'yyyy-MM-dd', 'en-US');
      }

      let dataEnvioFormatada = '';
      const dataEnvioValue = this.registerForm.value.dataEnvio;
      if (dataEnvioValue instanceof Date && !isNaN(dataEnvioValue.getTime())) {
        dataEnvioFormatada = formatDate(dataEnvioValue, 'yyyy-MM-dd', 'en-US');
      }

      let dataRecebimentoFormatada = '';
      const dataRecebimentoValue = this.registerForm.value.dataRecebimento;
      if (dataRecebimentoValue instanceof Date && !isNaN(dataRecebimentoValue.getTime())) {
        dataRecebimentoFormatada = formatDate(dataRecebimentoValue, 'yyyy-MM-dd', 'en-US');
      }


      // 5. Salva a amostra vinculando à ordem
      this.amostraService.registerAmostra(
        this.registerForm.value.especie,
        this.registerForm.value.finalidade,
        this.registerForm.value.numeroSac,
        dataEnvioFormatada,
        this.registerForm.value.destinoEnvio,
        dataRecebimentoFormatada,
        this.registerForm.value.reter,
        this.registerForm.value.registroEp,
        this.registerForm.value.registroProduto,
        this.registerForm.value.numeroLote, 
        dataColetaFormatada,
        dataEntradaFormatada,
        this.registerForm.value.material,
        this.registerForm.value.numero,
        this.registerForm.value.tipoAmostra,
        this.registerForm.value.subtipo,
        this.registerForm.value.produtoAmostra,
        this.registerForm.value.periodoHora,
        this.registerForm.value.periodoTurno,
        this.registerForm.value.tipoAmostragem,
        this.registerForm.value.localColeta,
        this.registerForm.value.fornecedor,
        this.registerForm.value.representatividadeLote,
        this.registerForm.value.identificacaoComplementar,
        this.registerForm.value.complemento,
        this.registerForm.value.observacoes,
        numeroOrdem,
        null, 
        this.registerForm.value.digitador,
        this.registerForm.value.status
      ).subscribe({
        next: (amostraCriada) => {
          // 6. Crie a análise vinculada à amostra recém-criada
          this.analiseService.registerAnalise(amostraCriada.id, 'PENDENTE').subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Amostra, ordem e análise registradas com sucesso.' });
              this.activeStep = 4; // Avança para o próximo passo, se houver
            },
            error: () => {
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Amostra e ordem salvas, mas erro ao criar análise.' });
            }
          });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a amostra.' });
        }
      });
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a ordem.' });
    }
  });
}

loadAnalises(){
  this.analiseService.getAnalises().subscribe(
    response => {
      this.analises = response;
      
    },
    error => {
      console.log('Erro ao carregar análises', error);
    }
  );
}

osExpressa(){
  //TEM QUE IMPLEMENTAR A FUNÇÃO
}

loadUltimaAnalise(){
  this.getDigitadorInfo();
  this.analiseService.getAnalises().subscribe(
    response => {
      if (response && response.length > 0) {
        // Pega a última análise (assumindo que o array está ordenado por criação)
        const ultimaAnalise = response[response.length - 1];
        this.idUltimaAanalise = ultimaAnalise.id;
        console.log('Última análise:', ultimaAnalise);
        this.analisesSimplificadas = [{
          amostraDataEntrada: ultimaAnalise.amostra_detalhes?.data_entrada,
          amostraDataColeta: ultimaAnalise.amostra_detalhes?.data_coleta,
          amostraDigitador: ultimaAnalise.amostra_detalhes?.digitador,
          amostraFornecedor: ultimaAnalise.amostra_detalhes?.fornecedor,
          amostraIdentificacaoComplementar: ultimaAnalise.amostra_detalhes?.identificacao_complementar,
          amostraComplemento: ultimaAnalise.amostra_detalhes?.complemento,
          amostraLocalColeta: ultimaAnalise.amostra_detalhes?.local_coleta,
          amostraMaterial: ultimaAnalise.amostra_detalhes?.material_detalhes?.nome,
          amostraNumero: ultimaAnalise.amostra_detalhes?.numero,
          amostraPeriodoHora: ultimaAnalise.amostra_detalhes?.periodo_hora,
          amostraPeriodoTurno: ultimaAnalise.amostra_detalhes?.periodo_turno,
          amostraRepresentatividadeLote: ultimaAnalise.amostra_detalhes?.representatividade_lote,
          amostraStatus: ultimaAnalise.amostra_detalhes?.status,
          amostraSubtipo: ultimaAnalise.amostra_detalhes?.subtipo,
          amostraTipoAmostra: ultimaAnalise.amostra_detalhes?.tipo_amostra_detalhes?.nome,
          amostraNatureza: ultimaAnalise.amostra_detalhes?.tipo_amostra_detalhes?.natureza,
          amostraTipoAmostragem: ultimaAnalise.amostra_detalhes?.tipo_amostragem,
          amostraProdutoAmostra: ultimaAnalise.amostra_detalhes?.produto_amostra_detalhes?.nome,
          amostraRegistroEmpresa:ultimaAnalise.amostra_detalhes?.produto_amostra_detalhes?.registro_empresa,
          amostraRegistroProduto: ultimaAnalise.amostra_detalhes?.produto_amostra_detalhes?.registro_produto,
          estado: ultimaAnalise.estado,
          ordemNumero: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.numero,
          ordemClassificacao: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.classificacao,
          ordemPlanoAnalise: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.descricao,
          planoDetalhes: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.plano_detalhes || [],
          planoEnsaios: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.ensaio_detalhes,
          //planoCalculos: ultimaAnalise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.calculo_ensaio_detalhes,
        }];console.log('Numero da Ordem:', this.analisesSimplificadas[0].ordemNumero);
      } else {
        this.analisesSimplificadas = [];
      }
    },
    error => {
      console.log('Erro ao carregar análises', error);
      this.analisesSimplificadas = [];
    }
  );
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

calcular(calc: any, produto?: any) {
  if (produto) {
    this.sincronizarValoresEnsaios(produto, calc);
  }
  if (!calc.ensaios_detalhes || !Array.isArray(calc.ensaios_detalhes)) {
    calc.resultado = 'Sem ensaios para calcular';
    return;
  }

  // Descobre todos os varX usados na expressão
  const varMatches = (calc.funcao.match(/var\d+/g) || []);
  const varList = Array.from(new Set(varMatches));

  // Monta safeVars usando o valor correto para cada varX
  const safeVars: any = {};

  // safe var6 -> PNquimica %, var9 -> RE (reativ) %
  safeVars['var6'] = calc.ensaios_detalhes[0]?.valor ?? 0;
  safeVars['var9'] = calc.ensaios_detalhes[1]?.valor ?? 0;

  // Avaliação
  console.log('Função final para eval:', calc.funcao, safeVars);
  try {
    calc.resultado = evaluate(calc.funcao, safeVars);
  } catch (e) {
    calc.resultado = 'Erro no cálculo';
  }
}

private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

recalcularTodosCalculos(produto: any) {
  if (produto && produto.planoCalculos) {
    produto.planoCalculos.forEach((calc: any) => this.calcular(calc));
  }
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
    console.log('Função final para eval:', funcaoSubstituida);
    try {
      calc.resultado = eval(funcaoSubstituida);
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

salvarAnaliseResultados() {
  this.getDigitadorInfo();
  // Monta os arrays de ensaios e cálculos a partir dos dados do formulário ou do seu objeto de análise
  const ensaios = this.analisesSimplificadas[0].planoDetalhes
  .flatMap((plano: { ensaio_detalhes: any[]; }) =>
    plano.ensaio_detalhes?.map((ensaio: any) => ({
      id: ensaio.id,
      descricao: ensaio.descricao,
      valores: ensaio.valor,
      responsavel: ensaio.responsavel,
      digitador: this.digitador,
      tempo_previsto: ensaio.tempo_previsto,
      tipo: ensaio.tipo_ensaio_detalhes?.nome,
      ensaios_utilizados: plano.ensaio_detalhes?.map((e: any) => ({
        id: e.id,
        descricao: e.descricao,
        valor: e.valor
      }))
    })) || []
  );

 

  const calculos = this.analisesSimplificadas[0].planoDetalhes
  .flatMap((plano: { calculo_ensaio_detalhes: any[]; }) =>
    plano.calculo_ensaio_detalhes?.map(calc => ({
      calculos: calc.descricao,
      valores: calc.ensaios_detalhes?.map((e: any) => e.valor), // array dos valores dos ensaios usados
      resultados: calc.resultado,
      responsavel: calc.responsavel,
      digitador: this.digitador,
      ensaios_utilizados: calc.ensaios_detalhes?.map((e: any) => ({
        id: e.id,
        descricao: e.descricao,
        valor: e.valor
      }))
    })) || []
  );




  const idAnalise = this.idUltimaAanalise;
  console.log('ID da análise:', idAnalise);
  const payload = {
    estado: 'PENDENTE',
    ensaios: ensaios,
    calculos: calculos
  };

  this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Análise registrada com sucesso.' });
      this.activeStep = 4; // Avança para o próximo passo
      this.loadUltimaAnalise();
    },
    error: (err) => {
      console.error('Erro ao registrar análise:', err);
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
}

// Método para criar amostra normal- sem criar ordem
criarAmostraNormal(): void {
  console.log('🚀 Criando amostra normal (sem ordem)');
  
  // Validar se o formulário está válido
  if (!this.registerForm.valid) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Erro', 
      detail: 'Preencha todos os campos obrigatórios' 
    });
    return;
  }

  // Formatar datas para o backend
  let dataColetaFormatada = '';
  const dataColetaValue = this.registerForm.value.dataColeta;
  if (dataColetaValue instanceof Date && !isNaN(dataColetaValue.getTime())) {
    dataColetaFormatada = formatDate(dataColetaValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataEntradaFormatada = '';
  const dataEntradaValue = this.registerForm.value.dataEntrada;
  if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
    dataEntradaFormatada = formatDate(dataEntradaValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataEnvioFormatada = '';
  const dataEnvioValue = this.registerForm.value.dataEnvio;
  if (dataEnvioValue instanceof Date && !isNaN(dataEnvioValue.getTime())) {
    dataEnvioFormatada = formatDate(dataEnvioValue, 'yyyy-MM-dd', 'en-US');
  }

  let dataRecebimentoFormatada = '';
  const dataRecebimentoValue = this.registerForm.value.dataRecebimento;
  if (dataRecebimentoValue instanceof Date && !isNaN(dataRecebimentoValue.getTime())) {
    dataRecebimentoFormatada = formatDate(dataRecebimentoValue, 'yyyy-MM-dd', 'en-US');
  }

  console.log('📝 Criando amostra normal...');
  
  // Criar amostra normal (sem ordem)
  this.amostraService.registerAmostra(
    this.registerForm.value.especie,
    this.registerForm.value.finalidade,
    this.registerForm.value.numeroSac,
    dataEnvioFormatada,
    this.registerForm.value.destinoEnvio,
    dataRecebimentoFormatada,
    this.registerForm.value.reter,
    this.registerForm.value.registroEp,
    this.registerForm.value.registroProduto,
    this.registerForm.value.numeroLote, 
    dataColetaFormatada,
    dataEntradaFormatada,
    this.registerForm.value.material,
    this.registerForm.value.numero,
    this.registerForm.value.tipoAmostra,
    this.registerForm.value.subtipo,
    this.registerForm.value.produtoAmostra,
    this.registerForm.value.periodoHora,
    this.registerForm.value.periodoTurno,
    this.registerForm.value.tipoAmostragem,
    this.registerForm.value.localColeta,
    this.registerForm.value.fornecedor,
    this.registerForm.value.representatividadeLote,
    this.registerForm.value.identificacaoComplementar,
    this.registerForm.value.complemento,
    this.registerForm.value.observacoes,
    null, // Sem ordem para amostra normal
    null,
    this.registerForm.value.digitador,
    this.registerForm.value.status
  ).subscribe({
    next: (amostraCriada) => {
      console.log('✅ Amostra normal criada:', amostraCriada);
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: 'Amostra normal criada com sucesso!'
      });
      
    },
    error: (error) => {
      console.error('❌ Erro ao criar amostra normal:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao criar amostra normal: ' + (error.error?.detail || error.message)
      });
    }
  });

}

//----------------------------IMAGES---------------------------
handleChange(info: any): void {
  const fileList = info.fileList;
  
  // Converter para FileWithInfo com inicialização explícita
  this.uploadedFilesWithInfo = fileList
    .filter((file: any) => file.status !== 'error' && file.originFileObj)
    .map((file: any) => ({
      file: file.originFileObj as File,
      descricao: '' // Descrição inicial vazia
    }));
  
  console.log('Arquivos processados:', this.uploadedFilesWithInfo);
  this.validateFiles();
}

validateFiles(): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles: FileWithInfo[] = [];
    
    this.uploadedFilesWithInfo.forEach(fileInfo => {
      if (!fileInfo.file) return;
      
      if (!allowedTypes.includes(fileInfo.file.type)) {
        console.warn(`Tipo de arquivo não permitido: ${fileInfo.file.type}`);
        this.messageService.add({
          severity: 'warn',
          summary: 'Arquivo inválido',
          detail: `Tipo de arquivo não permitido: ${fileInfo.file.name}`
        });
        return;
      }
      
      if (fileInfo.file.size > maxSize) {
        console.warn(`Arquivo muito grande: ${fileInfo.file.name}`);
        this.messageService.add({
          severity: 'warn',
          summary: 'Arquivo muito grande',
          detail: `${fileInfo.file.name} excede o tamanho máximo de 5MB`
        });
        return;
      }
      
      validFiles.push(fileInfo);
    });
    
    this.uploadedFilesWithInfo = validFiles;
    console.log('Arquivos válidos:', this.uploadedFilesWithInfo);
  }

// Método para interceptar requisições e não fazer upload automático
customRequest = (item: any): any => {
  // Marca como sucesso imediatamente sem afetar a UI
  setTimeout(() => {
    item.onSuccess({}, item.file, {});
  }, 0);
  
  return { unsubscribe: () => {} };
};

visualizarImagens(amostra: any): void {
  this.amostraImagensSelecionada = amostra;
  this.carregarImagensAmostra(amostra.id);
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
    console.log(`Descrição atualizada para arquivo ${index}: "${descricao}"`);
    console.log('Estado atual dos arquivos:', this.uploadedFilesWithInfo);
  }
}

// Método para verificar o estado antes do upload
verificarEstadoArquivos(): void {
  console.log('Estado final dos arquivos antes do upload:');
  this.uploadedFilesWithInfo.forEach((fileInfo, index) => {
    console.log(`Arquivo ${index}:`, {
      nome: fileInfo.file.name,
      descricao: fileInfo.descricao,
      tamanho: fileInfo.file.size
    });
  });
}

downloadPdf() {

  const logoBase64 = 'data:image/jpeg;base64,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RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73v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arF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z';

  let dataEntradaFormatada = '';
  let dataDescarteFormatada = '';

  const dataEntradaValue = this.registerForm.value.dataEntrada;
  if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
    const dataDescarteValue = new Date(dataEntradaValue);
    dataDescarteValue.setDate(dataDescarteValue.getDate() + 60);
    dataEntradaFormatada = formatDate(dataEntradaValue, 'dd/MM/yy', 'en-US');
    dataDescarteFormatada = formatDate(dataDescarteValue, 'dd/MM/yy', 'en-US');
  }

  let auxMaterialNome = this.materiais.find(m => m.id === this.registerForm.value.material);
  let materialNome = auxMaterialNome?.nome;
  
  let material = this.registerForm.value.material;
  let numero = this.registerForm.value.numero;
  let localColeta = this.registerForm.value.localColeta;
  let produtoAmostra = this.registerForm.value.produtoAmostra;
  let periodoHora = this.registerForm.value.periodoHora ? this.registerForm.value.periodoHora : "";
  let periodoTurno = this.registerForm.value.periodoTurno ?? "";
  periodoTurno = periodoTurno !== "" ? this.periodos[periodoTurno].nome : ""; 
  let auxprodutoAmostra = this.produtosAmostra.find(p => p.id === this.registerForm.value.produtoAmostra);
  let produtoAmostraNome = auxprodutoAmostra?.nome;

  let periodoDescricao = '';
  if(periodoHora && periodoHora){
    periodoDescricao = periodoHora+' - '+periodoTurno;
  }else if(periodoHora){
    periodoDescricao = periodoHora;
  }else if(periodoTurno){
    periodoDescricao = periodoTurno;
  }else{
    periodoDescricao = 'Período';
  }
  
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [100, 30]
  });

  // doc.rect(1, 1, 97, 28);

  let y = 5;

  const linhas = [
    [numero ? numero : 'Numero', "", ""],
    [produtoAmostra ? produtoAmostraNome : 'Produto Amostra', "", ""],
    [material ? materialNome : 'Material', "Reter", "Entrada "+dataEntradaFormatada],
    [localColeta ? localColeta : 'Local Coleta', periodoDescricao, "Descarte "+dataDescarteFormatada]
  ];

  linhas.forEach((linha, index) => {
    if (index === 0) {
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(linha[0], 3, y);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[1], 55, y);
      doc.text(linha[2], 70, y);
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 3, y);
      doc.text(linha[1], 45, y);
      doc.text(linha[2], 70, y);
    }
    y += 7;
  });

  doc.addImage(logoBase64, 'PNG', 79, 1, 20, 5); // x, y, largura, altura

  // Cria uma URL temporária para pré-visualizar
  const blobUrl = doc.output("bloburl");

  // Abre em nova aba/janela
  window.open(blobUrl, "_blank");

  // doc.save("Etiqueta.pdf");
  }



}