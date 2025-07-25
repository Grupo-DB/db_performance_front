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
import { CentroCusto } from '../centrocusto/centrocusto.component';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { RaizSinteticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizSintetica/raiz-sintetica.service';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';

interface RegisterRaizSinteticaForm{
  raiz_contabil: FormControl;
  //descricao: FormControl;
  //natureza: FormControl;
  cc: FormControl; 
}

export interface RaizSintetica{
  id: number;
  raiz_contabil: string;
  descricao: string;
  natureza: any;
  cc: any;
  
}

@Component({
  selector: 'app-raiz-sintetica',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,ConfirmDialogModule,ToastModule,ButtonModule,IconFieldModule,InputIconModule,FloatLabelModule,SelectModule, CardModule, InplaceModule, DrawerModule
  ],
  providers:[
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
  templateUrl: './raiz-sintetica.component.html',
  styleUrl: './raiz-sintetica.component.scss'
})
export class RaizSinteticaComponent implements OnInit{
  ccs: CentroCusto[]| undefined;
  raizesSinteticas: any[]=[];
  
  //
  editForm!: FormGroup;
  registerForm!:FormGroup<RegisterRaizSinteticaForm>;
  editFormVisible: boolean = false;
  loading: boolean = true;

  @ViewChild('RregisterForm') RegisterRaizSinteticaForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private loginService: LoginService,
    private fb :FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private centroCustoService: CentrocustoService,
    private raizSinteticaService: RaizSinteticaService,
  ){
    this.registerForm = new FormGroup ({
      raiz_contabil: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      cc: new FormControl('',[Validators.required])
    });
    this.editForm = this.fb.group({
      id:[''],
      raiz_contabil:[''],
      descricao:[''],
      natureza:[''],
      cc:['']
    })
  }

  ngOnInit(): void {
 
    this.centroCustoService.getCentroCusto().subscribe(
      ccs => {
        this.ccs = ccs.map(cc => ({
          ...cc,
          label: `${cc.codigo} - ${cc.nome} - ${cc.cc_pai_detalhes.filial_detalhes.nome}` // Cria o rótulo combinado
        }));
      },
      error => {
        console.error('Não carregou:', error);
      }
    );
    this.raizSinteticaService.getRaizSintetica().subscribe(
      raizesSinteticas => {
        // Adiciona o rótulo combinado para cc
        this.raizesSinteticas = raizesSinteticas.map(raiz => ({
          ...raiz,
          ccLabel: `${raiz.cc?.codigo || ''} - ${raiz.cc?.nome || ''}` // Combina código e nome, com fallback para strings vazias
        }));
      },
      error => {
        console.error('Erro ao carregar raízes sintéticas:', error);
      }
    );
  }

  getNomeCc(id: number): string{
    const cc = this.ccs?.find((cc: { id: number; }) => cc.id === id );
    return cc ? `${cc.codigo} - ${cc.nome}` : 'CC não encontrado';
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

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  abrirModalEdicao(raizSintetica: RaizSintetica){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: raizSintetica.id,
      raiz_contabil: raizSintetica.raiz_contabil,
      descricao: raizSintetica.descricao,
      natureza: raizSintetica.natureza,
      centro_custo: raizSintetica.cc,
    })
  }

  saveEdit(){
    const raizSinteticaId = this.editForm.value.id;
    const ccId = this.editForm.value.cc.id;
    const dadosAtualizados: Partial<RaizSintetica> = {
      raiz_contabil: this.editForm.value.raiz_contabil,
      descricao: this.editForm.value.descricao,
      natureza: this.editForm.value.natureza,
      cc: ccId
    };
    this.raizSinteticaService.editRaizSintetica(raizSinteticaId, dadosAtualizados).subscribe({
      next:()=>{
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Raiz Sintetica atualizada com sucesso!' });
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

  excluirRaizSintetica(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta Raiz Sintetica?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.raizSinteticaService.deleteRaizSintetica(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Raiz Sintetica excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
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
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }

  submit(){
    const ccId = this.registerForm.value.cc.id;
    this.raizSinteticaService.registerRaizSintetica(
      this.registerForm.value.raiz_contabil,
      ccId
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Raiz Sintetica registrada com sucesso!' });
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
