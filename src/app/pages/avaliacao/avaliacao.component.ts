import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCargoService } from '../../services/cargos/getcargo.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { RegisterTipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { GetAvaliacaoService } from '../../services/avaliacoes/getavaliacao.service';
import { RegisterAvaliacaoService } from '../../services/avaliacoes/registeravaliacao.service.spec';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
import { GetFormularioService } from '../../services/formularios/getformulario.service';
import { GetTipoAvaliacaoService } from '../../services/tipoavaliacoes/gettipoavaliacao.service';
import { GetAvaliadorService } from '../../services/avaliadores/getavaliador.service';


interface RegisterAvaliacaoForm{
  tipoavaliacao: FormControl,
  colaborador: FormControl,
  avaliador: FormControl,
  formulario: FormControl,
  data_avaliacao: FormControl,
  periodo: FormControl,
  resposta: FormControl,
  justificativa: FormControl,
  nota: FormControl,
  feedback: FormControl
}
interface TipoAvaliacao{
  nome: string
}
interface Colaborador{
  nome: string
}
interface Avaliador{
  colaborador: string
}
interface Formulario{
  nome: string
}
interface Periodo{
  nome: string
}

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService,GetSetorService,RegisterTipoContratoService,
    GetCompanyService,GetFilialService,GetAreaService,GetCargoService
  ],
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.scss'
})
export class AvaliacaoComponent implements OnInit {
  tipoavaliacoes: TipoAvaliacao [] | undefined;
  colaboradores: Colaborador [] | undefined;
  avaliadores: Avaliador [] | undefined;
  formularios: Formulario [] | undefined;
  periodos: Periodo [] | undefined;
  avaliacoes: any[] = [];

  registeravaliacaoForm!: FormGroup<RegisterAvaliacaoForm>;
  @ViewChild('RegisterAvaliacaoForm') RegisterAvaliacaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private gettipoavaliacaoService: GetTipoAvaliacaoService,
    private getcolaboradorService: GetColaboradorService,
    private registeravaliacaoService: RegisterAvaliacaoService,
    private getformularioService: GetFormularioService,
    private getavaliacaoService: GetAvaliacaoService,
    private getavaliadorService: GetAvaliadorService,
  )
  {
    this.registeravaliacaoForm = new FormGroup({
      tipoavaliacao: new FormControl('',[Validators.required]),
      colaborador: new FormControl('',[Validators.required]),
      avaliador: new FormControl('',[Validators.required]),
      formulario: new FormControl('',[Validators.required]),
      data_avaliacao: new FormControl('',[Validators.required]),
      periodo: new FormControl('',[Validators.required]),
      resposta: new FormControl('',[Validators.required]),
      justificativa: new FormControl('',[Validators.required]),
      nota: new FormControl('',[Validators.required]),
      feedback: new FormControl('',[Validators.required]),
    });
 }

 ngOnInit(): void {
  this.periodos = [
    { nome: '1º Trimestre'},
    { nome: '2º Trimestre'},
    { nome: '3º Trimestre'},
    { nome: '4º Trimestre'},
  ];

  this.gettipoavaliacaoService.getTipoavaliacoes().subscribe(
    tipoavaliacoes => {
      this.tipoavaliacoes = tipoavaliacoes;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.getcolaboradorService.getColaboradores().subscribe(
    colaboradores => {
      this.colaboradores = colaboradores;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.getavaliadorService.getAvaliadores().subscribe(
    avaliadores => {
      this.avaliadores = avaliadores;
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

  this.getavaliacaoService.getAvaliacoes().subscribe(
    avaliacoes => {
      this.avaliacoes = avaliacoes;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

}

clear(table: Table) {
  table.clear();
}

clearForm() {
this.registeravaliacaoForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  const tipoavaliacaoId = this.registeravaliacaoForm.value.tipoavaliacao.id;
  const colaboradorId = this.registeravaliacaoForm.value.colaborador.id;
  const avaliadorId = this.registeravaliacaoForm.value.avaliador.id;
  const formularioId = this.registeravaliacaoForm.value.formulario.id;
  this.registeravaliacaoService.registeravaliacao(
    tipoavaliacaoId,
    colaboradorId,
    avaliadorId,
    formularioId,
    this.registeravaliacaoForm.value.data_avaliacao,
    this.registeravaliacaoForm.value.periodo,
    this.registeravaliacaoForm.value.resposta,
    this.registeravaliacaoForm.value.justificativa,
    this.registeravaliacaoForm.value.nota,
    this.registeravaliacaoForm.value.feedback,

  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  });
}


navigate(){
  this.router.navigate(["dashboard"])
}

}


