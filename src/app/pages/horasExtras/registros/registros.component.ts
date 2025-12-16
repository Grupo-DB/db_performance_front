import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { RegistrosHsExtrasService, RegistroHoraExtra } from '../../../services/horasExtrasServices/registros-hs-extras.service';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-registros',
  imports: [
    SelectModule,CommonModule,FormsModule,DatePickerModule,InputTextModule,ButtonModule
  ],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit {
  ambientes: any[] = [];
  colaboradores: any[] = [];
  selectedAmbiente: any;
  selectedColaborador: any;
  data: Date | null = null;
  horaInicial: any;
  horaFinal: any;
  horasCalculadas: string = '';
  horasDecimal: number = 0;
  digitador: string = '';
  motivo: string = '';
  responsavel: string = '';
  constructor(
    private colaboradorService: ColaboradorService,
    private ambienteService: AmbienteService,
    private registrosService: RegistrosHsExtrasService
  ) { }
  ngOnInit(): void {
    this.getAmbientes();
    this.getDigitadorInfo();
  }
  getAmbientes(): void {
    this.ambienteService.getAmbientes().subscribe(
      ambientes => {
        this.ambientes = ambientes;
      },
      error => {
        console.error('Erro ao carregar os ambientes:', error);
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
      alert('Por favor, selecione um colaborador');
      return;
    }
    if (!this.data) {
      alert('Por favor, selecione uma data');
      return;
    }
    if (!this.horaInicial || !this.horaFinal) {
      alert('Por favor, preencha a hora inicial e final');
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

    // Envia para o backend
    this.registrosService.createRegistro(registro).subscribe(
      response => {
        console.log('Registro criado com sucesso:', response);
        alert('Hora extra cadastrada com sucesso!');
        this.limparFormulario();
      },
      error => {
        console.error('Erro ao criar registro:', error);
        alert('Erro ao cadastrar hora extra. Verifique os dados e tente novamente.');
      }
    );
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
    this.colaboradores = [];
  }

}     
    
  

