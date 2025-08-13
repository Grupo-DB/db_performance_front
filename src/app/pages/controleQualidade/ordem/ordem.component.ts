import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NG_ASYNC_VALIDATORS, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Amostra } from '../amostra/amostra.component';
import { CheckboxModule } from 'primeng/checkbox';


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

  laudoForm!: FormGroup;
  modalLaudo: boolean = false;

  ordens: Ordem[]=[];
  analises: any[] = [];
  uploadedFilesWithInfo: FileWithInfo[] = [];

  // Propriedades para dados da amostra recebida
  amostraData: any = null;
  amostraRecebida: any = null;
  imagensExistentes: any[] = [];
  planosAnalise: any[] = [];
  digitador: string = '';
  teste: string = '';

  ensaios_laudo: any[] = [];
  ensaios_selecionados: any[] = [];
  amostra_detalhes_selecionada: any[] = [];

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
    private amostraService: AmostraService,
    private fb: FormBuilder,
    
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
    this.laudoForm  = this.fb.group({
      id: [''],
      nome: [''],
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

  abrirModalLaudo(amostra_detalhes: any) {

    this.amostra_detalhes_selecionada = amostra_detalhes;
    while (this.ensaios_laudo.length > 0) {
        this.ensaios_laudo.pop(); // Removes elements one by one from the end
    }
    if(amostra_detalhes.expressa_detalhes){
      amostra_detalhes.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
        this.ensaios_laudo.push({
          id: ensaio_detalhes.id,
          descricao: ensaio_detalhes.descricao
        });
      });

    }else{
      amostra_detalhes.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {
        plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
          this.ensaios_laudo.push({
            id: ensaio_detalhes.id,
            descricao: ensaio_detalhes.descricao
          });
        });
      });
    }
    this.modalLaudo = true;
  }

  salvarSelecionados() {
    this.imprimirLaudoPDF(this.amostra_detalhes_selecionada, this.ensaios_laudo, this.ensaios_selecionados);
  }

  imprimirLaudoPDF(amostra_detalhes_selecionada: any, ensaios_laudo: any, ensaios_selecionados: any){
    if(amostra_detalhes_selecionada.material === 'argamassa'){
      this.imprimirLaudoArgPDF(amostra_detalhes_selecionada, ensaios_laudo, ensaios_selecionados);
    }else{
      this.imprimirLaudoCalcPDF(amostra_detalhes_selecionada);
    }
  }

  imprimirLaudoArgPDF(amostra_detalhes_selecionada: any, ensaios_laudo: any, ensaios_selecionados: any) {

    const doc = new jsPDF({ 
      unit: "mm", 
      format: "a4" 
    });

    const logoBase64 = 'data:image/png;base64,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';
    
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19); // x, y, largura, altura

    //cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('ARGAMASSA | 1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('Data de Emissão:', 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    let y = 52;

    //Dados amostra
    const linhas = [
      ['Material:', "Tipo:", ""],
      ['Sub-Tipo:', "Local de Coleta:", ""],
      ['Produto:', "", ""],
      ['Fornecedor:', "Amostragem:", "Data Coleta / Fabricação"],
      ['Registro EP:', "Registro do Produto:", ""],
    ];

    doc.rect(15, 48, 182, 35); //tabela dados amostra
    linhas.forEach((linha, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 155, y);
      y += 7;
    });

    //tabela de ensaios
    let contadorLinhas = 88;
    const head = [['Ensaio', 'Unid', 'Resultado', '', 'Garantia']];

    const body = [
      ['Massa Específica', 'kg/m³', '#N/D', '-', '-'],
      ['Densidade Aparente', 'kg/m³', '#N/D', '-', '-'],
      ['Umidade', '%', '#N/D', '', 'max'],
      ['Ri+SiO₂', '%', '#N/D', '-', '-'],
      ['CaO', '%', '#N/D', '', 'min'],
      ['MgO', '%', '#N/D', '', 'min'],
      ['Soma de Óxidos (CaO+MgO)', '%', '#N/D', '', 'min'],
      ['Perda ao Fogo', '%', '#N/D', '-', '-'],
      ['CO₂', '%', '#N/D', '-', '-'],
      ['PN (Equiv CaCO₃)', '%', '#N/D', '', 'min'],
      ['PRNT', '%', '#N/D', '', 'min'],
      ['RE', '%', '#N/D', '-', '-'],
      ['RET Indiv #10 (2mm)	', '%', '#N/D', '-', '-'],
      ['PASS Indiv #10 (2mm)', '%', '#N/D', '', 'min'],
      ['RET Indiv #20 (0,84mm)', '%', '#N/D', '-', '-'],
      ['PASS Indiv #20 (0,84mm)', '%', '#N/D', '', 'min'],
      ['RET Indiv #50 (0,3mm)', '%', '#N/D', '-', '-'],
      ['PAS Indiv #50 (0,3mm)', '%', '#N/D', '', 'min'],
      ['RET ACUM #100 (0,150mm)	', '%', '#N/D', '-', '-'],
      ['PAS ACUM #100 (0,150mm)', '%', '#N/D', '-', '-'],
      ['RET ACUM #200 (0,075mm)', '%', '#N/D', '-', '-'],
      ['Finos < #200 (0,075mm)', '%', '#N/D', '-', '-'],
    ];

    autoTable(doc, {
      head: head,
      body: body,
      startY: contadorLinhas,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'center',
        cellPadding: 1,
        
      },
       headStyles: {
        halign: 'left', // <-- Alinha o cabeçalho à esquerda
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { halign: 'left' }, 
        1: { halign: 'left' },
        2: { halign: 'left' },
        3: { halign: 'left' },
        4: { halign: 'left' }
      }
    });

    //observações
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 84, 213)
    doc.rect(14, 215, 182, 20); //tabela dados amostra

    //original assinando...
    autoTable(doc, {
      body: [['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']],
      startY: 270,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    //rodape
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: ', 16, 281);
    doc.text("DB Calc Plan", 100, 281);
    doc.text("Vesão: 9.0", 180, 281);

    const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, 238, 40, 30); // x, y, largura, altura

  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }

  imprimirLaudoCalcPDF(amostra_detalhes_selecionada: any) {

    const doc = new jsPDF({ 
      unit: "mm", 
      format: "a4" 
    });

    const logoBase64 = 'data:image/png;base64,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';
    
    doc.addImage(logoBase64, 'PNG', 15, 15, 26, 19); // x, y, largura, altura

    //cabeçalho
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('F-054 Certificado de Análise', 75, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('1ª Via', 46, 30);
    doc.rect(45, 26, 55, 7); // 1ª via

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR'); // exemplo: 07/08/2025 13:35:22
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('Data de Emissão: '+dataHoraFormatada, 105, 30);
    doc.rect(103, 26, 90, 7); // Data emissao

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text('DADOS DA AMOSTRA', 84, 46);

    let y = 52;

    console.log(amostra_detalhes_selecionada);

    //Dados amostra
    const linhas = [
      ['Material: '+amostra_detalhes_selecionada.material, "Tipo: "+amostra_detalhes_selecionada.tipo_amostragem, ""],
      ['Sub-Tipo: '+amostra_detalhes_selecionada.subtipo, "Local de Coleta: "+amostra_detalhes_selecionada.local_coleta, ""],
      ['Produto: '+amostra_detalhes_selecionada.produto_amostra_detalhes.nome, "", ""],
      ['Fornecedor: '+amostra_detalhes_selecionada.fornecedor, "Amostragem:", "Data Coleta / Fabricação: "+amostra_detalhes_selecionada.data_coleta],
      ['Registro EP: '+amostra_detalhes_selecionada.produto_amostra_detalhes.registro_empresa, "Registro do Produto: "+amostra_detalhes_selecionada.produto_amostra_detalhes.registro_produto, ""],
    ];

    doc.rect(15, 48, 182, 35); //tabela dados amostra
    linhas.forEach((linha, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(linha[0], 16, y);
      doc.text(linha[1], 86, y);
      doc.text(linha[2], 130, y);
      y += 7;
    });

    //tabela de ensaios
    let contadorLinhas = 88;
    const head = [['Ensaio', 'Unid', 'Resultado', '', 'Garantia']];
    if(amostra_detalhes_selecionada.expressa_detalhes){
      const body: any[] = [];

      amostra_detalhes_selecionada.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
        this.ensaios_selecionados.forEach((selected: any) => {
          if (selected.id === ensaio_detalhes.id) {
            const linha: any[] = [];
            linha.push({ content: ensaio_detalhes.descricao });
            linha.push({ content: 'kg/m³' });
            linha.push({ content: 'N/D' });
            linha.push({ content: '-' });
            linha.push({ content: '-' });
            body.push(linha);
          }
        });

      });
        autoTable(doc, {
          startY: contadorLinhas,
          head: head,
          body: body,
          theme: "grid",
          styles: {
            fontSize: 8,
            halign: 'left',
            cellPadding: 1,
            
          },
          headStyles: {
            halign: 'left',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
        });

        contadorLinhas += 20;

    }else{
      amostra_detalhes_selecionada.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {   
        const body: any[] = [];

        plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
          this.ensaios_selecionados.forEach((selected: any) => {

            if (selected.id === ensaio_detalhes.id) {
              const linha: any[] = [];
              linha.push({ content: ensaio_detalhes.descricao });
              linha.push({ content: 'kg/m³' });
              linha.push({ content: 'N/D' });
              linha.push({ content: '-' });
              linha.push({ content: '-' });
              body.push(linha);
            }
          });
        });

        autoTable(doc, {
          startY: contadorLinhas,
          head: head,
          body: body,
          theme: "grid",
          styles: {
            fontSize: 8,
            halign: 'left',
            cellPadding: 1,
            
          },
          headStyles: {
            halign: 'left',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
        });

        contadorLinhas += 20;
      });
    }

    //observações
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Observações', 84, 213);
    autoTable(doc, {
      body: [[this.teste]],
      startY: 220,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      }
    });
    doc.rect(14, 215, 182, 20); //tabela obs

    //original assinado...
    autoTable(doc, {
      body: [['Somente o original assinado tem valor de laudo. A representatividade da amostra é de responsabilidade do executor da coleta da mesma. Os resultados presentes referem-se unicamente a amostra analisada']],
      startY: 270,
      theme: 'grid',
      styles: {
        fontSize: 8,
        halign: 'left',
        cellPadding: 1,
      },
    });

    //rodape
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('Validade do Laudo: ', 16, 281);
    doc.text("DB Calc Plan", 100, 281);
    doc.text("Vesão: 9.0", 180, 281);

    const logoAssinaturaBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QL6RXhpZgAATU0AKgAAAAgABAE7AAIAAAAQAAABSodpAAQAAAABAAABWpydAAEAAAAgAAAC0uocAAcAAAEMAAAAPgAAAAAc6gAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATWF0aGV1cyBSaWNhbGRlAAAFkAMAAgAAABQAAAKokAQAAgAAABQAAAK8kpEAAgAAAAM1OQAAkpIAAgAAAAM1OQAA6hwABwAAAQwAAAGcAAAAABzqAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI1OjA4OjA1IDE2OjQ4OjE3ADIwMjU6MDg6MDUgMTY6NDg6MTcAAABNAGEAdABoAGUAdQBzACAAUgBpAGMAYQBsAGQAZQAAAP/hBCJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPjx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE2OjQ4OjE3LjU5MDwveG1wOkNyZWF0ZURhdGU+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5NYXRoZXVzIFJpY2FsZGU8L3JkZjpsaT48L3JkZjpTZXE+DQoJCQk8L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwveDp4bXBtZXRhPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAcFBQYFBAcGBQYIBwcIChELCgkJChUPEAwRGBUaGRgVGBcbHichGx0lHRcYIi4iJSgpKywrGiAvMy8qMicqKyr/2wBDAQcICAoJChQLCxQqHBgcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKir/wAARCADAAqkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6RooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAormrHXLo+P7zQ7tgUNmt3CoQDyxvKn5s854PTjmuloAKKKKACiimTSxwQvLM6xxxqWZmOAoHUmgDG1vxdpehanY6bcvJNqGoMy21pAA0kmBk9SAB7kgVNpfiOy1W9msoxNBewDMttcJskUeuO49xmud8I6TY6z4j1Dxs4S5ku3MFhKyDMcCZX5T7nNaWuafHD4u0LVYNsdwZXtZWHBeNkJwfXDKKYHTUUCikAUUUUAFFFY2q+LtD0TVLbT9U1GK3ubk/u1bPrgZPRcnjmgDZooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDm9SsfJ8daZqcQjV5YJLWVmJyV+8APfP9a6QcAVg+LkQaXDcvx9muEkyCQeuMAd+SOK3UO5AfUZp9AFooopAFcx8Q2uG8F3VnYMFur5ktYcnHzOwH8sn8K6euG8SCXVvif4b0xHP2ezSTUJwCOq4CZ/GmgOq0PSodC0Gy0u1AEVpCsQwMZwOT+Jyfxqj4hVZdU0GLJ3/AG7zAAM8LGxJ/kPxrdrmr6WG7+ImmWhUl7O1luS3IwThQPToTQB0tFFFIAooooAK8/tPCtp4nv8Axfd6iqyfb5PsMLgA+XHGoGVPruOfwFdrq10bHRb27HWC3klH/AVJ/pXL/CZp5vhlpd1ecz3fmXEhPctIx/lin0A1fBF9Jf8Ag3T3nJM0UZgkLdSyEoT+O3Nb1YPhCJYdMuY0RkUXs+NxBz8/Wt6kAUUUUAFFcl4p1rWfC0w1eQwXWhKyrdxiMiW2QnmQEcMB3HFdTbzxXVvHPbuskUqh0dTkMDyCKAJKKKKACiiigAooooAKKKKACiii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3a7qEuzbu3x2/wA+PLznEQ+95b5xj/XSYxiPZpUUAZsWl3cfl7td1CXZt3b47f58eXnOIh97y3zjH+ukxjEezN/4RfV/+h78Qf8AfjT/AP5FrpKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAIri2hu4GhuYkljb7yuMg1kxyS6A/lXTvNp7H93LjJg5+63tyMH8626a6LIhRxlWGCD3oAcDkAjoarajZrqGl3VnJ9y4heJvowI/rWWZD4ckbzizaW54fk/Zz0wepIPr2rcVgygjkGgDiPhDeST/AA+t7K5cNc6XNJZS4OeUbj9CK7ivM/h5GmhfEjxloBLEy3C6hET02vyf1YflXplNjYVRm0axn1KK/eHbdR9JEYqWHo2PvD2NXqKQgooooAKKKKACiiigArEsdDk0zxTf6haSD7JqSq88DfwTKMb19iOvuBW3RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA141lQpIoZWGCCOtYj3jeHp2F8+NMc5WduluT/AAnH8PTB7Vu1Dd2sN7ayW11GJIZVKup7g0Aeb+Ib+20n42+FdTgZDFrFtLYSyo3DnrH+pFenV8466t34fgl0TV4Ggn0bWP7Q0m4ZciW0L/Oqt6oCDj0GO1fRcEyXECTRMGjkUMrDuCMg02Nj6KKKQgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMbxR4ZsvFeiS6dfgruGYpkA3wt/eXP8ALvVnQdJGhaBZaWtzLdC0hWITTY3OB3OOK0KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=';
    doc.addImage(logoAssinaturaBase64, 'PNG', 84, 238, 40, 30); // x, y, largura, altura

  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }

  imprimirCalculoPDF(analise: any) {

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const logoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCABjAswDASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAcIBgkDBAUCAf/EAFgQAAEDAwIDAQcKEQoFBAMAAAEAAgMEBQYHEQgSITETFCJBUWHSCRgyM1ZxdpKVtBYXGTU3QlJTV3J0gZGUsbPRFSNDVFVidZahsjhYc5OiRGOC04Okwf/EABoBAQADAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAwEQEAAgECBAQEBQUBAAAAAAAAAQIRAzEEEiFRExQyoRUiM0EFUmGB8CM0cbHhkf/aAAwDAQACEQMRAD8A2poqkeqT3a62jSDGZ7RdKyglfk8bHSUtQ+Fzm96VJ2JaQSNwDt5gtdX0bZr7s7/8pz+kujT0PErzZZ2vyzhvMRaM/o2zX3Z3/wCU5/ST6Ns192d/+U5/SV/KT3R4v6N5iLRn9G2a+7O//Kc/pJ9G2a+7O/8AynP6SeUnueL+jeYi0Z/Rtmvuzv8A8pz+kn0bZr7s7/8AKc/pJ5Se54v6N5iLRqM7zlpDm5tkIIGwIuk/Z8devbNaNYLM4OteqeW0xHZyXmo2/QX7J5Se54sN2aLUXjPGvxLYw5oj1ImucTf6O6UsVSD77i0P/wDJTtp96pvdIpYqXVDT2nnhOwfWWSUsePKe4ykg/meFS3DXjbqtGpEr/Io30o4h9ItaItsEy2nqK1reeS3VAMFXGPHvE/YkDyt3HnUkLCYmJxK+ciIvByyR7IKcse5u7zvsdvEppXntyj3kUe98VH3+T45Tvio+/wAnxyujys90ZSEij3vio+/yfHKd8VH3+T45Tys9zKQkUe98VH3+T45Tvio+/wAnxynlZ7mUhIo974qPv8nxynfFR9/k+OU8rPcykJFH7aysb7GrmH/5CuzDfLrCfBrHOHkfs79qieGt9pMs3RY3SZY7cNracbfdx/wXvU1XT1kfdaaUPb5vF76xvp2pvCXMiIqAixjDc8t2Zi5d50s9O623SttcjZdjzPpp3ROeNvE4s3Hj2KydNgREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREFPfVOPsN4v8KovmdUtba2SeqcfYbxf4VRfM6pa216PDfTc+p6hERbqCIiAiIgIiICIiDsW+43C01sNytVdUUdXTvEkNRTyGOSNw7C1zdiD7y2C8GnGhcc0uVJpNq3Wtmu8ze52i8O2aatwHtM3i7psOjvttuvXqdeS7NtutZYbjSX23TOiq7dPHVwPadi2SNwc0/pAVNTTjUjErVtNZb3Vj+Xe0U3/AFD+xexb5Xz0FNPId3SQse4+ctBXj5d7RTf9Q/sXn6Prh0SxlERegqIiICIiAiIgIiIC7dtr5bfUtmjceUnZ7d+hC6iHsPvJMRMYkSK0hwDh2Ebr9XxF7Uz8UL7XlLof0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBT31Tj7DeL/CqL5nVLW2tknqnH2G8X+FUXzOqWttejw303PqeoREW6giIgIiICIiAiIgL4qPaJPxD+xfa+Kj2iT8Q/sQb3rR9aaL8nj/2heVl3tFN/wBQ/sXq2j600X5PH/tC8zK45JIKcRxuds878oJ8S8zR9cOqWLouXvap/q8vxCne1T/V5fiFehmFXEi5e9qn+ry/EKd7VP8AV5fiFMwOJFy97VP9Xl+IU72qf6vL8QpmBxIuXvap/q8vxCne1T/V5fiFMwOJFztoqx2wbSTHf/2yuxDYrrMelI5o8ryGqJtWN5S6C7dtt81wqWxRtPKDu93iAXr0mJncOragbfcR/wASvepqWno4xFTRNY3zeP31hqcRERiphytAaA0eIbL9RFxLIf0I9vyv4XX75/KpgUP6Ee35X8Lr98/lUwK1t0RsIiKqRUSl1p4nNauIPOMG0Vzmis9rxMVRpYZKCCSKU07hFyve9hJMkocA7fYAjpt1VzNRMqp8GwLIsxquXudltdTXEE+yMcbnBvvkgD86qH6mdidRLZs11NucXdKm6V0dviqnHwn8oMkwPvvewrbTiIrN5Ut1mIS1wy8Tr9VZ67TjUe2tx/UewF8dfb3NMbaoMOzpImnsIPsmddt9xuOywaqfxmaE3iU03EZpIZaHNcTLaqr71b4dZTRj2zYeyfG3fcH2UfM077AGXOHDXey6/adU2U0Yip7tS8tNeKFrt+96kDqR4+R/smnybjckFResTHPXZMT1xKVERdW53O32W3VV3utXHS0VFE6eonkOzY42jdzifIAFksxrVbVPEtHMKrc5zKtMNFSANjiZsZamY78kMbftnu294AEnYAlUrzjXXi+u+llw4i6G+UmG4oK6CC0WaK3xTTVEEknJ3Zz5GEloO3hHYO6kABd2w09549NdpL/eIaiHSXB5yynpnEtbWv6EMO328mwc8jq2PlbuC4FWv15wamy/QvLcKooIKaOSyzR0rGxAMhMTOZga0DptyADbsXREV0piJ3+6k5t1h2NBdRJtVdIcXzyrdEay6UDH1gibs1tQ3wZAB4vCBWfqn/qaWZm8aR3nDKh+02PXVz44z2thqG8497+cEo/MrgLLUry3mFqzmMiIviaaKnifUVErIoo2l73v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arF7hfJGeO53GV7SfOyMsaf0Ka8T0+wXBKUUeGYhZ7JEG8pFDRxwlw/vFo3d+clUtxVY2haNKfu1w6M+p+arZ5UxXHUVrsMsu4c5s4a+vmHkbEDtH779iPuSthWlOkGCaMYxHiuCWdlJTjZ9RO8809VJtsZJX9rj/oPEAs0Rc2pq21N2laxXYUIcUf1lsP5ZL+7U3rC9TNNafUmjoaOou0tAKGV0odHEH8/M3bbqRsr8LqV0tat7bQrq1m1JiFPUVhPWt2z3Y1f6oz0k9a3bPdjV/qjPSXt/EOH/ADe0uHy+p2V7RWE9a3bPdjV/qjPST1rds92NX+qM9JPiHD/m9pPL6nZXtFYT1rds92NX+qM9JPWt2z3Y1f6oz0k+IcP+b2k8vqdle0VhPWt2z3Y1f6oz0k9a3bPdjV/qjPST4hw/5vaTy+p2V7RWLh4X8fa4Goyi4yAdoZFG3f8AavftfD1pxbnB9RSVlwcPFU1J5T+ZnKFW34loRtmf2Wjhryq9QW6vutUyitlFPVVEhAbHCwvcSfMFPmkmhVTaK2DJ8yYwVMBD6WhBDgx3ifIezceIDsUw2fHrHj8He1ktNJQx+MQRBm/vkdT+deguDiPxG2rHLSMR7t9Ph4pObdRERea6UQaEtc2fK+ZpG+W349Rt/wCvlUvrjZBBG8vZCxrnHckN2JK5FMzmcgiIoBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//Z';

    doc.addImage(logoBase64, 'PNG', 175, 3, 20, 5); // x, y, largura, altura

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

    const body: any[] = [];
    const linha: any[] = [];

    linha.push({ content: "Ensaios", styles: { halign: "center",  fillColor: [128, 128, 128], textColor: [255, 255, 255], fontStyle: "bold" } });
    body.push(linha);


    autoTable(doc, {
      startY: contadorLinhas,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 }
    });

    contadorLinhas+=10;

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

        if(plano_detalhes.calculo_ensaio_detalhes){
          const body: any[] = [];
          const linha: any[] = [];

          linha.push({ content: "Cálculos", styles: { halign: "center",  fillColor: [128, 128, 128], textColor: [255, 255, 255], fontStyle: "bold" } });
          body.push(linha);

      
          autoTable(doc, {
            startY: contadorLinhas,
            body,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 2 }
          });

          contadorLinhas+=10;
            
          plano_detalhes.calculo_ensaio_detalhes.forEach((calculo_ensaio_detalhes: any) => {
            const body: any[] = [];
            const linha: any[] = [];

            linha.push({ content: calculo_ensaio_detalhes.descricao, styles: { halign: "center",  fillColor: [128, 128, 128], textColor: [255, 255, 255], fontStyle: "bold" } });
            body.push(linha);

        
            autoTable(doc, {
              startY: contadorLinhas,
              body: body,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 }
            });

            contadorLinhas+=7;

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
                body: body,
                theme: "grid",
                styles: { fontSize: 8, cellPadding: 2 }
              });

              contadorLinhas+=20;
            });
            
          });
        }
        
      });
    }
  
    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  
    //   // doc.save("Etiqueta.pdf");
  }

  getMenuItems(analise: any) {
    return [
      // { label: 'Visualizar', icon: 'pi pi-eye'},
      { label: 'Imprimir Análises', icon: 'pi pi-print', command: () => this.imprimirCalculoPDF(analise) },
      { label: 'Abrir OS', icon: 'pi pi-folder-open'},
      { label: 'Editar', icon: 'pi pi-pencil'},
      { label: 'Excluir', icon: 'pi pi-trash'},
      { label: 'Imagens', icon: 'pi pi-image'},
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
