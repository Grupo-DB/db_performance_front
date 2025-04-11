import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Produto } from '../produto/produto.component';
import { CentroCustoPai } from '../../orcamentoBase/centrocustopai/centrocustopai.component';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { CustoproducaoService } from '../../../../services/baseOrcamentariaServices/indicadoresCustoProducao/custoproducao.service';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';
import { ProjecaoService } from '../../../../services/baseOrcamentariaServices/dre/projecao.service';

interface RegisterCustoProducaoForm{
  produto: FormControl;
  ccPai: FormControl;
  fabrica: FormControl;
  periodo: FormControl;
  ano: FormControl;
  quantidade: FormControl;
}

export interface CustoProducao{
  id: number;
  produto: any;
  centro_custo_pai: any;
  fabrica: string;
  periodo: number;
  ano: number;
  quantidade: number;
  produto_detalhes: any;
  centro_custo_pai_detalhes: any;
}



@Component({
  selector: 'app-custoproducao',
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,NzMenuModule,
    InputGroupModule,InputGroupAddonModule,
    DropdownModule,InputTextModule,TableModule,DialogModule,ButtonModule,InputNumberModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,SelectModule,IconFieldModule,InputIconModule 
  ],
  providers:[
    MessageService,ConfirmationService,
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
  templateUrl: './custoproducao.component.html',
  styleUrl: './custoproducao.component.scss'
})
export class CustoproducaoComponent implements OnInit{
  produtos: Produto[] = [];
  ccsPais: CentroCustoPai[] = [];
  custosProducao:any[] = [];
  registerForm!: FormGroup<RegisterCustoProducaoForm>;
  editForm!: FormGroup;
  editFormVisible: boolean = false;

  @ViewChild('RegisterProjecaoForm') RegisterProjecaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  linhaForm: FormGroup;

  fabricas = [
    { nome: '05 - Fábrica de Calcário' },
    { nome: '04 - Fábrica de Cal' },
    { nome: '06 - Fábrica de Argamassa' },
    { nome: '03 - Fábrica de Calcinação' },
    { nome: '07 - Fábrica de Fertilizantes' },
    { nome: '02 - Britagem' },
    { nome: '01 - Mineração' },
  ]

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private custoProducaoService: CustoproducaoService,
    private ccPaiService: CentrocustopaiService,
    private projecaoService: ProjecaoService
  )
  {
    this.linhaForm = this.fb.group({
      linhas: this.fb.array([])
    });
    this.editForm = this.fb.group({
      id: [''],
      produto: [''],
      centro_custo_pai: [''],
      fabrica: [''],
      periodo: [''],
      ano: [''],
      quantidade: ['']
    })
  }

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  ngOnInit(): void {
   this.addLinha();
   this.projecaoService.getProdutos().subscribe(
    response => {
      this.produtos = response;
    }, error => {
      console.log('Nao Carregou', error)
    }
   )
   this.ccPaiService.getCentrosCustoPai().subscribe(
    response => {
      this.ccsPais = response;
    }, error => {
      console.log('Nao Carregou', error)
    }
   )
   this.custoProducaoService.getCustoProducao().subscribe(
    response => {
      this.custosProducao = response;
    }, error => {
      console.log('Nao Carregou', error)
    }
   )
  }

  

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
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

  addLinha(): void {
    this.linhas.push(
      this.fb.group({
        produto: [''],
        centro_custo_pai: [''],
        fabrica: [''],
        periodo: [''],
        ano: [''],
        quantidade: [0],
      })
    );
  }

  get linhas(): FormArray {
      return this.linhaForm.get('linhas') as FormArray;
    }
    
  removeLinha(index: number): void {
    this.linhas.removeAt(index);
  }

  abrirModalEdicao(custoProducao: CustoProducao){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: custoProducao.id,
      produto: custoProducao.produto_detalhes.id,
      centro_custo_pai: custoProducao.centro_custo_pai_detalhes.id,
      fabrica: custoProducao.fabrica,
      periodo: custoProducao.periodo,
      ano: parseInt(custoProducao.ano.toString(), 10),
      quantidade: parseFloat(custoProducao.quantidade.toString())
    })
  }

  saveEdit(){
    const custoProducaoId = this.editForm.value.id;
    const produtoId = this.editForm.value.produto;
    const ccPaiId = this.editForm.value.ccPai;
    const dadosAtualizados: Partial<CustoProducao> = {
      produto: produtoId,
      centro_custo_pai: ccPaiId,
      fabrica: this.editForm.value.fabrica,
      periodo: this.editForm.value.periodo,
      ano: this.editForm.value.ano,
      quantidade: this.editForm.value.quantidade
    };
    this.custoProducaoService.editCustoProducao(custoProducaoId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Custo de Produção Atualizado com Sucesso!'});
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao Atualizar', err);
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

  excluirCustoProducao(id: number){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esse Custo de Produção?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.custoProducaoService.deleteCustoProducao(id).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary:'Confirmado', detail:'Custo de Produção Excluído com Sucesso!'});
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          error: (err) => {
            console.error('Erro ao Excluir', err);
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
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }

  submit(){
    if (this.linhaForm.valid){
      this.custoProducaoService.createLinhas(this.linhaForm.value.linhas).subscribe({
        next:() => {
          this.messageService.add({severity: 'success', summary: 'Sucesso!', detail: 'Custo de Produção registrado com sucesso!'});
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error:(err) => {
          console.error('Deu ruim', err);
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

}   