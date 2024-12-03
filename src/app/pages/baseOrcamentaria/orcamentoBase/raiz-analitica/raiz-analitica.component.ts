import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RaizAnaliticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizAnalitica/raiz-analitica.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

interface RegisterRaizAnaliticaForm{
  raiz_contabil: FormControl,
  gestor: FormControl,
}

export interface RaizAnalitica {
  id: number;
  raiz_contabil: string;
  descricao: string;
  gestor: any;
}

@Component({
  selector: 'app-raiz-analitica',
  standalone: true,
  imports: [
    DividerModule,CommonModule,RouterLink,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService,
  ],
  templateUrl: './raiz-analitica.component.html',
  styleUrl: './raiz-analitica.component.scss'
})
export class RaizAnaliticaComponent implements OnInit{
gestores: any;
raizesAnaliticas:any[] = [];
registerForm!: FormGroup<RegisterRaizAnaliticaForm>;
editForm!: FormGroup;
editFormVisible: boolean = false;
@ViewChild('RegisterRaizAnaliticaForm') RegisterRaizAnaliticaForm: any;
@ViewChild('dt1') dt1!: Table;
inputValue: string = '';

constructor(
  private loginService: LoginService,
  private raizAnaliticaSevice: RaizAnaliticaService,
  private fb: FormBuilder,
  private messageService: MessageService,
  private confirmationService: ConfirmationService,
)
{
 this.registerForm = new FormGroup({
  raiz_contabil: new FormControl('',[Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
  gestor: new FormControl('',[Validators.required])
 });
 this.editForm = this.fb.group({
  id:[''],
  raiz_contabil:[''],
  descricao:[''],
  gestor:['']
 })
}
  ngOnInit(): void {
      this.raizAnaliticaSevice.getGestores().subscribe(
        gestores => {
          this.gestores = gestores;
        },
        error => {
          console.error('Não carregou:',error)
        }
      )
      
      this.raizAnaliticaSevice.getRaizesAnaliticas().subscribe(
        raizesAnaliticas => {
          this.raizesAnaliticas = raizesAnaliticas;
        },
        error => {
          console.error('Error fetching companies:', error);
        }
      )
  }

hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
  }

  getNomeGestor(id: number): string{
    const gestor = this.gestores?.find((gestor: { id: number; }) => gestor.id === id );
    return gestor ? gestor.nome : 'Gestor não encontrado';
  }

  clear(table: Table) {
    table.clear();
  }
  clearForm() {
    this.registerForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  abrirModalEdicao(raiz: RaizAnalitica){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: raiz.id,
      raiz_contabil: raiz.raiz_contabil,
      descricao: raiz.descricao,
      gestor: raiz.gestor,
    })
  }

  saveEdit(){
    const raizAnaliticaId = this.editForm.value.id;
    const gestorId = this.editForm.value.gestor.id;
    const dadosAtualizados: Partial<RaizAnalitica> = {
      gestor: gestorId,
      raiz_contabil: this.editForm.value.raiz_contabil,
      descricao: this.editForm.value.descricao
    };

    this.raizAnaliticaSevice.editRaiAnalitica(raizAnaliticaId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Raiz Analitica atualizada com sucesso!' });
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

  excluirRaizAnalitica(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta Raiz Analitica?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.raizAnaliticaSevice.deleteRaizAnalitica(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Raiz Analítica excluída com sucesso!!', life: 1000 });
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
      const gestorId = this.registerForm.value.gestor.id;
      this.raizAnaliticaSevice.registerRaizAnalitica(
        this.registerForm.value.raiz_contabil,
        gestorId, 
      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Raiz Analítica registrada com sucesso!' });
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
