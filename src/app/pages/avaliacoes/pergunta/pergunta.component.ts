import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { PerguntaService } from '../../../services/avaliacoesServices/perguntas/registerpergunta.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { DividerModule } from 'primeng/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';


import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';

interface RegisterPerguntaForm{
  texto: FormControl,
  legenda: FormControl
}
export interface Pergunta{
  id: number;
  texto: string;
  legenda: Text;
}
@Component({
  selector: 'app-pergunta',
  standalone: true,
  imports: [ 
    NzIconModule,NzLayoutModule,NzMenuModule,TabMenuModule,InputTextModule,ReactiveFormsModule,FormsModule,CommonModule,EditorModule,InputTextModule,InputMaskModule,DialogModule,ConfirmDialogModule,DividerModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule, CardModule, InplaceModule, DrawerModule
  ],
  providers: [
    MessageService,PerguntaService,ConfirmationService,
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
  templateUrl: './pergunta.component.html',
  styleUrl: './pergunta.component.scss'
})
export class PerguntaComponent implements OnInit{
  perguntas: Pergunta[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registerperguntaForm!: FormGroup<RegisterPerguntaForm>;
  @ViewChild('RegisterfilialForm') RegisterPerguntaForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  formattedTexts: SafeHtml[] = [];
  constructor(
    private router: Router,
    private messageService: MessageService,
    private perguntaService: PerguntaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService 
  ) 
  {
    this.registerperguntaForm = new FormGroup({
      texto: new FormControl('',[Validators.required, Validators.minLength(3)]),
      legenda: new FormControl('',)
   });
   this.editForm = this.fb.group({
    id: [''],
    texto: [''],
    legenda:['']
   });  
 }

 hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
}
 
 ngOnInit(): void {

this.perguntaService.getPerguntas().subscribe(response => {
    this.perguntas = response;
  });
}
sanitizeHtml(legenda: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(legenda);
}

clearForm() {
  this.registerperguntaForm.reset();
}
 
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}

cleareditForm() {
  this.editForm.reset();
}
abrirModalEdicao(pergunta: Pergunta) {
  this.editFormVisible = true;
  this.editForm.patchValue({
    id: pergunta.id,
    texto: pergunta.texto,
    legenda:pergunta.legenda
  });
}

saveEdit() {
  const perguntaId = this.editForm.value.id;
  const dadosAtualizados: Partial<Pergunta> = {
    texto: this.editForm.value.texto,
    legenda: this.editForm.value.legenda,
    };
  
  this.perguntaService.editPergunta(perguntaId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Pergunta atualizada com sucesso!' });
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
excluirPergunta(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta pergunta?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.perguntaService.deletePergunta(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Pergunta excluída com sucesso!!', life: 1000 });
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
   this.perguntaService.registerpergunta(
     this.registerperguntaForm.value.texto,
     this.registerperguntaForm.value.legenda,
   ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Pergunta registrada com sucesso!' });
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
  })
}
}
