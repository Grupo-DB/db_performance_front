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
   { label: 'Função Matemática', value:'FuncaoMatematica' },
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

  funcoesMatematicas = [
    // Funções básicas
    { label: 'Raiz Quadrada', value: 'sqrt' },
    { label: 'Potência (x^y)', value: 'pow' },
    { label: 'Logaritmo Natural', value: 'log' },
    { label: 'Logaritmo Base 10', value: 'log10' },
    { label: 'Exponencial', value: 'exp' },
    
    // Funções trigonométricas
    { label: 'Seno', value: 'sin' },
    { label: 'Cosseno', value: 'cos' },
    { label: 'Tangente', value: 'tan' },
    { label: 'Arco Seno', value: 'asin' },
    { label: 'Arco Cosseno', value: 'acos' },
    { label: 'Arco Tangente', value: 'atan' },
    
    // Funções de arredondamento
    { label: 'Arredondar', value: 'round' },
    { label: 'Piso (menor inteiro)', value: 'floor' },
    { label: 'Teto (maior inteiro)', value: 'ceil' },
    { label: 'Valor Absoluto', value: 'abs' },
    
    // Funções estatísticas
    { label: 'Média', value: 'mean' },
    { label: 'Mediana', value: 'median' },
    { label: 'Modo', value: 'mode' },
    { label: 'Desvio Padrão', value: 'std' },
    { label: 'Variância', value: 'var' },
    { label: 'Desvio Absoluto Máximo', value: 'mad' },
    { label: 'Mínimo', value: 'min' },
    { label: 'Máximo', value: 'max' },
    { label: 'Soma', value: 'sum' },
    
    // Constantes matemáticas
    { label: 'PI (π)', value: 'pi' },
    { label: 'Euler (e)', value: 'e' },
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
        // Use a descrição como value para a edição reconhecer o item
        return { label, value: label as string };
      }).filter(Boolean) as any[];
      case 'Operador': return this.operadores;
      case 'Condicional': return this.condicionais;
      case 'Delimitador': return this.delimitadores;
      case 'Operador Lógico': return this.operadoresLogicos;
      case 'FuncaoMatematica': return this.funcoesMatematicas;
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
  // Certifica o mapa atualizado
  this.gerarNomesSegurosComValoresAtuais();
  // Inverte o nameMap para buscar pelo valor
  const reverseMap = Object.fromEntries(
    Object.entries(this.nameMap).map(([k, v]) => [v, k])
  );
  // Substitui códigos por nomes com fallback
  return expr.replace(/(ens\d+|ensaio\d+|calculo\d+)/g, (match) => {
    if (reverseMap[match]) return '"' + reverseMap[match] + '"';
    if (match.startsWith('calculo')) {
      const calc = this.caculosEnsaio.find((c: any) => c?.tecnica === match || `calculo${c?.id}` === match);
      return calc?.descricao ? '"' + calc.descricao + '"' : match;
    } else {
      const ens = this.ensaios.find((e: any) => e?.ensaioTecnico === match || e?.tecnica === match || `ens${e?.id}` === match || `ensaio${e?.id}` === match);
      return ens?.descricao ? '"' + ens.descricao + '"' : match;
    }
  });
}
// Avalia a expressão usando math.js e os valores dos ensaios
avaliarExpressao() {
  const expressao = this.registerForm.get('funcao')?.value;
  this.gerarNomesSegurosComValoresAtuais(); // <-- agora pega os valores digitados
  
  // Criar contexto com funções personalizadas
  const context = {
    ...this.safeVars,
    // Adicionar função de desvio absoluto máximo
    mad: this.calcularDesvioAbsolutoMaximo.bind(this),
    // Constantes matemáticas
    pi: Math.PI,
    e: Math.E
  };
  
  try {
    const resultado = evaluate(expressao, context);
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

/**
 * Calcula o Desvio Absoluto Máximo (MAD - Maximum Absolute Deviation)
 * Fórmula: max(|xi - média|)
 * @param valores Array de números ou argumentos individuais
 * @returns Desvio absoluto máximo
 */
private calcularDesvioAbsolutoMaximo(...args: any[]): number {
  // Debug: mostrar o que está sendo recebido
  console.log('MAD - Argumentos recebidos:', args);
  console.log('MAD - Tipos dos argumentos:', args.map(arg => typeof arg));
  console.log('MAD - Quantidade de argumentos:', args.length);
  
  let valores: number[];
  
  // Caso especial: se não há argumentos, retornar erro específico
  if (args.length === 0) {
    console.log('MAD - Erro: nenhum argumento fornecido');
    throw new Error('Desvio absoluto máximo requer ao menos um valor');
  }
  
  // Se o primeiro argumento é um array, usa ele. Caso contrário, usa todos os argumentos
  if (args.length === 1) {
    const firstArg = args[0];
    console.log('MAD - Primeiro argumento:', firstArg);
    console.log('MAD - É array?', Array.isArray(firstArg));
    console.log('MAD - Tem propriedade _data?', firstArg && firstArg._data);
    console.log('MAD - Tem método valueOf?', firstArg && typeof firstArg.valueOf === 'function');
    
    // Verificar se é um Matrix do MathJS ou objeto similar
    if (firstArg && typeof firstArg === 'object') {
      // Tentar extrair dados de Matrix do MathJS
      if (firstArg._data && Array.isArray(firstArg._data)) {
        valores = firstArg._data;
        console.log('MAD - Usando _data do Matrix:', valores);
      } else if (typeof firstArg.valueOf === 'function') {
        const converted = firstArg.valueOf();
        if (Array.isArray(converted)) {
          valores = converted;
          console.log('MAD - Usando valueOf():', valores);
        } else {
          valores = [converted];
          console.log('MAD - valueOf() retornou valor único:', valores);
        }
      } else if (Array.isArray(firstArg)) {
        valores = firstArg;
        console.log('MAD - Usando array padrão:', valores);
      } else {
        // Tentar converter objeto para array de seus valores
        const objectValues = Object.values(firstArg);
        if (objectValues.length > 0 && objectValues.every(v => typeof v === 'number')) {
          valores = objectValues as number[];
          console.log('MAD - Usando Object.values():', valores);
        } else {
          valores = [firstArg];
          console.log('MAD - Tratando como valor único:', valores);
        }
      }
    } else if (Array.isArray(firstArg)) {
      valores = firstArg;
      console.log('MAD - Usando array do primeiro argumento:', valores);
    } else {
      valores = args;
      console.log('MAD - Usando todos os argumentos como array:', valores);
    }
  } else {
    valores = args;
    console.log('MAD - Usando todos os argumentos como array:', valores);
  }
  
  // Verificação adicional para arrays vazios
  if (Array.isArray(valores) && valores.length === 0) {
    console.log('MAD - Erro: array está vazio');
    throw new Error('Desvio absoluto máximo requer ao menos um valor');
  }
  
  // Se não for array, tentar converter
  if (!Array.isArray(valores)) {
    console.log('MAD - Convertendo valor único em array:', valores);
    valores = [valores];
  }
  
  // Filtrar valores válidos (números)
  const valoresValidos = valores.filter(v => {
    const isValid = typeof v === 'number' && !isNaN(v) && isFinite(v);
    console.log(`MAD - Valor ${v} (tipo: ${typeof v}) é válido: ${isValid}`);
    return isValid;
  });
  
  console.log('MAD - Valores válidos encontrados:', valoresValidos);
  
  if (valoresValidos.length === 0) {
    console.log('MAD - Erro: nenhum valor numérico válido encontrado após filtragem');
    throw new Error('Nenhum valor numérico válido encontrado para calcular o desvio absoluto máximo');
  }
  
  // Caso especial: se só há um valor, o desvio é 0
  if (valoresValidos.length === 1) {
    console.log('MAD - Apenas um valor, retornando 0');
    return 0;
  }
  
  // Calcular a média
  const media = valoresValidos.reduce((soma, valor) => soma + valor, 0) / valoresValidos.length;
  console.log('MAD - Média calculada:', media);
  
  // Calcular os desvios absolutos
  const desviosAbsolutos = valoresValidos.map(valor => Math.abs(valor - media));
  console.log('MAD - Desvios absolutos:', desviosAbsolutos);
  
  // Retornar o máximo dos desvios absolutos
  const resultado = Math.max(...desviosAbsolutos);
  console.log('MAD - Resultado final:', resultado);
  
  return resultado;
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
  this.gerarNomesSegurosComValoresAtuais();
  const funcaoComNomes = this.converterExpressaoParaNomes(funcao);
  this.expressaoDinamica = this.converterFuncaoParaBlocos(funcaoComNomes);
  this.editarFormulaVisivel = true;
  }
  
  // Exibe a função com nomes legíveis no modal de edição
  get funcaoLegivelEdicao(): string {
    try {
      this.gerarNomesSegurosComValoresAtuais();
      const expr = this.editForm.get('funcao')?.value || '';
      return this.converterExpressaoParaNomes(expr);
    } catch {
      return this.editForm.get('funcao')?.value || '';
    }
  }

  // Lista os nomes dos Ensaios e Cálculos presentes na expressão do modal de edição
  get elementosUsadosEdicao(): { descricao: string, tipo: 'Ensaio' | 'Cálculo' }[] {
    const expr: string = this.editForm.get('funcao')?.value || '';
    const codigos = Array.from(new Set(expr.match(/(ens\d+|ensaio\d+|calculo\d+)/g) || []));
    const usados: { descricao: string, tipo: 'Ensaio' | 'Cálculo' }[] = [];

    codigos.forEach(codigo => {
      if (codigo.startsWith('calculo')) {
        const calc = this.caculosEnsaio.find((c: any) => c?.tecnica === codigo || `calculo${c?.id}` === codigo);
        if (calc?.descricao) usados.push({ descricao: calc.descricao, tipo: 'Cálculo' });
      } else {
        const ens = this.ensaios.find((e: any) => e?.ensaioTecnico === codigo || e?.tecnica === codigo || `ens${e?.id}` === codigo || `ensaio${e?.id}` === codigo);
        if (ens?.descricao) usados.push({ descricao: ens.descricao, tipo: 'Ensaio' });
      }
    });

    return usados;
  }
// O método converterFuncaoParaBlocos pode ficar igual, pois agora recebe nomes de ensaio
private tokenizeExpressao(expr: string): string[] {
  const tokens: string[] = [];
  const twoCharOps = ['>=', '<=', '==', '!=', '&&', '||'];
  const oneCharOps = new Set(['+', '-', '*', '/', '^', '?', ':', '=', ',', '<', '>']);
  const delims = new Set(['(', ')', '[', ']', '{', '}']);
  
  // Lista de funções matemáticas a serem reconhecidas
  const mathFunctions = [
    'sqrt', 'pow', 'log', 'log10', 'exp', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'round', 'floor', 'ceil', 'abs', 'mean', 'median', 'mode', 'std', 'var', 'mad', 'min', 'max', 'sum'
  ];
  
  let i = 0;
  const n = expr.length;
  while (i < n) {
    const ch = expr[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') { i++; continue; }
    
    // quoted names as a single token
    if (ch === '"') {
      i++;
      let buf = '';
      while (i < n && expr[i] !== '"') { buf += expr[i]; i++; }
      if (i < n && expr[i] === '"') i++; // consume closing quote
      tokens.push('"' + buf + '"');
      continue;
    }
    
    const next2 = expr.slice(i, i + 2);
    if (twoCharOps.includes(next2)) { tokens.push(next2); i += 2; continue; }
    if (delims.has(ch) || oneCharOps.has(ch)) { tokens.push(ch); i++; continue; }
    
    // Verifica constantes matemáticas
    if (expr.startsWith('pi', i)) { tokens.push('pi'); i += 2; continue; }
    if (expr.startsWith('e', i) && (i + 1 >= n || !/[a-zA-Z_]/.test(expr[i + 1]))) { 
      tokens.push('e'); i += 1; continue; 
    }
    
    // Verifica funções matemáticas
    let foundFunction = false;
    for (const func of mathFunctions) {
      if (expr.startsWith(func, i)) {
        tokens.push(func);
        i += func.length;
        foundFunction = true;
        break;
      }
    }
    if (foundFunction) continue;
    
    // Coletar nome/numero até o próximo operador ou delimitador
    let buf = '';
    while (i < n) {
      const c = expr[i];
      const look2 = expr.slice(i, i + 2);
      if (c === ' ' && buf.length === 0) { i++; continue; }
      if (twoCharOps.includes(look2) || delims.has(c) || oneCharOps.has(c)) break;
      // Para para não pegar parte de uma função matemática
      let isPartOfFunction = false;
      for (const func of mathFunctions) {
        if (expr.startsWith(func, i)) {
          isPartOfFunction = true;
          break;
        }
      }
      if (isPartOfFunction) break;
      buf += c;
      i++;
    }
    const trimmed = buf.trim();
    if (trimmed) tokens.push(trimmed);
  }
  return tokens;
}

private normalizeText(txt: string): string {
  return (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

converterFuncaoParaBlocos(funcao: string): { tipo: string, valor: string }[] {
  const tokens = this.tokenizeExpressao(funcao);
  
  // Lista de funções matemáticas
  const mathFunctions = [
    'sqrt', 'pow', 'log', 'log10', 'exp', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'round', 'floor', 'ceil', 'abs', 'mean', 'median', 'mode', 'std', 'var', 'mad', 'min', 'max', 'sum'
  ];
  
  // Constantes matemáticas
  const mathConstants = ['pi', 'e'];
  
  // Conjunto de descrições de Cálculos vindas tanto da lista quanto do nameMap
  const calcFromList = (this.caculosEnsaio || []).map((c: any) => this.normalizeText(c?.descricao));
  const calcFromMap = Object.entries(this.nameMap || {})
    .filter(([nome, tecnica]) => typeof tecnica === 'string' && /^calculo\d+$/i.test(tecnica))
    .map(([nome]) => this.normalizeText(nome));
  const calculoDescricoesNorm = new Set([...calcFromList, ...calcFromMap]);
  
  return tokens.map(token => {
    const isQuoted = token.startsWith('"') && token.endsWith('"');
    const raw = isQuoted ? token.slice(1, -1) : token;
    const tokenNorm = this.normalizeText(raw);
    
    if (['+', '-', '*', '/', '^'].includes(token)) {
      return { tipo: 'Operador', valor: token };
    } else if(['&&','||','!','==','!=','<','>','<=','>='].includes(token)) {
      return { tipo: 'Operador Lógico', valor: token };
    } else if(['?', ':'].includes(token)) {
      return { tipo: 'Condicional', valor: token };
    } else if(["(", ")", ",", "[", "]", "{", "}"].includes(token)) {
      return { tipo: 'Delimitador', valor: token };
    } else if (mathFunctions.includes(token) || mathConstants.includes(token)) {
      return { tipo: 'FuncaoMatematica', valor: token };
    } else if (!isNaN(Number(token))) {
      return { tipo: 'Valor', valor: token };
    } else if (token.startsWith('calculo')) {
      return { tipo: 'CalculoEnsaio', valor: token };
    } else if (calculoDescricoesNorm.has(tokenNorm)) {
      return { tipo: 'CalculoEnsaio', valor: raw };
    } else {
      return { tipo: 'Ensaio', valor: raw };
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

// Valida a expressão substituindo variáveis seguras por valores de teste
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

    // Cria um contexto de teste com valores simulados
    const testContext: any = {
      // Valores de teste para variáveis
      ...Object.fromEntries(
        Object.keys(this.safeVars).map(key => [key, Math.random() * 10 + 1])
      ),
      // Funções personalizadas
      mad: this.calcularDesvioAbsolutoMaximo.bind(this),
      // Constantes matemáticas
      pi: Math.PI,
      e: Math.E
    };

    // Substitui nomes técnicos por valores de teste se não estiverem no contexto
    let fakeExpr = exprSegura.replace(/(ens\d+|ensaio\d+|calculo\d+)/g, (match) => {
      return testContext[match] !== undefined ? match : '5';
    });

    // Para funções que precisam de arrays (como mean, std, mad, etc.), 
    // vamos simular com arrays de teste quando necessário
    fakeExpr = fakeExpr.replace(/\b(mean|median|mode|std|var|mad|min|max|sum)\s*\(/g, (match, func) => {
      return `${func}([1,2,3,4,5]`;
    });

    fakeExpr = fakeExpr.replace(/\s+/g, ' ');
    const resultado = evaluate(fakeExpr, testContext);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Expressão válida!',
      detail: `Expressão testada com sucesso. Resultado: ${resultado}`,
      life: 5000
    });
    return true;
  } catch (error) {
    console.error('Erro na validação:', error);
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