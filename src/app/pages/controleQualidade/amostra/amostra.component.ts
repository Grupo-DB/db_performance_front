import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TipoAmostra } from '../tipo-amostra/tipo-amostra.component';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';
import { StepperModule } from 'primeng/stepper';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Plano } from '../plano/plano.component';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { FieldsetModule } from 'primeng/fieldset';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { Ordem } from '../ordem/ordem.component';
import { Analise } from '../analise/analise.component';
import { InplaceModule } from 'primeng/inplace';
import { CardModule } from 'primeng/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import jsPDF from 'jspdf';
import { TooltipModule } from 'primeng/tooltip';
import { Avaliador } from '../../avaliacoes/avaliador/avaliador.component';

interface FileWithInfo {
  file: File;
  descricao: string;
}
interface AmostraForm{
  laboratorio: FormControl,
  material: FormControl,
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
  numero:FormControl,
  tipoAmostra: FormControl,
  subtipo: FormControl,
  produtoAmostra: FormControl,
  codDb: FormControl,
  estadoFisico: FormControl,
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
  status: FormControl,
  dataDescarte: FormControl,
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
  laboratorio: any;
  data_entrada: any;
  data_coleta: any;
  numero: any;
  finalidade: any;
  numero_lote: any;
  status: any;
  local_coleta: any;

  material: any;
  tipo_amostra: any;
  subtipo: any;
  estado_fisico: any;
  cod_db: any;
  fornecedor: any;
  periodo_hora: any;
  periodo_turno: any;
  tipo_amostragem: any;
  representatividade_lote: any;
  registro_ep: any;
  registro_produto: any;
  data_envio: any;
  destino_envio: any;
  data_recebida: any;
  identificacao_complementar: any;
  complemento: any;
  observacoes: any;
  reter: any;
  expressa_detalhes: any;
  ordem_detalhes: any;
  classificacao: any;
  responsavel: any;
  data: any;
  data_descarte: any;
  
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
    InputIcon, FieldsetModule, MenuModule, SplitButtonModule, TagModule,
    DrawerModule, SpeedDialModule, InplaceModule, 
    NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule
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

  editForm!: FormGroup;
  editFormVisible: boolean = false;

  avaliadores: Avaliador [] | undefined;
  cols!: Column[];
  selectedColumns!: Column[];  
  amostras: Amostra[] = [];
  
  // Cache para menu items para evitar recriação constante
  private menuItemsCache = new Map<number, MenuItem[]>();
  
  // Propriedades para controle de laboratório
  laboratorios: any[] = [];
  laboratorioSelecionado: any = null;
  mostrarFormulario: boolean = false;
  
  registerForm!: FormGroup<AmostraForm>;
  registerOrdemForm!: FormGroup<OrdemForm>;
  tiposAmostra: TipoAmostra[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  produtosFiltrados: any[] = [];
  tiposFiltrados: any[] = [];
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
  amostraData: any = null;
  imagensExistentes: any[] = [];
  // Propriedades para visualização de imagens
  modalImagensVisible: boolean = false;
  imagensAmostra: any[] = [];
  amostraImagensSelecionada: any = null;
  imagemAtualIndex: number = 0;
  amostraDoFormulario: any = null;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  modalImagens: boolean = false;
  modalVisualizar: boolean = false;
  materiaisFiltro: any[] = [];

  tipos = [
    { value: 'Media' },
    { value: 'Pontual' }
  ]

  materiais: any[] = [
    { value: 'Aditivos' },
    { value: 'Areia' },
    { value: 'Argamassa' },
    { value: 'Cal' },
    { value: 'Calcário' },
    { value: 'Dolomita'},
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
    { id: 0, nome: 'Diário' },
    { id: 1, nome: 'Pontual' },
    { id: 2, nome: 'Semanal' },
    { id: 3, nome: 'Mensal' },
    { id: 4, nome: 'Anual' },
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
    { id: 0, nome: 'Simples' },
    { id: 1, nome: 'Parcial' },
    { id: 2, nome: 'Complexa' },
    { id: 3, nome: 'Super Complexa' },
  ]

  finalidades = [
    { id: 0, nome: 'Controle de Qualidade' },
    { id: 1, nome: 'SAC' },
    { id: 2, nome: 'Desenvolvimento de Produtos' },
    { id: 3, nome: 'Demanda Comercial' },
    { id: 4, nome: 'Laboratório / Qualidade' },
    { id: 5, nome: 'Teste Validação' },
    { id: 6, nome: 'Reclamação Atendimento' },
    { id: 7, nome: 'Treinamento' },
    { id: 8, nome: 'Padrão' },
    { id: 9, nome: 'Controle Matéria Prima' },
    { id: 10, nome: 'Outros' },

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
    { value: true, nome: 'Sim' },
    { value: false, nome: 'Não' },
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
    private router: Router,
    private fb: FormBuilder,
  )
  {
    this.registerForm = new FormGroup<AmostraForm>({
      laboratorio: new FormControl(''),
      material: new FormControl('',[Validators.required]),
      finalidade: new FormControl('',[Validators.required]),
      numeroSac: new FormControl('',),
      dataEnvio: new FormControl('',),
      destinoEnvio: new FormControl('',),
      dataRecebimento: new FormControl('',),
      reter: new FormControl(false),
      registroEp: new FormControl('',),
      registroProduto: new FormControl('',),
      numeroLote: new FormControl(''),
      dataColeta: new FormControl(new Date()),
      dataEntrada: new FormControl(new Date()),
      numero: new FormControl(''),
      tipoAmostra: new FormControl(''),
      subtipo: new FormControl(''),
      produtoAmostra: new FormControl(''),
      codDb: new FormControl(''),
      estadoFisico: new FormControl(''),
      periodoHora: new FormControl(''),
      periodoTurno: new FormControl(''),
      tipoAmostragem: new FormControl(''),
      localColeta: new FormControl(''),
      fornecedor: new FormControl(''),
      representatividadeLote: new FormControl(''),
      identificacaoComplementar: new FormControl(''),
      complemento: new FormControl(''),
      observacoes: new FormControl(''),
      ordem: new FormControl(''),
      digitador: new FormControl(''),
      status: new FormControl(''),
      dataDescarte: new FormControl(''),
    });
    
    // Inicializar lista de laboratórios
    this.laboratorios = [
      { nome: 'Matriz'},
      { nome: 'ATM'},
    ];
    this.registerOrdemForm = new FormGroup<OrdemForm>({
      data: new FormControl('',[Validators.required]),
      numero: new FormControl('',[Validators.required]),
      planoAnalise: new FormControl('',[Validators.required]),
      responsavel: new FormControl('',[Validators.required]),
      digitador: new FormControl('',[Validators.required]),
      classificacao: new FormControl('',[Validators.required])
    });

    this.editForm  = this.fb.group({
      id: [''],
      laboratorio: [''],
      dataEntrada: [''],
      dataColeta: [''],
      numero: [''],
      finalidade: [''],
      numeroLote: [''],
      status: [''],
      localColeta: [''],
      produtoAmostra: [''],
      material: [''],
      tipoAmostra: [''],
      subtipo: [''],
      estadoFisico: [''],
      codDb: [''],
      fornecedor: [''],
      periodoHora: [''],
      periodoTurno: [''],
      tipoAmostragem: [''],
      representatividadeLote: [''],
      registroEp: [''],
      registroProduto: [''],
      dataEnvio: [''],
      destinoEnvio: [''],
      dataRecebimento: [''],
      identificacaoComplementar: [''],
      complemento: [''],
      observacoes: [''],
      reter: [''],
      dataDescarte: [''],
      
    });

  }
  abrirModalEdicao(amostra: Amostra) {
    this.editFormVisible = true;
    // Limpa arquivos de upload anteriores e define o ID da amostra
    this.uploadedFilesWithInfo = [];
    this.amostraId = amostra.id;
    const dataEntrada = amostra.data_entrada ? new Date(amostra.data_entrada) : null;
    const dataColeta = amostra.data_coleta ? new Date(amostra.data_coleta) : null;
    const dataEnvio = amostra.data_envio ? new Date(amostra.data_envio) : null;
    const dataRecebimento = amostra.data_recebida ? new Date(amostra.data_recebida) : null;
    // Calcular data de descarte se não existir ou usar a existente
    let dataDescarte = amostra.data_descarte ? new Date(amostra.data_descarte) : null;
    if (!dataDescarte && dataEntrada && amostra.material) {
      dataDescarte = this.calcularDataDescarte(dataEntrada, amostra.material);
    }
    this.editForm.patchValue({
      id: amostra.id,
      laboratorio: amostra.laboratorio,
      dataEntrada: dataEntrada,
      dataColeta: dataColeta,
      dataEnvio: dataEnvio,
      dataRecebimento: dataRecebimento,
      numero:  amostra.numero,
      finalidade:  amostra.finalidade,
      numeroLote:  amostra.numero_lote,
      status:  amostra.status,
      localColeta:  amostra.local_coleta,
      material:  amostra.material,
      //nnao sei
      // produto_amostra
      tipoAmostra: amostra.tipo_amostra,
      subtipo: amostra.subtipo,
      estadoFisico: amostra.estado_fisico,
      codDB: amostra.cod_db,
      fornecedor: amostra.fornecedor,
      periodoHora: amostra.periodo_hora,
      periodoTurno: amostra.periodo_turno ? Number(amostra.periodo_turno) : null,
      tipoAmostragem: amostra.tipo_amostragem,
      representatividadeLote: amostra.representatividade_lote,
      registroEp: amostra.registro_ep,
      registroProduto: amostra.registro_produto,
      destinoEnvio: amostra.destino_envio,
      identificacaoComplementar: amostra.identificacao_complementar,
      complemento: amostra.complemento,
      observacoes: amostra.observacoes,
      reter: amostra.reter,
      dataDescarte: dataDescarte
    });
  }
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  
  // Método chamado quando o laboratório é selecionado
  onLaboratorioSelecionado(laboratorio: any): void {
    this.laboratorioSelecionado = laboratorio;
    this.mostrarFormulario = true;
    
    // Salvar o nome do laboratório no formulário
    this.registerForm.patchValue({
      laboratorio: laboratorio.nome
    });
    
    this.messageService.add({
      severity: 'success',
      summary: 'Laboratório Selecionado',
      detail: `${laboratorio.nome} selecionado com sucesso!`,
      life: 2000
    });
  }
  
  // Método para resetar a seleção do laboratório
  resetarLaboratorio(): void {
    this.laboratorioSelecionado = null;
    this.mostrarFormulario = false;
    this.clearForm();
  }
  
  ngOnInit(): void {
    this.loadTiposAmostra();
    this.loadProdutosAmostra();
    this.loadPlanosAnalise();
    this.getDigitadorInfo();
    this.loadAnalises();
    this.loadAmostras();
    this.cd.markForCheck();
    //número da OS
    this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.get('numero')?.setValue(numero);
  });
    // Chama sempre que algum campo relevante mudar
  this.registerForm.get('material')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  this.registerForm.get('tipoAmostragem')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  this.registerForm.get('dataColeta')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  // Listeners para atualizar data de descarte automaticamente
  this.registerForm.get('dataEntrada')?.valueChanges.subscribe(() => this.atualizarDataDescarte());
  this.registerForm.get('material')?.valueChanges.subscribe(() => this.atualizarDataDescarte());
  // Chamada inicial para calcular data de descarte se houver dados
  setTimeout(() => this.atualizarDataDescarte(), 100);
    // Configuração das colunas da tabela
    this.cols = [
      { field: 'planoEnsaios', header: 'Ensaios do Plano' },
    ];
  }
  getSeverity(materialNome: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    if (!materialNome) {
      return 'secondary';
    }
    switch (materialNome.toLowerCase()) {
      case 'calcario':
        return 'warn';
      case 'acabamento':
        return 'success';
      case 'argamassa':
        return 'info';
      case 'cal':
        return 'danger';
      case 'mineracao':
        return 'contrast';
      default:
        return 'secondary';
    }

  }

  loadAmostras(): void {
    this.amostraService.getAmostrasSemOrdem().subscribe(
      response => {
        this.amostras = response;
        this.materiaisFiltro = response.map((amostra: { material: any; }) => ({
          label: amostra.material,
          value: amostra.material
        }));
        
        // Limpar cache de menu items quando dados são atualizados
        this.menuItemsCache.clear();
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
    // Não resetar o laboratório aqui para manter a seleção
  }
  
  clearFormCompleto(){
    this.registerForm.reset();
    this.resetarLaboratorio();
  }
  
  clearEditForm(){
    this.editForm.reset();
    // Também limpar os arquivos de upload
    this.uploadedFilesWithInfo = [];
  }

  saveEdit(){
    const id = this.editForm.value.id;
    let dataEntradaFormatada = null;
    const dataEntrada = this.editForm.value.dataEntrada;
    if (dataEntrada instanceof Date) {
      dataEntradaFormatada = formatDate(dataEntrada, 'yyyy-MM-dd', 'en-US');
    }
    let dataColetaFormatada = null;
    const dataColeta = this.editForm.value.dataColeta;
    if (dataColeta instanceof Date) {
      dataColetaFormatada = formatDate(dataColeta, 'yyyy-MM-dd', 'en-US');
    }
    let dataEnvioFormatada = null;
    const dataEnvio = this.editForm.value.dataEnvio;
    if (dataEnvio instanceof Date) {
      dataEnvioFormatada = formatDate(dataEnvio, 'yyyy-MM-dd', 'en-US');
    }
    let dataRecebimentoFormatada = null;
    const dataRecebimento = this.editForm.value.dataRecebimento;
    if (dataRecebimento instanceof Date) {
      dataRecebimentoFormatada = formatDate(dataRecebimento, 'yyyy-MM-dd', 'en-US');
    }
    let dataDescarteFormatada = null;
    const dataDescarte = this.editForm.value.dataDescarte;
    if (dataDescarte instanceof Date) {
      dataDescarteFormatada = formatDate(dataDescarte, 'yyyy-MM-dd', 'en-US');
    }
    const dadosAtualizados: Partial<Amostra> = {
      laboratorio: this.editForm.value.laboratorio,
      data_entrada: dataEntradaFormatada,
      data_coleta: dataColetaFormatada,
      data_envio: dataEnvioFormatada,
      data_recebida: dataRecebimentoFormatada,
      data_descarte: dataDescarteFormatada,
      numero: this.editForm.value.numero,
      finalidade: this.editForm.value.finalidade,
      numero_lote: this.editForm.value.numeroLote,
      status: this.editForm.value.status,
      local_coleta: this.editForm.value.localColeta,
      material: this.editForm.value.material,
      tipo_amostra: this.editForm.value.tipoAmostra,
      subtipo: this.editForm.value.subtipo,
      estado_fisico: this.editForm.value.estadoFisico,
      cod_db: this.editForm.value.codDb,
      fornecedor: this.editForm.value.fornecedor,
      periodo_hora: this.editForm.value.periodoHora,
      periodo_turno: this.editForm.value.periodoTurno,
      tipo_amostragem: this.editForm.value.tipoAmostragem,
      representatividade_lote: this.editForm.value.representatividadeLote,
      registro_ep: this.editForm.value.registroEp,
      registro_produto: this.editForm.value.registroProduto,
      destino_envio: this.editForm.value.destinoEnvio,
      identificacao_complementar: this.editForm.value.identificacaoComplementar,
      complemento: this.editForm.value.complemento,
      observacoes: this.editForm.value.observacoes,
      reter: this.editForm.value.reter,
    };
    this.amostraService.editAmostra(id, dadosAtualizados).subscribe({
      next:() =>{       
        // Se há arquivos para upload, fazer upload das imagens
        if (this.uploadedFilesWithInfo.length > 0) {
          this.amostraId = id; // Define o ID da amostra para o upload
          this.uploadImagesForEdit(id);
        } else {
          this.editFormVisible = false;
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra atualizada com sucesso!!', life: 1000 });
          this.loadAmostras();
        }
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

  excluirAmostra(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta Amostra?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.amostraService.deleteAmostra(id).subscribe({
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
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
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
          this.analisesSimplificadas[0].planoDetalhes.forEach((plano: any) => {
          // Verificar se existem ensaios antes de iterar
          if (plano.ensaio_detalhes && Array.isArray(plano.ensaio_detalhes)) {
            plano.ensaio_detalhes.forEach((ensaio: any) => {
              ensaio.digitador = this.digitador;
              
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
        console.error('Erro ao carregar planos de análise', error);
      }
    );
  }

onMaterialChange(materialNome: string) {  
  if (materialNome) {
    // Normaliza o nome apenas para operações internas, mas mantém o valor original no form
    const materialNormalizado = this.normalize(materialNome);    
    // Usa a versão normalizada para todas as operações de backend
    this.amostraService.getProximoSequencialPorNome(materialNormalizado).subscribe({
      next: (sequencial) => {
        const numero = this.gerarNumero(materialNormalizado, sequencial);
        this.registerForm.get('numero')?.setValue(numero);
        this.loadProdutosPorMaterial(materialNormalizado);
        this.loadTiposAmostraPorMaterial(materialNormalizado);
        // Atualizar data de descarte quando material mudar
        this.atualizarDataDescarte();
      },
      error: (err) => {
        console.error('Erro ao buscar sequencial:', err);
        const sequencialFallback = this.gerarSequencialFallback(materialNormalizado);
        const numero = this.gerarNumero(materialNormalizado, sequencialFallback);
        this.registerForm.get('numero')?.setValue(numero);
        this.messageService.add({ 
          severity: 'warn', 
          summary: 'Aviso', 
          detail: 'Usando numeração local. Verifique a conectividade.' 
        });
      }
    });
  }
}

private gerarSequencialFallback(materialNome: string): number {
  // usa timestamp + hash do nome do material
  const timestamp = Date.now();
  const hash = materialNome.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Combina timestamp com hash para gerar um número único
  return Math.abs((timestamp + hash) % 999999) + 1;
}
  loadTiposAmostra() {
    this.amostraService.getTiposAmostra().subscribe(
      response => {
        this.tiposAmostra = response;
      },
      error => {
        console.error('Erro ao carregar tipos de amostra', error);
      }
    );
  }
  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }
      , error => {
        console.error('Erro ao carregar produtos de amostra', error);
      }
    )
  }

  loadProdutosPorMaterial(materialNome: string): void {
    if (!materialNome) {
      this.produtosFiltrados = [];
      return;
    }
    this.amostraService.getProdutosPorMaterial(materialNome).subscribe({
      next: (response) => {
        this.produtosFiltrados = response;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos por material:', err);
        this.produtosFiltrados = [];
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar produtos para o material selecionado.' 
        });
      }
    });
  }

  loadTiposAmostraPorMaterial(materialNome: string): void {
    if (!materialNome) {
      this.tiposFiltrados = [];
      return;
    }
    this.amostraService.getTiposAmostraPorMaterial(materialNome).subscribe({
      next: (response) => {
        this.tiposFiltrados = response;
      },
      error: (err) => {
        console.error('Erro ao carregar tipos por material:', err);
        this.tiposFiltrados = [];
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao carregar tipos para o material selecionado.' 
        });
      }
    });
  }

  mostrarTodosProdutos(): void {
    this.produtosFiltrados = [...this.produtosAmostra];
  }
  
  toggleFiltroMaterial(materialNome: string | null): void {
    if (materialNome) {
      this.loadProdutosPorMaterial(materialNome);
    } else {
      this.mostrarTodosProdutos();
    }
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
  if (this.exibirRepresentatividadeLote()) {
    this.consultarProducao();
  } else {
    this.registerForm.get('representatividadeLote')?.setValue('');
  }
}
getMenuItems(amostra: any) {
  // Usar cache para evitar recriação constante dos menu items
  const amostraId = amostra.id;
  
  if (!this.menuItemsCache.has(amostraId)) {
    const menuItems = [
      { label: 'Visualizar', icon: 'pi pi-eye', command: () => this.visualizar(amostra), tooltip: 'Visualizar amostra', tooltipPosition: 'top' },
      { label: 'Imprimir Etiqueta', icon: 'pi pi-file-pdf', command: () => this.imprimirEtiqueta(amostra), tooltip: 'IMprimir Etiqueta', tooltipPosition: 'top' },
      { label: 'Editar', icon: 'pi pi-pencil', command: () => this.abrirModalEdicao(amostra), tooltip: 'Editar amostra', tooltipPosition: 'top' },
      { label: 'Excluir', icon: 'pi pi-trash', command: () => this.excluirAmostra(amostra.id), tooltip: 'Excluir amostra', tooltipPosition: 'top' },
      { label: 'Imagens', icon: 'pi pi-image', command: () => this.visualizarImagens(amostra), tooltip: 'Visualizar imagens', tooltipPosition: 'top' },
    ];
    this.menuItemsCache.set(amostraId, menuItems);
  }
  
  return this.menuItemsCache.get(amostraId) || [];
}

irLinkExterno(analise: any) {
  window.open(`/welcome/controleQualidade/analise`, analise.id);
}

visualizar(amostra: any) {
  this.amostraSelecionada = amostra;
  this.modalVisualizar = true;
}

imprimirAmostraVisualizar() {
  const doc = new jsPDF();
  let y = 15;
  const addTitle = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 8;
  };
  const addField = (label: string, value: any) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value || "-"), 100, y);
    y += 7;
  };

  let data_entrada = '';
  if (this.amostraSelecionada.data_entrada) {
    data_entrada = formatDate( this.amostraSelecionada.data_entrada, 'dd/MM/YYYY', 'en-US');
  }

  let data_coleta = '';
  if (this.amostraSelecionada.data_coleta) {
    data_coleta = formatDate( this.amostraSelecionada.data_coleta, 'dd/MM/YYYY', 'en-US');
  }

  addTitle("Informações Gerais");
  addField("Data de Entrada", data_entrada);
  addField("Data de Coleta", data_coleta);
  addField("Finalidade", this.amostraSelecionada.finalidade);
  addField("N° SAC", this.amostraSelecionada.numero_sac);
  addField("Número", this.amostraSelecionada.numero);
  addField("Número Lote", this.amostraSelecionada.numero_lote);
  addField("Classificação", this.amostraSelecionada.status);
  addField("Local de Coleta", this.amostraSelecionada.local_coleta);

  y += 5;
  doc.line(10, y, 200, y);
  y += 10;

  addTitle("Material");
  addField("Material", this.amostraSelecionada.material);
  addField("Produto de Amostra", this.amostraSelecionada.produto_amostra_detalhes?.nome);
  addField("Tipo", this.amostraSelecionada.produto_amostra_detalhes?.tipo);
  addField("Subtipo", this.amostraSelecionada.produto_amostra_detalhes?.sub_tipo);
  addField("Código DB", this.amostraSelecionada.cod_db);
  addField("Fornecedor", this.amostraSelecionada.fornecedor);
  addField("Período Hora", this.amostraSelecionada.periodo_hora);
  addField("Periodicidade", this.amostraSelecionada.periodo_turno);
  addField("Tipo de Amostragem", this.amostraSelecionada.tipo_amostragem);
  addField("Representatividade do Lote Tn", this.amostraSelecionada.representividade_lote);

  y += 5;
  doc.line(10, y, 200, y);
  y += 10;

  let data_envio = '';
  if (this.amostraSelecionada.data_envio) {
    data_envio = formatDate( this.amostraSelecionada.data_envio, 'dd/MM/YYYY', 'en-US');
  }

  let data_recebida = '';
  if (this.amostraSelecionada.data_recebida) {
    data_recebida = formatDate( this.amostraSelecionada.data_recebida, 'dd/MM/YYYY', 'en-US');
  }

  addTitle("Complementos");
  addField("Registro Empresa", this.amostraSelecionada.registro_ep);
  addField("Registro Produto", this.amostraSelecionada.registro_produto);
  addField("Data de Envio", data_envio);
  addField("Destino do Envio", this.amostraSelecionada.destino_envio);
  addField("Data de Recebimento", data_recebida);
  addField("Identificação Complementar", this.amostraSelecionada.identificacao_complementar);
  addField("Complemento", this.amostraSelecionada.complemento);
  addField("Observações", this.amostraSelecionada.observacoes);
  addField("Reter", this.amostraSelecionada.reter ? "Sim" : "Não");

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
}

abrirOS(amostra: any) {
  this.amostraSelecionada = amostra;
  this.activeStep = 2;
}

exibirRepresentatividadeLote(): boolean {
  const materialNome = this.registerForm.get('material')?.value;
  const tipoAmostragem = this.registerForm.get('tipoAmostragem')?.value?.toLowerCase();
  if (!materialNome || !tipoAmostragem) return false;
  const nomeMaterialNormalizado = this.normalize(materialNome);
  return (
    (nomeMaterialNormalizado === 'calcario' || nomeMaterialNormalizado === 'finaliza') &&
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
      registroProduto: produtoSelecionado.registro_produto,
      codDb: produtoSelecionado.cod_db,
      tipoAmostra:produtoSelecionado.tipo,
      subtipo:produtoSelecionado.subtipo,
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
      //this.activeStep = 3; // Avança para o próximo passo
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

  // Calcular data de descarte automaticamente baseada no material e data de entrada
  let dataDescarteFormatada = null;
  const material = this.registerForm.value.material;
  if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime()) && material) {
    const dataDescarteValue = this.calcularDataDescarte(dataEntradaValue, material);
    if (dataDescarteValue) {
      dataDescarteFormatada = formatDate(dataDescarteValue, 'yyyy-MM-dd', 'en-US');
    }
  }

  this.amostraService.registerAmostra(
    this.registerForm.value.laboratorio,
    this.registerForm.value.material,
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
    this.registerForm.value.numero,
    this.registerForm.value.tipoAmostra,
    this.registerForm.value.subtipo,
    this.registerForm.value.produtoAmostra,
    this.registerForm.value.codDb,
    this.registerForm.value.estadoFisico,
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
    this.registerForm.value.status,
    dataDescarteFormatada
  ).subscribe({
    next: (amostraCriada) => {
      this.amostraId = amostraCriada.id; // Armazena o ID da amostra criada
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: 'Amostra registrada com sucesso.' 
      });
      
      this.loadAmostras();

      // Faz upload das imagens se houver 
      setTimeout(() => {

        if (this.uploadedFilesWithInfo.length > 0) {
          this.uploadImages();
        } else {
          this.loadAmostras();
          //this.activeStep = 1;
        }
      }, 2000);

      if (material) {
        const materialNormalizado = this.normalize(material);    
        this.amostraService.getProximoSequencialPorNome(materialNormalizado).subscribe({
          next: (sequencial) => {
            const numero = this.gerarNumero(materialNormalizado, sequencial);
            this.registerForm.get('numero')?.setValue(numero);
          },
          error: (err) => {
            console.error('Erro ao buscar sequencial:', err);
            const sequencialFallback = this.gerarSequencialFallback(materialNormalizado);
            const numero = this.gerarNumero(materialNormalizado, sequencialFallback);
            this.registerForm.get('numero')?.setValue(numero);
            this.messageService.add({ 
              severity: 'warn', 
              summary: 'Aviso', 
              detail: 'Usando numeração local. Verifique a conectividade.' 
            });
          }
        });
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
  });
  this.amostraService.uploadImagens(this.amostraId, formData).subscribe({
    next: (response) => {
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

// Método para fazer upload das imagens durante edição
uploadImagesForEdit(amostraId: number): void {
  if (!amostraId || this.uploadedFilesWithInfo.length === 0) {
    this.editFormVisible = false;
    this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra atualizada com sucesso!!', life: 1000 });
    this.loadAmostras();
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
  });

  this.amostraService.uploadImagens(amostraId, formData).subscribe({
    next: (response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Amostra atualizada e ${this.uploadedFilesWithInfo.length} imagem(ns) enviada(s) com sucesso!`
      });
      
      this.uploadedFilesWithInfo = [];
      this.editFormVisible = false;
      this.loadAmostras();
    },
    error: (error) => {
      console.error('Erro ao enviar imagens durante edição:', error);
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Amostra foi atualizada, mas houve erro ao enviar as imagens. Tente novamente.'
      });
      this.editFormVisible = false;
      this.loadAmostras();
    }
  });
}

// Método para remover arquivo da lista antes do envio
removeFile(index: number): void {
    this.uploadedFilesWithInfo.splice(index, 1);
  }

// Previne o upload automático
beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
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
  // Salva no sessionStorage como backup (sem as imagens por limitação de tamanho)
  const dadosSemImagens = { ...dadosEnriquecidos };
  delete dadosSemImagens.imagens;
  sessionStorage.setItem('amostraData', JSON.stringify(dadosSemImagens));
  // Navega para a rota expressa passando os dados via state
  this.router.navigate(['/welcome/controleQualidade/expressa'], {
    state: { amostraData: dadosEnriquecidos }
  });
}

// Método para preencher os dados do formulário
enriquecerDadosFormulario(formData: any): any {
  const dadosEnriquecidos = { ...formData };
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
      nome: periodoSelecionado?.nome || 'Periodicidade não encontrada'
    };
  }
  
  // CAMPOS QUE JÁ SÃO NOMES (optionValue="nome") - não precisam enriquecimento
  if (formData.material) {
    dadosEnriquecidos.materialInfo = {
      nome: formData.material
    };
  }
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

//////////////////////////////////////////////OS EXPRESSA APARTIR DA TABELA //////////////////
criarExpressaDeAmostra(amostra: any) {
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
    id: amostra.id,
    material: amostra.material || '',
    finalidade: amostra.finalidade || '',
    numeroSac: amostra.numero_sac || '',
    dataEnvio: amostra.data_envio ? new Date(amostra.data_envio) : null,
    destinoEnvio: amostra.destino_envio || '',
    dataRecebimento: amostra.data_recebimento ? new Date(amostra.data_recebimento) : null,
    dataDescarte: amostra.data_descarte ? new Date(amostra.data_descarte) : null,
    reter: amostra.reter || false,
    registroEp: amostra.registro_ep || '',
    registroProduto: amostra.registro_produto || '',
    numeroLote: amostra.numero_lote || '',
    dataColeta: amostra.data_coleta ? new Date(amostra.data_coleta) : null,
    dataEntrada: amostra.data_entrada ? new Date(amostra.data_entrada) : null,
    numero: amostra.numero || '',
    tipoAmostra: amostra.tipo_amostra_detalhes?.id || amostra.tipo_amostra,
    subtipo: amostra.subtipo || '',
    produtoAmostra: amostra.produto_amostra_detalhes?.id || amostra.produto_amostra,
    codDb: amostra.cod_db || '',
    estadoFisico: amostra.estado_fisico || '',
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
    
  // Navegar para a rota expressa passando os dados via state
  this.router.navigate(['/welcome/controleQualidade/expressa'], {
    state: { amostraData: dadosEnriquecidos }
  });
}

//////////////////////////END OS EXPRESSA APARTIR DA TABELA //////////////////

//////////////////OS COM PLANO APARTIR DA AMOSTRA SELECIONADA DA TABELA //////////////
criarOrdemDeAmostra(amostra: any) {

  // Converter os dados da amostra para o formato esperado pela ordem
  const dadosAmostraParaOrdem = this.converterAmostraSalvaParaFormulario(amostra);
  //enriquecer dados
  const dadosEnriquecidos = this.enriquecerDadosFormulario(dadosAmostraParaOrdem);
  //carregar imagens se tiver
  this.carregarImagensParaOrdemNormal(amostra.id, dadosEnriquecidos);
}
// Método para carregar imagens da amostra para ordem normal
carregarImagensParaOrdemNormal(amostraId: number, dadosEnriquecidos: any) {
  this.amostraService.getImagensAmostra(amostraId).subscribe({
    next: (imagens) => {
      // Adicionar imagens aos dados enriquecidos
      if (imagens && imagens.length > 0) {
        dadosEnriquecidos.imagensExistentes = imagens.map((img: any) => ({
          id: img.id,
          url: img.image_url || img.image,
          descricao: img.descricao || '',
          nome: `imagem_${img.id}`,
          isExistente: true
        }));
      }
      
      this.navegarParaOrdemComDados(dadosEnriquecidos);
    },
    error: (error) => {
      console.warn('Erro ao carregar imagens, mas continuando:', error);
      // Mesmo se houver erro ao carregar imagens, continua para a ordem normal
      this.navegarParaOrdemComDados(dadosEnriquecidos);
    }
  });
}
// Método para navegar para ordem normal com dados preparados
navegarParaOrdemComDados(dadosEnriquecidos: any) {
  // Salvar no sessionStorage como backup
  const dadosSemImagens = { ...dadosEnriquecidos };
  delete dadosSemImagens.imagens;
  delete dadosSemImagens.imagensExistentes;
  sessionStorage.setItem('amostraData', JSON.stringify(dadosSemImagens));  
  // Navegar para a rota ordem passando os dados via state
  this.router.navigate(['/welcome/controleQualidade/ordem'], {
    state: { amostraData: dadosEnriquecidos }
  });
}
///////////////////////////////////////////////////////////////////////////END OS COM PLANO APARTIR DA AMOSTRA SELECIONADA DA TABELA //////////////////

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
  // Busca o próximo número de OS
  this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.patchValue({
      numero: numero,
      data: new Date(), // Data atual
      digitador: this.digitador,
      //classificacao: amostra.finalidade || 'Controle de Qualidade'
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
      // Associar a amostra existente a ordem criada
      this.associarAmostraAOrdem(this.amostraSelecionada.id, ordemSalva.id);
    },
    error: (err) => {
      console.error('❌ Erro ao criar ordem:', err);
      this.tratarErroOperacao(err, 'criar ordem de serviço');
    }
  });
}

associarAmostraAOrdem(amostraId: number, ordemId: number) {  
  // Atualizar a amostra para incluir a referência da ordem
  this.amostraService.associarAmostraAOrdem(amostraId, ordemId).subscribe({
    next: (amostraAtualizada) => {      
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
  // Preparar dados para atualização
  const dadosAtualizacao = {
    ordem: ordemId
  };
  
  // Se tiver um método de update na amostra service
  this.amostraService.updateAmostra(amostraId, dadosAtualizacao).subscribe({
    next: (amostraAtualizada) => {
      // Criar análise para a amostra
      this.criarAnaliseParaAmostra(amostraId);
    },
    error: (err) => {
      console.error('❌ Erro ao atualizar amostra:', err);
      
      // Mesmo se der erro na associação tenta criar a análise
      this.criarAnaliseParaAmostra(amostraId);
    }
  });
}

criarAnaliseParaAmostra(amostraId: number) {  
  // Buscar a amostra atualizada para garantir que tem a ordem associada
  this.amostraService.getAmostraById(amostraId).subscribe({
    next: (amostraAtualizada) => {      
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
      this.analiseService.registerAnalise(amostraId, 'PENDENTE').subscribe({
        next: (analiseCriada) => {          
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
      this.analiseService.registerAnalise(amostraId, 'PENDENTE').subscribe({
        next: (analiseCriada) => {          
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


/////////////////////// ORDEM DE SERVIÇO COM PLANO APARTIR DO FORMULAŔIO////////////////////
navegarParaOs() {  
  // Capturar dados do formulário atual
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
  // ARMAZENAR OS DADOS LOCALMENTE para o fluxo interno
  this.amostraData = dadosEnriquecidos;
  // Salva no sessionStorage como backup
  const dadosSemImagens = { ...dadosEnriquecidos };
  delete dadosSemImagens.imagens;
  sessionStorage.setItem('amostraData', JSON.stringify(dadosSemImagens));
  // Ir para step 2
  this.activeStep = 2;
}
receberDadosAmostra(): void {
  // Validar campos obrigatórios antes de prosseguir
  const camposObrigatorios = ['material', 'finalidade', 'dataColeta', 'dataEntrada'];
  const camposInvalidos = camposObrigatorios.filter(campo => {
    const control = this.registerForm.get(campo);
    return !control || !control.value;
  });

  if (camposInvalidos.length > 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos Obrigatórios',
      detail: 'Por favor, preencha todos os campos obrigatórios da amostra antes de continuar.'
    });
    return;
  }

  // Se não tiver amostraData já carregado, capturar do formulário
  if (!this.amostraData) {
    const formData = this.registerForm.value;
    this.amostraData = this.enriquecerDadosFormulario(formData);
    
    // Adiciona as imagens aos dados
    if (this.uploadedFilesWithInfo && this.uploadedFilesWithInfo.length > 0) {
      this.amostraData.imagens = this.uploadedFilesWithInfo.map(fileInfo => ({
        file: fileInfo.file,
        descricao: fileInfo.descricao,
        nome: fileInfo.file.name,
        tamanho: fileInfo.file.size,
        tipo: fileInfo.file.type
      }));
    }
  }
  
  // Verificar se veio de navegação com dados
  if (window.history.state && window.history.state.amostraData) {
    this.amostraData = window.history.state.amostraData;    
    // Lidar com imagens novas do formulário
    if (this.amostraData.imagens && this.amostraData.imagens.length > 0) {
      this.uploadedFilesWithInfo = this.amostraData.imagens.map((imagem: any) => ({
        file: imagem.file,
        descricao: imagem.descricao || ''
      }));
    }
    
    // Lidar com imagens existentes de amostra salva
    if (this.amostraData.imagensExistentes && this.amostraData.imagensExistentes.length > 0) {
      this.imagensExistentes = this.amostraData.imagensExistentes;
    }
  }
  
  // Preencher formulário da OS com dados da amostra
  this.preencherFormularioOSComAmostraFormulario(this.amostraData);
  
  this.activeStep = 3;
}
criarOSDoFormulario() {
  console.log('Dados da amostra antes de criar OS:', this.amostraData);
  
  // Verificar se amostraData existe
  if (!this.amostraData) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Dados da amostra não encontrados. Por favor, volte e preencha o formulário da amostra.'
    });
    return;
  }
  // Validação customizada 
  const camposEssenciaisOrdem = {
    'data': 'Data da Ordem',
    'numero': 'Número da Ordem',
    'planoAnalise': 'Plano de Análise',
    'digitador': 'Digitador',
  };
  const camposVaziosOrdem = [];
  for (const [campo, nome] of Object.entries(camposEssenciaisOrdem)) {
    const control = this.registerOrdemForm.get(campo);
    if (!control || !control.value || control.value === '') {
      camposVaziosOrdem.push(nome);
    }
  }
  if (camposVaziosOrdem.length > 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos Obrigatórios da Ordem',
      detail: `Por favor, preencha: ${camposVaziosOrdem.join(', ')}`
    });
    return;
  }

  let dataFormatada = '';
  const dataValue = this.registerOrdemForm.value.data;
  if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
    dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
  }

  this.ordemService.registerOrdem(
    dataFormatada,
    this.registerOrdemForm.value.numero,
    this.registerOrdemForm.value.planoAnalise,
    this.registerOrdemForm.value.responsavel,
    this.registerOrdemForm.value.digitador,
    this.registerOrdemForm.value.classificacao
  ).subscribe({
    next: (ordemSalva) => {
      const idOrdem = ordemSalva.id;
      
      // Criar amostra vinculada à ordem
      this.criarAmostraVinculada(idOrdem);
    },
    error: (error) => {
      console.error('❌ Erro ao criar ordem :', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Erro ao criar ordem: ' + (error.error?.detail || error.message)
      });
    }
  });
}

voltarParaStep1() {
  this.activeStep = 1;
}

voltarParaStep2() {
  this.activeStep = 2;
}

limparDadosFormulario() {
  this.amostraData = null;
  this.amostraSelecionada = null;
  this.amostraDoFormulario = null;
  sessionStorage.removeItem('amostraData');
}

  // Método auxiliar para criar amostra vinculada à ordem
  private criarAmostraVinculada(idOrdem: string | number): void {
    // Formatar datas para o backend
    let dataColetaFormatada = null;
    const dataColetaValue = this.amostraData.dataColeta;
    if (dataColetaValue instanceof Date && !isNaN(dataColetaValue.getTime())) {
      dataColetaFormatada = formatDate(dataColetaValue, 'yyyy-MM-dd', 'en-US');
    } else if (typeof dataColetaValue === 'string') {
      dataColetaFormatada = dataColetaValue;
    }

    let dataEntradaFormatada = null;
    const dataEntradaValue = this.amostraData.dataEntrada;
    if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
      dataEntradaFormatada = formatDate(dataEntradaValue, 'yyyy-MM-dd', 'en-US');
    } else if (typeof dataEntradaValue === 'string') {
      dataEntradaFormatada = dataEntradaValue;
    }

    let dataEnvioFormatada = null;
    const dataEnvioValue = this.amostraData.dataEnvio;
    if (dataEnvioValue instanceof Date && !isNaN(dataEnvioValue.getTime())) {
      dataEnvioFormatada = formatDate(dataEnvioValue, 'yyyy-MM-dd', 'en-US');
    } 

    let dataRecebimentoFormatada = null;
    const dataRecebimentoValue = this.amostraData.dataRecebimento;
    if (dataRecebimentoValue instanceof Date && !isNaN(dataRecebimentoValue.getTime())) {
      dataRecebimentoFormatada = formatDate(dataRecebimentoValue, 'yyyy-MM-dd', 'en-US');
    } 

    // Calcular data de descarte automaticamente baseada no material e data de entrada
    let dataDescarteFormatada = null;
    const material = this.amostraData.materialInfo?.nome || this.amostraData.material;
    if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime()) && material) {
      const dataDescarteValue = this.calcularDataDescarte(dataEntradaValue, material);
      if (dataDescarteValue) {
        dataDescarteFormatada = formatDate(dataDescarteValue, 'yyyy-MM-dd', 'en-US');
      }
    }

    // Criar amostra vinculada à ordem
    this.amostraService.registerAmostra(
      this.amostraData.laboratorio,
      this.amostraData.materialInfo?.id || this.amostraData.material,
      this.amostraData.finalidadeInfo?.id || this.amostraData.finalidade,
      this.amostraData.numeroSac,
      dataEnvioFormatada,
      this.amostraData.destinoEnvio,
      dataRecebimentoFormatada,
      this.amostraData.reter,
      this.amostraData.registroEp,
      this.amostraData.registroProduto,
      this.amostraData.numeroLote,
      dataColetaFormatada,
      dataEntradaFormatada,
      //this.amostraData.materialInfo?.id || this.amostraData.material,
      this.amostraData.numero,
      this.amostraData.tipoAmostraInfo?.id || this.amostraData.tipoAmostra,
      this.amostraData.subtipo,
      this.amostraData.produtoAmostraInfo?.id || this.amostraData.produtoAmostra,
      this.amostraData.codDb,
      this.amostraData.estadoFisico,
      this.amostraData.periodoHora,
      this.amostraData.periodoTurno,
      this.amostraData.tipoAmostragem,
      this.amostraData.localColetaInfo?.nome || this.amostraData.localColeta,
      this.amostraData.fornecedorInfo?.nome || this.amostraData.fornecedor,
      this.amostraData.representatividadeLote,
      this.amostraData.identificacaoComplementar,
      this.amostraData.complemento,
      this.amostraData.observacoes,
      idOrdem, // Vincular à ordem criada
      null,
      this.registerOrdemForm.value.digitador,
      this.amostraData.statusInfo?.nome || this.amostraData.status,
      dataDescarteFormatada
    ).subscribe({
      next: (amostraCriada) => {
      // Define o ID da amostra criada ANTES do upload
      this.amostraId = amostraCriada.id;
        // Faz upload das imagens se houver arquivos selecionados
      if (this.uploadedFilesWithInfo.length > 0) {
        this.uploadImages();
      } 
        // Criar análise vinculada à amostra
        this.criarAnaliseVinculada(amostraCriada.id);
      },
      error: (error) => {
        console.error('❌ Erro ao criar amostra:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Ordem criada, mas erro ao criar amostra: ' + (error.error?.detail || error.message)
        });
      }
    });
  }

  // Método auxiliar para criar análise vinculada à amostra
  private criarAnaliseVinculada(idAmostra: number): void {
    this.analiseService.registerAnalise(idAmostra, 'PENDENTE').subscribe({
      next: (analiseCriada) => {
        // Sucesso final
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Amostra expressa criada com sucesso! (Ordem → Amostra → Análise)'
        });
        // redirecionar  
        this.router.navigate(['/welcome/controleQualidade/ordem']);
      },
      error: (error) => {
        console.error('❌ Erro ao criar análise:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Ordem e amostra criadas, mas erro ao criar análise: ' + (error.error?.detail || error.message)
        });
      }
    });
  }

preencherFormularioOSComAmostraFormulario(dadosFormulario: any) {
  // Buscar próximo número de OS
  this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.patchValue({
      numero: numero,
      data: new Date(),
      digitador: this.digitador,
      classificacao: dadosFormulario.finalidade || 'Controle de Qualidade'
    });
  });
  
}

loadAnalises(){
  this.analiseService.getAnalises().subscribe(
    response => {
      this.analises = response;
    },
    error => {
      console.error('Erro ao carregar análises', error);
    }
  );
}

loadUltimaAnalise(){
  this.getDigitadorInfo();
  this.analiseService.getAnalises().subscribe(
    response => {
      if (response && response.length > 0) {
        // Pega a última análise (assumindo que o array está ordenado por criação)
        const ultimaAnalise = response[response.length - 1];
        this.idUltimaAanalise = ultimaAnalise.id;
        this.analisesSimplificadas = [{
          amostraDataEntrada: ultimaAnalise.amostra_detalhes?.data_entrada,
          amostraDataColeta: ultimaAnalise.amostra_detalhes?.data_coleta,
          amostraDataDescarte: ultimaAnalise.amostra_detalhes?.data_descarte,
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
        }];
      } else {
        this.analisesSimplificadas = [];
      }
    },
    error => {
      console.error('Erro ao carregar análises', error);
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

private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
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

// Função para atualizar a data de descarte no formulário
private atualizarDataDescarte(): void {
  const dataEntrada = this.registerForm.get('dataEntrada')?.value;
  const material = this.registerForm.get('material')?.value;  
  if (dataEntrada && material) {
    const dataDescarte = this.calcularDataDescarte(dataEntrada, material);
    this.registerForm.get('dataDescarte')?.setValue(dataDescarte, { emitEvent: false });
  } else {
    // Limpar campo se não tiver dados suficientes
    this.registerForm.get('dataDescarte')?.setValue(null, { emitEvent: false });
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

  // Calcular data de descarte automaticamente baseada no material e data de entrada
  let dataDescarteFormatada = '';
  const material = this.registerForm.value.material;
  if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime()) && material) {
    const dataDescarteValue = this.calcularDataDescarte(dataEntradaValue, material);
    if (dataDescarteValue) {
      dataDescarteFormatada = formatDate(dataDescarteValue, 'yyyy-MM-dd', 'en-US');
    }
  }  
  // Criar amostra normal (sem ordem)
  this.amostraService.registerAmostra(
    this.registerForm.value.laboratorio,
    this.registerForm.value.material,
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
    this.registerForm.value.numero,
    this.registerForm.value.tipoAmostra,
    this.registerForm.value.subtipo,
    this.registerForm.value.produtoAmostra,
    this.registerForm.value.codDb,
    this.registerForm.value.estadoFisico,
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
    this.registerForm.value.status,
    dataDescarteFormatada
  ).subscribe({
    next: (amostraCriada) => {      
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
  }
}

// Método para verificar o estado antes do upload
verificarEstadoArquivos(): void {
  this.uploadedFilesWithInfo.forEach((fileInfo, index) => {
  });
}

  imprimirEtiquetaForm() {

    const logoBase64 = 'data:image/png;base64,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pUoVnQHxU+FyyCuuLURF8+bNzbx587QqHLkeN2zYYFatWmXq16/v3SZ/b/JaqlGjhqlVq5Y3atasaapVq2aqVq3KtQYAAGJr3bp13vOl77//fuP4+eefvedTv/zyi1m9erWpXbu2qVOnjverjM0339xsvfXW3thmm228XzfbbDP9EwG4gHAPKIdwDwi2xx57mA8++ECrwiHcy93KlSvNp59+6g15kv+HP/zBtG3b1uywww56D+RKvi+nTJliFi1aZJYsWWJat25t2rRpY7bffnu9Byrjv//9r5k7d653ra9du9bsuOOO3mjVqpXeA+msX7/ezJ4927vu5QW8XO+77767adq0qd4jnuTr8txzz3nfV3K9HnbYYfo78CPXXnLI413yGmzRooXeA2Ejz8neeOMN79fkyMdrGnkMadeunTfkOUSHDh3MLrvsor8bD++//7758ssvzf/93//pLe5r3Lix91jYqVMnvSV8li5daj788EPva79ixQq9tbjkdUa9evU2DgnA5Zpo1qyZ3iOEyi78TchNDEZcRyH5/X0Mhouje/fu+l1dWBs2bEisW7cuUfZDfePfXfZiIzF//nxvLFy4MLFkyZLEypUrE2vWrPHuK/9P3I0YMSJR9gRkk3+z5DjxxBMTZU/69Z7I1kUXXZRo1KiR79e2f//+iQULFug9ka0333wzMWDAAN+vrYwjjzwy8eyzz+q9UdG4ceMSZS84fL92Xbt2Tdx33316z3iZOnVqolWrVpt8Pfbaa69E2YtGvQeS5GvVt2/fTb5W5cfxxx+feOWVV/TeKKXFixcn7rjjjsSxxx6baNy4se+/V6FG8+bNvcdqeUyR52JR9f777yf++Mc/+n4NojL+8pe/6GcbLqNHj040aNDA92MOw5Dn2PJzpF+/fol//vOfoXpeTbjHYJQbheT39zEYLo5TTz1Vv6sLi3Ave5dccskm/1Z+o3r16rF9oZ+rzz77LLHPPvv4fj3Lj9atW+v/gWyMGTPG9+vpN6688kr9v5B0++23+36tKo79998/dqFWu3btfL8Whx9+uN4DYtSoUb5fJ79x44036v+FYlq9enXinnvuSRx22GG+/y6lGvLmwfDhwxNz5szRjzQadtppJ9/PN2pj2LBh+hmHw+OPP+77cYZ9yPfLoEGDSv4mJOEeg1FuFJLf38dguDiGDBmi39WFRbiXnenTp2/y7xQ0XnrpJf0/EaRDhw6+X0O/cfHFF+v/hUzceeedvl9H2xg8eLD+35g7d26iZs2avl8nv9GwYcPECy+8oP93tM2YMcP3a5Ac//3vf/We8Xbdddf5fn1sI2yBQJS98847Xmiw2Wab+f5bhGkccMABibvvvjvx66+/6kfvpmuuucb384vikDdAwmS33Xbz/ThdGjvvvLMXeC9fvlw/q+LhtFwAQFa6deumM4TJU089pbPMnHfeeabsCbhWSOfMM8/09tzJ1H/+8x+dIcj8+fPNBRdcoFXmRo4cmfX3e1Q9+OCD3t6EmVq2bJk59NBDvX0jo+7rr7/Wmb+PPvpIZ/Ele7NdeumlWmXuqquuMpMnT9YKhTB16lRz5JFHmr333tvcfvvt3j6aYff666+bM844w2y55ZbmrLPO8vYAddEnn3yis+j78ccfdVZ6sree7Bnrujlz5piLL77Y29tw0KBBZuHChfo7hUe4BwDIihyogfCRJ9XZ+OKLL8zVV1+tFfy8+OKL5u6779YqM/IkTkIrBJNgTw7MyQXh9P989tlnOstO3759vQMmEG8XXnihzrIn1yDy78033zS9e/c2PXr08A6CcZEEkXfddZf3fPHEE080M2bM0N9xw1dffaWz6AvTASlR+5n022+/mTvuuMO0bNnS3HDDDXprYRHuAQCy0qBBA50hLFavXm3effddrTJ33XXXeSEf/OUafmbT6RdXr732mhk/frxW2ZPTim+99Vat4ivX6/eHH34wAwcO1ApxNGHChEp1cEqHzb333qsVKktOdZZuny5dunj/NoVSp04ds80225hGjRrpLYX12GOPma5du5pjjz3WvP3223pruLnQJZkv119/vc5KL9c3+8JO3oj829/+Ztq3b1/Qa1sQ7gEAMibvwhLuhc9///tfnWXvH//4h85QnnTsvfHGG1pl5//+7/90hnRuvvlmnfmTboJ99tlHK3+Ee8Zs2LBBZ9mbPn26t2QI8RR0DbZr1y6wU59rMD/GjRvnPebdeOONekvumjVrZk466SRz2223ed3nEqh9/vnnZvHixV7IIAGKzJcuXSqbjW8csjzz448/Ni+99JK5//77vaBRlvBvv/32+idXjryZ07lzZ3PKKafEatlrGG277bbmhBNO8Dq/O3bsqLei0D788EOvK7eQz7uryMZ7OvdUqVJFZ0D8VLgc8oprC1EwZMgQM2LECK0KS65HeeEqT0Tr16/v3TZv3ryN11KNGjVMrVq1vFGzZk1TrVo1U7Vq1Vhea7L30YEHHqhV9t56663AICVudt55Z/Pll19qlUq6HtLtVXPRRReZ4cOHa4WKZImWdHKks91223l7NW211VZmr732Mu+9957+Tqo777zT/OUvf9Eqftq2beu9IK8MeSE/YMAAraLj4Ycf9oKEdCZNmuSFF3H0zDPPmKOPPlqrVG3atDGzZs3yfgbvuuuu3s/edB5//HEvKEBuJESrTKgnP6vk5/9+++3ndf3tuOOO+jv5s2DBAu95RnJUdg8x2ZNPAs3u3bvrLeGy++67pw0g5fnod999p5V75DmyPG8OI3nDaf/999cqlaymkOulWNatW+e9BpFOThnffPONF4hKWC7fH/LcOVfymHnfffeZzTffXG/JEwn3ypObGIy4jkLy+/sYDNfG+PHj9Tu68DgtN3MPPPDAJv9OFcdtt93me3ty9OnTR/8kiKATXPv27Zvo37+/7+/JkN9Hev369fP9uiVH2QtdvWci8cgjj/jeJznat2+v94ynshehvl+X5JBr2+/28kNO0F20aJH+idHx0EMP+X6+yTFp0iS9Z/wcfvjhvl+T5Ch70an3TAT+/OjRo4feE9n44osvEt27d/f9mgaNqlWrJk455ZTEiy++qH9acU2cONH7Oef3sWUzPvroI/0Tw6VNmza+H6+M+vXr672Qb9OmTfP9mieHnOwdJt9++633/Fue01SpUsX3Y7YN+T5bsGCB/mn5wbJcAEDGOEwjnIKW5crSu4MPPlirVNJ54cpeOMVgW64mHaM33XSTdRNqluWmJxtmP/LII1qlatKkySab/J988smmQ4cOWqWSDr9C72HjMtnvSpYB2cgJutJtiniYOXOmef7557VKJV175fdjlJ8fzZs31yqV7NuX7YFOcSenqktXspyImw3pzJOTc+WalZOy//jHP+rvFJd0fT766KPe3p233HKLd6JvLu655x6dAe6R5c39+/f3usRlmbs8N5Suz0xJ999RRx3lLZPPF8I9AEBGJNizPcFH6djCJFmyI6644grv13SKtdw67GSvvTlz5miV6vLLLzd/+MMfNn5d/VRmD8SoGz16tM78+e0BF7QvXNCfGXdjxowxu+22m1b+JGx4+umntUKU5XINnnvu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rjMUS1AHXJ8+fXRWfFG5BoO69jp16uTtawgAmZI3xKQZwybbrj1BuAcAjkvurSc/JOjWi4egsKh+/fo6q5ygrrawd+/JktxXX31Vq1T5DMK33357naWKa7hHsBAtEu7JASnpfPvtt2b06NFaoRjCfA0GHTDhytLcoC5fuvYAZOvKK6/0Ar506tSpQ7gHAHFSfm89WYaG+CjWMk/Xl+YWc0murVsyistyP//888DlgJ07d9aq+Lbccktr5+CyZcvME088oRUyIV9TuvfC44033jCffPKJVqnkjb+gk7wLqVWrVtbg66uvvnJiefynn36qM38HHXSQzgAUUlSW5U6dOtXccMMNWvm7+OKLTd26dbXKHOEeADgmGerNmzePvfViytYJlq8luUm27jbZN+mzzz7TKnyKtSRX7LTTTjpLFcXOvTB3DCXRvZd/QeGehE2uHZbgqjAvyU2KwsEatnBPumskRAWATF144YU68yerby666CKtskO4BwCOINRDkq0TbNddd9VZfrh6am4xl+QK2+bxK1asiNxJokEvyku5315Sr169vG6zdMaNG+edPI3MtWjRwtvf1YbuveIICqfDcA0ef/zxOvMX9oB90aJF1scIW2c7gPyKQufe+eefb95//32t/EnXXr169bTKDuEeAIScvCtMqIfybJ1g+exGE0FLcydOnKizcLF17Yl8n5IbtPwtSt17M2bMsHaz9OzZ01uSFwauhwthNGjQIJ35mzZtmnnppZe0QiE8/fTTZvHixVqlku/7Ro0aaVU60oFiuwblJNowX4NBS3IJ9wBk6tJLLzW33nqrVv5atmyZc9eeINwDgBCSAE+CvA8++MA7LINQD+UVs3NP2Lrc3nnnHfPll19qFR7y4jedfC/JFXEK91xYDpgUFO6xhDR7EvhLV6QN3XuF5ULXXpLLAXvQthOEewAyce2115p//etfWqV3yy23mNq1a2uVPcI9AAgJORQjGehJl55063FQBipasmSJWbVqlVapmjVrprP8CepyC1v33vfff2/tHMrlBLIg2223nc78RelQDZeCBdnsvmnTplqlko2twxhOh11Q956E67InJ/JPHv9tobR07AUFasUkH8tmm22mVaonn3zSLF26VKtwoXMPCA9Xl+XKa7u///3vWqU3dOhQc8QRR2iVG8I9ACgB6cJLhnljxozxAj0ZyUCPLj2kExQS5ftADSGdOrZON1uXXCkEfTyFCPeCRKVzT7623333nVapJNgL2+OXy51DYSWnoO6///5a+aN7rzAk2Fu3bp1WqcLUOSuqVavm7DVI5x6AXMl+nUceeaQZOXKk3pJep06dzM0336xV7gj3AKAA5MVt8+bNvaBOljTKBuTDhg3bGORJZ14yzJPfo0MPmQoKiQoR7gnb0lzZY2vBggValZ4t3Nt9991Nu3bttMqvrbbaSmepohLuBS1jDVPHUNJxxx2nM38szc1N0Mm5Dz74IF2RBRD0/Rq2cE8EPS6E9RoMOilX9scCgIruvPNO06ZNG/Pcc8/pLenJti7SwZwPVRJldO6JwikkQK4qXA4ASkiuxw0bNnhLkGRTbiGhaPLnVI0aNUytWrW8UbNmTa87oGrVqpH/OTZ69GhzzjnnaJWqUI9jssRun3320SrVqFGjzHnnnadV6ciptLbOscsuu8xcc801WuXXnnvuaWbNmqXVpmR56Msvv6yVm3755Rfva5uua0iu07CeCiydp59//rlWqd58803TuXNnrdzRtm1b8/HHH2uVqtDPa+SNqdmzZ2uVSrrT5U2sUnj44YfNKaecolWqSZMmmUMPPVQrN8ibKLatF+RNRfk5GUZbb721+eGHH7RK9cUXXwTuXVps8jwj3eNdx44dzbvvvqsVokTeBPzkk0+02pT8nJOT+OW5ZroRNvIxSRBdmb3cimH69OnWjnB5/nvWWWdpFU5ymNv1119v3nrrLb3FTh4X5ftJvufyouyH/ibkJgYjrgNAeGzYsCFR9qQ6sWLFio3XaNmLlsT8+fO9sXDhwsSSJUsSK1euTKxZs8a7r/w/UXfppZdu8rhVcRRS2Qsv379TxkEHHaT3Kq0HH3zQ9+NLjrffflvvmX9HHnmk798pY5dddtF7uevee+/1/dySY+DAgXrP8Pn73//u+zEnx5AhQ/Sebil7QeD7+SRHod1zzz2+f29y1KhRI7F06VK9d3E99NBDvh9TckyaNEnv6Y7hw4f7fi7JcdFFF+k9w+fss8/2/ZiT4+qrr9Z7hsMvv/zi+3EmR8+ePfWeiJo2bdr4/pu7Pnr37p2YM2eOfpbhM23aNN+POzlGjx6t9wyXuXPnJv71r39ZnyP7jR122MH7nPOJZbkAADjEtufetttuq7PCsC3NfeWVV6x7sRWLbUmuvHMt+5oUim1JdBSW5QbtixXGJblJQUtz2XcvN6effrpp0aKFVql+++039t7LIxeXxSe5dg2uWLFCZ/7q1aunM8AN48ePN/3799cKuVi/fr2ZMWOGufHGG73H2+233957bnnJJZeYOXPm6L2CdenSxbz++uuma9euekt+sCwXKKfC5QCghOR6ZFluqp49e5opU6ZotakePXqYyZMna5V/snRRnpCkc9ddd5kzzzxTq+L79ddfve8VCRT8XHDBBeamm27SKv+GDx9u/vrXv2qVSk463nLLLbVyyzfffOMt+Utnm222MYsXL9YqnGQZ3fvvv69Vqmeeecbb/NolpV6WK2TZrVxb6cibDt9++61WxRO1ZbmyT2+HDh20SiWHO6RbShgW8hgijyXpyItm28+YYpIX6rvssotWqeR7S/aVRPTYluVGgbwJetRRR2kVHvlelvvCCy9417FsKZKL1atXe29ay5DnN/KrvFErAV9lnHjiid7PJ3ndkncS7pUnNzEYcR0AwoNluf5atmy5yeNW+SHLngrN9vcfccQReq/SeOyxx3w/ruR47bXX9J6FMXHiRN+/NznKXpzrPd1zww03+H5OyTFo0CC9Z3j985//9P3Yk6Psxbre0x22ZblVq1bVexXW2rVrEw0bNvT9GJLj9ttv13sXT9SW5f7tb3/z/TyS44orrtB7hteFF17o+7Enx+DBg/WepffOO+/4fozJcc455+g9ETVRXZabHGF9rMjXstzly5cnDjzwQN8/o5Rj7733Tjz33HP6URYGy3IBAHCIbVluMTYjty3NlVPByp5UaVV8tiW5smT2gAMO0Kowgr7+Li/NDVoyF7TkLgyClizK5yjdn1FRrC5m6aI+++yztfJ3xx136Ay5isI1eMIJJ+jMX5hOzQ06HCi5ogBwjXSxR9nQoUO9QyrCQk7NlZ+BcjDd4YcfrrcWBuEeAACO+P77763hg23Pt3w5+uijdeZv4sSJOiuuRCJh/bt79eqls8KxLeEStmA2zGQpq+1USDm9U5aEh12rVq1M9+7dtUq1Zs2aUIULlVXMLQqCwj1Z4halr22xyUnbtlNwZbluu3bttAovOXFdlpKnI0vfZHl8GLDnHqJITvUPeh7nulI9D61IlhiPHTvW2zoj6GdkvhDuAQDgiKBwqBjhnjxZsf09tu65QpK/9+eff9YqVTHCvaAwxdXO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RJBrC9mQTpJevXpF8kl8puR63LBhg1m1apW3SbOYN2/exmtJTrKrVauWN2rWrGmqVavmdapE9VqrXr261/Xl54orrvCC4lKSF0Fy4p2f/fbbz0yfPl2rynvooYdM//79tUolmxdnckJfocgysoMPPlirVE888YQ5/vjjtQoPOS1R3oVO930m5Als8nqMkqB/j3feecc7SCRs2rZtaz7++GOtNrXNNtuYxYsXa1VaEsYfeuihWvmbNm2a6dq1q1aV9+CDD1pDI1n6GvQxFduCBQu8Awlsxo0bp7PoWLt2rTn55JO18vf11197qx6KrV69et5jYzpyjcm1hmByvaV7Y65x48bm+++/16q05PmD7AfqR37+yanAyD95nrj//vtrlWr06NHmrLPO0ip8JLyT06dtbrrpJnPBBRdoVQAS7pUnNzEYcR2F5Pf3MRiZjCFDhiTmzZun30nxsWHDhsS6desSK1as2Pi1kK/D/PnzvbFw4cLEkiVLEitXrkysWbPGu6/8P1Ekn2v574mK46677tJ7ls6FF17o+7ElxzfffKP3rLw+ffr4/h0y2rVrp/cqHflc/T625Lj55pv1nuHywAMP+H68DJO49NJL9asULmUvQn0/Xhnbbrut3isc9ttvP9+PMzn69u2r98yP+++/3/fvSY5JkybpPcNjxIgRvh8rwyTKXjTrV6m4Onbs6PvxJMd//vMfvSeCnHTSSb5fQxlbbLGF3qv02rRp4/sxyqhfv77eC/k2bdo03695cowePVrvGV6tW7f2/diTo2rVqonPP/9c751/LMsFgJCTpbrJPfpk/z7ET9AyzqBloMUQdGJYvpbmSjenbb+9oI+jGIL2+wvrslxXl58Wg4v77oWti3nQoEE68/fYY495Xbf5Io8VruEaTK9U12DQfoCTJ0/WGSpDujcB191www068yc/ly6++GKt8o9wDwAcIXv0yaEccgovIV+8BJ2wajudtVgOOOAAa8iYr3BP/hxZqp1OGMI9Ubt2bZ2lCuOJuT/++KN5+umntUJFsrfWG2+8oZUbwhbunXTSSWa33XbTyl8+995LFHCrlUKQ00LzuX1B1MjBK6XY4862xYIg3MsPOakdcJ0cMHfGGWdo5U+ex951111a5RfhHgA4Rk7hTYZ8cjAHoi+o0ysM4Z6wBWuyz04+9qmxde21atXK27w/DGxBZxg7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';
    let dataEntradaFormatada = '';
    let dataDescarteFormatada = '';

    const dataEntradaValue = this.registerForm.value.dataEntrada;
    if (dataEntradaValue instanceof Date && !isNaN(dataEntradaValue.getTime())) {
      const material = this.registerForm.value.material;
      const dataDescarteValue = this.calcularDataDescarte(dataEntradaValue, material);
      dataEntradaFormatada = formatDate(dataEntradaValue, 'dd/MM/yy', 'en-US');
      if (dataDescarteValue) {
        dataDescarteFormatada = formatDate(dataDescarteValue, 'dd/MM/yy', 'en-US');
      }
    } 
    let materialNome = this.registerForm.value.material;
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

  imprimirEtiqueta(amostra_detalhes: any) {

    const logoBase64 = 'data:image/png;base64,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pUoVnQHxU+FyyCuuLURF8+bNzbx587QqHLkeN2zYYFatWmXq16/v3SZ/b/JaqlGjhqlVq5Y3atasaapVq2aqVq3KtQYAAGJr3bp13vOl77//fuP4+eefvedTv/zyi1m9erWpXbu2qVOnjverjM0339xsvfXW3thmm228XzfbbDP9EwG4gHAPKIdwDwi2xx57mA8++ECrwiHcy93KlSvNp59+6g15kv+HP/zBtG3b1uywww56D+RKvi+nTJliFi1aZJYsWWJat25t2rRpY7bffnu9Byrjv//9r5k7d653ra9du9bsuOOO3mjVqpXeA+msX7/ezJ4927vu5QW8XO+77767adq0qd4jnuTr8txzz3nfV3K9HnbYYfo78CPXXnLI413yGmzRooXeA2Ejz8neeOMN79fkyMdrGnkMadeunTfkOUSHDh3MLrvsor8bD++//7758ssvzf/93//pLe5r3Lix91jYqVMnvSV8li5daj788EPva79ixQq9tbjkdUa9evU2DgnA5Zpo1qyZ3iOEyi78TchNDEZcRyH5/X0Mhouje/fu+l1dWBs2bEisW7cuUfZDfePfXfZiIzF//nxvLFy4MLFkyZLEypUrE2vWrPHuK/9P3I0YMSJR9gRkk3+z5DjxxBMTZU/69Z7I1kUXXZRo1KiR79e2f//+iQULFug9ka0333wzMWDAAN+vrYwjjzwy8eyzz+q9UdG4ceMSZS84fL92Xbt2Tdx33316z3iZOnVqolWrVpt8Pfbaa69E2YtGvQeS5GvVt2/fTb5W5cfxxx+feOWVV/TeKKXFixcn7rjjjsSxxx6baNy4se+/V6FG8+bNvcdqeUyR52JR9f777yf++Mc/+n4NojL+8pe/6GcbLqNHj040aNDA92MOw5Dn2PJzpF+/fol//vOfoXpeTbjHYJQbheT39zEYLo5TTz1Vv6sLi3Ave5dccskm/1Z+o3r16rF9oZ+rzz77LLHPPvv4fj3Lj9atW+v/gWyMGTPG9+vpN6688kr9v5B0++23+36tKo79998/dqFWu3btfL8Whx9+uN4DYtSoUb5fJ79x44036v+FYlq9enXinnvuSRx22GG+/y6lGvLmwfDhwxNz5szRjzQadtppJ9/PN2pj2LBh+hmHw+OPP+77cYZ9yPfLoEGDSv4mJOEeg1FuFJLf38dguDiGDBmi39WFRbiXnenTp2/y7xQ0XnrpJf0/EaRDhw6+X0O/cfHFF+v/hUzceeedvl9H2xg8eLD+35g7d26iZs2avl8nv9GwYcPECy+8oP93tM2YMcP3a5Ac//3vf/We8Xbdddf5fn1sI2yBQJS98847Xmiw2Wab+f5bhGkccMABibvvvjvx66+/6kfvpmuuucb384vikDdAwmS33Xbz/ThdGjvvvLMXeC9fvlw/q+LhtFwAQFa6deumM4TJU089pbPMnHfeeabsCbhWSOfMM8/09tzJ1H/+8x+dIcj8+fPNBRdcoFXmRo4cmfX3e1Q9+OCD3t6EmVq2bJk59NBDvX0jo+7rr7/Wmb+PPvpIZ/Ele7NdeumlWmXuqquuMpMnT9YKhTB16lRz5JFHmr333tvcfvvt3j6aYff666+bM844w2y55ZbmrLPO8vYAddEnn3yis+j78ccfdVZ6sree7Bnrujlz5piLL77Y29tw0KBBZuHChfo7hUe4BwDIihyogfCRJ9XZ+OKLL8zVV1+tFfy8+OKL5u6779YqM/IkTkIrBJNgTw7MyQXh9P989tlnOstO3759vQMmEG8XXnihzrIn1yDy78033zS9e/c2PXr08A6CcZEEkXfddZf3fPHEE080M2bM0N9xw1dffaWz6AvTASlR+5n022+/mTvuuMO0bNnS3HDDDXprYRHuAQCy0qBBA50hLFavXm3effddrTJ33XXXeSEf/OUafmbT6RdXr732mhk/frxW2ZPTim+99Vat4ivX6/eHH34wAwcO1ApxNGHChEp1cEqHzb333qsVKktOdZZuny5dunj/NoVSp04ds80225hGjRrpLYX12GOPma5du5pjjz3WvP3223pruLnQJZkv119/vc5KL9c3+8JO3oj829/+Ztq3b1/Qa1sQ7gEAMibvwhLuhc9///tfnWXvH//4h85QnnTsvfHGG1pl5//+7/90hnRuvvlmnfmTboJ99tlHK3+Ee8Zs2LBBZ9mbPn26t2QI8RR0DbZr1y6wU59rMD/GjRvnPebdeOONekvumjVrZk466SRz2223ed3nEqh9/vnnZvHixV7IIAGKzJcuXSqbjW8csjzz448/Ni+99JK5//77vaBRlvBvv/32+idXjryZ07lzZ3PKKafEatlrGG277bbmhBNO8Dq/O3bsqLei0D788EOvK7eQz7uryMZ7OvdUqVJFZ0D8VLgc8oprC1EwZMgQM2LECK0KS65HeeEqT0Tr16/v3TZv3ryN11KNGjVMrVq1vFGzZk1TrVo1U7Vq1Vhea7L30YEHHqhV9t56663AICVudt55Z/Pll19qlUq6HtLtVXPRRReZ4cOHa4WKZImWdHKks91223l7NW211VZmr732Mu+9957+Tqo777zT/OUvf9Eqftq2beu9IK8MeSE/YMAAraLj4Ycf9oKEdCZNmuSFF3H0zDPPmKOPPlqrVG3atDGzZs3yfgbvuuuu3s/edB5//HEvKEBuJESrTKgnP6vk5/9+++3ndf3tuOOO+jv5s2DBAu95RnJUdg8x2ZNPAs3u3bvrLeGy++67pw0g5fnod999p5V75DmyPG8OI3nDaf/999cqlaymkOulWNatW+e9BpFOThnffPONF4hKWC7fH/LcOVfymHnfffeZzTffXG/JEwn3ypObGIy4jkLy+/sYDNfG+PHj9Tu68DgtN3MPPPDAJv9OFcdtt93me3ty9OnTR/8kiKATXPv27Zvo37+/7+/JkN9Hev369fP9uiVH2QtdvWci8cgjj/jeJznat2+v94ynshehvl+X5JBr2+/28kNO0F20aJH+idHx0EMP+X6+yTFp0iS9Z/wcfvjhvl+T5Ch70an3TAT+/OjRo4feE9n44osvEt27d/f9mgaNqlWrJk455ZTEiy++qH9acU2cONH7Oef3sWUzPvroI/0Tw6VNmza+H6+M+vXr672Qb9OmTfP9mieHnOwdJt9++633/Fue01SpUsX3Y7YN+T5bsGCB/mn5wbJcAEDGOEwjnIKW5crSu4MPPlirVNJ54cpeOMVgW64mHaM33XSTdRNqluWmJxtmP/LII1qlatKkySab/J988smmQ4cOWqWSDr9C72HjMtnvSpYB2cgJutJtiniYOXOmef7557VKJV175fdjlJ8fzZs31yqV7NuX7YFOcSenqktXspyImw3pzJOTc+WalZOy//jHP+rvFJd0fT766KPe3p233HKLd6JvLu655x6dAe6R5c39+/f3usRlmbs8N5Suz0xJ999RRx3lLZPPF8I9AEBGJNizPcFH6djCJFmyI6644grv13SKtdw67GSvvTlz5miV6vLLLzd/+MMfNn5d/VRmD8SoGz16tM78+e0BF7QvXNCfGXdjxowxu+22m1b+JGx4+umntUKU5XINnnvu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rjMUS1AHXJ8+fXRWfFG5BoO69jp16uTtawgAmZI3xKQZwybbrj1BuAcAjkvurSc/JOjWi4egsKh+/fo6q5ygrrawd+/JktxXX31Vq1T5DMK33357naWKa7hHsBAtEu7JASnpfPvtt2b06NFaoRjCfA0GHTDhytLcoC5fuvYAZOvKK6/0Ar506tSpQ7gHAHFSfm89WYaG+CjWMk/Xl+YWc0murVsyistyP//888DlgJ07d9aq+Lbccktr5+CyZcvME088oRUyIV9TuvfC44033jCffPKJVqnkjb+gk7wLqVWrVtbg66uvvnJiefynn36qM38HHXSQzgAUUlSW5U6dOtXccMMNWvm7+OKLTd26dbXKHOEeADgmGerNmzePvfViytYJlq8luUm27jbZN+mzzz7TKnyKtSRX7LTTTjpLFcXOvTB3DCXRvZd/QeGehE2uHZbgqjAvyU2KwsEatnBPumskRAWATF144YU68yerby666CKtskO4BwCOINRDkq0TbNddd9VZfrh6am4xl+QK2+bxK1asiNxJokEvyku5315Sr169vG6zdMaNG+edPI3MtWjRwtvf1YbuveIICqfDcA0ef/zxOvMX9oB90aJF1scIW2c7gPyKQufe+eefb95//32t/EnXXr169bTKDuEeAIScvCtMqIfybJ1g+exGE0FLcydOnKizcLF17Yl8n5IbtPwtSt17M2bMsHaz9OzZ01uSFwauhwthNGjQIJ35mzZtmnnppZe0QiE8/fTTZvHixVqlku/7Ro0aaVU60oFiuwblJNowX4NBS3IJ9wBk6tJLLzW33nqrVv5atmyZc9eeINwDgBCSAE+CvA8++MA7LINQD+UVs3NP2Lrc3nnnHfPll19qFR7y4jedfC/JFXEK91xYDpgUFO6xhDR7EvhLV6QN3XuF5ULXXpLLAXvQthOEewAyce2115p//etfWqV3yy23mNq1a2uVPcI9AAgJORQjGehJl55063FQBipasmSJWbVqlVapmjVrprP8CepyC1v33vfff2/tHMrlBLIg2223nc78RelQDZeCBdnsvmnTplqlko2twxhOh11Q956E67InJ/JPHv9tobR07AUFasUkH8tmm22mVaonn3zSLF26VKtwoXMPCA9Xl+XKa7u///3vWqU3dOhQc8QRR2iVG8I9ACgB6cJLhnljxozxAj0ZyUCPLj2kExQS5ftADSGdOrZON1uXXCkEfTyFCPeCRKVzT7623333nVapJNgL2+OXy51DYSWnoO6///5a+aN7rzAk2Fu3bp1WqcLUOSuqVavm7DVI5x6AXMl+nUceeaQZOXKk3pJep06dzM0336xV7gj3AKAA5MVt8+bNvaBOljTKBuTDhg3bGORJZ14yzJPfo0MPmQoKiQoR7gnb0lzZY2vBggValZ4t3Nt9991Nu3bttMqvrbbaSmepohLuBS1jDVPHUNJxxx2nM38szc1N0Mm5Dz74IF2RBRD0/Rq2cE8EPS6E9RoMOilX9scCgIruvPNO06ZNG/Pcc8/pLenJti7SwZwPVRJldO6JwikkQK4qXA4ASkiuxw0bNnhLkGRTbiGhaPLnVI0aNUytWrW8UbNmTa87oGrVqpH/OTZ69GhzzjnnaJWqUI9jssRun3320SrVqFGjzHnnnadV6ciptLbOscsuu8xcc801WuXXnnvuaWbNmqXVpmR56Msvv6yVm3755Rfva5uua0iu07CeCiydp59//rlWqd58803TuXNnrdzRtm1b8/HHH2uVqtDPa+SNqdmzZ2uVSrrT5U2sUnj44YfNKaecolWqSZMmmUMPPVQrN8ibKLatF+RNRfk5GUZbb721+eGHH7RK9cUXXwTuXVps8jwj3eNdx44dzbvvvqsVokTeBPzkk0+02pT8nJOT+OW5ZroRNvIxSRBdmb3cimH69OnWjnB5/nvWWWdpFU5ymNv1119v3nrrLb3FTh4X5ftJvufyouyH/ibkJgYjrgNAeGzYsCFR9qQ6sWLFio3XaNmLlsT8+fO9sXDhwsSSJUsSK1euTKxZs8a7r/w/UXfppZdu8rhVcRRS2Qsv379TxkEHHaT3Kq0HH3zQ9+NLjrffflvvmX9HHnmk798pY5dddtF7uevee+/1/dySY+DAgXrP8Pn73//u+zEnx5AhQ/Sebil7QeD7+SRHod1zzz2+f29y1KhRI7F06VK9d3E99NBDvh9TckyaNEnv6Y7hw4f7fi7JcdFFF+k9w+fss8/2/ZiT4+qrr9Z7hsMvv/zi+3EmR8+ePfWeiJo2bdr4/pu7Pnr37p2YM2eOfpbhM23aNN+POzlGjx6t9wyXuXPnJv71r39ZnyP7jR122MH7nPOJZbkAADjEtufetttuq7PCsC3NfeWVV6x7sRWLbUmuvHMt+5oUim1JdBSW5QbtixXGJblJQUtz2XcvN6effrpp0aKFVql+++039t7LIxeXxSe5dg2uWLFCZ/7q1aunM8AN48ePN/3799cKuVi/fr2ZMWOGufHGG73H2+233957bnnJJZeYOXPm6L2CdenSxbz++uuma9euekt+sCwXKKfC5QCghOR6ZFluqp49e5opU6ZotakePXqYyZMna5V/snRRnpCkc9ddd5kzzzxTq+L79ddfve8VCRT8XHDBBeamm27SKv+GDx9u/vrXv2qVSk463nLLLbVyyzfffOMt+Utnm222MYsXL9YqnGQZ3fvvv69Vqmeeecbb/NolpV6WK2TZrVxb6cibDt9++61WxRO1ZbmyT2+HDh20SiWHO6RbShgW8hgijyXpyItm28+YYpIX6rvssotWqeR7S/aVRPTYluVGgbwJetRRR2kVHvlelvvCCy9417FsKZKL1atXe29ay5DnN/KrvFErAV9lnHjiid7PJ3ndkncS7pUnNzEYcR0AwoNluf5atmy5yeNW+SHLngrN9vcfccQReq/SeOyxx3w/ruR47bXX9J6FMXHiRN+/NznKXpzrPd1zww03+H5OyTFo0CC9Z3j985//9P3Yk6Psxbre0x22ZblVq1bVexXW2rVrEw0bNvT9GJLj9ttv13sXT9SW5f7tb3/z/TyS44orrtB7hteFF17o+7Enx+DBg/WepffOO+/4fozJcc455+g9ETVRXZabHGF9rMjXstzly5cnDjzwQN8/o5Rj7733Tjz33HP6URYGy3IBAHCIbVluMTYjty3NlVPByp5UaVV8tiW5smT2gAMO0Kowgr7+Li/NDVoyF7TkLgyClizK5yjdn1FRrC5m6aI+++yztfJ3xx136Ay5isI1eMIJJ+jMX5hOzQ06HCi5ogBwjXSxR9nQoUO9QyrCQk7NlZ+BcjDd4YcfrrcWBuEeAACO+P77763hg23Pt3w5+uijdeZv4sSJOiuuRCJh/bt79eqls8KxLeEStmA2zGQpq+1USDm9U5aEh12rVq1M9+7dtUq1Zs2aUIULlVXMLQqCwj1Z4halr22xyUnbtlNwZbluu3bttAovOXFdlpKnI0vfZHl8GLDnHqJITvUPeh7nulI9D61IlhiPHTvW2zoj6GdkvhDuAQDgiKBwqBjhnjxZsf09tu65QpK/9+eff9YqVTHCvaAwxdXO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RJBrC9mQTpJevXpF8kl8puR63LBhg1m1apW3SbOYN2/exmtJTrKrVauWN2rWrGmqVavmdapE9VqrXr261/Xl54orrvCC4lKSF0Fy4p2f/fbbz0yfPl2rynvooYdM//79tUolmxdnckJfocgysoMPPlirVE888YQ5/vjjtQoPOS1R3oVO930m5Als8nqMkqB/j3feecc7SCRs2rZtaz7++GOtNrXNNtuYxYsXa1VaEsYfeuihWvmbNm2a6dq1q1aV9+CDD1pDI1n6GvQxFduCBQu8Awlsxo0bp7PoWLt2rTn55JO18vf11197qx6KrV69et5jYzpyjcm1hmByvaV7Y65x48bm+++/16q05PmD7AfqR37+yanAyD95nrj//vtrlWr06NHmrLPO0ip8JLyT06dtbrrpJnPBBRdoVQAS7pUnNzEYcR2F5Pf3MRiZjCFDhiTmzZun30nxsWHDhsS6desSK1as2Pi1kK/D/PnzvbFw4cLEkiVLEitXrkysWbPGu6/8P1Ekn2v574mK46677tJ7ls6FF17o+7ElxzfffKP3rLw+ffr4/h0y2rVrp/cqHflc/T625Lj55pv1nuHywAMP+H68DJO49NJL9asULmUvQn0/Xhnbbrut3isc9ttvP9+PMzn69u2r98yP+++/3/fvSY5JkybpPcNjxIgRvh8rwyTKXjTrV6m4Onbs6PvxJMd//vMfvSeCnHTSSb5fQxlbbLGF3qv02rRp4/sxyqhfv77eC/k2bdo03695cowePVrvGV6tW7f2/diTo2rVqonPP/9c751/LMsFgJCTpbrJPfpk/z7ET9AyzqBloMUQdGJYvpbmSjenbb+9oI+jGIL2+wvrslxXl58Wg4v77oWti3nQoEE68/fYY495Xbf5Io8VruEaTK9U12DQfoCTJ0/WGSpDujcB191www068yc/ly6++GKt8o9wDwAcIXv0yaEccgovIV+8BJ2wajudtVgOOOAAa8iYr3BP/hxZqp1OGMI9Ubt2bZ2lCuOJuT/++KN5+umntUJFsrfWG2+8oZUbwhbunXTSSWa33XbTyl8+995LFHCrlUKQ00LzuX1B1MjBK6XY4862xYIg3MsPOakdcJ0cMHfGGWdo5U+ex951111a5RfhHgA4Rk7hTYZ8cjAHoi+o0ysM4Z6wBWuyz04+9qmxde21atXK27w/DGxBZxg7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';
    let dataEntradaFormatada = '';
    let dataDescarteFormatada = '';

    const dataEntradaValue = amostra_detalhes.data_entrada;
    const material = amostra_detalhes.material;
    const dataDescarteValue = this.calcularDataDescarte(dataEntradaValue, material);
    dataEntradaFormatada = formatDate(dataEntradaValue, 'dd/MM/yy', 'en-US');
    if (dataDescarteValue) {
      dataDescarteFormatada = formatDate(dataDescarteValue, 'dd/MM/yy', 'en-US');
    }
    const materialNome = amostra_detalhes.material;
    const numero = amostra_detalhes.numero;
    const localColeta = amostra_detalhes.local_coleta;
    const produtoAmostra = amostra_detalhes.produto_amostra_detalhes.nome;
    const periodoHora = amostra_detalhes.periodo_hora ? amostra_detalhes.periodo_hora : "";
    const periodoTurno = amostra_detalhes.periodo_turno ? amostra_detalhes.periodo_turno : "";
    const produtoAmostraNome = amostra_detalhes.produto_amostra_detalhes.nome

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
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");

    // doc.save("Etiqueta.pdf");
  }
 
}