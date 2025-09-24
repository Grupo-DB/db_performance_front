import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
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
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Chart } from 'chart.js';
import { Amostra } from '../amostra/amostra.component';
import { Ordem } from '../ordem/ordem.component';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';

interface FileWithInfo {
  file: File;
  descricao: string;
}

@Component({
  selector: 'app-arquivo',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, 
    CardModule,FloatLabelModule, TableModule, InputTextModule, InputGroupModule, 
    InputGroupAddonModule,ButtonModule, DropdownModule, ToastModule, NzMenuModule, 
    DrawerModule, RouterLink, IconField,InputNumberModule, AutoCompleteModule, 
    MultiSelectModule, DatePickerModule, StepperModule,InputIcon, FieldsetModule, 
    MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,
    NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule, 
    TagModule, CheckboxModule
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
  providers: [
      MessageService,ConfirmationService
    ],
  templateUrl: './arquivo.component.html',
  styleUrl: './arquivo.component.scss'
})
export class ArquivoComponent implements OnInit {
  @ViewChild('graficoCanvas', { static: true }) graficoCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  amostras: Amostra[] = [];
  ordens: Ordem[] = [];
  analises: any[] = [];

  produtosFiltrados: any[] = [];
  materiaisFiltro: any[] = [];

  laudoForm!: FormGroup;
  modalLaudo: boolean = false;
  modalImpressao: boolean = false;
  uploadedFilesWithInfo: FileWithInfo[] = [];

  ensaios_laudo: any[] = [];
  ensaios_selecionados: any[] = [];
  amostra_detalhes_selecionada: any[] = [];
  analises_selecionadas: any[] = [];

  // Propriedades para ordem expressa
  isOrdemExpressa: boolean = false;
  ensaiosDisponiveis: any[] = [];
  calculosDisponiveis: any[] = [];
  ensaiosSelecionados: any[] = [];
  calculosSelecionados: any[] = [];
  modalEnsaiosVisible: boolean = false;
  modalCalculosVisible: boolean = false;

  editFormVisible: boolean = false;
  modalVisualizar: boolean = false;
  analiseSelecionada: any;

  amostraImagensSelecionada: any;
  imagensAmostra: any[] = [];
  imagemAtualIndex: number = 0;
  modalImagensVisible = false;

  tipoFiltro = [
    { value: 'Expressa' },
    { value: 'Plano' },
  ];

  // Grafico Lauudo
  dadosTabela = [
    { tempo: '5min', valor: 2.3 },
    { tempo: '20min', valor: 4.1 },
    { tempo: '1h', valor: 6.85 },
    { tempo: '2h', valor: 8.35 },
    { tempo: '3h', valor: 10.0 },
    { tempo: '4h', valor: 12.0 },
    { tempo: '6h', valor: 14.0 }
  ];

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

constructor(
private loginService: LoginService,
private analiseService: AnaliseService,
private amostraService: AmostraService,
private messageService: MessageService,
private confirmationService: ConfirmationService,
){}
  ngOnInit(): void {
    this.loadAnalises();
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  
  analisesFiltradas: any[] = []; // array para exibir na tabela
  materiaisSelecionados: string[] = []; // valores escolhidos no multiselect
  loadAnalises(): void {
    this.analiseService.getAnalisesFechadas().subscribe(
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
          data_coleta: analise.amostra_detalhes?.data_coleta ?? '',

        
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

        // ✅ NOVO: Carregar dados completos e verificar alertas de rompimento
        //this.carregarDadosCompletosEVerificarAlertas();
      },
      (error) => {
        console.error('Erro ao carregar análises', error);
      }
    );
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

  //Normalização
  private normalize(str: string): string {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }
  //Severity
  getSeverity(materialNome: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    const materialNormalizado = this.normalize(materialNome);
    if (!materialNome) {
      return 'secondary';
    }
    switch (materialNormalizado.toLowerCase()) {
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

  //////////////////////////////////////////////////
  
  tipoSelecionados: string = ''; // valores escolhidos no multiselect
  // Filtro pelo MultiSelect
  filtrarPorTipo(): void {
    if (this.tipoSelecionados.length === 0) {
      this.analisesFiltradas = [...this.analises];
    } else {      
      if(this.tipoSelecionados == 'Expressa'){
          this.analisesFiltradas = this.analises.filter(
          (analise) => analise?.amostra_detalhes?.expressa_detalhes
        );
      }else{
        this.analisesFiltradas = this.analises.filter(
          (analise) => analise?.amostra_detalhes?.ordem_detalhes
        );
      }
    }
  }

  //Tipos de Ordem
  getTipoOrdem(tipoOrdem: string): 'warn' | 'contrast' | undefined {
    switch (tipoOrdem) {
      case 'Expressa':
        return 'warn';
      default:
        return 'contrast';
    }
  }

  // Filtro Global
  filterTable(): void {
    if (this.dt1) {
      this.dt1.filterGlobal(this.inputValue, 'contains');
    }
  }
  
  //Menu Items
    getMenuItems(analise: any) {
    const menuItems = [
      { label: 'Visualizar', icon: 'pi pi-eye', command: () => this.visualizar(analise), tooltip: 'Visualizar OS', tooltipPosition: 'top' },
      { label: 'Imprimir', icon: 'pi pi-print', command: () => this.abrirModalImpressao(analise.amostra_detalhes) },
      { label: 'Imagens', icon: 'pi pi-image', command: () => this.visualizarImagens(analise.amostra_detalhes) },
    ];
    return menuItems;
  }

  //=============================================MÉTODOS do MENU ITEM=============================================

  visualizar(analise: any) {
    this.analiseSelecionada = analise;
    this.modalVisualizar = true;
    console.log('Drawer deve abrir', analise); 
  }

  abrirModalImpressao(amostra_detalhes: any) {
    this.amostra_detalhes_selecionada = amostra_detalhes;
    this.ensaios_laudo.pop(); // Remove ULTIMO ELEMENTO
    while (this.ensaios_selecionados.length > 0) {
        this.ensaios_laudo.pop(); 
    }
    if(amostra_detalhes.expressa_detalhes){
      amostra_detalhes.expressa_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
        this.ensaios_laudo.push({
            id: ensaio_detalhes.id,
            descricao: ensaio_detalhes.descricao,
          });
      });
    }
    if(amostra_detalhes.ordem_detalhes){
      amostra_detalhes.ordem_detalhes.plano_detalhes.forEach((plano_detalhes: any) => {
        plano_detalhes.ensaio_detalhes.forEach((ensaio_detalhes: any) => {
          this.ensaios_laudo.push({
            id: ensaio_detalhes.id,
            descricao: ensaio_detalhes.descricao,
          });
        });
      });
    }
    this.modalImpressao = true;
  }

  excluirAmostraExpressa(id: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a os ${id}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.amostraService.deleteAmostraExpressa(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
            if (err.status === 500) {
              this.messageService.add({ severity: 'error', summary: 'Erro de exclusão!', detail: 'Não é possível excluir, pois esta OS já está associada a uma análise! ', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }
  
  excluirAmostraOrdem(id: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a os ${id}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.amostraService.deleteAmostraOrdem(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Amostra excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
            if (err.status === 500) {
              this.messageService.add({ severity: 'error', summary: 'Erro de exclusão!', detail: 'Não é possível excluir, pois esta OS já está associada a uma análise! ', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }


//==============================================METODOS IMAGENS==============================================
visualizarImagens(amostraId: any): void {
  console.log('Visualizando imagens da amostra:', amostraId);
  this.amostraImagensSelecionada = amostraId;
  this.carregarImagensAmostra(amostraId.id);
}

carregarImagensAmostra(amostraId: number): void {
  console.log(amostraId, 'amosastraID');
  this.amostraService.getImagensAmostra(amostraId).subscribe({
    next: (imagens) => {
      // Usar image_url em vez de image para ter a URL completa
      this.imagensAmostra = imagens.map((img: { image_url: any; image: any; }) => ({
        ...img,
        image: img.image_url || img.image // Usar image_url se disponível, senão fallback para image
      }));
      this.imagemAtualIndex = 0;
      this.modalImagensVisible = true;
      
      if (imagens.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Esta amostra não possui imagens anexadas.'
        });
      }
    },
    error: (error) => {
      console.error('Erro ao carregar imagens:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar imagens da amostra.'
      });
    }
  });
}

// Métodos para navegação entre imagens
proximaImagem(): void {
  if (this.imagemAtualIndex < this.imagensAmostra.length - 1) {
    this.imagemAtualIndex++;
  }
}

imagemAnterior(): void {
  if (this.imagemAtualIndex > 0) {
    this.imagemAtualIndex--;
  }
}

// Método para ir para uma imagem específica
irParaImagem(index: number): void {
  this.imagemAtualIndex = index;
}

// Método para deletar uma imagem
deletarImagem(imageId: number): void {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja deletar esta imagem?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.amostraService.deleteImagem(this.amostraImagensSelecionada.id, imageId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Imagem deletada com sucesso!'
          });
          
          
          this.carregarImagensAmostra(this.amostraImagensSelecionada.id);
        },
        error: (error) => {
          console.error('Erro ao deletar imagem:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar imagem.'
          });
        }
      });
    }
  });
}

downloadImagem(imagem: any): void {
  const link = document.createElement('a');
  link.href = imagem.image;
  link.download = `amostra_${this.amostraImagensSelecionada.numero}_imagem_${imagem.id}`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onDescricaoChange(imagem: any): void {
  // Debounce para não fazer muitas requisições
  if (this.descricaoTimeout) {
    clearTimeout(this.descricaoTimeout);
  }
  
  this.descricaoTimeout = setTimeout(() => {
    this.salvarDescricaoImagem(imagem);
  }, 3000); // Salva após 3 segundos sem alterações
}

private descricaoTimeout: any;

salvarDescricaoImagem(imagem: any): void {
  // método no service para atualizar descrição
  this.amostraService.atualizarDescricaoImagem(imagem.id, imagem.descricao).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Descrição atualizada com sucesso!'
      });
    },
    error: (error) => {
      console.error('Erro ao atualizar descrição:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar descrição da imagem.'
      });
    }
  });
}

// Método para capturar mudanças na descrição durante o upload
onDescricaoInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;
  const descricao = target.value;
  
  if (this.uploadedFilesWithInfo[index]) {
    this.uploadedFilesWithInfo[index].descricao = descricao;
    console.log(`Descrição atualizada para arquivo ${index}: "${descricao}"`);
    console.log('Estado atual dos arquivos:', this.uploadedFilesWithInfo);
  }
}  

duplicata(amostra: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja fazer a duplicata?`,
      header: 'Confirmar Duplicata',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        
        const novaAmostra = JSON.parse(JSON.stringify(amostra));
        //zera id
        delete novaAmostra.id;
        
        
          console.log(novaAmostra);

          // Calcular data de descarte se necessário
          let dataDescarteFormatada = novaAmostra.data_descarte;
          if (!dataDescarteFormatada && novaAmostra.data_entrada && novaAmostra.material) {
            const dataEntrada = new Date(novaAmostra.data_entrada);
            if (!isNaN(dataEntrada.getTime())) {
              const dataDescarte = this.calcularDataDescarte(dataEntrada, novaAmostra.material);
              if (dataDescarte) {
                dataDescarteFormatada = formatDate(dataDescarte, 'yyyy-MM-dd', 'en-US');
              }
            }
          }

          this.amostraService.registerAmostra(
            novaAmostra.material,
            novaAmostra.finalidade,
            novaAmostra.numeroSac,
            novaAmostra.data_envia,
            novaAmostra.destino_envio,
            novaAmostra.data_recebimento,
            novaAmostra.reter,
            novaAmostra.registro_ep,
            novaAmostra.registro_produto,
            novaAmostra.numero_lote,
            novaAmostra.data_coleta,
            novaAmostra.data_entrada,
            novaAmostra.numero,
            novaAmostra.tipoAmostra,
            novaAmostra.subtipo,
            novaAmostra.produtoAmostra,
            novaAmostra.codDb,
            novaAmostra.estado_fisico,
            novaAmostra.periodo_Hora,
            novaAmostra.periodo_turno,
            novaAmostra.tipo_amostragem,
            novaAmostra.local_coleta,
            novaAmostra.fornecedor,
            novaAmostra.representatividade_lote,
            novaAmostra.identificacao_complementar,
            novaAmostra.complemento,
            novaAmostra.observacoes,
            novaAmostra.ordem,
            null,
            novaAmostra.digitador,
            novaAmostra.status,
            dataDescarteFormatada
          ).subscribe({
            next: (amostraCriada) => {
              console.log('Amostra duplicada:', amostraCriada);
              
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Duplicata registrada com sucesso.' 
              });
              
              
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
          });
        },
      
    });
  }

  // Função para calcular a data de descarte baseada no material e data de entrada
  private calcularDataDescarte(dataEntrada: Date, material: string): Date | null {
    if (!dataEntrada || !material) {
      return null;
    }

    const materialNormalizado = this.normalize(material);
    const dataDescarte = new Date(dataEntrada);
    
    // Argamassa: +120 dias
    if (materialNormalizado === 'argamassa') {
      dataDescarte.setDate(dataDescarte.getDate() + 120);
    }
    // Cal, Cinza Pozolana, Cimento, Calcario e Finaliza: +90 dias  
    else if (materialNormalizado === 'cal' || 
             materialNormalizado === 'cinza pozolana' ||
             materialNormalizado === 'cimento' ||
             materialNormalizado === 'calcario' ||
             materialNormalizado === 'finaliza') {
      dataDescarte.setDate(dataDescarte.getDate() + 90);
    }
    // Para outros materiais, usar 90 dias como padrão
    else {
      dataDescarte.setDate(dataDescarte.getDate() + 90);
    }

    return dataDescarte;
  }


  //Finalizar análise
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


  abrirModalLaudo(amostra_detalhes: any) {
  
  console.log('laudo', amostra_detalhes);
  this.amostra_detalhes_selecionada = amostra_detalhes;

  while (this.ensaios_laudo.length > 0) {
      this.ensaios_laudo.pop(); // Removes elements one by one from the end
  }

    if(amostra_detalhes.ultimo_ensaio){
      amostra_detalhes.ultimo_ensaio.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
        this.ensaios_laudo.push({
            id: ensaios_utilizados.id,
            descricao: ensaios_utilizados.descricao,
            garantia: ensaios_utilizados.garantia
          });
      });
    }
    if(amostra_detalhes.ultimo_calculo){
      amostra_detalhes.ultimo_calculo.forEach((ultimo_calculo: any) => {
        ultimo_calculo.ensaios_utilizados.forEach((ensaios_utilizados: any) => {
          this.ensaios_laudo.push({
            id: ensaios_utilizados.id,
            descricao: ensaios_utilizados.descricao,
            garantia: ensaios_utilizados.garantia
          });
        });
      });
    }
    this.modalLaudo = true;
  }

  getStatusIcon(status: boolean): string {
    return status ? 'pi-check-circle' : 'pi-times-circle';
  }

  getStatusColor(status: boolean): string {
    return status ? '#22c55e' : '#ef4444';
  }

}  
