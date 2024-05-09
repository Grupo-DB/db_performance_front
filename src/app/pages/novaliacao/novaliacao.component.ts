import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
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
import { RegisterTipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { GetAvaliacaoService } from '../../services/avaliacoes/getavaliacao.service';
import { RegisterAvaliacaoService } from '../../services/avaliacoes/registeravaliacao.service.spec';
import { GetAvaliadorService } from '../../services/avaliadores/getavaliador.service';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
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
import { AtivoService } from '../../services/ativo/ativo.service';
import { AvaliadorService } from '../../services/ativo/avaliador.service';
import { ColaboradorResponse } from '../../types/colaborador-response';
import { ColaboradorService } from '../../services/ativo/colaborador.service';
import { Calendar, CalendarModule } from 'primeng/calendar';


// interface RegisterAvaliacaoForm{
//   tipoavaliacao: string,
//   colaborador: string,
//   data_avaliacao: string,
//   periodo:string,
//   perguntasRespostas: RespostasFormatadas,
//}
export interface RespostasFormatadas {
  [key: string]: { resposta: string; justificativa: string };
}
interface TipoAvaliacao{
  nome: string
}
interface Colaborador{
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
interface Pergunta{
  texto: string
  id: number
}
interface Cargo{
  nome:string
}

@Component({
  selector: 'app-novaliacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,StepperModule, RouterOutlet,CommonModule,MatStepperModule,MatFormFieldModule,CalendarModule,
    FormLayoutComponent,InputMaskModule,StepsModule,NzStepsModule,MatInputModule,MatButtonModule,AsyncPipe,MatSelectModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService,GetSetorService,RegisterTipoContratoService,PerguntasService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService,LoginService,AtivoService
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
  perguntas: any [] = [];
  respostas: any [] = [];
  activeIndex: number = 0;
  steps: any[] = [];
  avaliacoes: any[] = [];
  login: any;
  avaliadorSelecionado: any;
  avaliadoSelecionado: any;
  colaboradorInfo: any;
  avaliadorId: string | undefined
  //avaliador: any; // Variável para armazenar as informações do avaliador com o colaborador
  userId: any; // Variável para armazenar o userId
  avaliadorInfo:any;
  colaboradorSelecionado: any;
  respostasJustificativas: { [key: string]: { resposta: string, justificativa: string } } = {};

  registeravaliacaoForm: FormGroup;
  
  constructor(
    private router: Router,
    private messageService: MessageService,
    private gettipoavaliacaoService: GetTipoAvaliacaoService,
    private getcolaboradorService: GetColaboradorService,
    private registeravaliacaoService: RegisterAvaliacaoService,
    private getformularioService: GetFormularioService,
    private getavaliacaoService: GetAvaliacaoService,
    private getavaliadorService: GetAvaliadorService,
    private perguntasService: PerguntasService,
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    private ativoService: AtivoService,
    private avaliadorService: AvaliadorService,
    private colaboradorService: ColaboradorService,
    private fb: FormBuilder  
  )

  {
    this.registeravaliacaoForm = this.fb.group({
      tipoavaliacao: ['', ],
      avaliador:['',],
      colaborador:['', ],
      periodo:['',],
      perguntasRespostas: this.fb.group({}),
      feedback:['']
    });
  }
 
  ngOnInit(): void {
    this.periodos = [
      { nome: '1º Trimestre'},
      { nome: '2º Trimestre'},
      { nome: '3º Trimestre'},
      { nome: '4º Trimestre'},
    ];
    
    
    // this.inicializarRespostasJustificativas();

    // this.perguntas.forEach(pergunta => {
    //   (this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup).addControl(
    //     pergunta.id.toString(), this.fb.control('', Validators.required)
    //   );
    // });


    const userId = this.loginService.getUserId();
    if (userId) {
      this.avaliadorService.getAvaliadorByUserId(userId).subscribe((avaliador) => {
        console.log('Avaliador encontrado:', avaliador);
        
        // Faça o que for necessário com as informações do avaliador
        this.avaliadorInfo = avaliador;
        
        //this.registeravaliacaoForm?.get('avaliador')?.setValue(avaliador);
        // Verifique se o avaliador tem dados do colaborador associado
        if (avaliador.colaborador) {
          this.colaboradorService.getColaboradorById(avaliador.colaborador.id).subscribe((colaborador) => {
            console.log('Colaborador associado ao avaliador:', colaborador);
            // Faça o que for necessário com as informações do colaborador
            this.colaboradorInfo = colaborador;
          });
        } else {
          console.error('Avaliador não possui colaborador associado.');
        }
      });
    } else {
      console.error('ID do usuário não encontrado.');
    }

    this.registeravaliacaoForm.valueChanges.subscribe(value => {
      this.selecionarColaborador(value);
    });
  

    this.gettipoavaliacaoService.getTipoavaliacoes().subscribe(
      tipoavaliacoes => {
        this.tipoavaliacoes = tipoavaliacoes;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    
    this.getcolaboradorService.getColaboradores().subscribe(
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
  
    this.getavaliacaoService.getAvaliacoes().subscribe(
      avaliacoes => {
        this.avaliacoes = avaliacoes;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
  
  }
  
  selecionarColaborador(colaborador: any) {
    this.colaboradorSelecionado = colaborador;
}


  
  selecionarFormulario() {
    if (this.formularioSelecionado) {
      // Carregar perguntas ao selecionar um formulário
      this.carregarPerguntasDoFormulario(this.formularioSelecionado);
      this.cdRef.detectChanges();
    }
  }


    carregarPerguntasDoFormulario(formularioId: number) {
      this.perguntasService.carregarPerguntas(formularioId).subscribe(
        (perguntas: any) => {
          // Aqui você pode fazer o que quiser com as perguntas, como armazená-las em uma variável
          this.perguntas = perguntas;
          this.preencherCamposPerguntas();
          
          console.log()
        },
        error => {
          console.error('Erro ao carregar perguntas:', error);
        }
      );
    }

    getPerguntaFormGroup(perguntaId: number): FormGroup {
      return this.fb.group({
        perguntaId: [perguntaId],
        resposta: ['', Validators.required],
        justificativa: ['']
      });
    }
    preencherCamposPerguntas() {
      const perguntasRespostasGroup = this.registeravaliacaoForm.get('perguntasRespostas') as FormGroup;
  
      this.perguntas.forEach(pergunta => {
        const perguntaControlName = `pergunta-${pergunta.id}`;
        perguntasRespostasGroup.addControl(perguntaControlName, this.fb.group({
          resposta: ['', Validators.required], // Defina validadores conforme necessário
          justificativa: [''] // Pode ser obrigatória ou não, dependendo da lógica do seu aplicativo
        }));
      });
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
    const colaboradorId = this.registeravaliacaoForm.value.colaborador.id;
    const periodo = this.registeravaliacaoForm.value.periodo;
    const perguntasRespostas: any = this.formatarPerguntasRespostas(this.registeravaliacaoForm.value.perguntasRespostas);
    const perguntasRespostasJSON: JSON = JSON.parse(JSON.stringify(perguntasRespostas));
    const feedback = this.registeravaliacaoForm.value.feedback;
      this.registeravaliacaoService.registeravaliacao(
        tipoavaliacaoId,
        avaliadorId,
        colaboradorId,
        periodo,
        perguntasRespostasJSON,
        feedback
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
