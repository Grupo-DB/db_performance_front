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
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { Amostra } from '../amostra/amostra.component';


import jsPDF from 'jspdf';
import autoTable, { CellInput } from "jspdf-autotable";


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
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule, TagModule, CheckboxModule
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

  produtosFiltrados: any[] = [];
  materiaisFiltro: any[] = [];
  amostras: Amostra[] = [];

  ordens: Ordem[]=[];
  analises: any[] = [];
  uploadedFilesWithInfo: FileWithInfo[] = [];

  // Propriedades para dados da amostra recebida
  amostraData: any = null;
  amostraRecebida: any = null;
  imagensExistentes: any[] = [];
  planosAnalise: any[] = [];
  digitador: string = '';

  // Propriedades para ordem expressa
  isOrdemExpressa: boolean = false;
  ensaiosDisponiveis: any[] = [];
  calculosDisponiveis: any[] = [];
  ensaiosSelecionados: any[] = [];
  calculosSelecionados: any[] = [];
  modalEnsaiosVisible: boolean = false;
  modalCalculosVisible: boolean = false;

  teste: any[] = [];




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

  materiais: any[] = [
    { value: 'Aditivos' },
    { value: 'Acabamento' },
    { value: 'Areia' },
    { value: 'Argamassa' },
    { value: 'Cal' },
    { value: 'Calcario' },
    { value: 'Cimento' },
    { value: 'Cinza Pozolana' },
    { value: 'Fertilizante' },
    { value: 'Finaliza' },
    { value: 'Mineracao' },
    { value: 'Areia' },
  ]

  finalidades = [
    { id: 0, nome: 'Controle de Qualidade' },
    { id: 1, nome: 'SAC' },
    { id: 2, nome: 'Desenvolvimento de Produtos' },
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
    this.carregarEnsaiosECalculosDisponiveis();
    this.configurarFormularioInicial();
    // this.loadAmostras();
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

  /**
   * Carrega ensaios e cálculos disponíveis para ordem expressa
   */
  carregarEnsaiosECalculosDisponiveis() {
    // Carregar ensaios
    this.ensaioService.getEnsaios().subscribe({
      next: (ensaios) => {
        this.ensaiosDisponiveis = ensaios.map((ensaio: any) => ({
          ...ensaio,
          selecionado: false
        }));
        console.log('Ensaios carregados:', this.ensaiosDisponiveis);
      },
      error: (error) => {
        console.error('Erro ao carregar ensaios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de ensaios'
        });
      }
    });

    // Carregar cálculos
    this.ensaioService.getCalculoEnsaio().subscribe({
      next: (calculos: any) => {
        this.calculosDisponiveis = calculos.map((calculo: any) => ({
          ...calculo,
          selecionado: false
        }));
        console.log('Cálculos carregados:', this.calculosDisponiveis);
      },
      error: (error: any) => {
        console.error('Erro ao carregar cálculos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de cálculos'
        });
      }
    });
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






onMaterialChange(materialNome: string) {
  console.log('Material selecionado:', materialNome);
  
  if (materialNome) {
    // Normaliza o nome e atualiza o formulário
    const materialNormalizado = this.normalize(materialNome);
    console.log('Material normalizado:', materialNormalizado);
    
    // Atualiza o valor no formulário com a versão normalizada
    // this.registerOrdemForm.get('material')?.setValue(materialNormalizado, { emitEvent: false });
    
    // Usa a versão normalizada para todas as operações
    this.amostraService.getProximoSequencialPorNome(materialNormalizado).subscribe({
      next: (sequencial) => {
        console.log('Sequencial recebido do backend:', sequencial);
        const numero = this.gerarNumero(materialNormalizado, sequencial);
        this.registerOrdemForm.get('numero')?.setValue(numero);
        console.log('Número da amostra gerado:', numero);
        this.loadProdutosPorMaterial(materialNormalizado);
      },
      error: (err) => {
        console.error('Erro ao buscar sequencial:', err);
        const sequencialFallback = this.gerarSequencialFallback(materialNormalizado);
        const numero = this.gerarNumero(materialNormalizado, sequencialFallback);
        this.registerOrdemForm.get('numero')?.setValue(numero);
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
  // Você pode usar timestamp + hash do nome do material
  const timestamp = Date.now();
  const hash = materialNome.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Combina timestamp com hash para gerar um número único
  return Math.abs((timestamp + hash) % 999999) + 1;
}

loadProdutosPorMaterial(materialNome: string): void {
  if (!materialNome) {
    this.produtosFiltrados = [];
    return;
  }

  this.amostraService.getProdutosPorMaterial(materialNome).subscribe({
    next: (response) => {
      this.produtosFiltrados = response;
      console.log('Produtos filtrados por material:', this.produtosFiltrados);
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

gerarNumero(materialNome: string, sequencial: number): string {
  //const ano = new Date().getFullYear().toString().slice(-2); // 
  const sequencialFormatado = sequencial.toString().padStart(6, '0'); // Ex: '000008'
  // Formata como 08.392 
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' 
  return `${materialNome} ${parte1}.${parte2}`;
}

private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}



  analisesFiltradas: any[] = []; // array para exibir na tabela
  materiaisSelecionados: string[] = []; // valores escolhidos no multiselect
  loadAnalises(): void {
    this.analiseService.getAnalises().subscribe(
      (response: any[]) => {
        // Mapeia e cria campos "planos" para facilitar o filtro global
        this.analises = response.map((analise: any) => ({
          ...analise,
          material: analise.amostra_detalhes?.material ?? '',
          fornecedor: analise.amostra_detalhes?.fornecedor ?? '',
          numero: analise.amostra_detalhes?.numero ?? '',
          status: analise.amostra_detalhes?.status ?? '',
          responsavel: analise.amostra_detalhes?.expressa_detalhes?.responsavel ?? '',
          data_entrada: analise.amostra_detalhes?.data_entrada ?? '',
          data_coleta: analise.amostra_detalhes?.data_coleta ?? ''
        }));

        // Inicializa a lista filtrada
        this.analisesFiltradas = [...this.analises];

        // Cria opções únicas para o MultiSelect
        this.materiaisFiltro = this.analises
          .map((analise) => ({
            label: analise.material,
            value: analise.material
          }))
          .filter(
            (item, index, self) =>
              index === self.findIndex((opt) => opt.value === item.value)
          );
      },
      (error) => {
        console.error('Erro ao carregar análises', error);
      }
    );
  }

  // Filtro Global
  filterTable(): void {
    if (this.dt1) {
      this.dt1.filterGlobal(this.inputValue, 'contains');
    }
  }

  // Filtro pelo MultiSelect
  filtrarPorMateriais(): void {
    if (this.materiaisSelecionados.length === 0) {
      this.analisesFiltradas = [...this.analises];
    } else {
      this.analisesFiltradas = this.analises.filter((analise) =>
        this.materiaisSelecionados.includes(analise.material)
      );
    }
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



  imprimirCalculoPDF(analise: any) {

  console.log("Aquiddd");
  console.log(analise);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let contadorLinhas = 45;
  autoTable(doc, {
    startY: 10,
    body: [
      [
        { content: "Ordem de Serviço", styles: { halign: "left", fontStyle: "bold" } },
        { content: analise.numero, styles: { halign: "left", fontStyle: "bold" } },
        { content: "Data de Entrada: "+analise.data_entrada, styles: { halign: "left" } },
      ],
      [
        { content: "Material da Amostra: "+analise.material, colSpan: 2, styles: { halign: "left" } },
        { content: "Data de Amostra: "+analise.data_coleta, styles: { halign: "left" } }
      ],
      [
        { content: "Tipo: "+analise?.tipo_amostragem, styles: { halign: "left" } },
        { content: "Sub-tipo: "+analise?.subtipo, styles: { halign: "left" } },
        { content: "Data de Conclusão: ", styles: { halign: "left" } }
      ],
      [
        { content: "Local da Coleta: "+analise.local_coleta, colSpan: 2, styles: { halign: "left" } },
        { content: "Data de Descarte: ", styles: { halign: "left", fontStyle: "bold" } }
      ]
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2
    }
  });

  if(analise.expressa_detalhes){
    
    analise.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
      // monta a linha de forma dinâmica
      const body: any[] = [];
      const linha: any[] = [];
      const linhaVazia: any[] = [];

      // primeira célula: descrição
      linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center",  } });
      linha.push({ content: 'Técnico', styles: { halign: "center" } });

      linhaVazia.push({ content: '', styles: { halign: "center" } });
      linhaVazia.push({ content: '', styles: { halign: "center" } });

      // adiciona cada variável como coluna
      ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
        linha.push({ content: variavel_detalhes.nome, styles: { halign: "center",  } });
        linhaVazia.push({ content: '', styles: { halign: "center" } });
      });

      // última célula: descrição novamente (ou resultado final)
      linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center", fontStyle: "bold" } });
      linhaVazia.push({ content: '', styles: { halign: "center" } });

      // adiciona a linha no body
      body.push(linha);
      body.push(linhaVazia);
      // gera a tabela
      autoTable(doc, {
        startY: contadorLinhas,
        body,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 }
      });
      contadorLinhas+=20;
    });

  }else{
    
    analise.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {
            
      //aqui é o ennsaio_detalhes
      plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
        const body: any[] = [];
        const linha: any[] = [];
        const linhaVazia: any[] = [];
        
        linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center",  } });
        linha.push({ content: 'Técnico', styles: { halign: "center" } });

        linhaVazia.push({ content: '', styles: { halign: "center" } });
        linhaVazia.push({ content: '', styles: { halign: "center" } });

          ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
            console.log('2')
            console.log(variavel_detalhes)
            linha.push({ content: variavel_detalhes.nome, styles: { halign: "center",  } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
          });    

        linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center",  } });
        linhaVazia.push({ content: '', styles: { halign: "center" } });
        
        body.push(linha);
        body.push(linhaVazia);

        autoTable(doc, {
          startY: contadorLinhas,
          body,
          theme: "grid",
          styles: { fontSize: 8, cellPadding: 2 }
        });

        contadorLinhas+=20;
      });

        
      plano_detalhes.calculo_ensaio_detalhes.forEach((calculo_ensaio_detalhes: any) => {
        calculo_ensaio_detalhes.ensaios_detalhes.forEach((ensaio_detalhes: any) => {
          const body: any[] = [];
          const linha: any[] = [];
          const linhaVazia: any[] = [];

          linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center",  } });
          linha.push({ content: 'Técnico', styles: { halign: "center" } });

          linhaVazia.push({ content: '', styles: { halign: "center" } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });

          ensaio_detalhes.variavel_detalhes.forEach((variavel_detalhes: any) => {
            linha.push({ content: variavel_detalhes.nome, styles: { halign: "center",  } });
            linhaVazia.push({ content: '', styles: { halign: "center" } });
          });

          linha.push({ content: ensaio_detalhes.descricao, styles: { halign: "center",  } });
          linhaVazia.push({ content: '', styles: { halign: "center" } });

          body.push(linha);
          body.push(linhaVazia);
      
          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });

          contadorLinhas+=20;
        });
        
      });
    });
  }

  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
  //   // doc.save("Etiqueta.pdf");
  }

  getMenuItems(analise: any) {
    const menuItems = [
      { label: 'IMPRIMIR', icon: 'pi pi-print', command: () => this.imprimirCalculoPDF(analise) },
      { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editarAnalise(analise) },
      { label: 'Excluir', icon: 'pi pi-trash', command: () => this.excluirAnalise(analise) },
      { label: 'Imagens', icon: 'pi pi-image', command: () => this.visualizarImagens(analise) },
    ];

    // Debug: verificar o valor da propriedade
    //console.log('analise completa:', analise);
    //console.log('analise.finalizada:', analise.finalizada, typeof analise.finalizada);

    // Verificar se a análise está finalizada (aceitar boolean true ou number 1 ou string '1')
    // if (analise && (
    //     analise.finalizada === true || 
    //     analise.finalizada === 1 || 
    //     analise.finalizada === '1'
    // )) {
    //   menuItems.push({
    //     label: 'Encaminhar para Laudo',
    //     icon: 'pi pi-book',
    //     command: () => this.laudoAnalise(analise)
    //   });
    // }

    return menuItems;
}

getStatusIcon(status: boolean): string {
  return status ? 'pi-check-circle' : 'pi-times-circle';
}

getStatusColor(status: boolean): string {
  return status ? '#22c55e' : '#ef4444';
}

    
  // ================ MÉTODOS DE AÇÕES DAS ANÁLISES ================

  /**
   * Abre a ordem de serviço para visualização
   */
  abrirOrdemServico(analise: any): void {
    console.log('Abrindo ordem de serviço:', analise);
    // Implementar navegação para detalhes da ordem
    this.messageService.add({
      severity: 'info',
      summary: 'Informação',
      detail: 'Funcionalidade em desenvolvimento'
    });
  }

  /**
   * Edita uma análise
   */
  editarAnalise(analise: any): void {
    console.log('Editando análise:', analise);
    // Implementar edição da análise
    this.messageService.add({
      severity: 'info',
      summary: 'Informação',
      detail: 'Funcionalidade em desenvolvimento'
    });
  }

  /**
   * Exclui uma análise
   */
  excluirAnalise(analise: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a análise ${analise.id}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        // Implementar exclusão
        console.log('Excluindo análise:', analise);
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Funcionalidade em desenvolvimento'
        });
      }
    });
  }

  /**
   * Visualiza imagens da amostra
   */
  visualizarImagens(analise: any): void {
    console.log('Visualizando imagens:', analise);
    // Implementar visualização de imagens
    this.messageService.add({
      severity: 'info',
      summary: 'Informação',
      detail: 'Funcionalidade em desenvolvimento'
    });
  }

  /**
   * Finaliza uma análise
   */
  finalizarAnalise(analise: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja finalizar a análise da amostra ${analise.id}?`,
      header: 'Finalizar Análise',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.analiseService.finalizarAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise finalizada com sucesso!'
            });
             setTimeout(() => {
             this.loadAnalises();
          }, 1000);
          },
          error: (error) => {
            console.error('Erro ao finalizar análise:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao finalizar análise.'
            });
          } 
        });
      }
    });
  }

  reabrirAnalise(analise: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja reabrir a análise da amostra ${analise.id}?`,
      header: 'Reabrir Análise',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.analiseService.reabrirAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise reaberta com sucesso!'
            });
             setTimeout(() => {
             this.loadAnalises();
          }, 1000);
          },
          error: (error) => {
            console.error('Erro ao reabrir análise:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao reabrir análise.'
            });
          } 
        });
      }
    });
  }

  laudoAnalise(analise: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja encaminhar à análise ${analise.id} para laudo?`,
      header: 'Encaminhar para Laudo',
      icon: 'pi pi-file',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.analiseService.laudoAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise encaminhada para laudo com sucesso!'
            });
             setTimeout(() => {
             this.loadAnalises();
          }, 1000);
          },
          error: (error) => {
            console.error('Erro ao encaminhar análise para laudo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao reabrir análise.'
            });
          } 
        });
      }
    });
  }

  aprovarAnalise(analise: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja aprovar a análise ${analise.id}?`,
      header: 'Aprovar Análise',
      icon: 'pi pi-check',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.analiseService.aprovarAnalise(analise.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Análise aprovada para laudo com sucesso!'
            });
             setTimeout(() => {
             this.loadAnalises();
          }, 1000);
          },
          error: (error) => {
            console.error('Erro ao aprovar análise para laudo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao aprovar análise.'
            });
          } 
        });
      }
    });
  }



  gerarLaudo(analise: any): void {
    console.log('Gerando laudo para análise:', analise);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Gerando Laudo',
      detail: 'Preparando documento...'
    });

    // Implementar geração do laudo
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Laudo Gerado',
        detail: 'Laudo gerado com sucesso!'
      });
    }, 2000);
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

  /**
   * Retorna o nome de exibição para o status da análise
   */
  getStatusDisplayName(estado: string): string {
    const statusMap: { [key: string]: string } = {
      'EM_ANDAMENTO': 'Em Andamento',
      'PENDENTE': 'Pendente',
      'FINALIZADA': 'Finalizada',
      'APROVADA': 'Aprovada',
      'CANCELADA': 'Cancelada',
      'REJEITADA': 'Rejeitada'
    };
    
    return statusMap[estado] || estado || 'Sem Status';
  }

  /**
   * Retorna a severidade da tag para o status
   */
  getStatusSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (estado) {
      case 'APROVADA':
        return 'success';
      case 'FINALIZADA':
        return 'info';
      case 'EM_ANDAMENTO':
        return 'warn';
      case 'PENDENTE':
        return 'secondary';
      case 'CANCELADA':
      case 'REJEITADA':
        return 'danger';
      default:
        return 'contrast';
    }
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
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
    // Se for ordem expressa, usar método específico
    if (this.isOrdemExpressa) {
      this.criarOrdemExpressa();
      return;
    }

    // Continuar com lógica de ordem normal
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
criarOSDoFormulario() {
  console.log('🚀 Iniciando criação de OS do formulário');

  // Se for ordem expressa, usar método específico
  if (this.isOrdemExpressa) {
    this.criarOrdemExpressa();
    return;
  }

  // Continuar com lógica de ordem normal
  // Validação para campos  mínimos
  const camposEssenciais = {
    'material': 'Material',
    'tipoAmostra': 'Tipo de Amostra', 
    'dataColeta': 'Data de Coleta',
    'dataEntrada': 'Data de Entrada',
    'finalidade': 'Finalidade',
    'fornecedor': 'Fornecedor',
    'status': 'Status'
  };
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

  // ================ MÉTODOS PARA ORDEM EXPRESSA ================

  /**
   * Alterna entre ordem normal e expressa
   */
  alternarTipoOrdem(): void {
    this.isOrdemExpressa = !this.isOrdemExpressa;
    console.log('Tipo de ordem alterado para:', this.isOrdemExpressa ? 'Expressa' : 'Normal');
    
    if (this.isOrdemExpressa) {
      // Limpar seleções anteriores
      this.ensaiosSelecionados = [];
      this.calculosSelecionados = [];
    }
  }

  /**
   * Abre modal para seleção de ensaios
   */
  abrirModalEnsaios(): void {
    this.modalEnsaiosVisible = true;
  }

  /**
   * Abre modal para seleção de cálculos
   */
  abrirModalCalculos(): void {
    this.modalCalculosVisible = true;
  }

  /**
   * Fecha modal de ensaios
   */
  fecharModalEnsaios(): void {
    this.modalEnsaiosVisible = false;
  }

  /**
   * Fecha modal de cálculos
   */
  fecharModalCalculos(): void {
    this.modalCalculosVisible = false;
  }

  /**
   * Adiciona ensaios selecionados
   */
  adicionarEnsaiosSelecionados(): void {
    const selecionados = this.ensaiosDisponiveis.filter(e => e.selecionado);
    
    selecionados.forEach(ensaio => {
      // Verifica se já não está na lista
      if (!this.ensaiosSelecionados.find(e => e.id === ensaio.id)) {
        this.ensaiosSelecionados.push({ ...ensaio });
      }
      // Remove a seleção
      ensaio.selecionado = false;
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${selecionados.length} ensaio(s) adicionado(s)`
    });

    this.fecharModalEnsaios();
  }

  /**
   * Adiciona cálculos selecionados
   */
  adicionarCalculosSelecionados(): void {
    const selecionados = this.calculosDisponiveis.filter(c => c.selecionado);
    
    selecionados.forEach(calculo => {
      // Verifica se já não está na lista
      if (!this.calculosSelecionados.find(c => c.id === calculo.id)) {
        this.calculosSelecionados.push({ ...calculo });
      }
      // Remove a seleção
      calculo.selecionado = false;
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${selecionados.length} cálculo(s) adicionado(s)`
    });

    this.fecharModalCalculos();
  }

  /**
   * Remove ensaio da lista de selecionados
   */
  removerEnsaio(ensaio: any): void {
    this.ensaiosSelecionados = this.ensaiosSelecionados.filter(e => e.id !== ensaio.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Removido',
      detail: `Ensaio "${ensaio.descricao}" removido`
    });
  }

  /**
   * Remove cálculo da lista de selecionados
   */
  removerCalculo(calculo: any): void {
    this.calculosSelecionados = this.calculosSelecionados.filter(c => c.id !== calculo.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Removido',
      detail: `Cálculo "${calculo.descricao}" removido`
    });
  }

  /**
   * Cria uma ordem expressa
   */
  criarOrdemExpressa(): void {
    // Validar se o formulário está válido
    if (!this.registerOrdemForm.valid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Preencha todos os campos obrigatórios' 
      });
      return;
    }

    // Validar se há ensaios ou cálculos selecionados
    if (this.ensaiosSelecionados.length === 0 && this.calculosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Selecione pelo menos um ensaio ou cálculo para a ordem expressa'
      });
      return;
    }

    this.isCreatingOrdem = true;

    // Formatar data
    let dataFormatada = '';
    const dataValue = this.registerOrdemForm.value.data;
    if (dataValue instanceof Date && !isNaN(dataValue.getTime())) {
      dataFormatada = formatDate(dataValue, 'yyyy-MM-dd', 'en-US');
    }

    // Extrair IDs dos ensaios e cálculos selecionados
    const ensaiosIds = this.ensaiosSelecionados.map(e => e.id);
    const calculosIds = this.calculosSelecionados.map(c => c.id);

    console.log('🚀 Criando ordem expressa:', {
      data: dataFormatada,
      numero: this.registerOrdemForm.value.numero,
      ensaios: ensaiosIds,
      calculos: calculosIds,
      responsavel: this.registerOrdemForm.value.responsavel,
      digitador: this.registerOrdemForm.value.digitador,
      classificacao: this.registerOrdemForm.value.classificacao
    });

    // Criar ordem expressa
    this.ordemService.registerExpressa(
      dataFormatada,
      this.registerOrdemForm.value.numero,
      ensaiosIds,
      calculosIds,
      this.registerOrdemForm.value.responsavel,
      this.registerOrdemForm.value.digitador,
      this.registerOrdemForm.value.classificacao
    ).subscribe({
      next: (ordemSalva) => {
        console.log('✅ Ordem Expressa criada:', ordemSalva);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Ordem expressa criada com sucesso!'
        });

        // Limpar formulário e seleções
        this.registerOrdemForm.reset();
        this.ensaiosSelecionados = [];
        this.calculosSelecionados = [];
        this.isOrdemExpressa = false;
        this.isCreatingOrdem = false;

        // Recarregar lista de ordens
        this.loadOrdens();
      },
      error: (err) => {
        this.isCreatingOrdem = false;
        console.error('❌ Erro ao criar ordem expressa:', err);
        this.tratarErroOperacao(err, 'criar ordem expressa');
      }
    });
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
