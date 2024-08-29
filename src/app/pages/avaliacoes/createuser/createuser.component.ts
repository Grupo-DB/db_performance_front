import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CreateuserService } from '../../../services/avaliacoesServices/users/createuser.service';
import { passwordValidator } from './passwordValidator';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { TableModule,Table } from 'primeng/table';
import { UserService } from '../../../services/avaliacoesServices/users/user.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GetFuncaoService } from '../../../services/avaliacoesServices/funcoes/getfuncao.service';

interface CreateuserForm {
  first_name: FormControl,
  last_name: FormControl,
  username: FormControl,
  password: FormControl,
  confirmPassword: FormControl,
  funcao: FormControl,
}

interface Funcao{
  name: string
}
export interface User{
  id: number,
  username:string
}

@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    CreateuserService,
    LoginService,
    UserService,
    MessageService,
    GetFuncaoService

  ],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.scss'
})
export class CreateuserComponent implements OnInit{
  users: any[] = [];
  funcoes: Funcao[]|undefined;
  // funcoes: Funcao[] =[
  //   { name: 'Recursos Humanos', code: 'RH'},
  //   { name: 'Avaliador', code: 'AV'}
  // ];
  createuserForm!: FormGroup<CreateuserForm>;
  @ViewChild('CreateuserForm') CreateuserForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private createuserService:CreateuserService,
    private userService: UserService,
    private messageService: MessageService,
    private getfuncaoService: GetFuncaoService
  )
  
  
  
  {
    this.createuserForm = new FormGroup({
      first_name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      last_name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      username: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
      funcao: new FormControl('',Validators.required),
      
    }, { validators: passwordValidator  }); 

    

  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.getfuncaoService.getFuncaos().subscribe(
      funcoes => {
        this.funcoes = funcoes;
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
  this.createuserForm.reset();
}

filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}

  submit(){
    this.createuserService.createuser(
      this.createuserForm.value.first_name, 
      this.createuserForm.value.last_name, 
      this.createuserForm.value.username, 
      this.createuserForm.value.password,
      this.createuserForm.value.confirmPassword,
      this.createuserForm.value.funcao, ).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário registrado com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }),
    })
  }

  navigate(){
    this.router.navigate(["login"])
  }

}


