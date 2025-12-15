import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { GetAreaService } from '../../../services/avaliacoesServices/areas/getarea.service';
import { GetCargoService } from '../../../services/avaliacoesServices/cargos/getcargo.service';
import { GetCompanyService } from '../../../services/avaliacoesServices/companys/getcompany.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { GetSetorService } from '../../../services/avaliacoesServices/setores/get-setor.service';
import { AvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';
import { RegisterAvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/registeravaliacao.service.spec';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GetFormularioService } from '../../../services/avaliacoesServices/formularios/getformulario.service';
import { PerguntasService } from '../../../services/avaliacoesServices/avaliacoes/perguntas.service';
import { StepsModule } from 'primeng/steps';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ChangeDetectorRef } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import {MatRadioModule} from '@angular/material/radio';
import { CalendarModule } from 'primeng/calendar';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { TipoContratoService } from '../../../services/avaliacoesServices/tipocontratos/resgitertipocontrato.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';
import { Colaborador } from '../colaborador/colaborador.component';
import { Avaliado } from '../avaliado/avaliado.component';
import { TipoAvaliacaoService } from '../../../services/avaliacoesServices/tipoavaliacoes/registertipoavaliacao.service';
import { DividerModule } from 'primeng/divider';
import { catchError, of } from 'rxjs';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { TipoContrato } from '../tipocontrato/tipocontrato.component';
import { Cargo } from '../cargo/cargo.component';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormularioService } from '../../../services/avaliacoesServices/formularios/registerformulario.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';
import { SafeHtmlPipe } from './safeHtml';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Dialog, DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';

// Custom validator function
function respostaJustificativaValidator(control: AbstractControl): { [key: string]: any } | null {
  const resposta = control.get('resposta')?.value;
  const justificativa = control.get('justificativa')?.value;

  if ((resposta === 1 || resposta === 5) && (!justificativa || justificativa.trim() === '')) {
    return { justificativaObrigatoria: true };
  }

  return null;
}

export interface Avaliacao{
  id: number;
  periodo: string;
  tipo: string;
  perguntasRespostas: JSON;
  observacoes: Text;
  formulario: string;
  avaliador: number;
  avaliado: number;
  feedback:boolean;
}

export interface RespostasFormatadas {
  [key: string]: { resposta: string; justificativa: string };
}
interface TipoAvaliacao{
  nome: string
}

interface Avaliador{
  nome: string
}
interface Formulario{
  id: number;
  nome: string
}
interface Periodo{
  nome: string
}
interface Tipo{
  nome: string,
}


@Component({
  selector: 'app-novaliacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,StepperModule,CommonModule,MatStepperModule,MatFormFieldModule,CalendarModule,MatRadioModule,DividerModule,
    InputMaskModule,StepsModule,NzStepsModule,MatInputModule,MatButtonModule,MatSelectModule,RadioButtonModule,InputTextModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,SafeHtmlPipe,
    NzMenuModule,TabMenuModule,SelectModule,FloatLabelModule,DialogModule, CardModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
    MessageService,GetSetorService,TipoContratoService,PerguntasService,TipoAvaliacaoService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService,LoginService,FormularioService
  ],
  templateUrl: './novaliacao.component.html',
  styleUrl: './novaliacao.component.scss',
  
})
export class NovaliacaoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  tipoavaliacoes: TipoAvaliacao [] | undefined;
  colaboradores: Colaborador [] | undefined;
  avaliadores: Avaliador [] | undefined;
  formularios: Formulario [] | undefined;
  formularioSelecionado: any | undefined;
  periodos: Periodo [] | undefined;
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: Cargo[]| undefined;
  ambientes: Ambiente[]| undefined;
  tipocontratos: TipoContrato[]| undefined;
  perguntas: any [] = [];
  respostas: any [] = [];
  activeIndex: number = 0;
  steps: any[] = [];
  avaliacoes: any[] = [];
  login: any;
  perguntasRespostas:any = null;
  observacoes: any = null;
  formulario: any = null;
  feedback: any = null;
  avaliados: any[] = [];
  avaliadorSelecionado: any;
  avaliadoSelecionado: Avaliado [] = [];
  colaboradorInfo: any;
  avaliadorId: string | undefined
  tipos: Tipo[] | undefined;
  userId: any; // Variável para armazenar o userId
  avaliador:any = null;
  avaliado: any = null;
  avaliadoSelecionadoId: number | undefined;
  avaliadoDetalhes: any | undefined;
  avaliadosSA:any|undefined;
  trimestre: any;
  colaboradorSelecionado: Colaborador [] = [];
  respostasJustificativas: { [key: string]: { resposta: string, justificativa: string } } = {};
  tipoavSelecionadoId: number | null = null;
  registeravaliacaoForm: FormGroup;
  periodo: any;
  isLinear = false;
  tipoAvaliacao: any;
  perguntasSubscription: Subscription | undefined;
  formularioDetalhes: any;
  conceitos: any[] = [
    { key: 'otimo', name: 'Ótimo', value: 5 },
    { key: 'bom', name: 'Bom', value: 4 },
    { key: 'regular', name: 'Regular', value: 3 },
    { key: 'ruim', name: 'Ruim', value: 2 },
    { key: 'pessimo', name: 'Péssimo', value: 1 },
    { key: 'nao_se_aplica', name: 'Não se aplica', value: 'nao_se_aplica' },
];

  formulariosCods: any[] = [
    { id:2, nome: 'Avaliação Geral'},
    { id:3, nome: 'Avaliação do Gestor'}
  ];

//formularioSelecionado: number; // Guarda o id do formulário selecionado
//formulariosDisponiveis: number[] = []; // Lista de formulários disponíveis
showFormularioSelect: boolean = false; // Flag para mostrar o select

//formularioSelecionado: number | null = null; // Armazena o ID do formulário selecionado
formulariosDisponiveis: { id: number; nome: string }[] = []; // Lista de formulários disponíveis

  constructor(
    private router: Router,
    private messageService: MessageService,
    private filialService: FilialService,
    private areaService: AreaService,
    private setorService: SetorService,
    private cargoService: CargoService,
    private ambienteService: AmbienteService,
    private tipocontratoService: TipoContratoService,
    private colaboradorService: ColaboradorService,
    private registeravaliacaoService: RegisterAvaliacaoService,
    private getformularioService: GetFormularioService,
    private avaliacaoService: AvaliacaoService,
    private avaliadorService: AvaliadorService,
    private perguntasService: PerguntasService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private tipoAvaliacaoService: TipoAvaliacaoService,
    private avaliadoService: AvaliadoService,
    private fb: FormBuilder,
    private registercompanyService:RegisterCompanyService,
    private sanitizer: DomSanitizer,
    private formularioService: FormularioService
    
  )

  {
    this.registeravaliacaoForm = this.fb.group({
      tipo: ['',Validators.required],
      avaliador:['',],
      avaliado:['', ],
      periodo:['',],
      perguntasRespostas: this.fb.array([],[Validators.required]),
    });

  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.trimestre = 'Quarto Trimestre';
    //this.obterTrimestre();
    //this.periodo = this.obterTrimestre();
    this.carregarMeusAvaliadosSemAvaliacao();

    this.tipos =[
      { nome:'Avaliação Geral'},
      { nome:'Avaliação do Gestor'}
    ];
    
    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.tipocontratoService.getTiposContratos().subscribe(
      tipocontratos => {
        this.tipocontratos = tipocontratos;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.cargoService.getCargos().subscribe(
      cargos => {
        this.cargos = cargos;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.setorService.getSetores().subscribe(
      setores => {
        this.setores = setores;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.areaService.getAreas().subscribe(
      areas => {
        this.areas = areas;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.ambienteService.getAmbientes().subscribe(
      ambientes => {
        this.ambientes = ambientes;
      },
      error =>{
        console.error('Error fetching users:',error);
      }
    )
    
    this.getAvaliadorInfo();

    this.colaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.avaliacaoService.getAvaliacoes().subscribe(
      avaliacoes => {
        this.avaliacoes = avaliacoes;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.avaliadoService.getMeusAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
      },
      error => {
        console.error('Error fetching users:',error);
      }
     );
    this.tipoAvaliacaoService.getTipoAvaliacaos().subscribe(
      tipoavaliacoes => {
        this.tipoavaliacoes = tipoavaliacoes;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    
  }

  ngOnDestroy(): void {
    // Limpa todas as subscrições
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('NovaliacaoComponent destruído');
  }
  
  sanitizeHtml(legenda: string): SafeHtml {
    if (!legenda) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(legenda);
  }

  obterTrimestre() {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1; // +1 porque os meses em JavaScript são indexados a partir de 0
    const anoAtual = dataAtual.getFullYear();

    // Calcula o trimestre atual
    let trimestreAtual = Math.ceil(mesAtual / 3);
    let anoReferencia = anoAtual;

    // Ajusta para o trimestre anterior
    if (trimestreAtual === 1) {
        trimestreAtual = 4; // Se for o primeiro trimestre, o anterior é o quarto trimestre do ano anterior
        anoReferencia -= 1;
    } else {
        trimestreAtual -= 1; // Caso contrário, apenas subtraia 1 do trimestre atual
    }

    // Define o nome do trimestre
    let trimestre = '';
    switch (trimestreAtual) {
        case 1:
            trimestre = 'Primeiro Trimestre';
            break;
        case 2:
            trimestre = 'Segundo Trimestre';
            break;
        case 3:
            trimestre = 'Terceiro Trimestre';
            break;
        case 4:
            trimestre = 'Quarto Trimestre';
            break;
        default:
            trimestre = 'Indeterminado';
    }

    this.trimestre = `${trimestre} de ${anoReferencia}`;
    console.log('Período de Avaliação:', this.trimestre);
}



  getAvaliadorInfo(): void {
    this.colaboradorService.getAvaliador().subscribe(
      data => {
        this.avaliador = data;
      },
      error => {
        console.error('Erro ao obter informações do avaliador:', error);
        this.avaliador = null; // Garanta que avaliador seja null em caso de erro
      }
    );
  }

  onTipoAvaliacaoSelecionado(tipoavaliacao: any): void {
    const id = tipoavaliacao.nome;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.tipoavSelecionadoId = id;
      this.carregarMeusAvaliadosSemAvaliacao();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  avaliadoByTipoAvaliacao(): void {
    if (this.tipoavSelecionadoId !== null) {
      this.avaliadoService.getAvaliadosByTipoAvaliacao(this.tipoavSelecionadoId).subscribe(data => {
        this.avaliados = data;
        console.log('Filiais carregadas:', this.avaliados); // Log para depuração
      });
    }
  }
  getNomeEmpresa(id: number): string {
    const empresa = this.empresas?.find(emp => emp.id === id);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  }
  getNomeFilial(id: number): string {
    const filial = this.filiais?.find(fil => fil.id === id);
    return filial ? filial.nome : 'Filial não encontrada';
  }
  getNomeArea(id: number): string {
    const area = this.areas?.find(are => are.id === id);
    return area ? area.nome : 'Area não encontrada';
  }
  getNomeSetor(id: number): string {
    const setor = this.setores?.find(set => set.id === id);
    return setor ? setor.nome : 'Setor não encontrada';
  }
  getNomeAmbiente(id: number): string {
    const ambiente = this.ambientes?.find(amb => amb.id === id);
    return ambiente ? ambiente.nome : 'Ambiente não encontrada';
  }
  getNomeCargo(id: number): string {
    const cargo = this.cargos?.find(cargo => cargo.id === id);
    return cargo ? cargo.nome : 'Cargo não encontrada';
  }
  getNomeTipoContrato(id: number): string {
    const tipocontrato = this.tipocontratos?.find(tipocontrato => tipocontrato.id === id);
    return tipocontrato ? tipocontrato.nome : 'Tipo de contrato não encontrado';
  }
  
   onAvaliadoSelecionado(avaliado: any): void {
    const id = avaliado.id;
    const form = avaliado.formulario;
    if (id !== undefined) {
      console.log('Avaliado selecionado ID:', id); // Log para depuração
      this.avaliadoSelecionadoId = id;
      this.obterDetalhesAvaliado(); // Espera a obtenção dos detalhes do avaliado
      this.carregarPerguntasDoFormulario(form); // Carrega os tipos de avaliação e as perguntas dos formulários
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  // onAvaliadoSelecionado(avaliado: any): void {
  //   const id = avaliado.id;
  //   const form = avaliado.formulario;
    
  //   if (id !== undefined) {
  //     console.log('Avaliado selecionado ID:', id); // Log para depuração
  //     this.avaliadoSelecionadoId = id;
  
  //     if (Array.isArray(form) && form.length > 1) {
  //       // Caso tenha mais de um formulário, guarda os formulários para o select
  //       this.formulariosDisponiveis = form;
  //       console.log('Formulários disponíveis:', this.formulariosDisponiveis); // Log para depuração
  //       this.showFormularioSelect = true; // Exibe o select
  //     } else {
  //       // Se tiver apenas um formulário, carrega diretamente
  //       this.carregarPerguntasDoFormulario(form[0] || form); // Aqui assume-se que form é um array, mas pode ser único
  //       this.showFormularioSelect = false; // Não exibe o select
  //     }
  
  //     this.obterDetalhesAvaliado(); // Espera a obtenção dos detalhes do avaliado
  //   } else {
  //     console.error('O ID do avaliado é indefinido');
  //   }
  // }
  
  // selecionarFormulario(formularioSelecionado: number) {
  //   this.obterDetalhesAvaliado();
  //   console.log('Formulário selecionado:', formularioSelecionado);
  //   this.carregarPerguntasDoFormulario(formularioSelecionado);
  // }


  obterDetalhesAvaliado(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.avaliadoSelecionadoId !== undefined) {
        // Obter os detalhes do avaliado
        this.avaliadoService.getAvaliado(this.avaliadoSelecionadoId).subscribe(
          (response) => {
            this.avaliadoDetalhes = response;
  
            // Aqui, você pode obter o ID do formulário depois que avaliadosDetalhes foi definido
            const formularioId = this.avaliadoDetalhes.formulario; // Certifique-se de que isso é um ID válido
  
            // Obter os detalhes do formulário
            this.formularioService.getFormularioDetalhes(formularioId).subscribe(
              (data: any) => {
                console.log(data); // Para ver o retorno da API no console
                this.formularioDetalhes = data;
                 // Define o valor do campo 'tipo' no formulário
                 this.registeravaliacaoForm.patchValue({
                  tipo: this.formularioDetalhes.nome // Define o nome do formulário aqui
                });
                resolve(); // Resolva a Promise após a conclusão
              },
              (error) => {
                console.error('Erro ao buscar detalhes do formulário:', error); // Para verificar erros
                reject(error);
              }
            );
          },
          (error) => {
            console.error('Erro ao obter detalhes do avaliado:', error);
            reject(error);
          }
        );
      } else {
        console.error('O ID do avaliado é indefinido');
        reject('O ID do avaliado é indefinido');
      }
    });
  }
  


  carregarMeusAvaliadosSemAvaliacao(): void {
    this.trimestre = 'Quarto Trimestre de 2025';
    if (this.trimestre && this.trimestre !== 'Indeterminado' ) {
      this.avaliadoService.getMeusAvaliadosSemAvaliacao(this.trimestre).subscribe(
        data => {
          this.avaliadosSA = data;
          console.log('Avaliados sem avaliação carregados:', this.avaliadosSA);
        },
        error => {
          console.error('Erro na requisição:', error);
        }
      );
    } else {
      console.error('Período ou tipo de avaliação inválido');
    }
  }


  carregarPerguntasDoFormulario(formularioId: number): Promise<void> {
    // Cancelar subscrição anterior, se houver
    if (this.perguntasSubscription) {
      this.perguntasSubscription.unsubscribe();
    }
  
    // Iniciar nova subscrição
    return new Promise<void>((resolve, reject) => {
      this.perguntasSubscription = this.perguntasService.carregarPerguntasDoFormulario(formularioId)
        .pipe(
          catchError((error) => {
            console.error(`Erro ao carregar perguntas do formulário ${formularioId}:`, error);
            return of([]); // Retorna um array vazio em caso de erro
          })
        )
        .subscribe(
          (perguntas) => {
            this.perguntas = perguntas;
            this.preencherCamposPerguntas();
            console.log(`Perguntas do formulário ${formularioId}:`, perguntas);
            resolve(); // Resolve a promise após carregar as perguntas
          },
          (error) => {
            reject(error); // Rejeita a promise em caso de erro durante a subscrição
          }
        );
    });
  }
      
    
  

  get perguntasRespostasArray(): FormArray {
    return this.registeravaliacaoForm.get('perguntasRespostas') as FormArray;
  }

preencherCamposPerguntas() {
  const perguntasRespostasArray = this.registeravaliacaoForm.get('perguntasRespostas') as FormArray;
 // perguntasRespostasArray.clear();

  this.perguntas.forEach((pergunta, index) => {
    const perguntaGroup = this.fb.group({
      pergunta: [pergunta.texto],
      resposta: ['', Validators.required],
      justificativa: ['']
    },{ validators: respostaJustificativaValidator });
    //perguntasRespostasArray.push(perguntaGroup);  
    perguntasRespostasArray.push(perguntaGroup);
    
    });
    
 
}
onRespostaChange(index: number) {
  const perguntaGroup = this.registeravaliacaoForm.get(`perguntasRespostas.pergunta-${this.perguntas[index].texto}`) as FormArray;
  const respostaControl = perguntaGroup.get('resposta');
  const justificativaControl = perguntaGroup.get('justificativa');

  if (respostaControl && justificativaControl) {
    const resposta = respostaControl.value;
    if (resposta === 1 || resposta === 5) { 
      justificativaControl.setValidators([Validators.required]);
    } else {
      justificativaControl.clearValidators();
    }
    justificativaControl.updateValueAndValidity();
  }
}  

getPerguntaControl(index: number): AbstractControl {
  const perguntasRespostas = this.registeravaliacaoForm.get('perguntasRespostas') as FormArray;
  return perguntasRespostas.at(index) || new FormGroup({});
}
    validacaoPersonalizada(formGroup: FormGroup) {
      let resposta = formGroup.controls['resposta'];
      let justificativa = formGroup.controls['justificativa'];
  
      if ((resposta.value === 1 || resposta.value === 5) && !justificativa.value.trim()) {
        justificativa.setValidators([Validators.required]);
        justificativa.updateValueAndValidity();
      } else {
        justificativa.clearValidators();
        justificativa.updateValueAndValidity();
      }
    }

    getRespostaValue(index: number): string {
      const respostaControl = this.registeravaliacaoForm.get(`perguntasRespostas.${index}.resposta`);
      return respostaControl ? respostaControl.value : '';
    }
  
    getJustificativaValue(index: number): string {
      const justificativaControl = this.registeravaliacaoForm.get(`perguntasRespostas.${index}.justificativa`);
      return justificativaControl ? justificativaControl.value : '';
    }

  formatarPerguntasRespostas(perguntasRespostas: any): RespostasFormatadas {
    const respostasFormatadas: RespostasFormatadas = {};

    for (const key in perguntasRespostas) {
      if (perguntasRespostas.hasOwnProperty(key)) {
        const perguntaTexto = perguntasRespostas[key].pergunta; // Obtenha o ID da pergunta
        const resposta = perguntasRespostas[key].resposta;
        const justificativa = perguntasRespostas[key].justificativa;

        respostasFormatadas[`pergunta-${perguntaTexto}`] = { resposta, justificativa };
      }
    }

    return respostasFormatadas;
  }

  submit(){
    console.log(this.registeravaliacaoForm.value)
    const tipo = this.registeravaliacaoForm.value.tipo;
    const avaliadorId = this.registeravaliacaoForm.value.avaliador.id;
    const avaliadoId = this.registeravaliacaoForm.value.avaliado.id;
    const periodo = this.registeravaliacaoForm.value.periodo;
    const perguntasRespostas: any = this.formatarPerguntasRespostas(this.registeravaliacaoForm.value.perguntasRespostas);
    const perguntasRespostasJSON: JSON = JSON.parse(JSON.stringify(perguntasRespostas));
      this.registeravaliacaoService.registeravaliacao(
        tipo,
        avaliadorId,
        avaliadoId,
        periodo,
        perguntasRespostasJSON,

      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Avaliação concluída com sucesso!' });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após o registro
          }, 1000); // Tempo em milissegundos (1 segundo de atraso)
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao concluir avaliação! Por favor revise as respostas e justificativas,caso necessárias, e tente novamente.' }),
      });
    }
}
