import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService,ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TagModule } from 'primeng/tag';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Ensaio } from '../ensaio/ensaio.component';
import { CalculoEnsaio } from '../calculo-ensaio/calculo-ensaio.component';
import { DatePickerModule } from 'primeng/datepicker';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';

@Component({
  selector: 'app-resultados',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, 
    InputMaskModule, DialogModule, ConfirmDialogModule, 
    SelectModule, IconFieldModule, FloatLabelModule, TableModule, 
    InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule, 
    DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, 
    InputNumberModule, CardModule, InplaceModule, TooltipModule, 
    TagModule,MultiSelectModule,DatePickerModule
  ],
    providers:[
       MessageService,ConfirmationService
  ],
  animations: [
    trigger('efeitoFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 }))
      ])
    ]),
    trigger('efeitoZoom', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('0.5s ease-out', style({ transform: 'scale(1)' })),
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
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {
  ensaios: Ensaio[] = [];
  calculos: CalculoEnsaio[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  data_inicio: Date | null = null;
  data_fim: Date | null = null;
  produtosSelecionados: any[] = [];
  ensaiosSelecionados: number[] = [];
  calculosSelecionados: string[] = [];
  mediasEnsaios: any[] = [];
  mediasCalculos: any[] = [];
  totalEnsaios: number = 0;
  totalCalculos: number = 0;
  modalVisualizar: boolean = false;
  analiseSelecionada: any = null;
  
  constructor(
    private analiseService: AnaliseService,
    private loginService: LoginService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private amostraService: AmostraService,
    private ensaioService: EnsaioService
  ){}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void { 
    this.getEnsaios();
    this.getCalculos();
    this.loadProdutosAmostra();
  }

  getEnsaios(): void{
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response.filter(ensaio => 
      ensaio.tipo_ensaio_detalhes?.nome !== 'Auxiliar' && 
      ensaio.tipo_ensaio_detalhes?.nome !== 'Resistencia'
    );
      }, error => {
        console.error('Erro ao obter os ensaios:', error);
      }
    )
  }

  getCalculos(): void{
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.calculos = response.filter(calculo => 
      !calculo.descricao.includes('(Cálculo composto Cal)') && 
      !calculo.descricao.includes('(Calc PN Cal)') && 
      !calculo.descricao.includes('(Calc PN Calc Cal)')
    );
      }, error => {
        console.error('Erro ao obter os cálculos:', error);
      }
    )
  }

  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }
      , error => {
        console.error('Erro ao carregar produtos de amostra', error);
      }
    )
  }

  buscarMediasEnsaios(): void {
    if (!this.ensaiosSelecionados || this.ensaiosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um ensaio',
        life: 3000
      });
      return;
    }

    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    // Formatar datas para string no formato esperado pelo backend (YYYY-MM-DD)
    const dataInicio = this.formatarDataParaBackend(this.data_inicio);
    const dataFim = this.formatarDataParaBackend(this.data_fim);

    this.analiseService.getMediasEnsaiosPorPeriodo(
      this.ensaiosSelecionados,
      this.produtosSelecionados,
      dataInicio,
      dataFim
    ).subscribe({
      next: (response: any) => {
        this.mediasEnsaios = response.resultados || [];
        this.totalEnsaios = response.total_ensaios || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.totalEnsaios} ensaio(s) encontrado(s)`,
          life: 3000
        });
      },
      error: (err: any) => {
        console.error('Erro ao obter médias dos ensaios:', err);
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
            detail: 'Acesso negado!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao buscar médias dos ensaios.'
          });
        }
      }
    });
  }

  buscarMediasCalculos(): void {
    if (!this.calculosSelecionados || this.calculosSelecionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um cálculo',
        life: 3000
      });
      return;
    }

    if (!this.data_inicio || !this.data_fim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período (data início e data fim)',
        life: 3000
      });
      return;
    }

    // Formatar datas para string no formato esperado pelo backend (YYYY-MM-DD)
    const dataInicio = this.formatarDataParaBackend(this.data_inicio);
    const dataFim = this.formatarDataParaBackend(this.data_fim);

    // Enviar descrições dos cálculos ao invés de IDs
    this.analiseService.getMediasCalculosPorPeriodo(
      this.calculosSelecionados,
      this.produtosSelecionados,
      dataInicio,
      dataFim
    ).subscribe({
      next: (response: any) => {
        this.mediasCalculos = response.resultados || [];
        this.totalCalculos = response.total_calculos || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.totalCalculos} cálculo(s) encontrado(s)`,
          life: 3000
        });
      },
      error: (err: any) => {
        console.error('Erro ao obter médias dos cálculos:', err);
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
            detail: 'Acesso negado!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Erro ao buscar médias dos cálculos.'
          });
        }
      }
    });
  }

  private formatarDataParaBackend(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  visualizarAnalise(analiseId: number): void {
    this.analiseService.getAnaliseById(analiseId).subscribe({
      next: (analise) => {
        this.analiseSelecionada = analise;
        this.modalVisualizar = true;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Erro ao carregar os detalhes da análise.'
        });
      }
    });
  }

  getStatusL1(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 1);
  }

  getStatusL7(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 7);
  }

  getStatusL28(dataL0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataL0, 28);
  }

  getStatusM1(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 1);
  }

  getStatusM7(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 7);
  }

  getStatusM28(dataM0: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataM0, 28);
  }

  // Métodos para Flexão
  getStatusFlexaoArgamassa28(dataMoldagem: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataMoldagem, 28);
  }

  getStatusFlexaoCimento28(dataMoldagem: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataMoldagem, 28);
  }

  // Métodos para Compressão
  getStatusCompressaoArgamassa28(dataMoldagem: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataMoldagem, 28);
  }

  getStatusCompressaoCimento7(dataMoldagem: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataMoldagem, 7);
  }

  getStatusCompressaoCimento28(dataMoldagem: string): { status: string, diasRestantes: number, cor: string, icone: string } {
    return this.getStatusDataRompimento(dataMoldagem, 28);
  }

  // Método para verificar se um rompimento foi marcado como concluído
  isRompimentoConcluido(tipo: string, periodo: string): boolean {
    if (!this.analiseSelecionada) return false;
    
    const campos: { [key: string]: string } = {
      'variacao_dimensional_l1': 'variacao_dimensional.l1.data',
      'variacao_dimensional_l7': 'variacao_dimensional.l7.data',
      'variacao_dimensional_l28': 'variacao_dimensional.l28.data',
      'variacao_massa_m1': 'variacao_massa.m1.data',
      'variacao_massa_m7': 'variacao_massa.m7.data',
      'variacao_massa_m28': 'variacao_massa.m28.data',
      'flexao_argamassa_28': 'flexao.concluido_argamassa_28',
      'flexao_cimento_28': 'flexao.concluido_cimento_28',
      'compressao_argamassa_28': 'compressao.concluido_argamassa_28',
      'compressao_cimento_7': 'compressao.concluido_cimento_7',
      'compressao_cimento_28': 'compressao.concluido_cimento_28'
    };
    
    const chave = `${tipo}_${periodo}`;
    const campoData = campos[chave];
    
    if (!campoData) return false;
    
    // Navega pelo objeto aninhado
    const partes = campoData.split('.');
    let valor: any = this.analiseSelecionada;
    for (const parte of partes) {
      valor = valor?.[parte];
      if (valor === undefined) return false;
    }
    
    // Para flexão e compressão, verifica se há um campo boolean de concluído
    if (campoData.includes('concluido')) {
      return valor === true;
    }
    
    // Para variação dimensional e massa, verifica se a data está no futuro (marcado como concluído)
    const dataRompimento = new Date(valor);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Se a data for mais de 300 dias no futuro, considera como concluído
    const diasDiferenca = (dataRompimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return diasDiferenca > 300;
  }

  // Método para marcar/desmarcar rompimento como concluído
  marcarRompimentoConcluido(tipo: string, periodo: string): void {
    if (!this.analiseSelecionada) return;
    
    const campos: { [key: string]: string } = {
      'variacao_dimensional_l1': 'variacao_dimensional.l1',
      'variacao_dimensional_l7': 'variacao_dimensional.l7',
      'variacao_dimensional_l28': 'variacao_dimensional.l28',
      'variacao_massa_m1': 'variacao_massa.m1',
      'variacao_massa_m7': 'variacao_massa.m7',
      'variacao_massa_m28': 'variacao_massa.m28',
      'flexao_argamassa_28': 'flexao',
      'flexao_cimento_28': 'flexao',
      'compressao_argamassa_28': 'compressao',
      'compressao_cimento_7': 'compressao',
      'compressao_cimento_28': 'compressao'
    };
    
    const chave = `${tipo}_${periodo}`;
    const caminho = campos[chave];
    
    if (!caminho) return;
    
    // Navega até o objeto correto
    const partes = caminho.split('.');
    let obj: any = this.analiseSelecionada;
    for (const parte of partes) {
      if (!obj[parte]) return;
      obj = obj[parte];
    }
    
    // Para todos os tipos, alterna o campo concluído ou manipula a data
    if (tipo === 'flexao' || tipo === 'compressao') {
      const campoConcluido = `concluido_${periodo}`;
      obj[campoConcluido] = !obj[campoConcluido];
    } else if (tipo === 'variacao_dimensional' || tipo === 'variacao_massa') {
      // Para variação dimensional e massa, manipula a data para indicar conclusão
      const hoje = new Date();
      const dataAtual = new Date(obj.data);
      
      // Se já está concluído (data > 300 dias no futuro), restaura a data original
      const diasDiferenca = (dataAtual.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
      if (diasDiferenca > 300) {
        // Reabrir: calcular a data correta baseada em l0/m0
        const partesPai = caminho.split('.').slice(0, -1);
        let objPai: any = this.analiseSelecionada;
        for (const parte of partesPai) {
          objPai = objPai[parte];
        }
        
        const diasPeriodo = periodo === 'l1' || periodo === 'm1' ? 1 : 
                           periodo === 'l7' || periodo === 'm7' ? 7 : 28;
        const dataBase = new Date(objPai[periodo.charAt(0) + '0'].data);
        const novaData = new Date(dataBase);
        novaData.setDate(novaData.getDate() + diasPeriodo);
        obj.data = novaData.toISOString().split('T')[0];
      } else {
        // Marcar como concluído: adiciona 365 dias
        const dataFutura = new Date(hoje);
        dataFutura.setFullYear(dataFutura.getFullYear() + 1);
        obj.data = dataFutura.toISOString().split('T')[0];
      }
    }
    
    // Salvar no backend
    const analiseId = this.analiseSelecionada.id;
    this.analiseService.editAnalise(analiseId, this.analiseSelecionada).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Rompimento marcado como concluído`,
          life: 3000
        });
      },
      error: (err: any) => {
        console.error('Erro ao atualizar status:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar status do rompimento',
          life: 3000
        });
      }
    });
  }

    // Métodos para verificar status das datas de rompimento
  getStatusDataRompimento(dataBase: string, diasRompimento: number): { status: string, diasRestantes: number, cor: string, icone: string } {
    if (!dataBase) {
      return { status: 'Sem data', diasRestantes: 0, cor: '#6c757d', icone: 'pi-question-circle' };
    }

    const dataBaseDate = new Date(dataBase);
    const dataRompimento = new Date(dataBaseDate);
    dataRompimento.setDate(dataRompimento.getDate() + diasRompimento);
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataRompimento.setHours(0, 0, 0, 0);
    
    const diffTime = dataRompimento.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return { 
        status: `Vencido há ${Math.abs(diasRestantes)} dia(s)`, 
        diasRestantes: diasRestantes, 
        cor: '#dc3545', 
        icone: 'pi-times-circle' 
      };
    } else if (diasRestantes === 0) {
      return { 
        status: 'Vence hoje!', 
        diasRestantes: 0, 
        cor: '#fd7e14', 
        icone: 'pi-exclamation-triangle' 
      };
    } else if (diasRestantes <= 2) {
      return { 
        status: `Vence em ${diasRestantes} dia(s)`, 
        diasRestantes: diasRestantes, 
        cor: '#ffc107', 
        icone: 'pi-exclamation-circle' 
      };
    } else if (diasRestantes <= 5) {
      return { 
        status: `${diasRestantes} dias restantes`, 
        diasRestantes: diasRestantes, 
        cor: '#17a2b8', 
        icone: 'pi-info-circle' 
      };
    } else {
      return { 
        status: `${diasRestantes} dias restantes`, 
        diasRestantes: diasRestantes, 
        cor: '#28a745', 
        icone: 'pi-check-circle' 
      };
    }
  }

}
