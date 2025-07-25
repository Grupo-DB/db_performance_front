import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { GrupoItensService } from '../../../../services/baseOrcamentariaServices/orcamento/GrupoItens/grupo-itens.service';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { RaizAnaliticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizAnalitica/raiz-analitica.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';


interface RegisterGrupoItensForm{
  codigo: FormControl;
  nome_completo: FormControl;
  gestor: FormControl;
}

export interface GrupoItens{
  id: string;
  codigo: string;
  nome_completo: string;
  gestor: any;
  gestor_detalhes: any;
}

@Component({
  selector: 'app-grupo-itens',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule,ButtonModule,FloatLabelModule,SelectModule,IconFieldModule,InputIconModule, CardModule, InplaceModule, DrawerModule
  ],
  providers: [
    MessageService,ConfirmationService
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
  templateUrl: './grupo-itens.component.html',
  styleUrl: './grupo-itens.component.scss'
})
export class GrupoItensComponent implements OnInit {
  gruposItens: any[] = [];
  gestores: any;
  editForm!: FormGroup;
  
  registerForm!: FormGroup<RegisterGrupoItensForm>;
  editFormVisible: boolean = false;
  loading: boolean = true;

  @ViewChild('RegisterGrupoItensForm') RegisterGrupoItensForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private loginService: LoginService,
    private fb :FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private grupoItensService: GrupoItensService,
    private raizAnaliticaSevice: RaizAnaliticaService
  )
  {
    this.registerForm = new FormGroup({
      codigo: new FormControl('', Validators.required),
      nome_completo: new FormControl('', Validators.required),
      gestor: new FormControl('', Validators.required),
    });
    this.editForm = this.fb.group({
      id:[''],
      codigo:[''],
      nome_completo:[''],
      gestor:['']
    });
  }
  ngOnInit(): void {
    this.raizAnaliticaSevice.getGestores().subscribe(
      gestores =>{
        this.gestores = gestores;
        this.mapGestores();
      },
      error => {
        console.error('Não Carregou', error)
      }
    );
    this.grupoItensService.getGruposItens().subscribe(
      gruposItens => {
        this.gruposItens = gruposItens
      },
      error => {
        console.error('Não Carregou', error)
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

  clearForm() {
    this.registerForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  abrirModalEdicao(grupoItens: GrupoItens){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: grupoItens.id,
      codigo: grupoItens.codigo,
      nome_completo: grupoItens.nome_completo,
      gestor: grupoItens.gestor_detalhes.id
    })
  }

  saveEdit(){
    const grupoItensId = this.editForm.value.id;
    const gestorId = this.editForm.value.gestor;
    const dadosAtualizados: Partial<GrupoItens>={
      codigo: this.editForm.value.codigo,
      nome_completo: this.editForm.value.nome_completo,
      gestor: gestorId
    };
    this.grupoItensService.editGrupoItens(grupoItensId,dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Grupo de Itens atualizado com sucesso!' });
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
    })
  }

  mapGestores() {
    this.gruposItens.forEach(grupoIten => {
      // Verifica se o gestor existe e se o id do gestor bate com o id do centroCusto
      const gestor = this.gestores?.find((gestor_detalhes: { id: any; }) => gestor_detalhes.id === grupoIten.gestor_detalhes);
  
      // Se o gestor for encontrado, associamos o nome ao centroCusto
      if (gestor) {
        grupoIten.gestorNome = gestor.gestor_detalhes ? gestor.gestor_detalhes.nome : 'Nome não encontrado';
      } else {
        grupoIten.gestorNome = 'Gestor não encontrado';
      }
    });
  
    this.loading = false;
  }

  excluirGrupoItens(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este Grupo de Itens?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.grupoItensService.deleteGrupoItens(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Grupo de Itens excluído com sucesso!!', life: 1000 });
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
    this.grupoItensService.registerGrupoItens(
      this.registerForm.value.codigo,
      this.registerForm.value.nome_completo,
      gestorId
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Grupo de Itens registrado com sucesso!' });
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
