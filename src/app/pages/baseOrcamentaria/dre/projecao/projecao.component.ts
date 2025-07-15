import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormGroupName, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProjecaoService } from '../../../../services/baseOrcamentariaServices/dre/projecao.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Produto } from '../produto/produto.component';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface RegisterProjecaoForm{
  produto: FormControl;
  aliquota: FormControl;
  precoMedioVenda: FormControl;
  custoMedioVariavel: FormControl;
  periodo: FormControl;
  ano: FormControl;
  quantidadeCarregada: FormControl;
  quantidadeProduzida: FormControl
}

export interface Projecao{
  id: number;
  produto: any;
  preco_medio_venda: number;
  custo_medio_variavel: number;
  periodo: number;
  ano: number;
  quantidade_carregada: number;
  produto_detalhes: any;
}

@Component({
  selector: 'app-projecao',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,InputTextModule,TableModule,FloatLabelModule,
    DialogModule,ButtonModule,MessagesModule,SelectModule,IconFieldModule,InputIconModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,InputNumberModule,ButtonModule
  ],
  providers: [
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
  templateUrl: './projecao.component.html',
  styleUrl: './projecao.component.scss'
})
export class ProjecaoComponent implements OnInit {
  produtoDetalhes: any | undefined;
  selectedProduto: any;
  projecoes: any[]=[];
  dados: any[]=[];
  produtos: Produto[]=[];
  registerForm!: FormGroup<RegisterProjecaoForm>;
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  teste!: any;
  @ViewChild('RegisterProjecaoForm') RegisterProjecaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  linhaForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private projecaoService: ProjecaoService,
    private loginService: LoginService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) 
    {
    this.linhaForm = this.fb.group({
      linhas: this.fb.array([]),
    });
    this.editForm = this.fb.group({
      id:[''],
      produto:[''],
      aliquota:[''],
      preco_medio_venda:[''],
      custo_medio_variavel:[''],
      periodo:[''],
      ano:[''],
      quantidade_carregada:[''],
    })
  }

  ngOnInit(): void {
    this.addLinha(); // Adiciona uma linha inicial
    this.projecaoService.getLinhas().subscribe(
      response => {
        this.projecoes = response;
      }, error =>{
        console.log('Não Carregou',error)
      } 
    )
    this.projecaoService.getProdutos().subscribe(
      response =>{
        this.produtos = response;
      }, error =>{
        console.log('Não Carregou', error)
      }
    )
  }

  onProdutoSelecionado(produtoId: any): void{
    if(produtoId){
      this.selectedProduto = produtoId;
      this.produtosDetalhes();
    }
  }

  produtosDetalhes(): Promise <void>{
    return new Promise((resolve, reject) =>{
      if(this.selectedProduto !== undefined){
        this.projecaoService.getProdutosDetalhes(this.selectedProduto).subscribe(
          (response) =>{
            this.produtoDetalhes = response
            resolve();
          },
          error => {
            console.log('Não Carregou', error)
          }
        )
      }
    })
  }

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));
  


  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
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
    
    abrirModalEdicao(projecao: Projecao) {
      this.editFormVisible = true;
      this.editForm.patchValue({
          id: projecao.id,
          produto: projecao.produto_detalhes.id,
          preco_medio_venda: parseFloat(projecao.preco_medio_venda.toString()),
          custo_medio_variavel: parseFloat(projecao.custo_medio_variavel.toString()),
          periodo: projecao.periodo,
          ano: parseInt(projecao.ano.toString(), 10),
          quantidade_carregada: parseFloat(projecao.quantidade_carregada.toString())
      });
  }
  saveEdit(){
    const projecaoId = this.editForm.value.id;
    const produtoId = this.editForm.value.produto;
    const dadosAtualizados: Partial<Projecao> = {
      produto: produtoId,
      preco_medio_venda: this.editForm.value.preco_medio_venda,
      custo_medio_variavel: this.editForm.value.custo_medio_variavel,
      periodo: this.editForm.value.periodo,
      ano: this.editForm.value.ano,
      quantidade_carregada: this.editForm.value.quantidade_carregada,
    };
    this.projecaoService.editLinha(projecaoId, dadosAtualizados).subscribe({
      next: ()=>{
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Projeção atualizada com sucesso!' });
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

  excluirLinha(id: number){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta Projeção?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.projecaoService.deleteLinha(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Projeção excluída com sucesso!!', life: 1000 });
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

  get linhas(): FormArray {
    return this.linhaForm.get('linhas') as FormArray;
  }

  addLinha(): void {
    this.linhas.push(
      this.fb.group({
        produto: [''],
        preco_medio_venda: [0],
        custo_medio_variavel: [0],
        periodo: [''],
        ano: [''],
        quantidade_carregada: [0],
      })
    );
  }


  removeLinha(index: number): void {
    this.linhas.removeAt(index);
  }

  onSubmit() {
    if (this.linhaForm.valid) {
      this.projecaoService.createLinhas(this.linhaForm.value.linhas).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Projeções registrada com sucesso!' });
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
}