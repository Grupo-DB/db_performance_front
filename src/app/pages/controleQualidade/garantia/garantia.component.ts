import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
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
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';

interface GarantiaProdutoForm{
  produto: FormControl,
  requisito: FormControl,
  norma: FormControl,
  classe: FormControl,
  especificacao: FormControl,
  minimo: FormControl,
  maximo: FormControl,
  unidade: FormControl,
}
export interface GarantiaProduto{
  id: number,
  produto: any,
  produto_detalhes: any,
  requisito: string,
  norma: string,
  classe: string,
  especificacao: string,
  minimo: number,
  maximo: number,
  unidade: string,
}

@Component({
  selector: 'app-garantia',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, CardModule, InplaceModule,
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
  templateUrl: './garantia.component.html',
  styleUrl: './garantia.component.scss'
})
export class GarantiaComponent implements OnInit{
  garantiasProduto: GarantiaProduto[] = [];
  produtosAmostra: any[] = [];
  registerForm!: FormGroup<GarantiaProdutoForm>;
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
    private amostraService: AmostraService,
  )
  {
    this.registerForm = new FormGroup<GarantiaProdutoForm>({
      produto: new FormControl('', Validators.required),
      requisito: new FormControl('', Validators.required),
      norma: new FormControl('', Validators.required),
      classe: new FormControl('', Validators.required),
      especificacao: new FormControl('', Validators.required),
      minimo: new FormControl(0, [Validators.required, Validators.min(0)]),
      maximo: new FormControl(0, [Validators.required, Validators.min(0)]),
      unidade: new FormControl('', Validators.required),
    });
    this.editForm = this.fb.group({
      id: [''],
      produto: [''],
      requisito: [''],
      norma: [''],
      classe: [''],
      especificacao: [''],
      minimo: [''],
      maximo: [''],
      unidade: [''],
    });
  }
  hasGroup(groups:string[]): boolean{
    return this.loginService.hasAnyGroup(groups);
  }
  ngOnInit(): void {
    this.loadGarantiasProduto();
    this.loadProdutosAmostra();
  }
  loadGarantiasProduto(){
    this.amostraService.getGarantiaProdutos().subscribe(
      response => {
        this.garantiasProduto = response;
      },
       error => {
        console.log('Erro ao carregar garantias de produto:', error);
      }
    );
  }

  loadProdutosAmostra(){
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      },
      error => {
        console.log('Erro ao carregar produtos de amostra:', error);
      }
    );
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

  abrirModalEdicao(garantia: GarantiaProduto){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: garantia.id,
      produto: garantia.produto_detalhes.id,
      requisito: garantia.requisito,
      norma: garantia.norma,
      classe: garantia.classe,
      especificacao: garantia.especificacao,
      minimo: garantia.minimo,
      maximo: garantia.maximo,
      unidade: garantia.unidade,
    });
  }

  saveEdit(){
    const id = this.editForm.value.id;
    const dadosAtualizados: Partial<GarantiaProduto> = {
      produto: this.editForm.value.produto,
      requisito: this.editForm.value.requisito,
      norma: this.editForm.value.norma,
      classe: this.editForm.value.classe,
      especificacao: this.editForm.value.especificacao,
      minimo: this.editForm.value.minimo,
      maximo: this.editForm.value.maximo,
      unidade: this.editForm.value.unidade,
    };
    this.amostraService.editGarantiaProduto(id, dadosAtualizados).subscribe({ 
      next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Garantia editada com sucesso!' });
        this.editFormVisible = false;
        this.loadGarantiasProduto();
      },
      error: (err) => {
        console.error('Erro ao editar garantia:', err);
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

  excluirGarantia(id: number){
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir essa garantia de produto?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.amostraService.deleteGarantiaProduto(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Garantia excluída com sucesso!' });
            this.loadGarantiasProduto();
          },
          error: (err) => {
            console.error('Erro ao excluir garantia:', err);
            if (err.status === 401) {
              this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
            } else if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
            }
          }
        });
      }
    });
  }

  submit(){
    this.amostraService.registerGarantiaProduto(
      this.registerForm.value.produto,
      this.registerForm.value.requisito,
      this.registerForm.value.norma,
      this.registerForm.value.classe,
      this.registerForm.value.especificacao,
      this.registerForm.value.minimo,
      this.registerForm.value.maximo,
      this.registerForm.value.unidade,
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Garantia registrada com sucesso!' });
        this.loadGarantiasProduto();
        this.clearForm();
      },
      error: (err) => {
        console.error('Erro ao registrar garantia:', err);
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