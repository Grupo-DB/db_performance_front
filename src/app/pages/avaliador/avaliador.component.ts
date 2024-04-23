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
import { RegisterAreaService } from '../../services/areas/registerarea.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetAvaliadorService } from '../../services/avaliadores/getavaliador.service';
import { RegisterAvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
import { UserService } from '../../services/users/user.service';


interface RegisterAvaliadorForm{
  colaborador: FormControl,
  usuario: FormControl
}
interface Colaborador {
  nome: string
}
interface User {
  username: string
}

@Component({
  selector: 'app-avaliador',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,RegisterAreaService,
    GetCompanyService,GetFilialService
  ],
  templateUrl: './avaliador.component.html',
  styleUrl: './avaliador.component.scss'
})
export class AvaliadorComponent implements OnInit {
  colaboradores: Colaborador[]| undefined;
  usuarios: User[]| undefined;
  avaliadores: any[] = [];

  registeravaliadorForm!: FormGroup<RegisterAvaliadorForm>;
  @ViewChild('RegisterfilialForm') RegisterAvaliadorForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcolaboradorService: GetColaboradorService,
    private userService: UserService,
    private registeravaliadorService: RegisterAvaliadorService,
    private getavaliadorService: GetAvaliadorService,
  )
  {
    this.registeravaliadorForm = new FormGroup({
      colaborador: new FormControl('',[Validators.required]),
      usuario: new FormControl('',[Validators.required]),
     }); 
   }

   ngOnInit(): void {
    this.getcolaboradorService.getColaboradores().subscribe(
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
  this.registeravaliadorService.registeravaliador( 
    colaboradorId,
    usuarioId,
    
    
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}


navigate(){
  this.router.navigate(["dashboard"])
}


}