import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SpeedDial, SpeedDialModule } from 'primeng/speeddial';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { string, boolean } from 'mathjs';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { InplaceModule } from 'primeng/inplace';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';


interface OrdemForm {
  data: FormControl,
  numero: FormControl,
  planoAnalise: FormControl,
  responsavel: FormControl,
  digitador: FormControl,
  classificacao: FormControl,
}

interface FileWithInfo {
  file: File;
  descricao: string;
}

export interface Ordem {
  id: number;
  numero: number;
  data: string;
  planoAnalise: any;
  responsavel: string;
  digitador: string;
  modificacoes: any;
  classificacao: any;
}

@Component({
  selector: 'app-ordem',
  imports: [
     ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,
    InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule, CdkDragPlaceholder,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule
  ],
  animations: [
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
  providers: [
    MessageService,ConfirmationService
  ],
  templateUrl: './ordem.component.html',
  styleUrl: './ordem.component.scss'
})
export class OrdemComponent implements OnInit {

  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  ordens: Ordem[]=[];
  analises: any[] = [];
  uploadedFilesWithInfo: FileWithInfo[] = [];

  // Propriedades para dados da amostra recebida
  amostraData: any = null;
  amostraRecebida: any = null;
  imagensExistentes: any[] = [];
  planosAnalise: any[] = [];
  digitador: string = '';

  isCreatingOrdem: boolean = false;
  isCreatingAnalise: boolean = false;
  registerOrdemForm!: FormGroup<OrdemForm>;

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
  
  router: any;
  constructor(
    private loginService: LoginService,
    private ordemService: OrdemService,
    private ensaioService: EnsaioService,
    private analiseService: AnaliseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private amostraService: AmostraService
  )
  {
    this.registerOrdemForm = new FormGroup<OrdemForm>({
      data: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      planoAnalise: new FormControl('', [Validators.required]),
      responsavel: new FormControl('', [Validators.required]),
      digitador: new FormControl('', [Validators.required]),
      classificacao: new FormControl('', [Validators.required]),
    });
  }
  

 ngOnInit() {
    //this.digitador = this.loginService.getLoggedUser()?.nome || 'Sistema';
    
    // Receber dados da amostra se houver
    this.receberDadosAmostra();
    setTimeout(() => {
      if (!this.amostraData) {
        console.log('Tentando novamente após delay...');
        this.receberDadosAmostra();
      }
    }, 100);


    // Carregar dados necessários
    this.loadOrdens();
    this.loadAnalises();
    this.loadPlanosAnalise();
    this.configurarFormularioInicial();
  }
  loadAnalises(): void {
    this.analiseService.getAnalises().subscribe(
      response => {
        this.analises = response;
        console.log("Resposta: ", this.analises);
      }, error => {
        console.log('Mensagem', error);
      }
    )
  }

  loadOrdens():void{
    this.ordemService.getOrdens().subscribe(
      response => {
        this.ordens = response;
        console.log("Resposta: ", this.ordens);
      }, error => {
        console.log('Mensagem', error);
      }
    )
  }

  filterTable() {
    console.log(this.dt1);//tem que apagar
    this.dt1.filterGlobal(this.inputValue,'contains');
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  } 

  receberDadosAmostra(): void {
    // Tentar receber via navigation state
    if (window.history.state && window.history.state.amostraData) {
      this.amostraData = window.history.state.amostraData;
      console.log('✅ Dados da amostra recebidos via history.state:', this.amostraData);
      
      // Carregar imagens existentes se houver
      if (this.amostraData.imagensExistentes && this.amostraData.imagensExistentes.length > 0) {
        console.log('📸 Imagens existentes encontradas:', this.amostraData.imagensExistentes);
        this.imagensExistentes = this.amostraData.imagensExistentes;
      }
      
      this.preencherFormularioComDadosAmostra();
      return;
    }

    // Tentar receber via sessionStorage como fallback
    const amostraDataSession = sessionStorage.getItem('amostraData');
    if (amostraDataSession) {
      try {
        this.amostraData = JSON.parse(amostraDataSession);
        console.log('✅ Dados da amostra recebidos via sessionStorage:', this.amostraData);
        this.preencherFormularioComDadosAmostra();
        // Limpar sessionStorage após uso
        sessionStorage.removeItem('amostraData');
        return;
      } catch (error) {
        console.error('❌ Erro ao processar dados do sessionStorage:', error);
      }
    }

    console.log('ℹ️ Nenhum dado da amostra foi recebido - criando ordem normal sem amostra pré-existente');
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


   configurarFormularioInicial(): void {
    // Buscar próximo número de ordem
    this.ordemService.getProximoNumero().subscribe({
      next: (numero) => {
        this.registerOrdemForm.patchValue({
          numero: numero,
          digitador: this.digitador,
          data: new Date(),
          classificacao: 'Controle de Qualidade'
        });
      },
      error: (error) => {
        console.error('Erro ao buscar próximo número:', error);
      }
    });
  }

  // Método para preencher formulário com dados da amostra
  preencherFormularioComDadosAmostra(): void {
    if (this.amostraData) {
      console.log('📝 Preenchendo formulário com dados da amostra recebida');
      
      // Buscar próximo número e preencher com dados da amostra
      this.ordemService.getProximoNumero().subscribe({
        next: (numero) => {
          this.registerOrdemForm.patchValue({
            numero: numero,
            data: new Date(),
            digitador: this.digitador,
            classificacao: this.amostraData.finalidade || 'Controle de Qualidade',
            // responsavel será selecionado pelo usuário
            // planoAnalise será selecionado pelo usuário
          });
          
          console.log('✅ Formulário preenchido com dados da amostra');
        }
      });
    }
  }

  // Método principal para criar ordem e vincular amostra
  criarOrdemComAmostra(): void {
   if (!this.amostraData) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Nenhum dado da amostra foi recebido' 
      });
      return;
    }

    // Validar se o formulário está válido
    if (!this.registerOrdemForm.valid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Preencha todos os campos obrigatórios' 
      });
      return;
    }

    // Validar estrutura dos dados
    // if (!this.validarDadosEnvio()) {
    //   this.messageService.add({ 
    //     severity: 'error', 
    //     summary: 'Erro', 
    //     detail: 'Dados inválidos nos ensaios ou cálculos selecionados' 
    //   });
    //   return;
    // }

    console.log('🚀 Iniciando criação da ordem - Fluxo: Ordem → Amostra → Análise');

    //Criar ordem expressa
    let dataFormatada = '';
    const dataValue = this.registerOrdemForm.value.data;
    if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
      dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
    }

    console.log('📝 Criando ordem expressa...');

    console.log('🚀 Iniciando criação de Ordem Normal');
    console.log('📋 Dados da ordem:', this.registerOrdemForm.value);
    console.log('📋 Dados da amostra recebida:', this.amostraData);

    // Criar a ordem de serviço normal
    this.ordemService.registerOrdem(
      dataFormatada,
      this.registerOrdemForm.value.numero,
      this.registerOrdemForm.value.planoAnalise,
      this.registerOrdemForm.value.responsavel,
      this.registerOrdemForm.value.digitador,
      this.registerOrdemForm.value.classificacao
    ).subscribe({
      next: (ordemSalva) => {
        console.log('✅ Ordem Normal criada:', ordemSalva);
        
        if (this.amostraData) {
          // Vincular amostra EXISTENTE à ordem recém-criada
          this.vincularAmostraExistenteAOrdem(ordemSalva.id);
        } else {
          this.finalizarComErro('Nenhuma amostra foi recebida para vincular à ordem');
        }
      },
      error: (err) => {
        this.isCreatingOrdem = false;
        console.error('❌ Erro ao criar ordem normal:', err);
        this.tratarErroOperacao(err, 'criar ordem de serviço normal');
      }
    });
  }

   private vincularAmostraExistenteAOrdem(ordemId: number): void {
  console.log('🔗 Vinculando amostra EXISTENTE à ordem:', ordemId);
  console.log('📋 Dados da amostra para vincular:', this.amostraData);

  // Verificar se temos o ID da amostra nos dados recebidos
  if (!this.amostraData.id) {
    console.error('❌ ID da amostra não encontrado nos dados recebidos');
    this.finalizarComErro('ID da amostra não encontrado para vincular à ordem');
    return;
  }

  // Atualizar amostra DIRETAMENTE com o ID que já temos
  const dadosAtualizacao = {
    ordem: ordemId
  };
  
  console.log('🔄 Atualizando amostra ID', this.amostraData.id, 'com ordem ID:', ordemId);
  
  this.amostraService.updateAmostra(this.amostraData.id, dadosAtualizacao).subscribe({
    next: (amostraAtualizada) => {
      console.log('✅ Amostra vinculada à ordem:', amostraAtualizada);
      this.amostraRecebida = amostraAtualizada;
      
      // Criar análise para a amostra vinculada
      this.criarAnaliseParaAmostra(amostraAtualizada.id);
    },
    error: (err) => {
      console.error('❌ Erro ao vincular amostra à ordem:', err);
      this.finalizarComErro('Erro ao vincular amostra à ordem');
    }
  });
}


   private buscarAmostraPorIdAlternativo(ordemId: number): void {
    console.log('🔍 Buscando amostra por método alternativo...');
    
    // Se você tiver o ID da amostra nos dados recebidos
    if (this.amostraData.id) {
      console.log('🆔 Usando ID da amostra dos dados recebidos:', this.amostraData.id);
      
      const dadosAtualizacao = {
        ordem: ordemId
      };
      
      this.amostraService.updateAmostra(this.amostraData.id, dadosAtualizacao).subscribe({
        next: (amostraAtualizada) => {
          console.log('✅ Amostra vinculada à ordem (método alternativo):', amostraAtualizada);
          this.amostraRecebida = amostraAtualizada;
          
          // Criar análise para a amostra vinculada
          this.criarAnaliseParaAmostra(amostraAtualizada.id);
        },
        error: (err) => {
          console.error('❌ Erro ao vincular amostra (método alternativo):', err);
          this.finalizarComErro('Erro ao vincular amostra à ordem');
        }
      });
    } else {
      // Buscar todas as amostras e filtrar
      this.amostraService.getAmostras().subscribe({
        next: (amostras) => {
          const amostraEncontrada = amostras.find((a: { numero: any; }) => a.numero === this.amostraData.numero);
          
          if (amostraEncontrada) {
            console.log('📋 Amostra encontrada por busca geral:', amostraEncontrada);
            
            const dadosAtualizacao = {
              ordem: ordemId
            };
            
            this.amostraService.updateAmostra(amostraEncontrada.id, dadosAtualizacao).subscribe({
              next: (amostraAtualizada) => {
                console.log('✅ Amostra vinculada à ordem:', amostraAtualizada);
                this.amostraRecebida = amostraAtualizada;
                
                // Criar análise para a amostra vinculada
                this.criarAnaliseParaAmostra(amostraAtualizada.id);
              },
              error: (err) => {
                console.error('❌ Erro ao vincular amostra:', err);
                this.finalizarComErro('Erro ao vincular amostra à ordem');
              }
            });
          } else {
            console.error('❌ Amostra não encontrada na lista geral');
            this.finalizarComErro('Amostra não encontrada para vincular à ordem');
          }
        },
        error: (err) => {
          console.error('❌ Erro ao buscar lista de amostras:', err);
          this.finalizarComErro('Erro ao buscar amostra para vincular à ordem');
        }
      });
    }
  }


  private criarAnaliseParaAmostra(amostraId: number): void {
    console.log('📊 Criando análise para amostra:', amostraId);
    
    this.isCreatingAnalise = true;

    this.analiseService.registerAnalise(amostraId, 'PENDENTE').subscribe({
      next: (analiseCriada) => {
        console.log('✅ Análise criada:', analiseCriada);
        
        // Navegar para a página de análise
        this.navegarParaAnalise(analiseCriada.id);
      },
      error: (err) => {
        console.error('❌ Erro ao criar análise:', err);
        this.finalizarComErro('Ordem criada e amostra vinculada, mas erro ao criar análise');
      }
    });
  }

  // Método para navegar para a análise
  private navegarParaAnalise(analiseId: number): void {
    console.log('🔄 Navegando para análise:', analiseId);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Ordem Normal criada, amostra vinculada e análise criada! Redirecionando...`
    });
    
    // Redirecionar para a página de análise após delay
    setTimeout(() => {
      this.router.navigate(['/welcome/controleQualidade/analise'], {
        queryParams: { id: analiseId }
      });
    }, 2000);
    
    this.finalizarProcesso();
  }

  // Método para finalizar com sucesso (sem análise)
  private finalizarComSucesso(ordemId: number, amostraId: number | null): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ordem de Serviço criada e amostra vinculada com sucesso!'
    });
    
    this.finalizarProcesso();
  }

  // Método para finalizar com erro
  private finalizarComErro(mensagem: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem
    });
    
    this.finalizarProcesso();
  }

  // Método para finalizar processo
  private finalizarProcesso(): void {
    this.isCreatingOrdem = false;
    this.isCreatingAnalise = false;
    
    // Limpar dados da amostra
    this.amostraData = null;
    this.amostraRecebida = null;
    this.imagensExistentes = [];
    
    // Resetar formulário
    this.registerOrdemForm.reset();
    this.configurarFormularioInicial();
  }

  // Método auxiliar para formatar datas
  private formatarData(data: any): string | null {
    if (!data) return null;
    
    if (data instanceof Date && !isNaN(data.getTime())) {
      return formatDate(data, 'yyyy-MM-dd', 'en-US');
    }
    
    if (typeof data === 'string') {
      return data;
    }
    
    return null;
  }

  // Método para tratar erros
  private tratarErroOperacao(err: any, operacao: string): void {
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
        detail: `Erro interno ao ${operacao}. Contate o administrador.` 
      });
    }
  }





}
