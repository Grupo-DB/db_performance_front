import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { DatePickerModule } from 'primeng/datepicker';
import { ProjecaoService } from '../../../services/baseOrcamentariaServices/dre/projecao.service';
import { Produto } from '../../baseOrcamentaria/dre/produto/produto.component';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TipoAmostra } from '../tipo-amostra/tipo-amostra.component';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';
import { StepperModule } from 'primeng/stepper';
import { ToggleButton } from 'primeng/togglebutton';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Plano } from '../plano/plano.component';
import { Colaborador } from '../../avaliacoes/colaborador/colaborador.component';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';

interface AmostraForm{
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
  representatividadeLote: FormControl,
  identificacaoComplementar: FormControl,
  complemento: FormControl,
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

@Component({
  selector: 'app-amostra',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,IconField,
    InputNumberModule,AutoCompleteModule,MultiSelectModule,DatePickerModule,StepperModule,
    InputIcon,
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

registerForm!: FormGroup<AmostraForm>;
registerOrdemForm!: FormGroup<OrdemForm>;
materiais: Produto[] = [];
tiposAmostra: TipoAmostra[] = [];
produtosAmostra: ProdutoAmostra[] = [];
planosAnalise: Plano[] = [];
producaoLote: any = null;
activeStep: number = 1;

digitador: any;
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

classificacoes = [
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
  analises: any;
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
    private analiseService: AnaliseService
)
{
  this.registerForm = new FormGroup<AmostraForm>({
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
    representatividadeLote: new FormControl('',[Validators.required]),
    identificacaoComplementar: new FormControl(''),
    complemento: new FormControl(''),
    ordem: new FormControl('',[Validators.required]),
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
    this.loadAnalises();
    //número da OS
    this.ordemService.getProximoNumero().subscribe(numero => {
    this.registerOrdemForm.get('numero')?.setValue(numero);
    console.log('Número da ordem de serviço gerado:', numero);
    
  });

     // Chama sempre que algum campo relevante mudar
    this.registerForm.get('material')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
    this.registerForm.get('tipoAmostragem')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
    this.registerForm.get('dataColeta')?.valueChanges.subscribe(() => this.onCamposRelevantesChange());
  }

  getDigitadorInfo(): void {
    this.colaboradorService.getColaboradorInfo().subscribe(
      data => {
        this.digitador = data.nome;
        this.registerOrdemForm.get('digitador')?.setValue(data.nome);
        this.registerForm.get('digitador')?.setValue(data.nome);
      },
      error => {
        console.error('Erro ao obter informações do colaborador:', error);
        this.digitador = null; // Garanta que digitador seja null em caso de erro
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
  const ano = new Date().getFullYear().toString().slice(-2); // Ex: '25'
  const sequencialFormatado = sequencial.toString().padStart(6, '0'); // Ex: '000008'
  // Formata como 08.392 (você pode ajustar conforme a lógica do seu sequencial)
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' -> '392' se quiser os 3 últimos
  return `${materialNome}${ano} ${parte1}.${parte2}`;
}

onCamposRelevantesChange() {
  console.log('Campos relevantes alterados, verificando exibição de representatividade do lote...');
  if (this.exibirRepresentatividadeLote()) {
    this.consultarProducao();
  } else {
    this.registerForm.get('representatividadeLote')?.setValue('');
  }
}

private normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
        this.producaoLote = producao; // Salva o resultado
        // Se quiser, pode também preencher o form:
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

  this.amostraService.registerAmostra( 
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
    this.registerForm.value.representatividadeLote,
    this.registerForm.value.identificacaoComplementar,
    this.registerForm.value.complemento,
    this.registerForm.value.ordem,
    this.registerForm.value.digitador,
    this.registerForm.value.status
    
  ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Amostra registrada com sucesso.' });
        this.activeStep = 3; // Avança para o próximo passo
        //this.router.navigate(['/amostras']);
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

  })
}

montarAnalise(){
  this.activeStep = 3;
}

salvarOrdemEAmostra() {
  // 1. Formate a data da ordem
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
      // 3. Pegue o número ou ID da ordem salva
      const numeroOrdem = ordemSalva.numero; // ou ordemSalva.id, conforme seu backend

      // 4. Formate as datas da amostra
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

      // 5. Salve a amostra vinculando à ordem
      this.amostraService.registerAmostra(
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
        this.registerForm.value.representatividadeLote,
        this.registerForm.value.identificacaoComplementar,
        this.registerForm.value.complemento,
        numeroOrdem, // Aqui você passa o número/id da ordem recém salva!
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

}