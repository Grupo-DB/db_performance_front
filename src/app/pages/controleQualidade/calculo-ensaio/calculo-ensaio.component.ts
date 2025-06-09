import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Ensaio, Responsaveis } from '../ensaio/ensaio.component';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { evaluate } from 'mathjs';
import { id } from 'date-fns/locale';

interface RegisterCalculoEnsaioForm{
  descricao: FormControl;
  funcao: FormControl;
  ensaios: FormControl;
  responsavel: FormControl;
  valor: FormControl;
}

export interface CalculoEnsaio{
  id: number;
  descricao: string;
  funcao: string;
  ensaios: any;
  ensaios_detalhes: any;
  responsavel: string;
  valor: number;
}

@Component({
  selector: 'app-calculo-ensaio',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule,AutoCompleteModule
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
  templateUrl: './calculo-ensaio.component.html',
  styleUrl: './calculo-ensaio.component.scss'
})
export class CalculoEnsaioComponent implements OnInit {
  caculosEnsaio: any[] = [];
  ensaios: Ensaio[] = [];
  filteredEnsaios: any[] = [];
  expressao: string = '';
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registerForm!: FormGroup<RegisterCalculoEnsaioForm>;
  loading: boolean = false;
  montarFormulaVisivel: boolean = false;
  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  @ViewChild('autoComp') autoComp!: AutoComplete;

  responsaveis = [
    { value: 'Antonio Carlos Vargas Sito' },
    { value: 'Fabiula Bueno' },
    { value: 'Janice Castro de Oliveira'},
    { value: 'Karine Urruth Kaizer'},
    { value: 'Luciana de Oliveira' },
    { value: 'Kaua Morales Silbershlach'},
    { value: 'Marco Alan Lopes'},
    { value: 'Maria Eduarda da Silva'},
    { value: 'Monique Barcelos Moreira'},
    { value: 'Renata Rodrigues Machado Pinto'},
    { value: 'Sâmella de Campos Moreira'},
    { value: 'David Weslei Sprada'},
    { value: 'Camila Vitoria Carneiro Alves Santos'},
  ]

  tipos = [
   { label: 'Ensaio', value: 'Ensaio' }, 
   { label: 'Operador', value:'Operador' }, 
   { label: 'Condicional', value:'Condicional' }, 
   { label: 'Delimitador', value:'Delimitador' }, 
   { label: 'Operador Lógico', value:'Operador Lógico' },
   { label: 'Valor', value:'Valor' }
  ];
  condicionais = [
    { label: 'condição verdadeira', value: '?' },
    { label: 'se não', value: ':' },
    
  ];
  delimitadores = [
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '{', value: '{' },
    { label: '}', value: '}' },  
  ];
  operadores = [
    { label: '+', value: '+' },
    { label: '-', value: '-' },
    { label: '*', value: '*' },
    { label: '/', value: '/' },
    { label: 'x²', value: '^' },
    { label: 'v²', value: 'sqrt' },
  ];
  operadoresLogicos = [
    { label: 'e', value: '&&' },
    { label: 'ou', value: '||' },
    { label: 'não', value: '!' },
    { label: 'igual', value: '==' },
    { label: 'diferente', value: '!=' },
    { label: 'menor que', value: '<' },
    { label: 'maior que', value: '>' },
    { label: 'menor ou igual a', value: '<=' },
    { label: 'maior ou igual a', value: '>=' },
    { label: 'recebe', value: '=' },
  ];
  
  expressaoDinamica: { tipo?: string, valor?: string }[] = [
    { tipo: '', valor: '' }
  ];

  elementos: any[] = [];
  editarFormulaVisivel: boolean = false;

  @HostListener('document:keydown.insert', ['$event'])
  handleInsertShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.adicionarBloco();
  }

  @HostListener('document:keydown.delete', ['$event'])
  handleInsertShortcutDelete(event: KeyboardEvent) {
    event.preventDefault();
    this.removerBloco(this.expressaoDinamica.length - 1);
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
    private loginService: LoginService,
    private el: ElementRef
  ) 
  { 
    this.registerForm = new FormGroup({
      descricao: new FormControl('', [Validators.required, Validators.minLength(3)]),
      funcao: new FormControl('', [Validators.required]),
      ensaios: new FormControl('', [Validators.required]),
      responsavel: new FormControl(''),
      valor: new FormControl(0)
    });
   
    this.editForm = this.fb.group({
      id: [''],
      descricao: [''],
      funcao: [''],
      ensaios: [''],
      responsavel: [''],
      valor: ['']
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.registerForm.get('valor')?.disable();
    this.loadEnsaios();
    this.loadCalculosEnsaio();
    // Preenche elementos após carregar ensaios
    setTimeout(() => {
      this.elementos = [
        ...this.ensaios.map(e => e.descricao),
        '(', ')', '[', ']', 'if', 'else', 'while'
      ];
    }, 500);
   
  }
  
  getValoresPorTipo(tipo: string): any[] {
    switch (tipo) {
      case 'Ensaio': return this.ensaios.map(e => ({ label: e.descricao, value: e.descricao }));
      case 'Operador': return this.operadores;
      case 'Condicional': return this.condicionais;
      case 'Delimitador': return this.delimitadores;
      case 'Operador Lógico': return this.operadoresLogicos;
      case 'Valor': return [];
      default: return [];
    }
  }
  
  adicionarBloco() {
    this.expressaoDinamica.push({ tipo: '', valor: '' });
    this.registerForm.get('funcao')?.setValue(this.getExpressaoString());
    this.atualizarEnsaiosDoForm();
  }
  
  removerBloco(i: number) {
    if (this.expressaoDinamica.length > 1) {
      this.expressaoDinamica.splice(i, 1);
      this.registerForm.get('funcao')?.setValue(this.getExpressaoString());
      this.atualizarEnsaiosDoForm();
    }
  }

  filterEnsaios(event: any) {
    const query = event.query.split(/[\s\+\-\*\/\(\)]+/).pop()?.toLowerCase() || '';
    this.filteredEnsaios = this.ensaios.filter(e =>
      e.descricao.toLowerCase().includes(query)
    );
  }

  getExpressaoString() {
    return this.expressaoDinamica
      .map(b => b.valor)
      .filter(v => !!v)
      .join(' ');
  }

  addEnsaio(event: any) {
    const variavel = event.descricao;
    const input = this.autoComp?.inputEL?.nativeElement;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      this.expressao =
        this.expressao.substring(0, start) +
        variavel +
        this.expressao.substring(end);
      setTimeout(() => {
        input.focus();
        input.selectionStart = input.selectionEnd = start + variavel.length;
      });
    } else {
      this.expressao += variavel;
    }
  }

  loadEnsaios() {
    this.ensaioService.getEnsaios().subscribe(
      response =>{
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }

  loadCalculosEnsaio() {
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.caculosEnsaio = response;
      }, error => {
        console.error('Erro ao carregar os cálculos de ensaio:', error);
      }
    )
  }
   
  montarFormula(){
    this.montarFormulaVisivel = true
  }
  editarFormula(){
    // Converta a string da função em blocos para edição
  const funcao = this.editForm.get('funcao')?.value || '';
  this.expressaoDinamica = this.converterFuncaoParaBlocos(funcao);
  this.editarFormulaVisivel = true;
  }

  converterFuncaoParaBlocos(funcao: string): { tipo: string, valor: string }[] {
  // Exemplo simples: separa por espaço
  const tokens = funcao.split(' ');
  return tokens.map(token => {
    if (['+', '-', '*', '/'].includes(token)) {
      return { tipo: 'Operador', valor: token };
    } else if (!isNaN(Number(token))) {
      return { tipo: 'Valor', valor: token };
    } else {
      return { tipo: 'Ensaio', valor: token };
    }
  });
}

salvarFormula() {
  const novaExpressao = this.getExpressaoString(); // monta a expressão a partir dos blocos
  this.registerForm.get('funcao')?.setValue(novaExpressao);
  this.montarFormulaVisivel = false;
}

salvarFormulaEditada() {
  const novaExpressao = this.getExpressaoString(); // monta a expressão a partir dos blocos
  this.editForm.get('funcao')?.setValue(novaExpressao);
  this.editarFormulaVisivel = false;
}

  abrirModalEdicao(calculo: CalculoEnsaio) {
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: calculo.id,
      descricao: calculo.descricao,
      funcao: calculo.funcao,
      ensaios: calculo.ensaios_detalhes.descricao,
      responsavel: calculo.responsavel,
      valor: calculo.valor
    });
  }

  saveEdit(){

      const expressao = this.editForm.value.funcao;

    if (!expressao || expressao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A expressão não pode estar vazia.' });
      return;
    }

    if (!this.validarExpressaoComValores(expressao)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
      return;
    }

    const id = this.editForm.value.id;
    const ensaios = this.editForm.value.ensaios;
    const dadosAtualizados: Partial<CalculoEnsaio> = {
      descricao: this.editForm.value.descricao,
      funcao: this.editForm.value.funcao,
      ensaios: ensaios,
      responsavel: this.editForm.value.responsavel,
      valor: this.editForm.value.valor
    };
    this.ensaioService.editCalculoEnsaio(id, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cálculo de ensaio editado com sucesso!' });
        this.loadCalculosEnsaio();
        this.editFormVisible = false;
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
   
  excluirCalculoEnsaio(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esse cálculo de ensaio?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.ensaioService.deleteCalculoEnsaio(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cálculo de ensaio excluído com sucesso!' });
            this.loadCalculosEnsaio();
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
    const expressao = this.getExpressaoString();

  if (!expressao || expressao.trim() === '') {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A expressão não pode estar vazia.' });
    return;
  }

  if (!this.validarExpressaoComValores(expressao)) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
    return;
  }

    const ensaios = Array.isArray(this.registerForm.value.ensaios)
  ? this.registerForm.value.ensaios
  : [this.registerForm.value.ensaios];
    console.log('Enviando ensaios:', ensaios);
    this.ensaioService.registerCalculoEnsaio(
      this.registerForm.value.descricao,
      this.registerForm.value.funcao,
      ensaios,
      this.registerForm.value.responsavel,
      this.registerForm.value.valor
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Cálculo de ensaio cadastrado com sucesso!!', life: 1000 });
        this.loadCalculosEnsaio();
      },

      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Vocês não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
    }
      }

    })
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

  validarExpressaoComValores(expr: string): boolean {
  try {
    // Substitui todas as variáveis por 1 (ou outro valor fictício)
    const fakeExpr = expr.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, '1');
    evaluate(fakeExpr);
    this.messageService.add({
      severity: 'info',
      summary: 'Expressão válida!',
      detail: `Expressão testada: ${fakeExpr}`,
      life: 5000
    });
    return true;
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Expressão inválida!',
      detail: 'A expressão montada possui erro de sintaxe ou operadores inválidos.',
      life: 5000
    });
    return false;
  }
}

private atualizarEnsaiosDoForm() {
  const descricoes = this.ensaios.map(e => e.descricao);

  // Pegue os ensaios usados na expressão, sem duplicatas
  const usados = this.expressaoDinamica
    .filter(b => b.tipo === 'Ensaio' && descricoes.includes(b.valor || ''))
    .map(b => b.valor)
    .filter((valor, idx, arr) => arr.indexOf(valor) === idx) // elimina duplicatas
    .map(valor => this.ensaios.find(e => e.descricao === valor))
    .filter(e => !!e);

  this.registerForm.get('ensaios')?.setValue(usados.map(e => e.id));
}

}
