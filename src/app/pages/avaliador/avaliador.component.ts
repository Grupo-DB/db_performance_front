import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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

import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetAvaliadorService } from '../../services/avaliadores/getavaliador.service';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
import { UserService } from '../../services/users/user.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { User } from '../createuser/createuser.component';

import { ColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { AvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { Colaborador } from '../colaborador/colaborador.component';
import { Avaliado } from '../avaliado/avaliado.component';


interface RegisterAvaliadorForm{
  usuario: FormControl
  colaborador:FormControl
}
export interface Avaliador{
  id: number;
  user: number;
  nome: string;
  colaborador: Colaborador;
  setor: string;
  cargo: string;
  avaliados: Avaliado[];
}

@Component({
  selector: 'app-avaliador',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,AreaService,ConfirmationService,
    GetCompanyService,GetFilialService
  ],
  templateUrl: './avaliador.component.html',
  styleUrl: './avaliador.component.scss'
})
export class AvaliadorComponent implements OnInit {
  usuarios: User[]| undefined;
  colaboradores: Colaborador[]| undefined;
  avaliadores: any[] = [];

  registeravaliadorForm!: FormGroup<RegisterAvaliadorForm>;
  @ViewChild('RegisterfilialForm') RegisterAvaliadorForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private colaboradorService: ColaboradorService,
    private userService: UserService,
    private avaliadorService:AvaliadorService,

  )
  {
    this.registeravaliadorForm = new FormGroup({
      colaborador: new FormControl('',[Validators.required]),
      usuario: new FormControl('',[Validators.required]),
      
     }); 
   }

   ngOnInit(): void {

    this.colaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.userService.getUsers().subscribe(
      usuarios => {
        this.usuarios = usuarios;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.avaliadorService.getAvaliadores().subscribe(
      (avaliadores: Avaliador []) => {
        this.avaliadores = avaliadores;
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
this.registeravaliadorForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  const colaboradorId = this.registeravaliadorForm.value.colaborador.id;
  const usuarioId = this.registeravaliadorForm.value.usuario.id;
  this.avaliadorService.registeravaliador(
    
    colaboradorId,
    usuarioId,
    
    
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}

}