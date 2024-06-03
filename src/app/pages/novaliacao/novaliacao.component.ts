import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCargoService } from '../../services/cargos/getcargo.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { AvaliacaoService } from '../../services/avaliacoes/getavaliacao.service';
import { RegisterAvaliacaoService } from '../../services/avaliacoes/registeravaliacao.service.spec';
import { MatRadioChange } from '@angular/material/radio';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GetFormularioService } from '../../services/formularios/getformulario.service';
import { GetTipoAvaliacaoService } from '../../services/tipoavaliacoes/gettipoavaliacao.service';
import { PerguntasService } from '../../services/avaliacoes/perguntas.service';
import { StepsModule } from 'primeng/steps';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ChangeDetectorRef } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import { LoginService } from '../../services/login/login.service';
import {MatRadioModule} from '@angular/material/radio';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { AvaliadoService } from '../../services/avaliados/avaliado.service';
import { TipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { ColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { AvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { Colaborador } from '../colaborador/colaborador.component';
import { Avaliado } from '../avaliado/avaliado.component';
import { justificativaValidator } from './justificativaValidator';
import { TipoAvaliacaoService } from '../../services/tipoavaliacoes/registertipoavaliacao.service';
import { DividerModule } from 'primeng/divider';
import { async } from 'rxjs';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { TipoContrato } from '../tipocontrato/tipocontrato.component';
import { Cargo } from '../cargo/cargo.component';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { AmbienteService } from '../../services/ambientes/ambiente.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { CargoService } from '../../services/cargos/registercargo.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

export interface Avaliacao{
  id: number;
  periodo: string;
  perguntasRespostas: JSON;
  observacoes: Text;
  tipoavaliacao: number;
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



@Component({
  selector: 'app-novaliacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,StepperModule, RouterOutlet,CommonModule,MatStepperModule,MatFormFieldModule,CalendarModule,MatRadioModule,DividerModule,
    FormLayoutComponent,InputMaskModule,StepsModule,NzStepsModule,MatInputModule,MatButtonModule,AsyncPipe,MatSelectModule,RadioButtonModule,InputTextareaModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,
  ],
  providers: [
    MessageService,GetSetorService,TipoContratoService,PerguntasService,TipoAvaliacaoService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService,LoginService,
  ],
  templateUrl: './novaliacao.component.html',
  styleUrl: './novaliacao.component.scss'
})
export class NovaliacaoComponent implements OnInit {
  tipoavaliacoes: TipoAvaliacao [] | undefined;
  colaboradores: Colaborador [] | undefined;
  avaliadores: Avaliador [] | undefined;
  formularios: Formulario [] | undefined;
  formularioSelecionado: number | undefined;
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
  avaliados: any[] = [];
  avaliadorSelecionado: any;
  avaliadoSelecionado: Avaliado [] = [];
  colaboradorInfo: any;
  avaliadorId: string | undefined
  //avaliador: any; // Variável para armazenar as informações do avaliador com o colaborador
  userId: any; // Variável para armazenar o userId
  avaliador:any = null;
  avaliado: any = null; 
  avaliadoSelecionadoId: number | undefined;
  avaliadoDetalhes: any | undefined;
  trimestre: any;
  colaboradorSelecionado: Colaborador [] = [];
  respostasJustificativas: { [key: string]: { resposta: string, justificativa: string } } = {};
  tipoavSelecionadoId: number | null = null;
  registeravaliacaoForm: FormGroup;
  periodo: any;
  tipoAvaliacao: any;
  conceitos: any[] = [
    { key: 'otimo', name: 'Ótimo', value: 5 },
    { key: 'bom', name: 'Bom', value: 4 },
    { key: 'regular', name: 'Regular', value: 3 },
    { key: 'ruim', name: 'Ruim', value: 2 },
    { key: 'pessimo', name: 'Pessimo', value: 1 },
];

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
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    private tipoAvaliacaoService: TipoAvaliacaoService,
    private avaliadoService: AvaliadoService,
    private fb: FormBuilder,
    private registercompanyService:RegisterCompanyService
    
  )

  {
    this.registeravaliacaoForm = this.fb.group({
      tipoavaliacao: ['',],
      avaliador:['',],
      avaliado:['', ],
      periodo:['',],
      //feedback:['',],
      perguntasRespostas: this.fb.group({}),
    },{ validators: justificativaValidator() });
  }
 
  ngOnInit(): void {
    //this.periodo = this.obterTrimestre();
    this.trimestre = '';
    this.obterTrimestre();  
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
    // this.inicializarRespostasJustificativas();

    // this.perguntas.forEach(pergunta => {
    //   (this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup).addControl(
    //     pergunta.id.toString(), this.fb.control('', Validators.required)
    //   );
    // });


    // const userId = this.loginService.getUserId();
    // if (userId) {
    //   this.avaliadorService.getAvaliadorByUserId(userId).subscribe((avaliador) => {
    //     console.log('Avaliador encontrado:', avaliador);
        
    //     // Faça o que for necessário com as informações do avaliador
    //     this.avaliadorInfo = avaliador;
        
    //     //this.registeravaliacaoForm?.get('avaliador')?.setValue(avaliador);
    //     // Verifique se o avaliador tem dados do colaborador associado
    //     if (avaliador.colaborador) {
    //       this.colaboradorService.getColaboradorById(avaliador.colaborador.id).subscribe((colaborador) => {
    //         console.log('Colaborador associado ao avaliador:', colaborador);
    //         // Faça o que for necessário com as informações do colaborador
    //         this.colaboradorInfo = colaborador;
    //       });
    //     } else {
    //       console.error('Avaliador não possui colaborador associado.');
    //     }
    //   });
    // } else {
    //   console.error('ID do usuário não encontrado.');
    // }

    // this.registeravaliacaoForm.valueChanges.subscribe(value => {
    //   this.selecionarAvaliado(value);
    // });
    //this.formularioId = this.avaliadoDetalhes.formulario;
    //this.carregarPerguntasDoFormulario();
    this.getAvaliadorInfo();
    
    //this.loadAvaliados();
    //this.getAvaliadoInfo();
    
    
    this.colaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    
    this.getformularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
      },
      error => {
        console.error('Error fetching users:',error);
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
    //this.carregarMeusAvaliadosSemAvaliacao();
  }
  


  requireJustification: boolean = false;
  justification: string = '';  
  onOptionChange(option: any): void {
    if (option.value === 5 || option.value === 1) {
      this.requireJustification = true;
    } else {
      this.requireJustification = false;
      this.justification = '';  // Clear the justification if not required
    }
  }

  obterTrimestre() {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1; // +1 porque os meses em JavaScript são indexados a partir de 0
    switch (Math.ceil(mesAtual / 3)) {
      case 1:
        this.trimestre = 'Primeiro trimestre';
        break;
      case 2:
        this.trimestre = 'Segundo trimestre';
        break;
      case 3:
        this.trimestre = 'Terceiro trimestre';
        break;
      case 4:
        this.trimestre = 'Quarto trimestre';
        break;
      default:
        this.trimestre = 'Não foi possível determinar o trimestre';
    }
  }

  // obterTrimestre(): string {
  //   const dataAtual = new Date();
  //   const mesAtual = dataAtual.getMonth() + 1; // +1 porque os meses em JavaScript são indexados a partir de 0
  //   switch (Math.ceil(mesAtual / 3)) {
  //     case 1:
  //       return 'Q1-' + dataAtual.getFullYear();
  //     case 2:
  //       return 'Q2-' + dataAtual.getFullYear();
  //     case 3:
  //       return 'Q3-' + dataAtual.getFullYear();
  //     case 4:
  //       return 'Q4-' + dataAtual.getFullYear();
  //     default:
  //       return 'Indeterminado';
  //   }
  // }


  onTipoAvaliacaoSelecionado(tipoavaliacao: any): void {
    const id = tipoavaliacao.id;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.tipoavSelecionadoId = id;
      this.carregarMeusAvaliadosSemAvaliacao();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  // onTipoAvaliacaoChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.tipoAvaliacao = selectElement.value;
  //   this.carregarMeusAvaliadosSemAvaliacao();
  // }

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
  // onAvaliadoSelecionado(avaliado: any): void {
  //   const id =avaliado.id;
  //   console.log('Avaliado selecionado ID:', id); // Log para depuração
  //   this.avaliadoSelecionadoId = id;
  //   this.obterDetalhesAvaliado();
  //   this.carregarPerguntasDoFormulario();
  // }
 

  // obterDetalhesAvaliado(): void {
  //   if (this.avaliadoSelecionadoId !== undefined) {
  //     this.avaliadoService.getAvaliado(this.avaliadoSelecionadoId).subscribe(
  //       (data: any) => {
  //         console.log('Dados do Avaliado:', data);
  //         this.avaliadoDetalhes = data;
  //       },
  //       (error) => {
  //         console.error('Erro ao obter detalhes do avaliado', error);
  //       }
  //     );
  //   }
  // }

/////////////FUNCIONAAAAAAAAAAAAAAAAAAAAAAAAAA
  // async onAvaliadoSelecionado(avaliado: any): Promise<void> {
  //   const id = avaliado.id;
  //   if (id !== undefined) {
  //     console.log('Avaliado selecionado ID:', id); // Log para depuração
  //     this.avaliadoSelecionadoId = id;
  //     await this.obterDetalhesAvaliado(); // Espera a obtenção dos detalhes do avaliado
  //     this.carregarPerguntasDoFormulario();
  //   } else {
  //     console.error('O ID do avaliado é indefinido');
  //   }
  // }
  async onAvaliadoSelecionado(avaliado: any): Promise<void> {
    const id = avaliado.id;
    if (id !== undefined) {
      console.log('Avaliado selecionado ID:', id); // Log para depuração
      this.avaliadoSelecionadoId = id;
      await this.obterDetalhesAvaliado(); // Espera a obtenção dos detalhes do avaliado
      await this.carregarTipoAvaliacaoEFormularios(id); // Carrega os tipos de avaliação e as perguntas dos formulários
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  
  obterDetalhesAvaliado(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.avaliadoSelecionadoId !== undefined) {
        // Substitua isso pelo código real para obter os detalhes do avaliado
        this.avaliadoService.getAvaliado(this.avaliadoSelecionadoId).subscribe(
          (response) => {
            this.avaliadoDetalhes = response;
            resolve();
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
    if (this.periodo !== 'Indeterminado' && this.tipoavSelecionadoId ) {
      this.avaliadoService.getMeusAvaliadosSemAvaliacao(this.periodo, this.tipoavSelecionadoId).subscribe(
        data => {
          this.avaliados = data;
        },
        error => {
          console.error('Erro na requisição:', error);
        }
      );
    } else {
      console.error('Período ou tipo de avaliação inválido');
    }
  }

  async carregarTipoAvaliacaoEFormularios(userId: number): Promise<void> {
    try {
      const tiposAvaliacao = await this.tipoAvaliacaoService.carregarTipoAvaliacao(userId).toPromise();
      for (const tipoAvaliacao of tiposAvaliacao) {
        const formularioId = tipoAvaliacao.formulario; // Ajuste conforme sua resposta da API
        await this.carregarPerguntasDoFormulario(formularioId);
      }
    } catch (error) {
      console.error('Erro ao carregar tipos de avaliação:', error);
    }
  }
  // onAvaliadoSelected(avaliadoId: number) {
  //   // Faça algo com o valor selecionado (por exemplo, buscar informações adicionais).
  //   console.log('Avaliado selecionado:', avaliadoId);
  //   // Aqui você pode chamar sua API DRF para obter mais informações sobre o avaliado.
  // }

//   selecionarAvaliado(avaliado: Avaliado) {
//     this.avaliadoSelecionado.push(avaliado);
// }

// loadAvaliados(): void {
//   // Chame o serviço para obter a lista de avaliados (ajuste conforme necessário)
//   this.avaliadoService.getAvaliados().subscribe(
//     data => {
//       this.avaliados = data;
//     },
//     error => {
//       console.error('Erro ao carregar a lista de avaliados:', error);
//     }
//   );
// }

// onAvaliadoChange(event: Event): void {
//   const target = event.target as HTMLSelectElement;
//   const avaliadoId = target.value ? parseInt(target.value, 10) : null;
//   if (avaliadoId !== null) {
//     this.getAvaliadoInfo(avaliadoId);
//   } else {
//     this.avaliado = null;
//   }
// }




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
  // selecionarFormulario() {
  //   if (this.formularioSelecionado) {
  //     // Carregar perguntas ao selecionar um formulário
  //     this.carregarPerguntasDoFormulario(this.formularioSelecionado);
  //     this.cdRef.detectChanges();
  //   }
  // }

  // getAvaliadoInfo(): void {
  //   this.colaboradorService.getAvaliado().subscribe(
  //     data => {
  //       this.avaliado = data;
  //     },
  //     error => {
  //       console.error('Erro ao obter informações do avaliado:', error);
  //       this.avaliado = {}; // Em caso de erro, inicialize como objeto vazio
  //     }
  //   );
  // }
  
  // getIdFormularioDoAvaliado(idAvaliado: number): number | null {
  //   // Aqui você deve implementar a lógica para obter o ID do formulário associado ao avaliado
  //   // Se o avaliado tem uma propriedade 'formularioId', você pode retorná-la diretamente
  //   // Exemplo:
  //   const avaliado = this.avaliados.find(avaliado => avaliado.id === idAvaliado);
  //   return avaliado ? avaliado.formularioId : null;
  // }

  // onChangeAvaliado(idAvaliado: number) {
  //   if (idAvaliado) {
  //     // Obter o ID do formulário associado ao avaliado
  //     const idFormulario = this.getIdFormularioDoAvaliado(idAvaliado);
      
  //     if (idFormulario) {
  //       this.carregarPerguntasDoFormulario(idFormulario);
  //     }
  //   } else {
  //     this.perguntas = [];  // Limpa as perguntas se nenhum avaliado for selecionado
  //   }
  // }

  // carregarPerguntasDoFormulario(formularioId: number): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.perguntasService.carregarPerguntas(formularioId).subscribe(
  //       (perguntas: any) => {
  //         this.perguntas.push(...perguntas); // Adiciona as novas perguntas ao array existente
  //         this.preencherCamposPerguntas();
  //         console.log('Perguntas carregadas:', perguntas);
  //         resolve();
  //       },
  //       error => {
  //         console.error('Erro ao carregar perguntas:', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  carregarPerguntasDoFormulario(formularioId: number) {
    this.perguntasService.carregarPerguntas(formularioId).subscribe(
      (perguntas: any) => {
        this.perguntas = perguntas;
        this.preencherCamposPerguntas();
        console.log('Perguntas carregadas:', perguntas);
      },
      error => {
        console.error('Erro ao carregar perguntas:', error);
      }
    );
  }

/////////FUNCIONAAAAAAAAAAA
    // carregarPerguntasDoFormulario() {
    //   const formularioId = this.avaliadoDetalhes.tipoavaliacao;
    //   this.perguntasService.carregarPerguntas(formularioId).subscribe(
    //     (perguntas: any) => {
    //       // Aqui você pode fazer o que quiser com as perguntas, como armazená-las em uma variável
    //       this.perguntas = perguntas;
    //       this.preencherCamposPerguntas();
          
    //       console.log()
    //     },
    //     error => {
    //       console.error('Erro ao carregar perguntas:', error);
    //     }
    //   );
    // }

  

    // getPerguntaFormGroup(perguntaId: number): FormGroup {
    //   return this.fb.group({
    //     perguntaId: [perguntaId],
    //     resposta: ['', Validators.required],
    //     justificativa: ['',]
    //   });
    // }
    //correto
    // preencherCamposPerguntas() {
    //   const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
  
    //   this.perguntas.forEach(pergunta => {
    //     const perguntaControlName = `pergunta-${pergunta.id}`;
    //     perguntasRespostasGroup.addControl(perguntaControlName, this.fb.group({
    //       resposta: ['', Validators.required], // Defina validadores conforme necessário
    //       justificativa: ['',] // Pode ser obrigatória ou não, dependendo da lógica do seu aplicativo
    //     },{ Validators: justificativaValidator() }));
        
    //   });
    // }
    // validacaoPersonalizada() {
    //   return (formGroup: FormGroup) => {
    //     let resposta = formGroup.controls['resposta'];
    //     let justificativa = formGroup.controls['justificativa'];
    
    //     // Condição de validação
    //     if ((resposta.value === 1 || resposta.value === 5) && justificativa.value === '') {
    //       return justificativa.setErrors({ 'obrigatorio': true });
    //     } else {
    //       return justificativa.setErrors(null);
    //     }
    //   }
    // }
    // preencherCamposPerguntas() {
    //   const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
  
    //   this.perguntas.forEach(pergunta => {
    //     const perguntaGroup = this.fb.group({
    //       resposta: ['', Validators.required],
    //       justificativa: ['',]
    //     }, { validators: this.validacaoPersonalizada() });
    //     perguntasRespostasGroup.addControl(`pergunta-${pergunta.id}`, perguntaGroup);
    //   });
    // }

    preencherCamposPerguntas() {
      const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
    
      this.perguntas.forEach((pergunta, index) => {
        const perguntaGroup = this.fb.group({
          resposta: ['', Validators.required],
          justificativa: ['']
        });
        perguntaGroup.get('resposta')!.valueChanges.subscribe(() => this.onRespostaChange(index));
        perguntasRespostasGroup.addControl(`pergunta-${pergunta.texto}`, perguntaGroup);
        // Chama a função de validação inicial para configurar os validadores corretamente
        
      });
    }
   

    getRespostaValue(perguntaTxt: string): string {
      const respostaControl = this.registeravaliacaoForm.get(`perguntasRespostas.pergunta-${perguntaTxt}.resposta`);
      return respostaControl ? respostaControl.value : '';
    }
  
    getJustificativaValue(perguntaTxt: string): string {
      const justificativaControl = this.registeravaliacaoForm.get(`perguntasRespostas.pergunta-${perguntaTxt}.justificativa`);
      return justificativaControl ? justificativaControl.value : '';
    }
   
    
    onRespostaChange(index: number) {
      const perguntaGroup = this.registeravaliacaoForm.get(`perguntasRespostas.pergunta-${this.perguntas[index].id}`) as FormGroup;
      const respostaControl = perguntaGroup.get('resposta');
      const justificativaControl = perguntaGroup.get('justificativa');
    
      if (respostaControl && justificativaControl) {
        const resposta = respostaControl.value;
        if (resposta === 1 || resposta === 5) { // Verifica se a resposta é 5 ou 1
          justificativaControl.setValidators([Validators.required]);
        } else {
          justificativaControl.clearValidators();
        }
        justificativaControl.updateValueAndValidity();
      }
    }
  
    isJustificativaRequired(index: number): boolean {
      const perguntaGroup = this.registeravaliacaoForm.get(`perguntasRespostas.pergunta-${this.perguntas[index].texto}`) as FormGroup;
      const justificativaControl = perguntaGroup?.get('justificativa');
      return (justificativaControl?.hasError('required') && (justificativaControl?.touched || justificativaControl?.dirty)) ?? false;
    }
  

    // preencherCamposPerguntas() {
    //   if (this.registeravaliacaoForm instanceof FormGroup) {
    //     // Acesse o grupo de controles dentro do perguntasRespostas
    //     const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
  
    //     // Preencha os campos de perguntas no formulário
    //     this.perguntas.forEach(pergunta => {
    //       const perguntaControlName = `pergunta-${pergunta.id}`;
    //       perguntasRespostasGroup.addControl(perguntaControlName, this.fb.group({
    //         resposta: ['',] ,
    //         justificativa: ['']
    //       }));
    //     });
    //   }
    // }





  //   preencherCamposPerguntas() {
  //     if (this.registeravaliacaoForm instanceof FormGroup) {
  //         // Acesse o grupo de controles dentro do perguntasRespostas
  //         const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
  
  //         // Preencha os campos de perguntas no formulário
  //         this.perguntas.forEach(pergunta => {
  //             const perguntaControlName = `pergunta${pergunta.id}`;
  //             const respostaControl = perguntasRespostasGroup.get(`${perguntaControlName}.resposta`);
  //             const justificativaControl = perguntasRespostasGroup.get(`${perguntaControlName}.justificativa`);
  
  //             if (respostaControl && justificativaControl) {
  //                 respostaControl.setValue(''); // Preencha a resposta conforme necessário
  //                 justificativaControl.setValue(''); // Preencha a justificativa conforme necessário
  //             } else {
  //                 console.error(`Controle não encontrado para pergunta ${pergunta.id}`);
  //             }
  //         });
  //     }
  // }





    // preencherCamposPerguntas() {
    //   if (this.registeravaliacaoForm instanceof FormGroup) {
    //     const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
    
    //     this.perguntas.forEach(pergunta => {
    //       const perguntaControlName = `pergunta${pergunta.id}`;
    //       perguntasRespostasGroup.get(perguntaControlName + '.resposta')?.setValue('');
    //       perguntasRespostasGroup.get(perguntaControlName + '.justificativa')?.setValue('');
    //     });
    //   }
    // }

  //   preencherCamposPerguntas() {
  //     if (this.registeravaliacaoForm instanceof FormGroup) {
  //         // Acesse o grupo de controles dentro do perguntasRespostas
  //         const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;

  //         // Preencha os campos de perguntas no formulário
  //         this.perguntas.forEach(pergunta => {
  //             const perguntaControlName = `${pergunta.id}_resposta`;
  //             const justificativaControlName = `${pergunta.id}_justificativa`;
  //             perguntasRespostasGroup.addControl(perguntaControlName, this.fb.control('', Validators.required));
  //             perguntasRespostasGroup.addControl(justificativaControlName, this.fb.control(''));
  //         });
  //     }
  // }
  
  // clear(table: Table) {
  //   table.clear();
  // }
  
  // avancarEtapa() {
  //   if (this.perguntas && this.perguntas.length > 0) {
  //     this.activeIndex++; // Avançar para a próxima etapa
  //   }
  // }

  // proximaPergunta(index: number) {
  //   // Lógica para avançar para a próxima pergunta
  // }

  // retrocederEtapa() {
  //   this.activeIndex--; // Retroceder para a etapa anterior
  // }
  // onIndexChange(event: any) {
  //   this.activeIndex = event; // Atualizar o índice ativo com base no evento
  // }


  // clearForm() {
  // this.registeravaliacaoForm.reset();
  // }
  
  // filterTable() {
  // this.dt1.filterGlobal(this.inputValue, 'contains');
  // }

  //  inicializarRespostas(): void {
  //   this.perguntas.forEach(pergunta => {
  //     this.respostas[pergunta.id] = { resposta: '', justificativa: '', nota: 0 };
  //   });}




  formatarPerguntasRespostas(perguntasRespostas: any): RespostasFormatadas {
    const respostasFormatadas: RespostasFormatadas = {};

    for (const key in perguntasRespostas) {
      if (perguntasRespostas.hasOwnProperty(key)) {
        const perguntaId = key.replace('pergunta', ''); // Obtenha o ID da pergunta
        const resposta = perguntasRespostas[key].resposta;
        const justificativa = perguntasRespostas[key].justificativa;

        respostasFormatadas[`pergunta${perguntaId}`] = { resposta, justificativa };
      }
    }

    return respostasFormatadas;
  }


  submit(){
    console.log(this.registeravaliacaoForm.value)
    const tipoavaliacaoId = this.registeravaliacaoForm.value.tipoavaliacao.id;
    const avaliadorId = this.registeravaliacaoForm.value.avaliador.id;
    const avaliadoId = this.registeravaliacaoForm.value.avaliado.id;
    const periodo = this.registeravaliacaoForm.value.periodo;
    const perguntasRespostas: any = this.formatarPerguntasRespostas(this.registeravaliacaoForm.value.perguntasRespostas);
    const perguntasRespostasJSON: JSON = JSON.parse(JSON.stringify(perguntasRespostas));
    const feedback = this.registeravaliacaoForm.value.feedback;
      this.registeravaliacaoService.registeravaliacao(
        tipoavaliacaoId,
        avaliadorId,
        avaliadoId,
        periodo,
        //feedback,
        perguntasRespostasJSON,
        
      ).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
        error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
      });
    
  }

  
//   submit() {
//     if (this.registeravaliacao2Form.valid) {
//         // Aqui você pode enviar os dados para o servidor
//         const dadosFormulario = this.registeravaliacao2Form.value;
//         console.log(dadosFormulario);
//     } else {
//         console.log('Formulário inválido. Preencha todos os campos obrigatórios.');
//     }
// }

  
  navigate(){
    this.router.navigate(["dashboard"])
  }
}
