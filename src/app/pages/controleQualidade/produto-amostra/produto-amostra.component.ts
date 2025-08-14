import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

interface ProdutoAmostraForm {
  nome: FormControl,
  registroEmpresa: FormControl,
  registroProduto: FormControl,
  material: FormControl,
  codDb: FormControl
}

export interface ProdutoAmostra {
  id: number;
  nome: string;
  registro_empresa: string;
  registro_produto: string;
  material: string;
  cod_db: string;
}

@Component({
  selector: 'app-produto-amostra',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, CardModule, InplaceModule,
    CdkDragPlaceholder
],
  animations:[
    trigger('efeitoFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 }))
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
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './produto-amostra.component.html',
  styleUrl: './produto-amostra.component.scss'
})
export class ProdutoAmostraComponent implements OnInit {
  produtosAmostra: any[] = [];

  registerForm!: FormGroup<ProdutoAmostraForm>;
  editForm!: FormGroup;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  editFormVisible: boolean = false;

  materiais = [
  { value: 'aditivos', display:'Aditivos' },
  { value: 'areia', display:'Areia' },
  { value: 'argamassa', display:'Argamassa' },
  { value: 'cal', display:'Cal' },
  { value: 'calcario', display:'Calcário' },
  { value: 'cimento', display:'Cimento' },
  { value: 'cinza pozolana', display:'Cinza Pozolana' },
  { value: 'fertilizante', display:'Fertilizante' },
  { value: 'finaliza', display:'Finaliza' },
  { value: 'aditivos', display:'Aditivos' },
  { value: 'mineracaoo', display:'Mineração' },
]

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private amostraService: AmostraService
    
  )
   {
    this.registerForm = new FormGroup<ProdutoAmostraForm>({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      registroEmpresa: new FormControl('', ),
      registroProduto: new FormControl('',),
      material: new FormControl('', [Validators.required]),
      codDb: new FormControl('',)
    });
    this.editForm = this.fb.group({
      id:[''],
      nome:[''],
      registro_empresa: [''],
      registro_produto: [''],
      material: [''],
      codDb: ['']
    });
  }
  
  hasGroup(groups:string[]): boolean{
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.loadProdutosAmostra();
  }

  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }, error => {
        console.error('Erro ao carregar produtos amostra:', error);
      }
    )
  }

  private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '') // Remove acentos
           .toLowerCase() 
           .trim(); // Remove espaços extras
}  

  onMaterialChange(materialValue: string, formType: 'register' | 'edit' = 'register'): void {
    if (materialValue) {
      const materialNormalizado = this.normalize(materialValue);
      console.log('Material normalizado:', materialNormalizado);
      
      if (formType === 'register') {
        this.registerForm.get('material')?.setValue(materialNormalizado, { emitEvent: false });
      } else {
        this.editForm.get('material')?.setValue(materialNormalizado, { emitEvent: false });
      }
    }
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

  abrirModalEdicao(produtoAmostra: ProdutoAmostra){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: produtoAmostra?.id,
      nome: produtoAmostra?.nome,
      registro_empresa: produtoAmostra?.registro_empresa,
      registro_produto: produtoAmostra?.registro_produto,
      material: produtoAmostra.material,
      codDb: produtoAmostra.cod_db
    });
    console.log(this.editForm);
  }

  saveEdit(){
    const id = this.editForm.value.id;
    const dadosAtualizados: Partial<ProdutoAmostra> = {
      nome: this.editForm.value.nome,
      registro_empresa: this.editForm.value.registro_empresa,
      registro_produto: this.editForm.value.registro_produto,
      material: this.editForm.value.material,
      cod_db: this.editForm.value.codDb
    };
    this.amostraService.editProduto(id, dadosAtualizados).subscribe({
      next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Produto de Amostra atualizado com sucesso!!', life: 1000 });
        this.loadProdutosAmostra();
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

  excluirProdutoAmostra(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este produto de amostra?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',

      accept:() =>{
        this.amostraService.deleteProduto(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Produto de Amostra excluído com sucesso!!', life: 1000 });
            this.loadProdutosAmostra();
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
    })
  }

submit(){
  this.amostraService.registerProduto(
    this.registerForm.value.nome,
    this.registerForm.value.registroEmpresa,
    this.registerForm.value.registroProduto,
    this.registerForm.value.material,
    this.registerForm.value.codDb
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Produto de Amostra cadastrado com sucesso!!', life: 1000 });
      this.loadProdutosAmostra();
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
  this.RegisterForm.resetForm();
}


}
