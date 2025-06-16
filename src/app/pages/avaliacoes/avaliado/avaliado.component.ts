import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { GetCompanyService } from '../../../services/avaliacoesServices/companys/getcompany.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { GetAvaliadorService } from '../../../services/avaliacoesServices/avaliadores/getavaliador.service';
import { GetColaboradorService } from '../../../services/avaliacoesServices/colaboradores/get-colaborador.service';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Colaborador } from '../colaborador/colaborador.component';
import { Formulario } from '../formulario/formulario.component';
import { FormularioService } from '../../../services/avaliacoesServices/formularios/registerformulario.service';

interface RegisterAvaliadoForm{
  colaborador: FormControl,
  formulario: FormControl,
}
export interface Avaliado{
  id: number;
  nome: string;
  colaborador: Colaborador;
  setor: string;
  cargo: string;
  formulario: number;
}

@Component({
  selector: 'app-avaliado',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,
    TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,AreaService,ConfirmationService,
    GetCompanyService,GetFilialService
  ],
  templateUrl: './avaliado.component.html',
  styleUrl: './avaliado.component.scss'
})
export class AvaliadoComponent implements OnInit {
  colaboradores: Colaborador[]| undefined;
  formularios: Formulario[]| undefined;
  avaliados: any[] = [];
  registeravaliadoForm!: FormGroup<RegisterAvaliadoForm>;
  @ViewChild('RegisteravaliadoForm') RegisterAvaliadoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcolaboradorService: GetColaboradorService,
    private formularioService: FormularioService,
    private avaliadoService: AvaliadoService,
    private getavaliadorService: GetAvaliadorService,
  )
  {
    this.registeravaliadoForm = new FormGroup({
      colaborador: new FormControl('',[Validators.required]),
      formulario: new FormControl('',[Validators.required]),
     }); 
   }

   ngOnInit(): void {
    this.avaliadoService.getAvaliados().subscribe(
      (avaliados: Avaliado []) => {
        this.avaliados = avaliados;
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
    

    
    this.formularioService.getFormularios().subscribe(
      formularios =>{
        this.formularios = formularios;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
   }
   clear(table: Table) {
    table.clear();
  }
  
  clearForm() {
  this.registeravaliadoForm.reset();
  }
  
  filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  submit(){
    const colaboradorId = this.registeravaliadoForm.value.colaborador.id;
    const formularioId = this.registeravaliadoForm.value.formulario.id;
    
    this.avaliadoService.registeravaliado(
    colaboradorId,
    formularioId,
      
    ).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
  
  
  navigate(){
    this.router.navigate(["dashboard"])
  }

}
