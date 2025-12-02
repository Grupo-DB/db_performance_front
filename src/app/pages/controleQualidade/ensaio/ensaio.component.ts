
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Form, FormControl, FormBuilder, Validators } from '@angular/forms';
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
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { TooltipModule } from 'primeng/tooltip';
import { TipoEnsaio } from '../tipo-ensaio/tipo-ensaio.component';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { evaluate } from 'mathjs';
import { Variavel } from '../variavel/variavel.component';

interface RegisterEnsaioForm {
  descricao:FormControl;
  valor: FormControl;
  tipoEnsaio: FormControl;
  unidade: FormControl;
  tempoPrevistoValor: FormControl;
  tempoPrevistoUnidade: FormControl;
  tempoTrabalhoValor: FormControl;
  tempoTrabalhoUnidade: FormControl;
  variavel: FormControl;
  funcao: FormControl;
  norma: FormControl;
  garantia: FormControl;
  tipoGarantia: FormControl;
  estado: FormControl;
}

export interface Ensaio {
  id: number;
  descricao: string;
  valor: number;
  tipoEnsaio: any;
  unidade: any;
  tempoPrevisto: any;
  tempoTrabalho: any;
  tipo_ensaio_detalhes: any;
  tipo_ensaio: any;
  tempo_previsto: any;
  tempo_trabalho: any;
  variavel: any;
  funcao: any;
  norma: any;
  garantia: string
  ensaioTecnico?: string;
  estado?: string;
}

export interface Responsaveis {
  value: string;
}
export interface Unidades {
  value: string;
}

@Component({
  selector: 'app-ensaio',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, InputMaskModule, DialogModule, ConfirmDialogModule, 
    SelectModule, IconFieldModule, FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule, ButtonModule, 
    DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, InputNumberModule, CardModule, InplaceModule, TooltipModule, 
    TagModule
],
  providers:[
     MessageService,ConfirmationService
  ],
  animations: [
    trigger('efeitoFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 }))
      ])
    ]),
    trigger('efeitoZoom', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('0.5s ease-out', style({ transform: 'scale(1)' })),
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
  templateUrl: './ensaio.component.html',
  styleUrl: './ensaio.component.scss'
})
export class EnsaioComponent implements OnInit{
  ensaios: Ensaio[] = [];
  tiposEnsaio: TipoEnsaio[] = [];
  tiposEnsaioFiltro: any[] = []; // Para o filtro da tabela
  variaveis: Variavel[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;

  registerForm!: FormGroup<RegisterEnsaioForm>;
  loading: boolean = false;

  filteredVariaveis: any[] = [];
  tipos = [
   { label: 'Variavel', value: 'Variavel' }, 
   { label: 'Ensaio', value:'Ensaio' }, 
   { label: 'Operador', value:'Operador' }, 
   { label: 'Condicional', value:'Condicional' }, 
   { label: 'Delimitador', value:'Delimitador' }, 
   { label: 'Operador Lógico', value:'Operador Lógico' },
   { label: 'Função Matemática', value:'FuncaoMatematica' },
   { label: 'Valor', value:'Valor' },
   { label: 'Função Data', value:'Funcao Data' }
  ];

  funcoesData = [
    { label: 'Adicionar dias', value: 'adicionarDias' },
    { label: 'Dias entre datas', value: 'diasEntre' },
    { label: 'Data atual', value: 'hoje' }
  ];
  
  unidades = [
    { value: 'Segundos' },
    { value: 'Minutos' },
    { value: 'Horas' },
    { value: 'Turnos' },
    { value: 'Dias' },
    { value: 'Semanas' },
    { value: 'Meses' },
    { value: 'Anos' },
  ]

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

  condicionais = [
    { label: 'condição verdadeira', value: '?' },
    { label: 'condição falsa', value: ':' },
    
  ];
  delimitadores = [
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '{', value: '{' },
    { label: '}', value: '}' },
    { label: ',', value: ',' },
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

  tipo_garantia = [
    { value: 'Min' },
    { value: 'Max' }
  ]
  elementos: any[] = [];
  expressaoDinamica: { tipo?: string, valor?: string }[] = [
    { tipo: '', valor: '' }
  ];
  montarFormulaVisivel: boolean = false;
  editarFormulaVisivel: boolean = false;
  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  safeVars: any = {};
  nameMap: any = {};
  resultados: {
    variavelId: any; ensaioId: number, valor: number 
}[] = [];
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
    private loginService: LoginService,
  ) 
  {
    this.registerForm = new FormGroup({
      descricao: new FormControl('',[Validators.required, Validators.minLength(3)]),
      valor: new FormControl(''),
      tipoEnsaio: new FormControl(''),
      unidade: new FormControl(''),
      tempoPrevistoValor: new FormControl('',),
      tempoPrevistoUnidade: new FormControl('',),
      tempoTrabalhoValor: new FormControl('',),
      tempoTrabalhoUnidade: new FormControl('',),
      variavel: new FormControl(''),
      funcao: new FormControl(''),
      norma: new FormControl(''),
      garantia: new FormControl(''),
      tipoGarantia: new FormControl(''),
      estado: new FormControl(''),
    });
    this.editForm = this.fb.group({
      id: [''],
      descricao: [''],
      valor: [''],
      tipo_ensaio: [''],
      unidade: [''],
      tempoPrevistoValor: [''],
      tempoPrevistoUnidade: [''],
      tempoTrabalhoValor: [''],
      tempoTrabalhoUnidade: [''],
      variavel: [''],
      funcao: [''],
      norma: [''],
      garantia: [''],
      estado: [''],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit() {
    //this.registerForm.get('valor')?.disable();
    //
    this.loadEnsaios();
    this.loadTiposEnsaio();
    this.loadVariaveis();
    
    // Para teste - adiciona método global para depuração
    (window as any).testarExpressaoMedia = () => {
      this.testarExpressaoMedia();
    };
  }

  async gerarEnsaioTecnico(): Promise<string> {
    // Busca o maior número já utilizado em ensaioTecnico ou tecnica (ex: ensaio01, ensaio02, ...) a partir do backend
    let max = 0;
    try {
      const ensaiosBackend = await new Promise<any[]>(resolve => {
        this.ensaioService.getEnsaios().subscribe(resolve, () => resolve([]));
      });
      ensaiosBackend.forEach(e => {
        // Considera tanto ensaioTecnico quanto tecnica, se existir
        const tecnicasPossiveis = [e.ensaioTecnico, (e as any).tecnica];
        tecnicasPossiveis.forEach(tecnica => {
          if (tecnica) {
            const match = tecnica.match(/ensaio(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num) && num > max) max = num;
            }
          }
        });
      });
    } catch (e) {
      // fallback para lista local
      this.ensaios.forEach(e => {
        const tecnicasPossiveis = [e.ensaioTecnico, (e as any).tecnica];
        tecnicasPossiveis.forEach(tecnica => {
          if (tecnica) {
            const match = tecnica.match(/ensaio(\d+)/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (!isNaN(num) && num > max) max = num;
            }
          }
        });
      });
    }
    const next = max + 1;
    return 'ensaio' + next.toString().padStart(2, '0');
  }

  getExpressaoStringAmigavel(): string {
    return this.expressaoDinamica
      .map(b => {
        if (b.tipo === 'Variavel') {
          // Busca a variável pelo tecnica (se já for tecnica) ou pelo nome
          const tecnica = this.getExpressaoStringTokenTecnica(b);
          const v = this.variaveis.find(v => v.tecnica === tecnica);
          return v && v.nome ? v.nome : b.valor;
        }
        if (b.tipo === 'Ensaio') {
          const e = this.ensaios.find(x => (x as any).ensaioTecnico === b.valor || (x as any).tecnica === b.valor);
          return e && e.descricao ? e.descricao : b.valor;
        }
        return b.valor;
      })
      .filter(v => !!v)
      .join(' ');
  }

  private getExpressaoStringTokenTecnica(bloco: any): string {
    if (this.variaveis.some(v => v.tecnica === bloco.valor)) {
      return bloco.valor;
    }
    const v = this.variaveis.find(v => v.nome === bloco.valor);
    return v && v.tecnica ? v.tecnica : bloco.valor;
  }

  loadEnsaios() {
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }

  loadTiposEnsaio() {
    this.ensaioService.getTiposEnsaio().subscribe(
      response => {
        this.tiposEnsaio = response;
        
        // Criar opções para o filtro da tabela
        this.tiposEnsaioFiltro = response.map((tipo: any) => ({
          label: tipo.nome,
          value: tipo.nome
        }));
      }, error => {
        console.error('Erro ao carregar os tipos de ensaio:', error);
      }
    )
  }

  loadVariaveis() {
  this.ensaioService.getVariaveis().subscribe(
    response => {
      this.variaveis = response;      
      // Verificar se todas as variáveis têm ID numérico
      const variaveisComIdInvalido = this.variaveis.filter(v => typeof v.id !== 'number' || isNaN(v.id));
      if (variaveisComIdInvalido.length > 0) {
        console.error('Variáveis com ID inválido:', variaveisComIdInvalido);
      }
    }, error => {
      console.error('Erro ao carregar as variáveis:', error);
    }
  )
}

  // Gera nomes seguros
getValoresPorTipo(tipo: string): any[] {
  switch (tipo) {
    case 'Variavel': return this.variaveis.map(v => ({ label: v.nome, value: v.tecnica }));
    case 'Ensaio': return this.ensaios.map((e: any) => {
        const fallback = e?.id != null ? `ensaio${String(e.id).padStart(2, '0')}` : undefined;
        const codigo = e.ensaioTecnico || e.tecnica || fallback;
        if (!codigo) return null;
        const label = e.descricao || codigo;
        return { label, value: codigo as string };
      }).filter(Boolean) as any[];
    case 'Operador': return this.operadores;
    case 'Condicional': return this.condicionais;
    case 'Delimitador': return this.delimitadores;
    case 'Operador Lógico': return this.operadoresLogicos;
    case 'FuncaoMatematica': return this.funcoesMatematicas;
    case 'Valor': return [];
    case 'Funcao Data': return this.funcoesData;
    default: return [];
  }
}
///////////////////////////////////////////////////////////////////////////////////

private funcoesDatas = {
  adicionarDias: (data: string | number, dias: number) => {
    let dataBase: Date;
    if (typeof data === 'string') {
      dataBase = new Date(data);
    } else {
      dataBase = new Date(data); // timestamp
    }
    const novaData = new Date(dataBase);
    novaData.setDate(novaData.getDate() + dias);
    return novaData.getTime(); // retorna timestamp para cálculos
  },
  
  diasEntre: (data1: string | number, data2: string | number) => {
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
  
  hoje: () => {
    return new Date().getTime();
  },
  
  formatarData: (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  }
};

////////////////////////////////////////////////////////////////////////////////////
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

  private atualizarVariaveisDoForm() {
    // Busca todos os tokens da expressão que são nomes técnicos (varX)
    const expr = this.getExpressaoString();
    const tecnicaMatches = (expr.match(/var\d+/g) || []);
    const tecnicasUnicas = Array.from(new Set(tecnicaMatches));
    // Associa os IDs das variáveis cujos tecnica aparecem na expressão
    const usados = tecnicasUnicas
      .map(tecnica => this.variaveis.find(v => v.tecnica === tecnica))
      .filter(v => !!v);
    this.registerForm.get('variavel')?.setValue(usados.map(v => v.id));
  }

getExpressaoString() {
  this.gerarSafeVarsPorTecnica();
  return this.expressaoDinamica
    .map(b => b.valor)
    .filter(v => !!v)
    .join(' ');
}

private atualizarEnsaiosDoForm() {
  const nomes = this.variaveis.map(e => e.nome);

  // Pegua os ensaios usados na expressão, sem duplicatas
  const usados = this.expressaoDinamica
    .filter(b => b.tipo === 'Variavel' && nomes.includes(b.valor || ''))
    .map(b => b.valor)
    .filter((valor, idx, arr) => arr.indexOf(valor) === idx) // elimina duplicatas
    .map(valor => this.variaveis.find(e => e.nome === valor))
    .filter(e => !!e);

  this.registerForm.get('variavel')?.setValue(usados.map(e => e.id));
}


onBlocoChange(index: number) {
  
  // Limpar o valor quando o tipo mudar
  if (this.expressaoDinamica[index].tipo !== 'Valor') {
    // Se mudou o tipo, limpar o valor para forçar nova seleção
    this.expressaoDinamica[index].valor = '';
  }
}


// Agora usa diretamente o campo tecnica das variáveis
gerarSafeVarsPorTecnica() {
  this.safeVars = {};
  this.variaveis.forEach((variavel: any) => {
    if (variavel.tecnica) {
      const resultado = this.resultados.find(r => r.variavelId === variavel.id);
      this.safeVars[variavel.tecnica] = resultado ? resultado.valor : 0;
    }
  });
  // Acrescenta os valores dos ensaios usando seu código técnico
  this.ensaios.forEach((e: any) => {
    const val = typeof e.valor === 'number' ? e.valor : Number(e.valor);
    const num = isNaN(val) ? 0 : val;
    if (e.ensaioTecnico) this.safeVars[e.ensaioTecnico] = num;
    if (e.tecnica) this.safeVars[e.tecnica] = num;
    if (e?.id != null) {
      const fallback = `ensaio${String(e.id).padStart(2, '0')}`;
      this.safeVars[fallback] = num;
    }
  });
}

avaliarExpressao() {
  const expressao = this.registerForm.get('funcao')?.value;
  if (!expressao) return null;

  this.gerarSafeVarsPorTecnica();
  
  // Combine variáveis normais com funções de data, constantes matemáticas e funções personalizadas
  const scope = {
    ...this.safeVars,
    ...this.funcoesDatas,
    // Adicionar função de desvio absoluto máximo
    mad: this.calcularDesvioAbsolutoMaximo.bind(this),
    pi: Math.PI,
    e: Math.E
  };

  try {
    // Processar a expressão para garantir que arrays funcionem corretamente
    let processedExpr = expressao;
    
    // Normalizar espaços em arrays
    processedExpr = processedExpr.replace(/\[\s*([^\]]+)\s*\]/g, (match: string, content: string) => {
      const items = content.split(',').map((item: string) => item.trim()).join(',');
      return `[${items}]`;
    });

    const resultado = evaluate(processedExpr, scope);
    return resultado;
  } catch (e) {
    console.error('Erro na avaliação da expressão:', e);
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
  let valores: number[];
  // Caso especial: se não há argumentos, retornar erro específico
  if (args.length === 0) {
    throw new Error('Desvio absoluto máximo requer ao menos um valor');
  }
  
  // Se o primeiro argumento é um array, usa ele. Caso contrário, usa todos os argumentos
  if (args.length === 1) {
    const firstArg = args[0];    
    // Verificar se é um Matrix do MathJS ou objeto similar
    if (firstArg && typeof firstArg === 'object') {
      // Tentar extrair dados de Matrix do MathJS
      if (firstArg._data && Array.isArray(firstArg._data)) {
        valores = firstArg._data;
      } else if (typeof firstArg.valueOf === 'function') {
        const converted = firstArg.valueOf();
        if (Array.isArray(converted)) {
          valores = converted;
        } else {
          valores = [converted];
        }
      } else if (Array.isArray(firstArg)) {
        valores = firstArg;
      } else {
        // Tentar converter objeto para array de seus valores
        const objectValues = Object.values(firstArg);
        if (objectValues.length > 0 && objectValues.every(v => typeof v === 'number')) {
          valores = objectValues as number[];
        } else {
          valores = [firstArg];
        }
      }
    } else if (Array.isArray(firstArg)) {
      valores = firstArg;
    } else {
      valores = args;
    }
  } else {
    valores = args;
  }
  // Verificação adicional para arrays vazios
  if (Array.isArray(valores) && valores.length === 0) {
    throw new Error('Desvio absoluto máximo requer ao menos um valor');
  }
  // Se não for array, tentar converter
  if (!Array.isArray(valores)) {
    valores = [valores];
  }
  // Filtrar valores válidos (números)
  const valoresValidos = valores.filter(v => {
    const isValid = typeof v === 'number' && !isNaN(v) && isFinite(v);
      return isValid;
  });  
  if (valoresValidos.length === 0) {
    throw new Error('Nenhum valor numérico válido encontrado para calcular o desvio absoluto máximo');
  }
  
  // Caso especial: se só há um valor, o desvio é 0
  if (valoresValidos.length === 1) {
    return 0;
  }
  // Calcular a média
  const media = valoresValidos.reduce((soma, valor) => soma + valor, 0) / valoresValidos.length;
  // Calcular os desvios absolutos
  const desviosAbsolutos = valoresValidos.map(valor => Math.abs(valor - media));
  // Retornar o máximo dos desvios absolutos
  const resultado = Math.max(...desviosAbsolutos);
  return resultado;
}

////////////-------------------------Montagem de Fórmula-------------------------////////////
montarFormula(){
    this.montarFormulaVisivel = true
  }

editarFormula(){
  // Converte a string da função em blocos para edição
  const funcao = this.editForm.get('funcao')?.value || '';
  this.expressaoDinamica = this.converterFuncaoParaBlocos(funcao);
  this.editarFormulaVisivel = true;
}

// O método converterFuncaoParaBlocos agora trata nomes tecnicos diretamente
converterFuncaoParaBlocos(funcao: string): { tipo: string, valor: string }[] {
  const tokens = funcao.split(' ');
  
  // Lista de funções matemáticas
  const mathFunctions = [
    'sqrt', 'pow', 'log', 'log10', 'exp', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'round', 'floor', 'ceil', 'abs', 'mean', 'median', 'mode', 'std', 'var', 'mad', 'min', 'max', 'sum'
  ];
  
  // Constantes matemáticas
  const mathConstants = ['pi', 'e'];
  
  return tokens.map(token => {
    if (["+", "-", "*", "/", "^"].includes(token)) {
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
    } else if (Object.keys(this.funcoesDatas).includes(token)) {
      return { tipo: 'Funcao Data', valor: token };
    } else {
      // Se o token for um tecnica conhecido, marca como Variavel, senão Ensaio
      const isTecnica = this.variaveis.some(v => v.tecnica === token);
      return { tipo: isTecnica ? 'Variavel' : 'Ensaio', valor: token };
    }
  });
}

validarExpressaoComValores(expr: string): boolean {
  if (!expr || expr.trim() === '') {
    return true; // Permite expressões vazias
  }

  let fakeExpr = '';
  let scope: any = {};

  try {
    this.gerarSafeVarsPorTecnica();
    
    // Criar um escopo de teste com valores fictícios
    fakeExpr = expr;
    scope = { 
      ...this.funcoesDatas,
      // Adicionar função de desvio absoluto máximo
      mad: this.calcularDesvioAbsolutoMaximo.bind(this),
      // Adicionar constantes matemáticas
      pi: Math.PI,
      e: Math.E
    };
    
    // Substitui referências específicas de ensaios por valores de teste
    fakeExpr = fakeExpr.replace(/ensaio(\d+)/g, (match, num) => {
      // Procura o ensaio pelo ID e usa seu valor, ou valor padrão
      const ensaio = this.ensaios.find((e: any) => e.id == num);
      let valor = ensaio?.valor || Math.random() * 10 + 5; // valor aleatório entre 5-15 para teste
      
      // Para alguns ensaios específicos, usar valores conhecidos
      if (num === '206') valor = 12.5;
      if (num === '207') valor = 8.3;
      if (num === '211') valor = 15.7;
      
      return valor.toString();
    });
    
    // Limpa espaços extras em arrays para normalizar
    fakeExpr = fakeExpr.replace(/\[\s*([^\]]+)\s*\]/g, (match, content) => {
      const items = content.split(',').map((item: string) => item.trim()).join(',');
      return `[${items}]`;
    });
    
    // Substituir variáveis por valores de teste
    this.variaveis.forEach(v => {
      if (v.tecnica) {
        const regex = new RegExp(v.tecnica.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        // Para variáveis de data, usar timestamp atual
        const valorTeste = v.tipo === 'data' ? new Date().getTime() : Math.random() * 10 + 1;
        fakeExpr = fakeExpr.replace(regex, valorTeste.toString());
        scope[v.tecnica] = valorTeste;
      }
    });
    // Substituir códigos técnicos de ensaio por valores conhecidos (ou 1)
    this.ensaios.forEach((e: any) => {
      const num = typeof e.valor === 'number' ? e.valor : Number(e.valor);
      const valorTeste = isNaN(num) ? 1 : num;
      if (e.ensaioTecnico) {
        const re1 = new RegExp(e.ensaioTecnico.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        fakeExpr = fakeExpr.replace(re1, valorTeste.toString());
        scope[e.ensaioTecnico] = valorTeste;
      }
      if (e.tecnica) {
        const re2 = new RegExp(e.tecnica.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        fakeExpr = fakeExpr.replace(re2, valorTeste.toString());
        scope[e.tecnica] = valorTeste;
      }
      if (e?.id != null) {
        const fallback = `ensaio${String(e.id).padStart(2, '0')}`;
        const re3 = new RegExp(fallback.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        fakeExpr = fakeExpr.replace(re3, valorTeste.toString());
        scope[fallback] = valorTeste;
      }
    });        
    const resultado = evaluate(fakeExpr, scope);
    
    this.messageService.add({
      severity: 'info',
      summary: 'Expressão válida!',
      detail: `Resultado: ${resultado}`,
      life: 3000
    });
    return true;
  } catch (error) {
    console.error('Erro na validação:', error);
    console.error('Expressão que falhou:', fakeExpr);
    console.error('Scope:', scope);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Expressão inválida!',
      detail: `Erro: ${error}`,
      life: 5000
    });
    return false;
  }
}

  testarExpressao() {
    const expressao = this.getExpressaoString();
    if (!expressao || expressao.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Monte uma expressão primeiro para testar',
        life: 3000
      });
      return;
    }
        this.validarExpressaoComValores(expressao);
  }

  // Método para testar a expressão específica que estava dando erro
  testarExpressaoMedia() {
    const expressaoTeste = 'mean ( [ ensaio206 , ensaio207 , ensaio211 ] )';
    this.validarExpressaoComValores(expressaoTeste);
  }

  salvarFormula() {
    const novaExpressao = this.getExpressaoString(); // monta a expressão a partir dos blocos
    this.registerForm.get('funcao')?.setValue(novaExpressao);
    this.montarFormulaVisivel = false;
  }// Cria um método específico para buscar variáveis na expressão
private buscarVariaveisNaExpressao(expressao: string) {  
  if (!expressao || expressao.trim() === '') {
    this.registerForm.get('variavel')?.setValue([]);
    return;
  }
  
  // Separar a expressão em palavras, removendo operadores
  const palavras = expressao.split(/[\s\+\-\*\/\(\)]+/).filter(p => p.trim() !== '');

  // Buscar variáveis que correspondem às palavras
  const variaveisEncontradas = [];
  
  for (const palavra of palavras) {
    const variavel = this.variaveis.find(v => v.nome === palavra);
    if (variavel) {
      variaveisEncontradas.push(variavel);
    }
  }  
  // Remover duplicatas
  const variaveisUnicas = variaveisEncontradas.filter((v, index, arr) => 
    arr.findIndex(item => item.id === v.id) === index
  );
                
  // Extrair os IDs
  const ids = variaveisUnicas.map(v => {
    return v.id;
  });
    
  // Verificar se todos os IDs são válidos
  const idsValidos = ids.every(id => {
    const isValid = typeof id === 'number' && !isNaN(id);
    return isValid;
  });
    
  if (idsValidos && ids.length > 0) {
    this.registerForm.get('variavel')?.setValue(ids);
  } else {
    this.registerForm.get('variavel')?.setValue([]);
  }
  
  // Verificar o valor final definido no formulário
  const valorFinal = this.registerForm.get('variavel')?.value;
}

// Crie um método específico para atualizar as variáveis baseado na expressão
private atualizarVariaveisComExpressao(expressao: string) {
  if (!expressao || expressao.trim() === '') {
    this.registerForm.get('variavel')?.setValue([]);
    return;
  }
  
  const nomes = this.variaveis.map(v => v.nome);
  const palavras = expressao.split(' ').filter(p => p.trim() !== '');
  
  // Encontrar palavras que correspondem a nomes de variáveis
  const variaveisUsadas = palavras
    .filter(palavra => nomes.includes(palavra))
    .filter((palavra, index, arr) => arr.indexOf(palavra) === index) // remover duplicatas
    .map(palavra => this.variaveis.find(v => v.nome === palavra))
    .filter(v => v !== undefined);
    
  const variaveisIds = variaveisUsadas.map(v => v.id);
  
  // Verificar se todos os IDs são válidos
  const idsValidos = variaveisIds.every(id => typeof id === 'number' && !isNaN(id));
  
  if (idsValidos) {
    this.registerForm.get('variavel')?.setValue(variaveisIds);
  } else {
    console.error('IDs inválidos:', variaveisIds);
    this.registerForm.get('variavel')?.setValue([]);
  }
}

// Modifique o método salvarFormulaEditada também
salvarFormulaEditada() {
  const novaExpressao = this.getExpressaoString(); // usa nomes originais
  this.editForm.get('funcao')?.setValue(novaExpressao);
  this.atualizarVariaveisDoForm();
  this.editarFormulaVisivel = false;
}

filterVariaveis(event: any) {
    const query = event.query.split(/[\s\+\-\*\/\(\)]+/).pop()?.toLowerCase() || '';
    this.filteredVariaveis = this.variaveis.filter(e =>
      e.nome.toLowerCase().includes(query)
    );
  }

  /////////////////////////////////////////////////////////////////
  filterTable() {
    this.dt1.filterGlobal(this.inputValue,'contains');
  }
  clearForm(){
    this.registerForm.reset();
  }
  clearEditForm(){
    this.editForm.reset();
  }

  abrirModalEdicao(ensaio: Ensaio) {
  this.editFormVisible = true;

  // Verifica se vem como tempo_previsto ou tempoPrevisto
  const tempoPrevisto = ensaio.tempo_previsto || ensaio.tempoPrevisto;
  const tempoTrabalho = ensaio.tempo_trabalho || ensaio.tempoTrabalho;

  // Supondo que ensaio.tempo_previsto seja uma string tipo "15 Minutos"
  let tempoPrevistoValor = '';
  let tempoPrevistoUnidade = '';
  if (tempoPrevisto) {
    const partes = tempoPrevisto.split(' ').filter((p: string) => p.trim() !== '');
    tempoPrevistoValor = partes[0] || '';
    tempoPrevistoUnidade = partes.slice(1).join(' ') || '';
  }

  // Supondo que ensaio.tempo_trabalho seja uma string tipo "15 Minutos"
  let tempoTrabalhoValor = '';
  let tempoTrabalhoUnidade = '';
  if (tempoTrabalho) {
    const partes = tempoTrabalho.split(' ').filter((p: string) => p.trim() !== '');
    tempoTrabalhoValor = partes[0] || '';
    tempoTrabalhoUnidade = partes.slice(1).join(' ') || '';
  }

  this.editForm.patchValue({
    id: ensaio.id,
    descricao: ensaio.descricao,
    valor: ensaio.valor,
    tipo_ensaio: ensaio.tipo_ensaio_detalhes?.id || ensaio.tipo_ensaio,
    unidade: ensaio.unidade,
    tempoPrevistoValor: tempoPrevistoValor,
    tempoPrevistoUnidade: tempoPrevistoUnidade,
    tempoTrabalhoValor: tempoTrabalhoValor,
    tempoTrabalhoUnidade: tempoTrabalhoUnidade,
    variavel: ensaio.variavel,
    funcao: ensaio.funcao,
    norma: ensaio.norma,
    garantia: ensaio.garantia,
    estado: ensaio.estado,
  });
}
 saveEdit(){
  const expressao = this.editForm.value.funcao;

  if (expressao && expressao.trim() !== '') {
    if (!this.validarExpressaoComValores(expressao)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
      return;
    }
  }

  const id = this.editForm.value.id;
  const tipo_ensaio = this.editForm.value.tipo_ensaio;
  const tempo_previsto = `${this.editForm.value.tempoPrevistoValor} ${this.editForm.value.tempoPrevistoUnidade}`;
  const tempo_trabalho = `${this.editForm.value.tempoTrabalhoValor} ${this.editForm.value.tempoTrabalhoUnidade}`;
  const dadosAtualizados: Partial<Ensaio> = {
    descricao: this.editForm.value.descricao,
    valor: this.editForm.value.valor,
    tempo_previsto: tempo_previsto,
    tempo_trabalho: tempo_trabalho,
    tipo_ensaio: tipo_ensaio,
    unidade: this.editForm.value.unidade,
    variavel: this.editForm.value.variavel,
    funcao: this.editForm.value.funcao,
    norma: this.editForm.value.norma,
    garantia: this.editForm.value.garantia,
    estado: this.editForm.value.estado,
  };
  
  this.ensaioService.editEnsaio(id, dadosAtualizados).subscribe({
    next:() =>{
      this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio atualizado com sucesso!!', life: 1000 });
      this.loadEnsaios();
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

  excluirEnsaio(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esse ensaio?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.ensaioService.deleteEnsaio(id).subscribe({
          next:() =>{
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio excluído com sucesso!!', life: 1000 });
            this.loadEnsaios();
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

  async submit() {
    const expressao = this.getExpressaoString();
    // if (!expressao || expressao.trim() === '') {
    //   this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A expressão não pode estar vazia.' });
    //   return;
    // }

    if (!this.validarExpressaoComValores(expressao)) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
      return;
    }

    // Atualiza o campo variavel do formulário com base na expressão antes de enviar
    this.atualizarVariaveisDoForm();
    const variaveis = Array.isArray(this.registerForm.value.variavel)  
      ? this.registerForm.value.variavel
      : [this.registerForm.value.variavel];

    // Gera o nome técnico de forma única consultando o backend
    const ensaioTecnico = await this.gerarEnsaioTecnico();
    let garantia = this.registerForm.value.garantia;
    if(this.registerForm.value.garantia && this.registerForm.value.tipoGarantia){
      garantia = this.registerForm.value.garantia+' '+this.registerForm.value.tipoGarantia;
    }
    this.ensaioService.registerEnsaio(
      this.registerForm.value.descricao,
      this.registerForm.value.valor,
      this.registerForm.value.tipoEnsaio,
      `${this.registerForm.value.tempoPrevistoValor} ${this.registerForm.value.tempoPrevistoUnidade}`,
      `${this.registerForm.value.tempoTrabalhoValor} ${this.registerForm.value.tempoTrabalhoUnidade}`,
      this.registerForm.value.unidade,
      variaveis,
      this.registerForm.value.funcao,
      this.registerForm.value.norma,
      garantia,
      ensaioTecnico,
      this.registerForm.value.estado
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio cadastrado com sucesso!!', life: 1000 });
        this.loadEnsaios();
        this.clearForm();
      },
      error: (err) => {
        console.error('Erro completo:', err);
        console.error('Resposta do servidor:', err.error);
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