import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule, IconField } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule, InputIcon } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Ensaio } from '../ensaio/ensaio.component';
import { C } from '@angular/cdk/focus-monitor.d-CvvJeQRc';
import { CalculoEnsaio } from '../calculo-ensaio/calculo-ensaio.component';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { PickListModule } from 'primeng/picklist';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';

interface ExpressaForm {
  data: FormControl,
  numero: FormControl,
  //ensaios: FormControl,
  //calculos_ensaio: FormControl,
  responsavel: FormControl,
  digitador: FormControl,
  classificacao: FormControl,
} 
interface FileWithInfo {
  file: File;
  descricao: string;
}

interface AmostraExpressaForm {
  numero: FormControl,
  material: FormControl,
  tipoAmostra: FormControl,
  dataColeta: FormControl,
  localColeta: FormControl,
  status: FormControl,
  observacoes: FormControl,
  prioridade: FormControl
}

export interface Expressa {
  id: number;
  numero: number;
  data: string;
  ensaios: any;
  calculos_ensaio: any;
  responsavel: string;
  digitador: string;
  modificacoes: any;
  classificacao: any;
}

@Component({
  selector: 'app-expressa',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,PickListModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,IconField,
    InputNumberModule,AutoCompleteModule,MultiSelectModule,DatePickerModule,StepperModule,
    InputIcon,FieldsetModule,MenuModule,SplitButtonModule,DrawerModule,SpeedDialModule, InplaceModule
  ],
  providers:[
    MessageService,ConfirmationService,DatePipe
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
  templateUrl: './expressa.component.html',
  styleUrl: './expressa.component.scss'

})

export class ExpressaComponent implements OnInit, OnDestroy {
  ensaios: any[] = [];
  targetEnsaios!: Ensaio[];
  calculos: any[] = [];
  targetCalculos!: CalculoEnsaio[];
  uploadedFilesWithInfo: FileWithInfo[] = [];
  // Propriedade para armazenar os dados da amostra recebidos
  amostraData: any = null;
  amostraId: any;

  amostraExpressaForm?: FormGroup<AmostraExpressaForm>;
  expressaForm!: FormGroup<ExpressaForm>;

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

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ensaioService: EnsaioService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private loginService: LoginService,
    private amostraService: AmostraService,
    private ordemService: OrdemService,
    private analiseService: AnaliseService,
    private route: ActivatedRoute
    
  ){
    this.expressaForm = new FormGroup<ExpressaForm>({
      data: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      responsavel: new FormControl('', [Validators.required]),
      digitador: new FormControl('', [Validators.required]),
      classificacao: new FormControl('', [Validators.required]),
    })
  }

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }


  ngOnInit(): void {
    this.receberDadosAmostra();
    // Tenta novamente após delay para garantir que a navegação foi processada
    setTimeout(() => {
      if (!this.amostraData) {
        console.log('Tentando novamente após delay...');
        this.receberDadosAmostra();
      }
    }, 100);
    
    this.ordemService.getProximoNumeroExpressa().subscribe(numero => {
      this.expressaForm.get('numero')?.setValue(numero);
    })

    this.targetEnsaios = [];
    this.targetCalculos = [];
    this.loadEnsaios();
    this.loadCalculos();
  }

  receberDadosAmostra(): void {
  // history.state (funciona após a navegação)
  console.log('Window history state:', window.history.state);
  if (window.history.state && window.history.state.amostraData) {
    this.amostraData = window.history.state.amostraData;
    console.log('✅ Dados da amostra recebidos via history.state:', this.amostraData);
    
    // Extrair as imagens dos dados recebidos
    if (this.amostraData.imagens && this.amostraData.imagens.length > 0) {
      console.log('📸 Extraindo imagens dos dados recebidos:', this.amostraData.imagens);
      this.uploadedFilesWithInfo = this.amostraData.imagens.map((imagem: any) => ({
        file: imagem.file,
        descricao: imagem.descricao || ''
      }));
      console.log('📸 Imagens carregadas no uploadedFilesWithInfo:', this.uploadedFilesWithInfo);
    }
    
    this.preencherFormularioComDadosAmostra();
    return;
  }
  console.log('Nenhum dado da amostra foi recebido');
}

  loadEnsaios(): void {
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }

  loadCalculos(): void{
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.calculos = response;
      }, error =>{
        console.error('Erro ao carregar os cálculos de ensaio:', error);
      }
    )
  }

  ngOnDestroy(): void {
    // Cleanup 
  }

  // Método para preencher o formulário expressa com dados da amostra
  preencherFormularioComDadosAmostra(): void {
    if (this.amostraData) {
      console.log('Preenchendo formulário com dados da amostra');
      
      // Preencher campos do formulário com valores padrão ou da amostra
      this.expressaForm.patchValue({
        data: new Date(), // Data atual
        numero: this.amostraData.numero ? `${this.amostraData.numero}-EXP` : '', // Número da amostra + sufixo
        classificacao: this.amostraData.classificacaoInfo?.nome || 'Controle de Qualidade',
        responsavel: this.amostraData.responsavelInfo?.value || 'Antonio Carlos Vargas Sito',
        digitador: this.amostraData.digitador || 'Sistema'
      });
      
      console.log('Formulário preenchido:', this.expressaForm.value);
    }
  }

  // caso necessário para editar
  criarFormularioAmostraExpressa(): void {
    this.amostraExpressaForm = new FormGroup<AmostraExpressaForm>({
      numero: new FormControl(this.amostraData?.numero || ''),
      material: new FormControl(this.amostraData?.materialInfo?.nome || ''),
      tipoAmostra: new FormControl(this.amostraData?.tipoAmostraInfo?.nome || ''),
      dataColeta: new FormControl(this.amostraData?.dataColeta || ''),
      localColeta: new FormControl(this.amostraData?.localColetaInfo?.nome || ''),
      status: new FormControl(this.amostraData?.statusInfo?.nome || ''),
      observacoes: new FormControl(''),
      prioridade: new FormControl('ALTA')
    });

    console.log('Formulário de amostra expressa criado:', this.amostraExpressaForm.value);
  }

  uploadImages(): void {
    if (!this.amostraId || this.uploadedFilesWithInfo.length === 0) {
      console.log('Sem amostra ID ou arquivos para upload');
      return;
    }

    // Verificar estado dos arquivos antes do upload
    this.verificarEstadoArquivos();

    const formData = new FormData();
    
    // Adicionar arquivos com suas descrições
    this.uploadedFilesWithInfo.forEach((fileInfo, index) => {
      formData.append('images', fileInfo.file, fileInfo.file.name);
      // Garantir que a descrição não seja undefined ou null
      const descricao = fileInfo.descricao || '';
      formData.append(`descricao_${index}`, descricao);
      
      // Debug: verificar o que está sendo enviado
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
       
      },
      error: (error) => {
        console.error('Erro ao enviar imagens:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar imagens. A amostra foi salva, mas as imagens não foram anexadas.'
        });
       
      }
    });
  }

  criarAmostra(): void {
    if (!this.amostraData) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Nenhum dado da amostra foi recebido' 
      });
      return;
    }

    // Validar se o formulário está válido
    if (!this.expressaForm.valid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Preencha todos os campos obrigatórios' 
      });
      return;
    }

    // Validar se pelo menos um ensaio ou cálculo foi selecionado
    if (this.targetEnsaios.length === 0 && this.targetCalculos.length === 0) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Atenção', 
        detail: 'Selecione pelo menos um ensaio ou cálculo para a análise expressa' 
      });
      return;
    }

    // Validar estrutura dos dados
    if (!this.validarDadosEnvio()) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Dados inválidos nos ensaios ou cálculos selecionados' 
      });
      return;
    }

    console.log('🚀 Iniciando criação da amostra expressa - Fluxo: Ordem → Amostra → Análise');

    //Criar ordem expressa
    let dataFormatada = '';
    const dataValue = this.expressaForm.value.data;
    if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
      dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
    }

    console.log('📝 Criando ordem expressa...');
    
    // Preparar os IDs dos ensaios e cálculos selecionados
    const ensaiosSelecionados = this.targetEnsaios
      .map(ensaio => ensaio.id)
      .filter(id => id != null && !isNaN(Number(id)))
      .map(id => Number(id));
      
    const calculosSelecionados = this.targetCalculos
      .map(calculo => calculo.id)
      .filter(id => id != null && !isNaN(Number(id)))
      .map(id => Number(id));
    
    console.log('🔢 IDs dos ensaios selecionados (números):', ensaiosSelecionados);
    console.log('🔢 IDs dos cálculos selecionados (números):', calculosSelecionados);
    
    // Verificação adicional
    if (ensaiosSelecionados.length !== this.targetEnsaios.length) {
      console.warn('⚠️ Alguns ensaios têm IDs inválidos!');
    }
    if (calculosSelecionados.length !== this.targetCalculos.length) {
      console.warn('⚠️ Alguns cálculos têm IDs inválidos!');
    }
    
    this.ordemService.registerExpressa(
      dataFormatada,
      this.expressaForm.value.numero,
      ensaiosSelecionados,
      calculosSelecionados,
      this.expressaForm.value.responsavel,
      this.expressaForm.value.digitador,
      this.expressaForm.value.classificacao
    ).subscribe({
      next: (ordemSalva) => {
        console.log('✅ Ordem expressa criada:', ordemSalva);
        const idOrdem = ordemSalva.id;
        
        // Criar amostra vinculada à ordem
        this.criarAmostraVinculada(idOrdem);
      },
      error: (error) => {
        console.error('❌ Erro ao criar ordem expressa:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Erro ao criar ordem expressa: ' + (error.error?.detail || error.message)
        });
      }
    });
  }

  // Método auxiliar para criar amostra vinculada à ordem
  private criarAmostraVinculada(idOrdem: string | number): void {
    console.log('📝 Criando amostra vinculada à ordem:', idOrdem);

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

    // Criar amostra vinculada à ordem
    this.amostraService.registerAmostra(
      this.amostraData.especieInfo?.id || this.amostraData.especie,
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
      this.amostraData.materialInfo?.id || this.amostraData.material,
      this.amostraData.numero,
      this.amostraData.tipoAmostraInfo?.id || this.amostraData.tipoAmostra,
      this.amostraData.subtipo,
      this.amostraData.produtoAmostraInfo?.id || this.amostraData.produtoAmostra,
      this.amostraData.periodoHora,
      this.amostraData.periodoTurno,
      this.amostraData.tipoAmostragem,
      this.amostraData.localColetaInfo?.nome || this.amostraData.localColeta,
      this.amostraData.fornecedorInfo?.nome || this.amostraData.fornecedor,
      this.amostraData.representatividadeLote,
      this.amostraData.identificacaoComplementar,
      this.amostraData.complemento,
      this.amostraData.observacoes,
      null,
      idOrdem, // Vincular à ordem criada
      this.expressaForm.value.digitador,
      this.amostraData.statusInfo?.nome || this.amostraData.status
    ).subscribe({
      next: (amostraCriada) => {
      console.log('✅ Amostra criada:', amostraCriada);

      // Define o ID da amostra criada ANTES do upload
      this.amostraId = amostraCriada.id;
      console.log('🆔 ID da amostra definido:', this.amostraId);

        // Faz upload das imagens se houver arquivos selecionados
      if (this.uploadedFilesWithInfo.length > 0) {
        console.log('📸 Iniciando upload de', this.uploadedFilesWithInfo.length, 'imagens');
        this.uploadImages();
      } else {
        console.log('📸 Nenhuma imagem para enviar');
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
    console.log('📝 Criando análise vinculada à amostra:', idAmostra);

    this.analiseService.registerAnalise(idAmostra, 'PENDENTE').subscribe({
      next: (analiseCriada) => {
        console.log('✅ Análise criada:', analiseCriada);
        
        // Opcional: Associar ensaios e cálculos à análise se necessário
        if (this.targetEnsaios.length > 0 || this.targetCalculos.length > 0) {
          this.associarEnsaiosECalculos(analiseCriada.id);
        }
        
        // Sucesso final
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: 'Amostra expressa criada com sucesso! (Ordem → Amostra → Análise)'
        });
        
        // redirecionar
        // this.router.navigate(['/welcome/controleQualidade/amostra']);
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

  // Método auxiliar para associar ensaios e cálculos à análise (se necessário)
  private associarEnsaiosECalculos(idAnalise: number): void {
    console.log('📝 Associando ensaios e cálculos à análise:', idAnalise);
    
    // Preparar dados dos ensaios e cálculos selecionados para a análise
    const ensaiosParaAnalise = this.targetEnsaios.map(ensaio => ({
      id: ensaio.id,
      descricao: ensaio.descricao,
      valor: null, // Será preenchido durante a análise
      responsavel: ensaio.responsavel,
      digitador: this.expressaForm.value.digitador,
      tempo_previsto: ensaio.tempo_previsto,
      tipo: ensaio.tipo_ensaio_detalhes?.nome || ensaio.tipoEnsaio
    }));
    
    const calculosParaAnalise = this.targetCalculos.map(calculo => ({
      id: calculo.id,
      descricao: calculo.descricao,
      funcao: calculo.funcao,
      resultado: null, // Será calculado durante a análise
      responsavel: calculo.responsavel,
      digitador: this.expressaForm.value.digitador,
      ensaios_utilizados: calculo.ensaios_detalhes || []
    }));
    
    const payload = {
      estado: 'PENDENTE',
      ensaios: ensaiosParaAnalise,
      calculos: calculosParaAnalise
    };
    
    console.log('Payload completo para associar à análise:', payload);
    
   
    // this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    //   next: () => {
    //     console.log('✅ Ensaios e cálculos associados à análise com sucesso');
    //   },
    //   error: (error) => {
    //     console.error('❌ Erro ao associar ensaios/cálculos à análise:', error);
    //   }
    // });
    
    // Por enquanto, apenas logamos os dados preparados
    console.log('✅ Ensaios e cálculos preparados para associação à análise');
    console.log(`📊 Total de ensaios: ${ensaiosParaAnalise.length}`);
    console.log(`🧮 Total de cálculos: ${calculosParaAnalise.length}`);
  }

  // debug para pick lists
  debugPickLists(): void {
    console.log('=== DEBUG PICK LISTS ===');
    console.log('📋 Ensaios Disponíveis:', this.ensaios.length);
    console.log('✅ Ensaios Selecionados:', this.targetEnsaios.length);
    console.log('📋 Cálculos Disponíveis:', this.calculos.length);
    console.log('✅ Cálculos Selecionados:', this.targetCalculos.length);
    
    if (this.targetEnsaios.length > 0) {
      console.log('🔬 Ensaios Selecionados Detalhados:');
      this.targetEnsaios.forEach((ensaio, index) => {
        console.log(`  ${index + 1}. ${ensaio.descricao} (ID: ${ensaio.id})`);
      });
      
      // Mostrar array de IDs que será enviado
      const ensaiosIds = this.targetEnsaios.map(ensaio => ensaio.id);
      console.log('📤 Array de IDs dos ensaios que será enviado:', ensaiosIds);
    }
    
    if (this.targetCalculos.length > 0) {
      console.log('🧮 Cálculos Selecionados Detalhados:');
      this.targetCalculos.forEach((calculo, index) => {
        console.log(`  ${index + 1}. ${calculo.descricao} (ID: ${calculo.id})`);
      });
      
      // Mostrar array de IDs que será enviado
      const calculosIds = this.targetCalculos.map(calculo => calculo.id);
      console.log('📤 Array de IDs dos cálculos que será enviado:', calculosIds);
    }
    
    // Verificar tipos de dados
    if (this.targetEnsaios.length > 0) {
      console.log('🔍 Tipo do primeiro ID de ensaio:', typeof this.targetEnsaios[0].id, this.targetEnsaios[0].id);
    }
    if (this.targetCalculos.length > 0) {
      console.log('🔍 Tipo do primeiro ID de cálculo:', typeof this.targetCalculos[0].id, this.targetCalculos[0].id);
    }
    
    console.log('========================');
  }

  // Método para validar estrutura dos dados antes do envio
  validarDadosEnvio(): boolean {
    console.log('🔍 Validando estrutura dos dados...');
    
    // Verificar se existem dados selecionados
    if (this.targetEnsaios.length === 0 && this.targetCalculos.length === 0) {
      console.error('❌ Nenhum ensaio ou cálculo selecionado');
      return false;
    }
    
    // Verificar estrutura dos ensaios
    if (this.targetEnsaios.length > 0) {
      console.log('📊 Verificando estrutura dos ensaios...');
      const primeiroEnsaio = this.targetEnsaios[0];
      console.log('🔬 Primeiro ensaio:', primeiroEnsaio);
      console.log('🆔 ID do primeiro ensaio:', primeiroEnsaio.id, typeof primeiroEnsaio.id);
      
      const idsInvalidos = this.targetEnsaios.filter(ensaio => 
        ensaio.id == null || isNaN(Number(ensaio.id))
      );
      
      if (idsInvalidos.length > 0) {
        console.error('❌ Ensaios com IDs inválidos:', idsInvalidos);
        return false;
      }
    }
    
    // Verificar estrutura dos cálculos
    if (this.targetCalculos.length > 0) {
      console.log('🧮 Verificando estrutura dos cálculos...');
      const primeiroCalculo = this.targetCalculos[0];
      console.log('📊 Primeiro cálculo:', primeiroCalculo);
      console.log('🆔 ID do primeiro cálculo:', primeiroCalculo.id, typeof primeiroCalculo.id);
      
      const idsInvalidos = this.targetCalculos.filter(calculo => 
        calculo.id == null || isNaN(Number(calculo.id))
      );
      
      if (idsInvalidos.length > 0) {
        console.error('❌ Cálculos com IDs inválidos:', idsInvalidos);
        return false;
      }
    }
    
    console.log('✅ Estrutura dos dados válida');
    return true;
  }

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
