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
import { SpeedDialModule } from 'primeng/speeddial';
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
    InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,
    CdkDragPlaceholder,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule
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
    reter: new FormControl('',),
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
    status: new FormControl('',[Validators.required])
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
    {
    
      label: 'Link Externo',
      icon: 'pi pi-link',
      //routerLink: ['/welcome/controleQualidade/analise', analise.id]
      command: () => window.open(`/welcome/controleQualidade/analise`)
    }
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
//////////////////////////////////////////////OS EXPRESSA APARTIR DA TABELA //////////////////
criarExpressaDeAmostra(amostra: any) {
  console.log('Criando expressa a partir da amostra:', amostra);

  // Converter os dados da amostra para o formato esperado pela expressa
  const dadosAmostraParaExpressa = this.converterAmostraSalvaParaFormulario(amostra);
  //enriquecer dados
  const dadosEnriquecidos = this.enriquecerDadosFormulario(dadosAmostraParaExpressa);
  //carregar imagens se tiver
  this.carregarImagensParaExpressa(amostra.id, dadosEnriquecidos);
}

// Método para converter amostra salva para formato do formulário
converterAmostraSalvaParaFormulario(amostra: any): any {
  return {
    especie: amostra.especie || '',
    finalidade: amostra.finalidade || '',
    numeroSac: amostra.numero_sac || '',
    dataEnvio: amostra.data_envio ? new Date(amostra.data_envio) : null,
    destinoEnvio: amostra.destino_envio || '',
    dataRecebimento: amostra.data_recebimento ? new Date(amostra.data_recebimento) : null,
    reter: amostra.reter || false,
    registroEp: amostra.registro_ep || '',
    registroProduto: amostra.registro_produto || '',
    numeroLote: amostra.numero_lote || '',
    dataColeta: amostra.data_coleta ? new Date(amostra.data_coleta) : null,
    dataEntrada: amostra.data_entrada ? new Date(amostra.data_entrada) : null,
    material: amostra.material_detalhes?.id || amostra.material,
    numero: amostra.numero || '',
    tipoAmostra: amostra.tipo_amostra_detalhes?.id || amostra.tipo_amostra,
    subtipo: amostra.subtipo || '',
    produtoAmostra: amostra.produto_amostra_detalhes?.id || amostra.produto_amostra,
    periodoHora: amostra.periodo_hora || '',
    periodoTurno: amostra.periodo_turno || '',
    tipoAmostragem: amostra.tipo_amostragem || '',
    localColeta: amostra.local_coleta || '',
    fornecedor: amostra.fornecedor || '',
    representatividadeLote: amostra.representatividade_lote || '',
    identificacaoComplementar: amostra.identificacao_complementar || '',
    complemento: amostra.complemento || '',
    observacoes: amostra.observacoes || '',
    digitador: amostra.digitador || '',
    status: amostra.status || ''
  };
}

// Método para carregar imagens da amostra 
carregarImagensParaExpressa(amostraId: number, dadosEnriquecidos: any) {
  this.amostraService.getImagensAmostra(amostraId).subscribe({
    next: (imagens) => {
      // Adicionar imagens aos dados enriquecidos
      if (imagens && imagens.length > 0) {
        dadosEnriquecidos.imagensExistentes = imagens.map((img: any) => ({
          id: img.id,
          url: img.image_url || img.image,
          descricao: img.descricao || '',
          nome: `imagem_${img.id}`,
          // Para imagens existentes, 
          isExistente: true
        }));
        console.log('Imagens carregadas para expressa:', dadosEnriquecidos.imagensExistentes);
      }
      
      this.navegarParaExpressaComDados(dadosEnriquecidos);
    },
    error: (error) => {
      console.warn('Erro ao carregar imagens, mas continuando:', error);
      // Mesmo se houver erro ao carregar imagens, continua para a expressa
      this.navegarParaExpressaComDados(dadosEnriquecidos);
    }
  });
}

// Método para navegar para expressa com dados preparados
navegarParaExpressaComDados(dadosEnriquecidos: any) {
  // Salvar no sessionStorage como backup
  const dadosSemImagens = { ...dadosEnriquecidos };
  delete dadosSemImagens.imagens;
  delete dadosSemImagens.imagensExistentes;
  sessionStorage.setItem('amostraData', JSON.stringify(dadosSemImagens));
  
  console.log('Navegando para expressa com dados da amostra salva:', dadosEnriquecidos);
  
  // Navegar para a rota expressa passando os dados via state
  this.router.navigate(['/welcome/controleQualidade/expressa'], {
    state: { amostraData: dadosEnriquecidos }
  });
}

//////////////////////////END OS EXPRESSA APARTIR DA TABELA //////////////////

////////////////////////ORDEM DE SERVIÇO COM PLANO DE ANÁLISE //////////////////

criarOrdemServico(amostra: any){  
  this.amostraSelecionada = amostra;

  // Preenche automaticamente alguns campos da OS baseados na amost
  this.preencherFormularioOSComAmostra(amostra);
  this.activeStep = 3;
  this.messageService.add({
    severity: 'info',
    summary: 'Amostra Selecionada',
    detail: `Amostra ${amostra.numero} selecionada. Configure a Ordem de Serviço.`
  });
}

preencherFormularioOSComAmostra(amostra: any) {
  console.log('Preenchendo formulário OS com dados da amostra:', amostra);
  
  // Busca o próximo número de OS
  this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.patchValue({
      numero: numero,
      data: new Date(), // Data atual
      digitador: this.digitador,
      classificacao: amostra.finalidade || 'Controle de Qualidade'
    });
  });
  
}

salvarOrdemEAssociarAmostra() {
  if (!this.amostraSelecionada) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Nenhuma amostra foi selecionada.'
    });
    return;
  }

  if (!this.registerOrdemForm.valid) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Preencha todos os campos obrigatórios da Ordem de Serviço.'
    });
    return;
  }

  // Formatar a data da ordem
  let dataFormatada = '';
  const dataValue = this.registerOrdemForm.value.data;
  if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
    dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
  }

  console.log('🚀 Iniciando criação de OS para amostra existente:', this.amostraSelecionada.id);

  // Criar a ordem de serviço
  this.ordemService.registerOrdem(
    dataFormatada,
    this.registerOrdemForm.value.numero,
    this.registerOrdemForm.value.planoAnalise,
    this.registerOrdemForm.value.responsavel,
    this.registerOrdemForm.value.digitador,
    this.registerOrdemForm.value.classificacao
  ).subscribe({
    next: (ordemSalva) => {
      console.log('✅ Ordem criada:', ordemSalva);
      
      // Associar a amostra existente à ordem criada
      this.associarAmostraAOrdem(this.amostraSelecionada.id, ordemSalva.id);
    },
    error: (err) => {
      console.error('❌ Erro ao criar ordem:', err);
      this.tratarErroOperacao(err, 'criar ordem de serviço');
    }
  });
}

associarAmostraAOrdem(amostraId: number, ordemId: number) {
  console.log(`🔗 Associando amostra ${amostraId} à ordem ${ordemId}`);
  
  // Atualizar a amostra para incluir a referência da ordem
  this.amostraService.associarAmostraAOrdem(amostraId, ordemId).subscribe({
    next: (amostraAtualizada) => {
      console.log('✅ Amostra associada à ordem:', amostraAtualizada);
      
      // Criar análise para a amostra
      this.criarAnaliseParaAmostra(amostraId);
    },
    error: (err) => {
      console.error('❌ Erro ao associar amostra à ordem:', err);
      
      // Se o serviço não existe, tenta atualizar diretamente
      this.atualizarAmostraComOrdem(amostraId, ordemId);
    }
  });
}

atualizarAmostraComOrdem(amostraId: number, ordemId: number) {
  console.log(`🔄 Atualizando amostra ${amostraId} com ordem ${ordemId} (método alternativo)`);
  
  // Preparar dados para atualização
  const dadosAtualizacao = {
    ordem: ordemId
  };
  
  // Se você tem um método de update na amostra service
  this.amostraService.updateAmostra(amostraId, dadosAtualizacao).subscribe({
    next: (amostraAtualizada) => {
      console.log('✅ Amostra atualizada com ordem:', amostraAtualizada);
      
      // Criar análise para a amostra
      this.criarAnaliseParaAmostra(amostraId);
    },
    error: (err) => {
      console.error('❌ Erro ao atualizar amostra:', err);
      
      // Mesmo se der erro na associação, tenta criar a análise
      this.criarAnaliseParaAmostra(amostraId);
    }
  });
}

criarAnaliseParaAmostra(amostraId: number) {
  console.log(`📊 Criando análise para amostra ${amostraId}`);
  
  // Buscar a amostra atualizada para garantir que tem a ordem associada
  this.amostraService.getAmostraById(amostraId).subscribe({
    next: (amostraAtualizada) => {
      console.log('📋 Amostra recuperada:', amostraAtualizada);
      
      // Verificar se a amostra tem ordem associada
      if (!amostraAtualizada.ordem && !amostraAtualizada.ordem_detalhes) {
        console.warn('⚠️ Amostra não tem ordem associada');
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'A amostra foi associada, mas não foi possível recuperar a ordem. Verifique manualmente.'
        });
        return;
      }
      
      // Criar análise com a amostra e ordem
      const ordemId = amostraAtualizada.ordem || amostraAtualizada.ordem_detalhes?.id;
      console.log(`🔗 Criando análise para amostra ${amostraId} com ordem ${ordemId}`);
      
      this.analiseService.registerAnalise(amostraId, 'PENDENTE').subscribe({
        next: (analiseCriada) => {
          console.log('✅ Análise criada:', analiseCriada);
          
          // Atualizar a lista de amostras para refletir as mudanças
          this.loadAmostras();
          
          // Limpar seleção e resetar formulários
          this.limparSelecaoEFormularios();
          
          // Voltar para o step 1
          this.activeStep = 1;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Ordem de Serviço criada e associada à amostra ${this.amostraSelecionada.numero}. Análise criada com sucesso!`
          });
        },
        error: (err) => {
          console.error('❌ Erro ao criar análise:', err);
          
          // Mesmo se der erro na análise, a ordem foi criada
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail: 'Ordem criada e associada, mas houve erro ao criar a análise. Verifique manualmente.'
          });
          
          this.limparSelecaoEFormularios();
          this.activeStep = 1;
        }
      });
    },
    error: (err) => {
      console.error('❌ Erro ao recuperar amostra atualizada:', err);
      
      // Se não conseguir recuperar a amostra, tenta criar análise só com amostraId
      console.log('🔄 Tentando criar análise apenas com amostraId como fallback');
      this.analiseService.registerAnalise(amostraId, 'PENDENTE').subscribe({
        next: (analiseCriada) => {
          console.log('✅ Análise criada (fallback):', analiseCriada);
          
          this.loadAmostras();
          this.limparSelecaoEFormularios();
          this.activeStep = 1;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Ordem criada e análise criada para amostra ${this.amostraSelecionada.numero}!`
          });
        },
        error: (fallbackErr) => {
          console.error('❌ Erro no fallback:', fallbackErr);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Ordem criada, mas não foi possível criar a análise. Verifique manualmente.'
          });
          
          this.limparSelecaoEFormularios();
          this.activeStep = 1;
        }
      });
    }
  });
}

limparSelecaoEFormularios() {
  this.amostraSelecionada = null;
  this.registerOrdemForm.reset();
  
  // Recarregar próximo número de OS para o formulário limpo
  this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.get('numero')?.setValue(numero);
  });
  
  // Restaurar digitador
  this.registerOrdemForm.get('digitador')?.setValue(this.digitador);
}

tratarErroOperacao(err: any, operacao: string) {
  console.error(`Erro ao ${operacao}:`, err);
  
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
      detail: 'Acesso negado! Você não tem autorização para esta operação.' 
    });
  } else if (err.status === 400) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Erro!', 
      detail: 'Dados inválidos. Verifique o preenchimento e tente novamente.' 
    });
  } else {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Falha!', 
      detail: `Erro interno ao ${operacao}. Comunicar o administrador.` 
    });
  }
}

//////////////////////////END ORDEM DE SERVIÇO COM PLANO DE ANÁLISE //////////////////











// salvarOrdemEAmostra() {
//   // Se houver uma análise selecionada, preencha o formulário de amostra com seus dados
//   if (this.amostraSelecionada ) {
//     const a = this.amostraSelecionada;
//     this.registerForm.patchValue({
//       dataColeta: a.data_coleta ? new Date(a.data_coleta) : '',
//       dataEntrada: a.data_entrada ? new Date(a.data_entrada) : '',
//       material: a.material_detalhes?.id || '',
//       numero: a.numero || '',
//       tipoAmostra: a.tipo_amostra_detalhes?.id || '',
//       subtipo: a.subtipo || '',
//       produtoAmostra: a.produto_amostra_detalhes?.id || '',
//       periodoHora: a.periodo_hora || '',
//       periodoTurno: a.periodo_turno || '',
//       tipoAmostragem: a.tipo_amostragem || '',
//       localColeta: a.local_coleta || '',
//       representatividadeLote: a.representatividade_lote || '',
//       identificacaoComplementar: a.identificacao_complementar || '',
//       complemento: a.complemento || '',
//       digitador: a.digitador || '',
//       status: a.status || ''
//     });
//   }

//   // 1. Formata a data da ordem
//   let dataFormatada = '';
//   const dataValue = this.registerOrdemForm.value.data;
//   if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
//     dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
//   }

//   // 2. Salve a ordem
//   this.ordemService.registerOrdem(
//     dataFormatada,
//     this.registerOrdemForm.value.numero,
//     this.registerOrdemForm.value.planoAnalise,
//     this.registerOrdemForm.value.responsavel,
//     this.registerOrdemForm.value.digitador,
//     this.registerOrdemForm.value.classificacao
//   ).subscribe({
//     next: (ordemSalva) => {
//       // 3. Pegua o número ou ID da ordem salva
//       const numeroOrdem = ordemSalva.numero; // ou ordemSalva.id

//       // 4. Formata as datas da amostra
//       let dataColetaFormatada = '';
//       const dataColetaValue = this.registerForm.value.dataColeta;
//       if (dataColetaValue instanceof Date && !isNaN(dataColetaValue.getTime())) {
//         dataColetaFormatada = formatDate(dataColetaValue, 'yyyy-MM-dd', 'en-US');
//       }
//       let dataEntradaFormatada = '';
//       const dataEntradaValue = this.registerForm.value.dataEntrada;
//       if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
//         dataEntradaFormatada = formatDate(dataEntradaValue, 'yyyy-MM-dd', 'en-US');
//       }

//       let dataEnvioFormatada = '';
//       const dataEnvioValue = this.registerForm.value.dataEnvio;
//       if (dataEnvioValue instanceof Date && !isNaN(dataEnvioValue.getTime())) {
//         dataEnvioFormatada = formatDate(dataEnvioValue, 'yyyy-MM-dd', 'en-US');
//       }

//       let dataRecebimentoFormatada = '';
//       const dataRecebimentoValue = this.registerForm.value.dataRecebimento;
//       if (dataRecebimentoValue instanceof Date && !isNaN(dataRecebimentoValue.getTime())) {
//         dataRecebimentoFormatada = formatDate(dataRecebimentoValue, 'yyyy-MM-dd', 'en-US');
//       }


//       // 5. Salva a amostra vinculando à ordem
//       this.amostraService.registerAmostra(
//         this.registerForm.value.especie,
//         this.registerForm.value.finalidade,
//         this.registerForm.value.numeroSac,
//         dataEnvioFormatada,
//         this.registerForm.value.destinoEnvio,
//         dataRecebimentoFormatada,
//         this.registerForm.value.reter,
//         this.registerForm.value.registroEp,
//         this.registerForm.value.registroProduto,
//         this.registerForm.value.numeroLote, 
//         dataColetaFormatada,
//         dataEntradaFormatada,
//         this.registerForm.value.material,
//         this.registerForm.value.numero,
//         this.registerForm.value.tipoAmostra,
//         this.registerForm.value.subtipo,
//         this.registerForm.value.produtoAmostra,
//         this.registerForm.value.periodoHora,
//         this.registerForm.value.periodoTurno,
//         this.registerForm.value.tipoAmostragem,
//         this.registerForm.value.localColeta,
//         this.registerForm.value.fornecedor,
//         this.registerForm.value.representatividadeLote,
//         this.registerForm.value.identificacaoComplementar,
//         this.registerForm.value.complemento,
//         this.registerForm.value.observacoes,
//         numeroOrdem,
//         null, 
//         this.registerForm.value.digitador,
//         this.registerForm.value.status
//       ).subscribe({
//         next: (amostraCriada) => {
//           // 6. Crie a análise vinculada à amostra recém-criada
//           this.analiseService.registerAnalise(amostraCriada.id, 'PENDENTE').subscribe({
//             next: () => {
//               this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Amostra, ordem e análise registradas com sucesso.' });
//               this.activeStep = 4; // Avança para o próximo passo, se houver
//             },
//             error: () => {
//               this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Amostra e ordem salvas, mas erro ao criar análise.' });
//             }
//           });
//         },
//         error: (err) => {
//           this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a amostra.' });
//         }
//       });
//     },
//     error: (err) => {
//       this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar a ordem.' });
//     }
//   });
// }

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


}