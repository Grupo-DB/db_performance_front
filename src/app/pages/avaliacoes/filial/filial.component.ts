import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { InputMaskModule } from 'primeng/inputmask';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { Empresa } from '../registercompany/registercompany.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

interface RegisterFilialForm{
  empresa: FormControl,
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}

export interface Filial {
  id: number;
  empresa: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  codigo: string;
}

@Component({
    selector: 'app-filial',
    standalone: true,
    templateUrl: './filial.component.html',
    styleUrl: './filial.component.scss',
    imports: [
        ReactiveFormsModule,FormsModule,CommonModule,DividerModule,
        InputMaskModule,DialogModule,ConfirmDialogModule,
        IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,
        TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
    ],
    providers:[
      FilialService,
      MessageService,ConfirmationService,
      RegisterCompanyService,GetFilialService
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
})
export class FilialComponent implements OnInit {
  filiais: any[] = [];
  empresas: Empresa[]| undefined;
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  loading: boolean = true;
 

  registerfilialForm!: FormGroup<RegisterFilialForm>;
  @ViewChild('RegisterfilialForm') RegisterFilialForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private filialService:FilialService,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginService: LoginService 
  )

    {
   this.registerfilialForm = new FormGroup({
      empresa: new FormControl('',[Validators.required]),
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      cnpj: new FormControl('',[Validators.required, Validators.minLength(13)]),
      endereco: new FormControl('',[Validators.required,]),
      cidade: new FormControl('',[Validators.required, Validators.minLength(3)]),
      estado: new FormControl('',[Validators.required, Validators.maxLength(2)]),
      codigo: new FormControl('',[Validators.required, Validators.maxLength(2)]),  
    });
    this.editForm = this.fb.group({
      id: [''],
      empresa: [''],
      nome: [''],
      cnpj: [''],
      endereco: [''],
      cidade: [''],
      estado: [''],
      codigo: ['']
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }  

  ngOnInit(): void {
    this.loading = false;
    this.filialService.getFiliais().subscribe(
      (filiais: Filial[]) => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );

    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
        this.mapEmpresas();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );

  } 

  mapEmpresas() {
    this.filiais.forEach(filial => {
      const empresa = this.empresas?.find(empresa => empresa.id === filial.empresa);
      if (empresa) {
        filial.empresaNome = empresa.nome;
      }
    });
    this.loading = false;
  }

 
  getNomeEmpresa(id: number): string {
    const empresa = this.empresas?.find(emp => emp.id === id);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  }
  
clear(table: Table) {
  table.clear();
}
clearForm() {
  this.registerfilialForm.reset();
}
cleareditForm() {
  this.editForm.reset();
}
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}
abrirModalEdicao(filial: Filial) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: filial.id,
    empresa: filial.empresa,
    nome: filial.nome,
    cnpj: filial.cnpj,
    endereco: filial.endereco,
    cidade: filial.cidade,
    estado: filial.estado,
    codigo: filial.codigo,
  });
}
saveEdit() {
  const filialId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const dadosAtualizados: Partial<Filial> = {
    empresa: empresaId,
    nome: this.editForm.value.nome,
    cnpj: this.editForm.value.cnpj,
    endereco: this.editForm.value.endereco,
    cidade: this.editForm.value.cidade,
    estado: this.editForm.value.estado,
    codigo: this.editForm.value.codigo,
  };
  
  this.filialService.editFilial(filialId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial atualizada com sucesso!' });
      setTimeout(() => {
       window.location.reload(); // Atualiza a página após a exclusão
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: (err) => {
      console.error('Login error:', err); 
    
      if (err.status === 401) {
        this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
      } else if (err.status === 403) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
      } else if (err.status === 400) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
      } 
  }
  });
}

excluirFilial(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta filial?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.filialService.deleteFilial(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Filial excluída com sucesso!!', life: 1000 });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a exclusão
          }, 1000); // Tempo em milissegundos (1 segundo de atraso)
        },
        error: (err) => {
          if (err.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
          } 
        }
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
    }
  });
}

  
  submit(){
    const empresaId = this.registerfilialForm.value.empresa.id;
    this.filialService.registerfilial(
      empresaId,
      this.registerfilialForm.value.nome, 
      this.registerfilialForm.value.cnpj, 
      this.registerfilialForm.value.endereco, 
      this.registerfilialForm.value.cidade, 
      this.registerfilialForm.value.estado, 
      this.registerfilialForm.value.codigo
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, tente novamente.' });
        } 
      }
    });
  }
}



