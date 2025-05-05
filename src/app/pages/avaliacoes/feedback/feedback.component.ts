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
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { TipoAvaliacao } from '../tipoavaliacao/tipoavaliacao.component';
import { TipoContrato } from '../tipocontrato/tipocontrato.component';
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
import { Avaliacao, RespostasFormatadas } from '../novaliacao/novaliacao.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,NzMenuModule,TabMenuModule,FormsModule,StepperModule,CommonModule,MatStepperModule,MatFormFieldModule,CalendarModule,MatRadioModule,DividerModule,DialogModule,
    InputMaskModule,StepsModule,NzStepsModule,MatInputModule,MatButtonModule,MatSelectModule,RadioButtonModule,InputTextModule,MultiSelectModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,IconFieldModule,InputIconModule
  ],
  providers:[
    MessageService,GetSetorService,TipoContratoService,PerguntasService,TipoAvaliacaoService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService,LoginService,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit{
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
      perguntasRespostas:[''],
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
  
    this.avaliacaoService.getAvaliacoes().subscribe(
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
       perguntasRespostas:avaliacao.perguntasRespostas ? JSON.stringify(avaliacao.perguntasRespostas, null, 2) : '',
       observacoes:avaliacao.observacoes
     });
 
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

  submit() {
    const avaliacaoId = this.avaliacaoDetalhe.id;
    const perguntasRespostasAtualizadas: any = JSON.parse(this.editForm.value.perguntasRespostas);
  
    const dadosAtualizados: Partial<Avaliacao> = {
      perguntasRespostas: perguntasRespostasAtualizadas,
      observacoes: this.editForm.value.observacoes
    };
  
    this.avaliacaoService.editAvaliacao(avaliacaoId, dadosAtualizados).subscribe(
      response => {
        console.log('Avaliação atualizada com sucesso:', response);
      },
      error => {
        console.error('Erro ao atualizar a avaliação:', error);
      }
    );
  }

  imprimirPDF(): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const content = document.getElementById('feedbackContent');
    const logoUrl = 'data:image/jpeg;base64,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RAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73vcGta0Dckk9gA8aol5WX5djuB43cMuyu5xW+1WyEz1NRIejWjsAHaXE7AAdSSAOpVUMA1J4mOKzIrxkOnWTx6b6fW9z4LfUvtkVVUVszfYhxkB3PYX8pDWAgeEepw3Ob/AJJx162M0xw6uqKPTDE5xPcq+IbCpIJaZfIXO2c2IHsHM/btCvJi2MWLC8dt+KYzboqC12uBtPS08Y2axg/aSdySepJJPUraYjSjrv8A6UzzT+isWivE/nWOam1WgPE22lo8jEwjtV6jibDBX8x8BrtgG+H9o8AAnwSA7be2Sg/ir4cbZr7hJFvZDS5bZ2ums1cfBLj2mnkd9w/xH7V2xHjBwzg04jLrnFJVaNaoulpc8xUOpz334M1bDEeV3MD2zR7bO8bhs7r4RS1YvXnr+6YnE4laNERYrPFza71eP4Zf79QBhqbba6qsh5xu3ukcTnt3HjG4CoTodrdxp6p2nKM0w3LbXkMmLzUxqMfrLbCw1kcwkcRC5jWkOaIz4PMCd+hJ6G9Gqf2Mcv8A8BuHzd6p76lx9bdSPym1/wCypW+niNO1sKW9UQnzh54psR1zhmsVVSPx3M7dzNr7FVu2kBb0c6IkAvaD2jYOb4x4zNyrTxO8K0ueVkerekNUbDqPZyKmKamf3EXAs7GucOjZdugeeh9i7odx3uF3ilh1aim0+1CphY9RbJzQ11DMzuPfnc+jpI2Hq1428OPxdo8HsrasTHNRMTicSsQsd1FvNfj2BZDfbXI2Ost9sqamB7mhwbIyMlpIPQ9R2LIliGsH2Ksu/wAFrP3TlnXeFkHcBWsuo2suC5Lc9R7+LtV227Mp6ebvaKEtjdA15aRG1oPhE7dFaBUq9S7+xvmn+OQ/NWK6q01oiLzEK12ERYRrHqzjWi2A3HO8nmHcqRnJTU7SO6VdQ72ELB4yT+gAk9As4iZnELbMR4luJHHuH3FmTuiZcsnugdHZ7UCd5X9ndZNuojafJ1cfBHjIiB9Bx4jTD6bf0wqRuQda44Z/IlPyij235Obbm7tt17nvvt05ubovJ4V9JMm1xzufit1uiNQ+on58ct0rSYmBp2ZKGn+jZ2RjxkF/bsrtLW0xp/LHWfupGbdUL8M3Enj/ABBYs+UxMtuT2sCO72onYxu7O6Rg9TG4g9vUHcHqFNCpHxUaRZPodndPxWaHw97PppufIrfE09ycHEB0rmDtik7JB4js4dey0mjWreM614Db87xiXaOpb3OqpXOBko6loHdIX+cE9D4wQR0Ki9Yxz12TWftLOERcc88VNBJUzvDY4mF73HxNA3JWSzoZHkuP4hZ6jIMovNHarbSN55qqrmEcbB5yfH5B2nxKvM3GDeNQrpPYOGrSS75zJA/uct4rD3ha4neeR/U+8eU+RQdZJ77x78QFfSX65VVLplh7zNHb6eUtbOznLY9yOhkl5XEv7Ws6DbfdX4x3HLDiVmpcexm0UlsttEwRwUtLEI42NHkA8flPaT1K1mtdPpbrKsTNtkHUuH8Z+WbVGR6t4bhMUvU0ljsnf8sY+5MlQdt/ON12hw/azS+HWcXGaOk7T3vaqGJu/wCLyHp5t1PKKviT9v8AScIGdofxA0AMlk4tL2+QDo25Y5RVDCfPsGrp9z44MRmaW1Gm+f0m+xD2zWupI/NvGP8AVWFROefvEGHUtM1yqLZSz3iiio66SFjqmnim7syKQjwmtfsOYA7jfYbrtoiolE/FPnmTaaaF5NmOHVzKO70UUQp6h0TZO5l8rGkhrgWk7E9oKhXh3t3EVrppfQ6i1XE5drPJWVFTAaSPHqKZre5SuZvzENJ3237FJPHH/wAMmYfiU379ix7gGvNnouGyyU9ZdqOCUV1wJZJOxrgDUP8AETut69NLMb5UnrbDI/pH8QX/ADc3r/K1D/FPpH8QX/Nzev8AK1D/ABUzfRFj/wDbtv8A1pn8U+iLH/7dt/60z+Kz57fyITiEU49o/rjar3RXG78UV4utFTzNknon43QxtqGA9Yy4bloI6bjqPEpnXWpLnba9zm0NwpqhzRu4RSteR7+xXZVZmZ3TEYFSzik1t1jsPEnimkWCZ2/HLVeoqCKR8FDBM9slRO9jpD3RpJ2AGzdwOnnV01r74qf+OzTn8eyfPHrXQiJt17Ivssb9I/iC/wCbm9f5Wof4p9I/iCHZxc3rf4LUP8VO6KniT/IhPLCv9TprxeWVvdsc4jLDfXNG4pr5i8ULHnyGSA8w/QsYl4uc60fyajxLii0zZY4q4ltLkVildU0E+xALuR3hADcFwBLhuPA2Ks5crvabNTPrbxc6Shp4xzPlqZmxMaPKXOIAVH+MfVWxcRUFn0L0MoZs1vMF1bcKust0RkpqUMjkj5RL7Hr3Ulz9+QBvaSemmn884tHRW3yx0XittyoLxb6a7WusiqqOsiZPTzxODmSxuG7XNI7QQQV2VhGieC1umek+L4JcqsVNXZ7eyCokB3b3U7ucGnxtBcQD5AFm6xnpPReFPfVOPsN4v8KovmdUtba2SeqcfYbxf4VRfM6pa216HDfTc+p6hERbqCIiAiIgIiICIiAvio9ok/EP7F9r4qPaJPxD+xBvetH1povyeP8A2hY3qJqRbdOKSiq7lb6qrbWyuiaIC3dpDd9zzELJLR9aaL8nj/2hQ3xR/WWw/lkv7tefwunXV1q0ttLfVtNaTMOx65/F/c3dvjReknrn8X9zd2+NF6Srgi9r4dw/b3cXmNTusf65/F/c3dvjReknrn8X9zd2+NF6SrgifDuH7e55jU7rH+ufxf3N3b40XpJ65/F/c3dvjRekq4Inw7h+3ueY1O6x/rn8X9zd2+NF6Seufxf3N3b9MXpKuCJ8O4ft7nmNTusvBxNYU8gT2e8RA9pEcbtv/Ne9a9d9NLo4Rm+Po3HsFXA+MfG2Lf8AVVKRVt+GaM7ZhMcTeN17LddLbd6cVVruFPWQn+kgla9v6Qu0qLWi93ew1Ta2y3Koop2kHnhkLd/fHYR5irBaTa6OyKrhxrLhHHXy+DTVbBysnP3Lh9q73uh8y4OI/Dr6Uc1JzDo0+IrecT0TOiIvOdCH9CPb8r+F1++fyqYFD+hHt+V/C6/fP5VMCtbdEbCIiqlWr1QTNPoW4eK60xS8lRk1fTWxoB8LuYcZpD720PKfx/Oso4MsMGE8OeJUstM2KqulO67VG327p3FzHf8Aa7l+hVx9UTu9XmWqWnmj1qfzzPAl5AdwZ6uZsMbSPKBHuPM/zq91ltNHYbPQWO3x8lLbqaKkgb9zHGwNaP0ALa3y6UR36qR1tMu4QHAtcAQehB8aoTqXZbpwRcQVHqxiVLKdOcxnMF1oYgeSmc47yRgDs2O8kfvOb2bBX3WJ6pab49q1gt1wLJ4A+juUJa2QN3dBKOrJW+RzXbEKmnflnrtK1oy9+y3m2ZDaKO+2asjq6C4QMqaaeN27ZI3jdrgfeKp3xh6n5Hqpm1t4S9JJTNX3SZhyGpjJ5IY+ju4uI7Gtb/OSeblb4ztG2BcR+dcI+O5poLnVqqay82XnGJSuYTEXyO2G5PbDs7uzdu3ZzNxu1T7wUaC3HA8bq9V9QYpZ83zMmrnfVAmemp3u5w12/ZJITzu8Y8EdNiFrFPC+ef2UzzdE16R6XY7o7gNrwLGoQKegi/nZiPDqZz1klefGXO3Pm6DxLMHsZKx0cjGvY8FrmuG4IPaCF9IsJmZnMtGvvhDlk0n4xM90nqpeSC6d+QQjsEksEpmi2Hk7k+bZbBFr24onfSb42cM1TYRDR3J1DWVL2jlAja409QN/KYuYn8ZbCVrrdcW7wpTpmBUk47+I6taX8P2mk09Rda5o/l+eja6R8MJG4pmhgLuZw8J+w3Ddh2npOPFZxBUOgOnE1ypJIpMlu/PS2Wmfsf5zbwp3DxsjBBPlJaPGSI74HuH2vxG0VGtmorJKjMcua6oiNUC6alppTzF7ieollJ5neMNIHjcE04ikeJb9i05nlh43D/rXoFoNp1RYZaLHnM1WQKi51oxKrDquqIHM8+D7EexaPEAFJPr19If7Ezz/ACpWeip+RVm1bTmY9/8AiYiYQD69fSH+xM8/ypWeiqscUGd4ZkubWbXPQ+hy+05pa5mOrjPjtVTRVEbB4Mznuby8zQOVwPsmH+6FslXxLFFPE+CeNskcjSx7HjdrmnoQQe0KaalaTmI9yazKMeHXXSw6+aeUuV20sguUG1PdqEO3dTVIHUedjvZNPjB8xUorXrndrvnApxD0+f4xSzy6c5fIWVdHHuWMYXbyQeQSRkl8flaS3fq7a/livdqyWzUOQ2KuirLdcqdlVS1EZ3bLE9oc1w98FRqUiPmrtJWc9JeLqn9jHL/8BuHzd6qB6l1HtaNRZPuqq2j9DKj+Kt/qn9jHL/8AAbh83eqj+pfAfQ3n5Haa6g3/AO3Kr0+lb9kT6oXgVbOKXhbm1Hmh1W0rqTZNR7Hyz09RA/uX8odz6tY9w7JBts1/k8F2422smiyraaTmFpjO6uvC7xTQassl091CpxY9RbKHQ1tDMzuXfhZ0dJG09jht4TPF2jwVLOsTgzSjL3HsFlrP3TlE3E1wp02q8kOomnVaMd1FtBbPSV8LzCKws6tZI5vVrx9rJ4uw7jsi+m4t6ybTbL9HeIa3S4rqDSWappYpamExwXRxjIaRsOVj3ebwHdrSN+Va8kXnmp/4rnHSXL6l39jjNP8AHIfmzFdVUq9S86ac5qPJfYR/+sxXVVdf6kpp6YdW6XO32W21V4u1ZFSUVFC+oqJ5XcrIo2glznHxAAErWbqZrLa+J3XOgr8ugyGPSrG6lzKenttsmqpJ2t6lz2xg8sk2wG59gw7dTvvLnGRqxkmq+d27hP0jkdPVV1Qxt9mjceTmGzhC8jsjjA7pJ7wHaOtqNGdJsd0V0+tuBY4wOZSN7pV1JaA+rqXAd0mf5yRsB4mho7Ar1xoxzTvKJ+acIyoOMjRS10NPbbdjecU1LSxNhghjxOrayNjRs1oHL0AAXP69fSH+xM8/ypWeip+RZZp29/8Ai2JV7reMrRW5Uc9uuGN5xU0tVE6GeGXEqtzJI3AhzXAs2IIJBCqNp3rHaeGPXStumFQZE/SvJKhjKmmudtnpZIGu3I5RKBzPhJdsQfCZ0PXfbZ6sH1m0nx3WnT654HkUTQyrZz0tRy7vpalvWOVh8RB/SCQehV6ala9MdJVmsz1Zbarrbr5bKW82isiq6GthbPTzxO3ZJG4btcD5CCvm90DrpZq+2Mfyuq6WWAO322L2Fu/+qpTwaas5JpRndw4UdW5HU9TR1EjbFNKfBD+rjC0ntY9vhx/nHkV41S9JpbC0TzQ1++p53WLTXVPOdFss5aG9vLW08co5XTS0znNkYN/7pa8Dxgk+JbAlXziJ4TLVq7c6bULCb27E8/thbJS3SAEMncz2Al5eocPFINyB0IcOixqw8SmsekEUdh4ntJru6Gn2iGWY9B33STjxPlYz2B8ZI2P9wLS/9Weau/ZWPl6StQujfKS5V9nraKzXY2uvngfHTVogbN3tIRs2TubvBfsevKeh2Ue4rxPcP+ZxtfY9Wcd53f0NXVtpJQfIWTcrt/zLNI86wmZndYsxsb2bb8zbhCRt7/MsZrMbwtmJRKdH+Jckn12M3+TqH+KxXVHHuKvS7AL/AKgUPEjR3lmPUEtxkoqvE6SITRxtLntD2kkHlHT/APnap2uOq+l1oY6S6akYvSNaNyZrvTs/a9QTxF8UGhF70kzPBcc1Eob3fL3ZKygoqS1xyVZkmkic1o5o2lo6kdSVrSbTMdPZWcR92Z8I+uN9150s+ifKKKlp7vRVslDUmlaWxS8oBa8NJPKSD1G/iU2qrXqeGLZJjGi9c3JLDX2t9bd5ainZWQOhfJFytAeGuAOxIOx26q0qpqxEXmIWr1jqgbjj/wCGTMPxKb9+xRDwacOGiOpGg9pyrN9PLfdrtPWVsctVNJKHOaydzWghrwOgAHYpe44+nDJmG/3FN+/YsM4FM/wSwcOlmtl9zWw22sZXV7nU9XcoYZWg1DyCWucCNx1HRa1mY0undWcc3VInrNeGP8ENp/7s/wD9ies14Y/wQ2n/ALs//wBiz76a+lp7NSsV+Waf00+mtpd+EnFvlin9NZ81+8pxDx8B4ftGtL7w/IMBwG32e4yQup3VMLpHP7mSCW+G47A7D9CkJYr9NbS78JOLfLFP6ayanqKergjqqSeOaGZofHJG4Oa9p6ggjoQfKqTmespjH2ci198VP/HZpz/1LJ88etgi19cVJHr7NOev9JZPnj1toeqf8K32XV1K0rxbVe101oyqS7MgpJjPH/J1znonF223hGJzeYeZ2+3iUV3Tgh0kr4HRUuR57b3uaQJKfJ6lxB8u0hcD+hWERZRe1dpWmIlQjM+ETNtFaybNLFjdm1nx2A92qbVf4ZHXKGMdSYy13LJsPMT/AHCrFcMes2impuOPoNMbJQYvcKJodcMfZSx001Oewu2YAJGb9Ocfn2PRTaqg8U3DPfLVefXFcPpltWYWh5rLjRUQ279aOrpY2DoZNt+dm20jd+nN7LWL+L8t91ccvWFvkUKcL3EpYuITEDM5sdDlFqY1l3twPY49BNGD1MbiPfaeh8RM1rG1ZrOJWic9YU99U4+w3i/wqi+Z1S1trZJ6px9hvF/hVF8zqlrbXocN9NhqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfak7h20Zvet+p1rxe30kjrbBNHVXep5TyQUjXAuBP3TtuVo8p8yiZisZlMRluNtH1qovyeP8A2hQ3xR/WWw/lkv7tTZFEyCJkMY2bG0NaPMBsoT4o/rLYfyyX92uPgf7iv8+zXX+nKvCIi+leYIiICIiAiIgIiIC+4qiWklZVwuLZIHCRhHic07j9i+F9MhkqXtp4hu+VwjaPK4nYf6lP8i9tDI6Wip5Xndz4mOPvkBc64KFjo6GnjeNnNiY0++AFzr5Cd3sQh/Qj2/K/hdfvn8qmBQ/oR7flfwuv3z+VTAptuiNhERVSx256dYFesmoszu+G2asvtu5e9LlPRxvqIOU7t5ZCNxseo8niWRIiZBERB1am122tmjqKy3U08sPtb5YWucz3iRuF2kRAREQY7lmnOBZ4+jkzXDbNfH29xfSuuFHHOYSdt+XmB232H6FkSImRj2Tae4JmlVQ1uXYfZ7zUWx5fRyV1HHO6Bx2J5S4HbsCyFETIIiICIiDycnxPGM1tL7Dl2P2+826RzXupa6nbNGXDsdyuBG48q7Vos9qsFsprLY7bTUFBRxiKnpqaIRxRMHY1rW9AF3ETI454IKqCSlqoWTQzMMckcjQ5r2kbFpB6EEdNl4mI4DhOA0s9FhOJ2qxQVUndZ46ClZAJX/dO5QNz7699EyCIiAvAyvAcHzqBlNmeIWe+Rx+wFfRRz8n4pcCR+Ze+iZwPGxbDcSwe2/yPhuNW2yUPOZDT0FMyBhce1xDQNz5yvZRE3GPWrTzBLHkVbl1mw+z0V7uW/fdwgo42VE++2/NIBzHfYb9euyyFETOQREQEREGO3XTvA75kdFl95w6z1t7t23elwno431EGx3HK8jcbHs8iyJETIL8IBGxG4K/UQYdkWjekuWvdLk2mmMXKR3spKm1wveffcW7/AOqxR/CTw1vdznRnGgfI2m2H6AdlLiK0WtG0oxCMKDhh4ebY8SUejOJNcOu77ZHIf/IFZxZMPxLGmhuOYvaLUANgKKiig6f/AAaF66KJtM7yYgREUJdG9WOzZJaqmx5BaqW5W6rZ3OopaqFssUrd99nNcCD1AP5lgB4Y+Hlx3doth5PntMPoqTUUxaY2MIx9bFw7/gVw75Jh9FPWxcO/4FcO+SYfRUnIp57d0YhGPrYuHf8AArh3yTD6KkS12q22O201ns1BT0NDRRNgpqanjEcUMbRs1rWjoAB0AC7SKJmZ3MRAsdu+nOBX/I6HML3htnr75bOXvO4VFHHJUQcri5vI8jcbEkjyE9FkSKM4SIiICIiDHcf06wLFLxX5BjOG2a1XK6da2ro6KOKWo68x53NAJ69ff6rIkRM5FPfVOPsN4v8ACqL5nVLW2txnEhw/UHEXiNsxK4ZNU2Nltubbk2eCmbM55EMkfIQ4jYfzpO/mVePqXeM/hgu3yVF6a7NHWpSmJljekzOYa+kWwX6l3jP4YLt8lRemn1LvGfwwXb5Ki9NbeY0+6vh2a+kWwX6l3jP4YLt8lRemn1LvGfwwXb5Ki9NPMafc8OzX0i2C/Uu8Z/DBdvkqL00+pd4z+GC7fJUXpp5jT7nh2a+kWwf6l5i+431fu+3jH8lxemvUtvqY2mEDg67aiZRVgdrYWU8IP6WOKjzGn3PDs1yLt2u03W+V0dsslsq7hWTHljp6WF0sjz5mtBJW1DGeAThsx5zJarF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z';// Caminho para o logotipo (substitua pelo caminho correto)

    // Adiciona o logotipo no cabeçalho
    const addLogo = (callback: () => void) => {
        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
            doc.addImage(img, 'PNG', 120, 10, 80, 20); // Ajuste as coordenadas e o tamanho conforme necessário
            callback();
        };
        img.onerror = () => {
            console.error('Erro ao carregar o logotipo.');
            callback();
        };
    };

    if (content) {
        addLogo(() => {
            doc.html(content, {
                callback: (doc) => {
                    doc.save('feedback.pdf');
                },
                x: 10,
                y: 20, // Ajusta para deixar espaço para o cabeçalho
                html2canvas: {
                    scale: 0.3, // Reduz ainda mais o tamanho do conteúdo
                    width: 190 // Ajusta a largura para caber na página A4
                }
            });
        });
    }
  }
}

function hasGroup(groups: any, arg1: any) {
  throw new Error('Function not implemented.');
}

