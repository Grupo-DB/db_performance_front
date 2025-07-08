import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DrawerModule } from 'primeng/drawer';
import { RouterLink } from '@angular/router';


interface RegisterTipoEnsaioForm {
  nome: FormControl,
}

export interface TipoEnsaio {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-tipo-ensaio',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink
  ],
  providers:[
    MessageService,ConfirmationService
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
  templateUrl: './tipo-ensaio.component.html',
  styleUrl: './tipo-ensaio.component.scss'
})
export class TipoEnsaioComponent implements OnInit{
  tiposEnsaio: any[] = [];

  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registerForm!: FormGroup<RegisterTipoEnsaioForm>;
  loading: boolean = false;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService,
    private ensaioService: EnsaioService,
    private fb: FormBuilder,
  ){
    this.registerForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
    });

    this.editForm  = this.fb.group({
      id: [''],
      nome: [''],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.loadTiposEnsaio();
  }

  loadTiposEnsaio() {
    this.loading = true;
    this.ensaioService.getTiposEnsaio().subscribe(
      response => {
        this.tiposEnsaio = response;
      }, error => {
        console.error('Erro ao carregar os tipos de ensaio:', error);
      }
    )
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

  abrirModalEdicao(tipoEnsaio: TipoEnsaio) {
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: tipoEnsaio.id,
      nome: tipoEnsaio.nome,
    });
  }

  saveEdit(){
    const id = this.editForm.value.id;
    const dadosAtualizados: Partial<TipoEnsaio> = {
      nome: this.editForm.value.nome,
    };
    this.ensaioService.editTipoEnsaio(id, dadosAtualizados).subscribe({
      next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Ensaio atualizado com sucesso!!', life: 1000 });
        this.loadTiposEnsaio();
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

  excluirTipoEnsaio(id: number){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este tipo de ensaio?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      
      accept: () => {
        this.ensaioService.deleteTipoEnsaio(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Ensaio excluído com sucesso!!', life: 1000 });
            this.loadTiposEnsaio();
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: ' Vocé nao tem permissão para realizar esta ação.', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Exclusão cancelada.', life: 1000 });
      }
    
    })
  }

  submit(){
    this.ensaioService.registerTipoEnsaio(
      this.registerForm.value.nome
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Ensaio cadastrado com sucesso!!', life: 1000 });
        this.loadTiposEnsaio();
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
    }
    );
  }

}
