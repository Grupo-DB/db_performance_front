import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink, Router } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GetAreaService } from '../../../services/avaliacoesServices/areas/getarea.service';
import { PerguntasService } from '../../../services/avaliacoesServices/avaliacoes/perguntas.service';
import { GetCargoService } from '../../../services/avaliacoesServices/cargos/getcargo.service';
import { GetCompanyService } from '../../../services/avaliacoesServices/companys/getcompany.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { GetSetorService } from '../../../services/avaliacoesServices/setores/get-setor.service';
import { TipoAvaliacaoService } from '../../../services/avaliacoesServices/tipoavaliacoes/registertipoavaliacao.service';
import { TipoContratoService } from '../../../services/avaliacoesServices/tipocontratos/resgitertipocontrato.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Avaliador } from '../avaliador/avaliador.component';
import { Cargo } from '../cargo/cargo.component';
import { Colaborador } from '../colaborador/colaborador.component';
import { Filial } from '../filial/filial.component';
import { Formulario } from '../formulario/formulario.component';
import { Empresa } from '../../avaliacoes/registercompany/registercompany.component';
import { Setor } from '../../avaliacoes/setor/setor.component';
import { TipoAvaliacao } from '../../avaliacoes/tipoavaliacao/tipoavaliacao.component';
import { TipoContrato } from '../../avaliacoes/tipocontrato/tipocontrato.component';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { AvaliacaoService  } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';
import { RegisterAvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/registeravaliacao.service.spec';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { GetFormularioService } from '../../../services/avaliacoesServices/formularios/getformulario.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { Avaliado } from '../avaliado/avaliado.component';
import { Avaliacao } from '../novaliacao/novaliacao.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { Select, SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';

import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,StepperModule,CommonModule,MatStepperModule,MatFormFieldModule,CalendarModule,MatRadioModule,DividerModule,DialogModule,InputMaskModule,StepsModule,NzStepsModule,MatInputModule,MatButtonModule,MatSelectModule,RadioButtonModule,InputTextModule,MultiSelectModule,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,IconFieldModule,InputIconModule,NzMenuModule,TabMenuModule,SelectModule,FloatLabelModule,DatePickerModule,MultiSelectModule, CardModule, InplaceModule, DrawerModule
  ],
  providers:[
    MessageService,GetSetorService,TipoContratoService,PerguntasService,TipoAvaliacaoService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService,LoginService,
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss'
})
export class HistoricoComponent implements OnInit{
  tipoavaliacoes: TipoAvaliacao [] | undefined;
  colaboradores: Colaborador [] | undefined;
  avaliadores: Avaliador [] | undefined;
  avaliados: Avaliado [] | undefined;
  avaliacoesInt: Avaliacao [] | undefined;
  formularios: Formulario [] | undefined;
  formularioSelecionado: number | undefined;
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: Cargo[]| undefined;
  ambientes: Ambiente[]| undefined;
  tipocontratos: TipoContrato[]| undefined;
  feedbacks: any [] = []; 
  avaliacoes:any [] =[];
  avaliacaoDetalhe: any;
  avaliadorSelecionadoId: number | null = null;
  loading: boolean = true;
  visible: boolean = false;
  avaliadoDetalhes: any | undefined;
  perguntasRespostasFormatada: any;
  registerfbForm: FormGroup;
  editForm!: FormGroup;
  inputValue: string = '';
  feedbackOptions = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false }
  ];

  conceitos: any[] = [
    { value: 0, name: 'Não se aplica' },
    { value: 1, name: 'Péssimo' },
    { value: 2, name: 'Ruim' },
    { value: 3, name: 'Regular' },
    { value: 4, name: 'Bom' },
    { value: 5, name: 'Ótimo' }
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
    private avaliadorService: AvaliadorService,
    private perguntasService: PerguntasService,
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    private tipoAvaliacaoService: TipoAvaliacaoService,
    private avaliadoService: AvaliadoService,
    private fb: FormBuilder,
    private registercompanyService:RegisterCompanyService,
    private avaliacaoService: AvaliacaoService, 
  )
  {
    this.registerfbForm = this.fb.group({
      observacoes: ['',], 
    });
    this.editForm = this.fb.group({
      observacoes: [''],
      
     });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.loading = false;
    
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
    );
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
  
    this.avaliacaoService.getMinhasAvaliacoes().subscribe(
      (avaliacoes: Avaliacao[]) => {
        this.avaliacoes = avaliacoes;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
        this.mapAvaliados();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.avaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
        this.mapAvaliadores();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.tipoAvaliacaoService.getTipoAvaliacaos().subscribe(
      tipoavaliacoes => {
        this.tipoavaliacoes = tipoavaliacoes;
        this.mapTipoAvaliacao();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
  }

  onAvaliadorSelecionado(avaliador: any): void {
    const id = avaliador.id;
    if (id !== undefined) {
      console.log('Empresa selecionada ID:', id); // Log para depuração
      this.avaliadorSelecionadoId = id;
      this.avaliadosByAvaliador();
    } else {
      console.error('O ID do avaliador é indefinido');
    }
  }

  avaliadosByAvaliador(): void {
    if (this.avaliadorSelecionadoId !== null) {
      this.avaliadoService.getAvaliadosByAvaliador(this.avaliadorSelecionadoId).subscribe(data => {
        this.avaliados = data;
        console.log('Avaliados carregadas:', this.filiais); // Log para depuração
      });
    }
  } 

  mapAvaliados() {
    this.avaliacoes.forEach(avaliacao => {
      const avaliado = this.avaliados?.find(avaliado => avaliado.id === avaliacao.avaliado);
      if (avaliado) {
        avaliacao.avaliadoNome = avaliado.nome;
      }
    });
    this.loading = false;
  }

  mapAvaliadores() {
    this.avaliacoes.forEach(avaliacao => {
      const avaliador = this.avaliadores?.find(avaliador => avaliador.id === avaliacao.avaliador);
      if (avaliador) {
        avaliacao.avaliadorNome = avaliador.nome;
      }
    });
    this.loading = false;
  }

  mapTipoAvaliacao() {
    this.avaliacoes.forEach(avaliacao => {
      const tipoavaliacao = this.tipoavaliacoes?.find(tipoavaliacao => tipoavaliacao.id === avaliacao.tipoavaliacao);
      if (tipoavaliacao) {
        avaliacao.tipoavaliacaoNome = tipoavaliacao.nome;
      }
    });
    this.loading = false;
  }


  getNomeAvaliado(id: number): string {
    const avaliado = this.avaliados?.find(avaliado => avaliado.id === id);
    return avaliado ? avaliado.nome : 'Avaliado não encontrada';
  }
  
  getNomeAvaliador(id: number): string {
    const avaliador = this.avaliadores?.find(avaliador => avaliador.id === id);
    return avaliador ? avaliador.nome : 'Avaliador não encontrada';
  }
  getNomeTipoAvaliacao(id: number): string {
    const tipoavaliacao = this.tipoavaliacoes?.find(tipo => tipo.id === id);
    return tipoavaliacao ? tipoavaliacao.nome : 'Tipo de Avaliação não encontrada';
  }

  onFeedbackButtonClick(avaliacaoId: number): void {
    this.avaliacaoService.updateFeedback(avaliacaoId).subscribe(
      response => {
        if (response.status === 'success') {
          // Atualize a interface do usuário conforme necessário
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Feedback finalizado com sucesso!' });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a exclusão
           }, 2000);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: `Erro ao finalizar o feedback: ${response.message}` });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Erro na requisição!', detail: `Erro: ${error.message || error}` });
      }
    );
  }
  abrirModalEdicao(id:number,avaliacao:Avaliacao) {
    this.visible = true;
     this.editForm.patchValue({
       observacoes:avaliacao.observacoes
     })
    this.avaliacaoService.getAvaliacao(id).subscribe(
      data => {
        if (data.perguntasRespostas && typeof data.perguntasRespostas === 'object') {
          this.perguntasRespostasFormatada = this.formatarPr(data.perguntasRespostas);
        } else{
          this.perguntasRespostasFormatada = data.perguntasRespostas;
        }
        this.avaliacaoDetalhe = data;
      },
      error => {
        console.error('Erro ao buscar detalhes da avaliação:', error);
      },
  );
  }
  
  formatarPr(perguntasRespostasObj: any): string {
    let perguntasRespostasFormatada = '';
    for (const key in perguntasRespostasObj) {
      if (perguntasRespostasObj.hasOwnProperty(key)) {
        const subObj = perguntasRespostasObj[key];
        perguntasRespostasFormatada += `${key}:\n`;
        for (const subKey in subObj) {
          if (subObj.hasOwnProperty(subKey)) {
            if (subKey === 'resposta') {
              perguntasRespostasFormatada += `  ${subKey}: ${this.getRespostaNome(subObj[subKey])}\n`;
            } else {
              perguntasRespostasFormatada += `  ${subKey}: ${subObj[subKey]}\n`;
            }
          }
        }
      }
    }
    return perguntasRespostasFormatada;
  }

  getRespostaNome(respostaValor: number): string {
    const conceito = this.conceitos.find(c => c.value === respostaValor);
    return conceito ? conceito.name : respostaValor.toString();
  }
  submit(){
    const avaliacaoId = this.avaliacaoDetalhe.id;
    const dadosAtualizados: Partial<Avaliacao>={
      observacoes: this.editForm.value.observacoes

    };
    this.avaliacaoService.editAvaliacao(avaliacaoId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Observações inseridas com sucesso!' });
         setTimeout(() => {
          window.location.reload(); // Atualiza a página após a exclusão
         }, 2000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao inserir  observações.' });
      }
    });
  }
  }
