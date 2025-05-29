import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { im } from 'mathjs';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';

interface TipoAmostraForm{
  nome: FormControl,
  natureza: FormControl,
}

export interface TipoAmostra {
  id: number;
  nome: string;
  natureza: string;
}

@Component({
  selector: 'app-tipo-amostra',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule,AutoCompleteModule,MultiSelectModule
  ],
  animations: [
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
  templateUrl: './tipo-amostra.component.html',
  styleUrl: './tipo-amostra.component.scss'
})
export class TipoAmostraComponent implements OnInit {
  tiposAmostra: any[] = [];

  registerForm!: FormGroup<TipoAmostraForm>;
  editForm!: FormGroup;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  editFormVisible: boolean = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private amostraService: AmostraService
  ) 
  { 
    this.registerForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      natureza: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
    });
    this.editForm = this.fb.group({
      id:[''],
      nome: [''],
      natureza: ['']
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  ngOnInit(): void {
    this.loadTiposAmostra();
  }
 
  loadTiposAmostra(): void{
    this.amostraService.getTiposAmostra().subscribe(
      response => {
        this.tiposAmostra = response
      }, 
      error =>{
        console.log('Erro ao carregar tipos de amostra:', error);
      }
    )
  }

  clear(table: Table) {
    table.clear();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue,'contains');
  }
  clearForm(){
    this.registerForm.reset();
  }
  clearEditForm(){
    this.editForm.reset();
  }

  abrirModalEdicao(tipoAmostra: TipoAmostra) {
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: tipoAmostra.id,
      nome: tipoAmostra.nome,
      natureza: tipoAmostra.natureza
    });
  }
  saveEdit(){
    const id = this.editForm.value.id;
    const dadosAtualizados: Partial<TipoAmostra> = {
      nome: this.editForm.value.nome,
      natureza: this.editForm.value.natureza,
    };
    this.amostraService.editTipoAmostra(id, dadosAtualizados).subscribe({
      next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Amostra atualizado com sucesso!!', life: 1000 });
        this.loadTiposAmostra();
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

  excluirTipoAmostra(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este tipo de amostra?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      
      accept: () => {
        this.amostraService.deleteTipoAmostra(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Amostra excluído com sucesso!!', life: 1000 });
            this.loadTiposAmostra();
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
    });
  }

  submit(){
    this.amostraService.registerTipoAmostra(
      this.registerForm.value.nome,
      this.registerForm.value.natureza
    ).subscribe({
      next:() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Amostra cadastrado com sucesso!!', life: 1000 });
        this.loadTiposAmostra();
        this.clearForm();
      }
      , error: (err) => {
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

}
