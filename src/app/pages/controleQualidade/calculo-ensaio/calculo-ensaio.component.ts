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

import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';

interface RegisterCalculoEnsaioForm{
  descricao: FormControl;
  funcao: FormControl;
  ensaios: FormControl;
  calculosEnsaio: FormControl;
  responsavel: FormControl;
  unidade: FormControl;
  valor: FormControl;
}

export interface CalculoEnsaio{
  id: number;
  descricao: string;
  funcao: string;
  ensaios: any;
  ensaios_detalhes: any;
  calculos_ensaio?: any;
  calculos_ensaio_detalhes?: any;
  responsavel: string;
  unidade: string;
  valor: number;
  tecnica?: string;
}

@Component({
  selector: 'app-calculo-ensaio',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
  ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
  InputNumberModule,AutoCompleteModule, CardModule, InplaceModule, TooltipModule,
  MultiSelectModule
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

  async gerarCalculoTecnico(): Promise<string> {
    // Busca o maior número já utilizado em tecnica (ex: calculo01, calculo02, ...) a partir do backend
    let max = 0;
    try {
      const calculosBackend = await new Promise<any[]>(resolve => {
        this.ensaioService.getCalculoEnsaio().subscribe(resolve, () => resolve([]));
      });
      calculosBackend.forEach(c => {
        if (c.tecnica) {
          const match = c.tecnica.match(/calculo(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > max) max = num;
          }
        }
      });
    } catch (e) {
      // fallback para lista local
      this.caculosEnsaio.forEach(c => {
        if (c.tecnica) {
          const match = c.tecnica.match(/calculo(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > max) max = num;
          }
        }
      });
    }
    const next = max + 1;
    return 'calculo' + next.toString().padStart(2, '0');
  }

  // Armazena o mapeamento de variáveis técnicas (nome amigável <-> tecnica)
  variaveisTecnicas: { id: any, nome: string, tecnica: string }[] = [];


  safeVars: any = {};
  nameMap: any = {};

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
   { label: 'Cálculo de Ensaio', value: 'CalculoEnsaio' },
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
  resultados: { ensaioId: number, valor: number }[] = [];

  // Permite escolher Ensaios manualmente em vez de só inferir pela expressão
  syncEnsaiosFromExpr = true;

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
      calculosEnsaio: new FormControl([]),
      responsavel: new FormControl(''),
      unidade: new FormControl(''),
      valor: new FormControl(0)
    });

    this.editForm = this.fb.group({
      id: [''],
      descricao: [''],
      funcao: [''],
      ensaios: [''],
      calculosEnsaio: [''],
      responsavel: [''],
      unidade: [''],
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


// Gera nomes seguros

  getValoresPorTipo(tipo: string): any[] {
    switch (tipo) {
      case 'Ensaio': return this.ensaios.map(e => ({ label: e.descricao, value: e.descricao }));
      case 'CalculoEnsaio': return this.caculosEnsaio.map((c: any) => {
        const fallback = c?.id != null ? `calculo${String(c.id).padStart(2, '0')}` : undefined;
        const codigo = c.tecnica || fallback;
        if (!codigo) return null;
        const label = c.descricao || codigo;
        return { label, value: codigo as string };
      }).filter(Boolean) as any[];
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

  gerarNomesSegurosComValoresAtuais() {
    this.safeVars = {};
    this.nameMap = {};
    
    // Processar ensaios usando o campo ensaioTecnico ou tecnica
    this.ensaios.forEach((ensaio: any) => {
      let tecnica = ensaio.ensaioTecnico || ensaio.tecnica;
      if (!tecnica) {
        tecnica = 'ens' + ensaio.id;
      }
      const resultado = this.resultados.find(r => r.ensaioId === ensaio.id);
      this.safeVars[tecnica] = resultado ? resultado.valor : 0;
      this.nameMap[ensaio.descricao] = tecnica;
    });

    // Processar cálculos de ensaio usando o campo tecnica
    this.caculosEnsaio.forEach((calculo: any) => {
      let tecnica = calculo.tecnica;
      if (!tecnica) {
        tecnica = 'calculo' + calculo.id;
      }
      // Usar o valor do cálculo (se existir) ou 0 como padrão
      this.safeVars[tecnica] = calculo.valor || 0;
      this.nameMap[calculo.descricao] = tecnica;
    });
  }

// Monta a expressão substituindo nomes de ensaio por nomes seguros

getExpressaoString() {
  this.gerarNomesSegurosComValoresAtuais();
  return this.expressaoDinamica
    .map(b => {
      // Se for tipo Ensaio ou CalculoEnsaio, substitui pelo nome técnico real
      if ((b.tipo === 'Ensaio' || b.tipo === 'CalculoEnsaio') && b.valor !== undefined && this.nameMap[b.valor]) {
        return this.nameMap[b.valor];
      }
      return b.valor;
    })
    .filter(v => !!v)
    .join(' ');
}

converterExpressaoParaNomes(expr: string): string {
  // Inverte o nameMap para buscar pelo valor
  const reverseMap = Object.fromEntries(
    Object.entries(this.nameMap).map(([k, v]) => [v, k])
  );
  // Substitui todos os ensXX e calculoXX pelo nome correspondente
  return expr.replace(/(ens\d+|ensaio\d+|calculo\d+)/g, (match) => reverseMap[match] || match);
}
// Avalia a expressão usando math.js e os valores dos ensaios
avaliarExpressao() {
  const expressao = this.registerForm.get('funcao')?.value;
  this.gerarNomesSegurosComValoresAtuais(); // <-- agora pega os valores digitados
  try {
    const resultado = evaluate(expressao, this.safeVars);
    return resultado;
  } catch (e) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro ao calcular',
      detail: 'Expressão inválida ou erro de cálculo.',
      life: 5000
    });
    return null;
  }
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
    // Converte a string da função em blocos para edição
  const funcao = this.editForm.get('funcao')?.value || '';
  const funcaoComNomes = this.converterExpressaoParaNomes(funcao);
  this.expressaoDinamica = this.converterFuncaoParaBlocos(funcaoComNomes);
  this.editarFormulaVisivel = true;
  }
// O método converterFuncaoParaBlocos pode ficar igual, pois agora recebe nomes de ensaio
converterFuncaoParaBlocos(funcao: string): { tipo: string, valor: string }[] {
  const tokens = funcao.split(' ');
  return tokens.map(token => {
    if (['+', '-', '*', '/'].includes(token)) {
      return { tipo: 'Operador', valor: token };
    } else if (!isNaN(Number(token))) {
      return { tipo: 'Valor', valor: token };
    } else if (token.startsWith('calculo')) {
      return { tipo: 'CalculoEnsaio', valor: token };
    } else {
      return { tipo: 'Ensaio', valor: token };
    }
  });
}

salvarFormula() {
  const novaExpressao = this.getExpressaoString(); // monta a expressão a partir dos blocos
  this.registerForm.get('funcao')?.setValue(novaExpressao);
  this.montarFormulaVisivel = false;
  // Atualiza a lista de ensaios se estiver sincronizando
  this.atualizarEnsaiosDoForm();
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
      ensaios: calculo.ensaios_detalhes?.descricao || '',
      calculosEnsaio: calculo.calculos_ensaio_detalhes?.descricao || '',
      responsavel: calculo.responsavel,
      unidade: calculo.unidade,
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
      unidade: this.editForm.value.unidade,
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

  async submit(){
    const expressao = this.getExpressaoString();

    if (!expressao || expressao.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A expressão não pode estar vazia.' });
      return;
    }

    if (!this.validarExpressaoComValores(expressao)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
      return;
    }

    // Gera o mapeamento nome amigável <-> tecnica
    this.gerarNomesSegurosComValoresAtuais();
    const ensaiosSelecionados = Array.isArray(this.registerForm.value.ensaios)
      ? this.registerForm.value.ensaios
      : [this.registerForm.value.ensaios];

    const calculosSelecionados = Array.isArray(this.registerForm.value.calculosEnsaio)
      ? this.registerForm.value.calculosEnsaio
      : this.registerForm.value.calculosEnsaio ? [this.registerForm.value.calculosEnsaio] : [];

    // Gera o código técnico de forma única consultando o backend
    const calculoTecnico = await this.gerarCalculoTecnico();

    // Preenche o campo tecnica em uma estrutura auxiliar para uso futuro
    this.variaveisTecnicas = ensaiosSelecionados.map((ensaioId: any, idx: number) => {
      const ensaio = this.ensaios.find(e => e.id === ensaioId);
      const nome = ensaio ? ensaio.descricao : `ens${(idx+1).toString().padStart(2, '0')}`;
      const tecnica = this.nameMap[nome] || `ens${(idx+1).toString().padStart(2, '0')}`;
      return {
        id: ensaioId,
        nome,
        tecnica
      };
    });

    // O backend espera apenas os IDs dos ensaios e cálculos
    const payload = {
      descricao: this.registerForm.value.descricao,
      funcao: this.registerForm.value.funcao,
      ensaios: ensaiosSelecionados,
      calculosEnsaio: calculosSelecionados,
      responsavel: this.registerForm.value.responsavel,
      unidade: this.registerForm.value.unidade,
      valor: this.registerForm.value.valor,
      tecnica: calculoTecnico
    };

    console.log('Enviando cálculo de ensaio:', payload);
    console.log('Código técnico gerado:', calculoTecnico);
    this.ensaioService.registerCalculoEnsaio(
      payload.descricao,
      payload.funcao,
      payload.ensaios,
      payload.responsavel,
      payload.unidade,
      payload.valor,
      payload.calculosEnsaio,
      payload.tecnica
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
    });
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

// Valida a expressão substituindo variáveis seguras por 1
validarExpressaoComValores(expr: string): boolean {
  try {
    // Gere nomes seguros e substitua na expressão
    this.gerarNomesSegurosComValoresAtuais();
    let exprSegura = expr;
    Object.keys(this.nameMap).forEach(origName => {
      // Substitui todas as ocorrências do nome original por nome seguro
      const regex = new RegExp(origName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      exprSegura = exprSegura.replace(regex, this.nameMap[origName]);
    });

    // Substitui nomes técnicos do tipo ensXX, ensaioXX ou calculoXX por 1
    let fakeExpr = exprSegura.replace(/(ens\d+|ensaio\d+|calculo\d+)/g, '1');
    fakeExpr = fakeExpr.replace(/\s+/g, ' ');
    fakeExpr = fakeExpr.replace(/1\s+1/g, '1');
    console.log('Expressão para validação:', fakeExpr);
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
  // Se o usuário quiser controlar manualmente, não sobrescrever
  if (!this.syncEnsaiosFromExpr) return;

  // Busca todos os códigos técnicos usados na expressão
  const expr = this.getExpressaoString();
  
  // Procura por códigos técnicos de ensaios (ensXX, ensaioXX)
  const ensaioMatches = (expr.match(/(ens\d+|ensaio\d+)/g) || []);
  const ensaiosUsados = ensaioMatches
    .map(codigo => this.ensaios.find((e: any) => e.ensaioTecnico === codigo || e.tecnica === codigo))
    .filter(e => !!e);

  // Procura por códigos técnicos de cálculos (calculoXX)
  const calculoMatches = (expr.match(/calculo\d+/g) || []);
  const calculosUsados = calculoMatches
    .map(codigo => this.caculosEnsaio.find((c: any) => c.tecnica === codigo))
    .filter(c => !!c);

  // Atualiza os campos do formulário
  this.registerForm.get('ensaios')?.setValue(ensaiosUsados.map(e => e.id));
  this.registerForm.get('calculosEnsaio')?.setValue(calculosUsados.map(c => c.id));
}

// Callback do MultiSelect quando o usuário escolhe Ensaios manualmente
onEnsaiosSelecionadosChange(ids: any[]) {
  this.registerForm.get('ensaios')?.setValue(ids || []);
}

// Callback do MultiSelect quando o usuário escolhe Cálculos de Ensaio manualmente
onCalculosSelecionadosChange(ids: any[]) {
  this.registerForm.get('calculosEnsaio')?.setValue(ids || []);
}

// Alterna sincronização entre expressão e lista de ensaios
toggleSyncEnsaios(checked: boolean) {
  this.syncEnsaiosFromExpr = checked;
  if (this.syncEnsaiosFromExpr) {
    this.atualizarEnsaiosDoForm();
  }
}

}