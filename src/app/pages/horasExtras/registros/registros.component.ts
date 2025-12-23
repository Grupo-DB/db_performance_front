import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { RegistrosHsExtrasService, RegistroHoraExtra, RegistrosResponse } from '../../../services/horasExtrasServices/registros-hs-extras.service';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FilialService } from '../../../../../app/services/avaliacoesServices/filiais/registerfilial.service';


@Component({
  selector: 'app-registros',
  imports: [
    SelectModule,
    CommonModule,
    FormsModule,
    DatePickerModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit {
  ambientes: any[] = [];
  ambientesFiltrados: any[] = [];
  colaboradores: any[] = [];
  filiais: any[] = [];
  selectedAmbiente: any;
  selectedColaborador: any;
  selectedFilial: any;
  data: Date | null = null;
  horaInicial: any;
  horaFinal: any;
  horasCalculadas: string = '';
  horasDecimal: number = 0;
  digitador: string = '';
  motivo: string = '';
  responsavel: string = '';
  filialSelected: any;
  
  // Novos campos para o layout
  mostrarFormulario: boolean = false;
  modoEdicao: boolean = false;
  registroEditando: any = null;
  filtroFuncionario: string = '';
  filtroFilial: number | null = null;
  filtroAmbiente: number | null = null;
  filtroMes: number | null = null;
  filtroAno: number = new Date().getFullYear();
  registros: any[] = [];
  totalHoras: number = 0;
  totalFuncionarios: number = 0;
  totalRegistros: number = 0;
  
  // Opções para os filtros
  meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];
  
  anos: number[] = [];
  
  constructor(
    private colaboradorService: ColaboradorService,
    private ambienteService: AmbienteService,
    private registrosService: RegistrosHsExtrasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private filialService: FilialService
  ) { }
  ngOnInit(): void {
    this.getAmbientes();
    this.getDigitadorInfo();
    this.getColaboradores();
    this.inicializarAnos();
    this.getRegistros();
    this.getFiliais();
  }
  
  inicializarAnos(): void {
    const anoAtual = new Date().getFullYear();
    // Gera lista de anos dos últimos 5 anos até o próximo ano
    for (let i = anoAtual - 5; i <= anoAtual + 1; i++) {
      this.anos.push(i);
    }
  }
  getAmbientes(): void {
    this.ambienteService.getAmbientes().subscribe(
      ambientes => {
        this.ambientes = ambientes;
        this.ambientesFiltrados = ambientes; // Inicialmente mostra todos
      },
      error => {
        console.error('Erro ao carregar os ambientes:', error);
      }
    )
  }

  filtrarAmbientesPorFilial(filialId: number): void {
    if (filialId) {
      this.ambientesFiltrados = this.ambientes.filter(amb => amb.filial === filialId);
      this.selectedAmbiente = null; // Limpa o ambiente selecionado
      this.selectedColaborador = null; // Limpa o colaborador selecionado
    } else {
      // Se nenhuma filial for selecionada, mostra todos os ambientes
      this.ambientesFiltrados = this.ambientes;
      this.selectedAmbiente = null;
      this.selectedColaborador = null;
    }
  }

  getFiliais(): void {
    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
      },
      error => {
        console.error('Erro ao carregar as filiais:', error);
      }
    )
  }
  

  colaboradoeresByAmbiente(selectedAmbiente: number): void {
    this.colaboradorService.getColaboradoresByAmbiente(selectedAmbiente).subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
        console.log('Colaboradores do ambiente', colaboradores);
      },
      error => {
        console.error('Erro ao carregar os colaboradores do ambiente:', error);
      }
    )
  }  
  calcularTempo(): void {
    if (this.horaInicial && this.horaFinal) {
      const inicio = new Date(this.horaInicial);
      const fim = new Date(this.horaFinal);
      
      // Calcula a diferença em milissegundos
      let diferencaMs = fim.getTime() - inicio.getTime();
      
      // Se a hora final for menor que a inicial, assumir que passou da meia-noite
      if (diferencaMs < 0) {
        diferencaMs += 24 * 60 * 60 * 1000; // Adiciona 24 horas em milissegundos
      }
      
      // Converte para horas e minutos
      const totalMinutos = Math.floor(diferencaMs / (1000 * 60));
      const horas = Math.floor(totalMinutos / 60);
      const minutos = totalMinutos % 60;
      
      // Armazena o valor decimal das horas
      this.horasDecimal = parseFloat((totalMinutos / 60).toFixed(2));
      
      // Formata o resultado
      this.horasCalculadas = `${horas}h ${minutos}min (${this.horasDecimal} horas)`;
    } else {
      this.horasCalculadas = '';
      this.horasDecimal = 0;
    }
  }  
  getDigitadorInfo(): void {
    this.colaboradorService.getColaboradorInfo().subscribe(
      digitador => {
        this.responsavel = digitador.nome;
        console.log('Informações do digitador', digitador);
      },
      error => {
        console.error('Erro ao carregar as informações do digitador:', error);
      }
    )
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  cadastrarRegistro(): void {
    // Validações
    if (!this.selectedColaborador) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Por favor, selecione um colaborador'
      });
      return;
    }
    if (!this.data) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Por favor, selecione uma data'
      });
      return;
    }
    if (!this.horaInicial || !this.horaFinal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Por favor, preencha a hora inicial e final'
      });
      return;
    }

    // Busca o nome do colaborador selecionado
    const colaboradorSelecionado = this.colaboradores.find(c => c.id === this.selectedColaborador);
    
    // Prepara o objeto para envio
    const registro: RegistroHoraExtra = {
      colaborador: colaboradorSelecionado ? colaboradorSelecionado.nome : '',
      data: this.formatDate(this.data),
      hora_inicial: this.formatTime(new Date(this.horaInicial)),
      hora_final: this.formatTime(new Date(this.horaFinal)),
      horas: this.horasDecimal,
      motivo: this.motivo,
      responsavel: this.responsavel
    };

    if (this.modoEdicao && this.registroEditando) {
      // Modo edição
      this.registrosService.updateRegistro(this.registroEditando.id, registro).subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Registro atualizado com sucesso!'
          });
          this.limparFormulario();
          this.getRegistros();
          this.mostrarFormulario = false;
          this.modoEdicao = false;
          this.registroEditando = null;
        },
        error => {
          console.error('Erro ao atualizar registro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar registro. Tente novamente.'
          });
        }
      );
    } else {
      // Modo criação
      this.registrosService.createRegistro(registro).subscribe(
        response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Hora extra cadastrada com sucesso!'
          });
          this.limparFormulario();
          this.getRegistros();
          this.mostrarFormulario = false;
        },
        error => {
          console.error('Erro ao criar registro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar hora extra. Verifique os dados e tente novamente.'
          });
        }
      );
    }
  }

  limparFormulario(): void {
    this.selectedAmbiente = null;
    this.selectedColaborador = null;
    this.data = null;
    this.horaInicial = null;
    this.horaFinal = null;
    this.horasCalculadas = '';
    this.horasDecimal = 0;
    this.motivo = '';
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.modoEdicao = false;
      this.registroEditando = null;
      this.limparFormulario();
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicao = false;
    this.registroEditando = null;
    this.limparFormulario();
  }

  getColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Erro ao carregar colaboradores:', error);
      }
    );
  }

  getRegistros(): void {
    const filtros: any = {};
    
    if (this.filtroFuncionario) {
      filtros.colaborador = this.filtroFuncionario;
    }
    
    if (this.filtroFilial) {
      filtros.filial = this.filtroFilial;
    }
    
    if (this.filtroAmbiente) {
      filtros.ambiente = this.filtroAmbiente;
    }
    
    if (this.filtroMes) {
      filtros.mes = this.filtroMes;
    }
    
    if (this.filtroAno) {
      filtros.ano = this.filtroAno;
    }
    
    this.registrosService.getRegistros(filtros).subscribe(
      (response: RegistrosResponse) => {
        this.registros = response.registros;
        this.totalHoras = response.total_horas;
        this.totalRegistros = response.quantidade_registros;
        this.calcularFuncionariosUnicos();
      },
      error => {
        console.error('Erro ao carregar registros:', error);
      }
    );
  }

  calcularFuncionariosUnicos(): void {
    // Conta funcionários únicos
    const funcionariosUnicos = new Set(this.registros.map(reg => reg.colaborador));
    this.totalFuncionarios = funcionariosUnicos.size;
  }
  
  aplicarFiltros(): void {
    this.getRegistros();
  }

  onFiltroFilialChange(filialId: number | null): void {
    // Limpa o filtro de ambiente quando a filial muda
    this.filtroAmbiente = null;
    this.aplicarFiltros();
  }

  onFiltroAmbienteChange(): void {
    this.aplicarFiltros();
  }
  
  limparFiltros() {
    this.filtroFuncionario = '';
    this.filtroFilial = null;
    this.filtroAmbiente = null;
    this.filtroMes = null;
    this.filtroAno = new Date().getFullYear();
    this.ambientesFiltrados = this.ambientes; // Reseta para mostrar todos os ambientes
    this.getRegistros();
  }

  exportarPDF(): void {
    const doc = new jsPDF();
    
    // Configurações
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Logo e Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Horas Extras', pageWidth / 2, 20, { align: 'center' });
    
    // Informações do Filtro
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 35;
    
    // Data do relatório
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Data de Emissão: ${dataAtual}`, 14, yPos);
    yPos += 7;
    
    // Filtros aplicados
    if (this.filtroFilial) {
      const filialNome = this.filiais.find(f => f.id === this.filtroFilial)?.nome || '';
      doc.text(`Filial: ${filialNome}`, 14, yPos);
      yPos += 7;
    }
    
    if (this.filtroAmbiente) {
      const ambienteNome = this.ambientesFiltrados.find(a => a.id === this.filtroAmbiente)?.nome || '';
      doc.text(`Ambiente: ${ambienteNome}`, 14, yPos);
      yPos += 7;
    }
    
    if (this.filtroFuncionario) {
      doc.text(`Funcionário: ${this.filtroFuncionario}`, 14, yPos);
      yPos += 7;
    }
    
    if (this.filtroMes && this.filtroAno) {
      const mesNome = this.meses.find(m => m.value === this.filtroMes)?.label || '';
      doc.text(`Período: ${mesNome}/${this.filtroAno}`, 14, yPos);
      yPos += 7;
    } else if (this.filtroAno) {
      doc.text(`Ano: ${this.filtroAno}`, 14, yPos);
      yPos += 7;
    }
    
    // Cards de Resumo
    yPos += 5;
    doc.setFillColor(41, 128, 185);
    doc.rect(14, yPos, 60, 20, 'F');
    doc.setFillColor(39, 174, 96);
    doc.rect(76, yPos, 60, 20, 'F');
    doc.setFillColor(230, 126, 34);
    doc.rect(138, yPos, 60, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Total de Horas', 44, yPos + 7, { align: 'center' });
    doc.text('Funcionários', 106, yPos + 7, { align: 'center' });
    doc.text('Registros', 168, yPos + 7, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.totalHoras.toFixed(2)}h`, 44, yPos + 15, { align: 'center' });
    doc.text(`${this.totalFuncionarios}`, 106, yPos + 15, { align: 'center' });
    doc.text(`${this.totalRegistros}`, 168, yPos + 15, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    // Tabela de Registros
    yPos += 25;
    
    const tableData = this.registros.map(registro => [
      registro.colaborador,
      this.formatarData(registro.data),
      registro.hora_inicial,
      registro.hora_final,
      Number(registro.horas).toFixed(2),
      registro.motivo || '-',
      registro.responsavel || '-'
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Colaborador', 'Data', 'Hora Inicial', 'Hora Final', 'Horas', 'Motivo', 'Responsável']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Colaborador
        1: { cellWidth: 22 }, // Data
        2: { cellWidth: 22 }, // Hora Inicial
        3: { cellWidth: 22 }, // Hora Final
        4: { cellWidth: 15, halign: 'right' }, // Horas
        5: { cellWidth: 40 }, // Motivo
        6: { cellWidth: 30 }  // Responsável
      },
      margin: { top: 10, left: 14, right: 14 },
      didDrawPage: (data) => {
        // Rodapé
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });
    
    // Salvar PDF
    const nomeArquivo = this.gerarNomeArquivoPDF();
    doc.save(nomeArquivo);
  }

  formatarData(data: string): string {
    if (!data) return '-';
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  }

  gerarNomeArquivoPDF(): string {
    const dataAtual = new Date().toISOString().split('T')[0];
    let nome = `horas_extras_${dataAtual}`;
    
    if (this.filtroFuncionario) {
      nome += `_${this.filtroFuncionario.replace(/\s+/g, '_')}`;
    }
    
    if (this.filtroMes && this.filtroAno) {
      const mesNome = this.meses.find(m => m.value === this.filtroMes)?.label || '';
      nome += `_${mesNome}_${this.filtroAno}`;
    } else if (this.filtroAno) {
      nome += `_${this.filtroAno}`;
    }
    
    return `${nome}.pdf`;
  }

  editarRegistro(registro: any): void {
    this.modoEdicao = true;
    this.registroEditando = registro;
    this.mostrarFormulario = true;
    
    // Preenche o formulário com os dados do registro
    const colaborador = this.colaboradores.find(c => c.nome === registro.colaborador);
    this.selectedColaborador = colaborador ? colaborador.id : null;
    
    // Converte a data string para Date
    this.data = new Date(registro.data + 'T00:00:00');
    
    // Converte as horas string para Date
    const hoje = new Date();
    const [horasIni, minutosIni] = registro.hora_inicial.split(':');
    const [horasFim, minutosFim] = registro.hora_final.split(':');
    
    this.horaInicial = new Date(hoje.setHours(parseInt(horasIni), parseInt(minutosIni), 0));
    this.horaFinal = new Date(hoje.setHours(parseInt(horasFim), parseInt(minutosFim), 0));
    
    this.horasDecimal = Number(registro.horas);
    this.motivo = registro.motivo || '';
    
    this.calcularTempo();
  }

  excluirRegistro(registro: any): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o registro de ${registro.colaborador}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.registrosService.deleteRegistro(registro.id).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Registro excluído com sucesso!'
            });
            this.getRegistros();
          },
          error => {
            console.error('Erro ao excluir registro:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao excluir registro. Tente novamente.'
            });
          }
        );
      }
    });
  }

}
  

