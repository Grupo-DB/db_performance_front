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
import { TipoEnsaio } from '../tipo-ensaio/tipo-ensaio.component';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { evaluate } from 'mathjs';
import { Variavel } from '../variavel/variavel.component';

interface RegisterEnsaioForm {
  descricao:FormControl;
  responsavel: FormControl;
  valor: FormControl;
  tipoEnsaio: FormControl;
  tempoPrevistoValor: FormControl;
  tempoPrevistoUnidade: FormControl;
  variavel: FormControl;
  funcao: FormControl;
}

export interface Ensaio {
  id: number;
  descricao: string;
  responsavel: string;
  valor: number;
  tipoEnsaio: any;
  tempoPrevisto: any;
  tipo_ensaio_detalhes: any;
  tipo_ensaio: any;
  tempo_previsto: any;
  variavel: any;
  funcao: any;
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
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule
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
  templateUrl: './ensaio.component.html',
  styleUrl: './ensaio.component.scss'
})
export class EnsaioComponent implements OnInit{
  // Variáveis e métodos do componente EnsaioComponent
  ensaios: any[] = [];
  tiposEnsaio: TipoEnsaio[] = [];
  variaveis: Variavel[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;

  registerForm!: FormGroup<RegisterEnsaioForm>;
  loading: boolean = false;

  filteredVariaveis: any[] = [];
  tipos = [
   { label: 'Variavel', value: 'Variavel' }, 
   { label: 'Operador', value:'Operador' }, 
   { label: 'Condicional', value:'Condicional' }, 
   { label: 'Delimitador', value:'Delimitador' }, 
   { label: 'Operador Lógico', value:'Operador Lógico' },
   { label: 'Valor', value:'Valor' }
  ];

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
  ];
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
      responsavel: new FormControl(''),
      valor: new FormControl({ value: 0, disabled: true }),
      tipoEnsaio: new FormControl(''),
      tempoPrevistoValor: new FormControl('', Validators.required),
      tempoPrevistoUnidade: new FormControl('', Validators.required),
      variavel: new FormControl(''),
      funcao: new FormControl(''),
    });
    this.editForm = this.fb.group({
      id: [''],
      descricao: [''],
      responsavel: [''],
      valor: [''],
      tipo_ensaio: [''],
      tempoPrevistoValor: [''],
      tempoPrevistoUnidade: [''],
      variavel: [''],
      funcao: [''],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit() {
    this.registerForm.get('valor')?.disable();
    //
    this.loadEnsaios();
    this.loadTiposEnsaio();
    this.loadVariaveis();
    
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
      }, error => {
        console.error('Erro ao carregar os tipos de ensaio:', error);
      }
    )
  }

//   loadVariaveis() {
//   this.ensaioService.getVariaveis().subscribe(
//     response => {
//       this.variaveis = response;
//     }, error => {
//       console.error('Erro ao carregar as variáveis:', error);
//     }
//   )
// }

  loadVariaveis() {
  this.ensaioService.getVariaveis().subscribe(
    response => {
      this.variaveis = response;
      console.log('Variáveis carregadas:', this.variaveis);
      
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
    case 'Variavel': return this.variaveis.map(v => ({ label: v.nome, value: v.nome })); 
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

  private atualizarVariaveisDoForm() {
  const nomes = this.variaveis.map(v => v.nome);

  // Pegua os ensaios usados na expressão, sem duplicatas
  const usados = this.expressaoDinamica
    .filter(b => b.tipo === 'Variavel' && nomes.includes(b.valor || ''))
    .map(b => b.valor)
    .filter((valor, idx, arr) => arr.indexOf(valor) === idx) // elimina duplicatas
    .map(valor => this.variaveis.find(v => v.nome === valor))
    .filter(v => !!v);

  this.registerForm.get('variavel')?.setValue(usados.map(v => v.id));
}

getExpressaoString() {
  this.gerarNomesSegurosComValoresAtuais();
  return this.expressaoDinamica
    .map(b => {
      if (b.tipo === 'Variavel' && b.valor !== undefined && this.nameMap[b.valor]) {
        return this.nameMap[b.valor];
      }
      return b.valor;
    })
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
  console.log(`Bloco ${index} alterado:`, this.expressaoDinamica[index]);
  
  // Limpar o valor quando o tipo mudar
  if (this.expressaoDinamica[index].tipo !== 'Valor') {
    // Se mudou o tipo, limpar o valor para forçar nova seleção
    this.expressaoDinamica[index].valor = '';
  }
}

gerarNomesSegurosComValoresAtuais() {
  this.safeVars = {};
  this.nameMap = {};
  this.variaveis.forEach((variavel: any, i: number) => {
    const safeName = 'var' + i;
    // Busca o valor digitado para este ensaio
    const resultado = this.resultados.find(r => r.variavelId === variavel.id);
    this.safeVars[safeName] = resultado ? resultado.valor : 0;
    this.nameMap[variavel.nome] = safeName;
  });
}

avaliarExpressao() {
  const expressao = this.registerForm.get('funcao')?.value;
  if (!expressao) return null;
  
  this.gerarNomesSegurosComValoresAtuais();
  
  // Converte a expressão original para usar nomes seguros
  let exprSegura = expressao;
  Object.keys(this.nameMap).forEach(origName => {
    const regex = new RegExp(origName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    exprSegura = exprSegura.replace(regex, this.nameMap[origName]);
  });
  
  try {
    const resultado = evaluate(exprSegura, this.safeVars);
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

////////////-------------------------Montagem de Fórmula-------------------------////////////
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
    } else {
      return { tipo: 'Ensaio', valor: token };
    }
  });
}

converterExpressaoParaNomes(expr: string): string { 
  const reverseMap = Object.fromEntries(
    Object.entries(this.nameMap).map(([k, v]) => [v, k])
  );

  return expr.replace(/var\d+/g, (match) => reverseMap[match] || match);
}

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

    // Agora substitua nomes seguros por 1
    let fakeExpr = exprSegura.replace(/var\d+/g, '1');
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

salvarFormula() {
  const novaExpressao = this.getExpressaoString(); // monta a expressão a partir dos blocos
  this.registerForm.get('funcao')?.setValue(novaExpressao);
  this.montarFormulaVisivel = false;
}

// Crie um método específico para buscar variáveis na expressão
private buscarVariaveisNaExpressao(expressao: string) {
  console.log('=== BUSCANDO VARIÁVEIS NA EXPRESSÃO ===');
  console.log('Expressão recebida:', expressao);
  console.log('Variáveis disponíveis:', this.variaveis);
  
  if (!expressao || expressao.trim() === '') {
    console.log('Expressão vazia, definindo array vazio');
    this.registerForm.get('variavel')?.setValue([]);
    return;
  }
  
  // Separar a expressão em palavras, removendo operadores
  const palavras = expressao.split(/[\s\+\-\*\/\(\)]+/).filter(p => p.trim() !== '');
  console.log('Palavras extraídas da expressão:', palavras);
  
  // Buscar variáveis que correspondem às palavras
  const variaveisEncontradas = [];
  
  for (const palavra of palavras) {
    console.log(`Procurando variável com nome: "${palavra}"`);
    const variavel = this.variaveis.find(v => v.nome === palavra);
    console.log(`Variável encontrada:`, variavel);
    
    if (variavel) {
      variaveisEncontradas.push(variavel);
    }
  }
  
  console.log('Todas as variáveis encontradas:', variaveisEncontradas);
  
  // Remover duplicatas
  const variaveisUnicas = variaveisEncontradas.filter((v, index, arr) => 
    arr.findIndex(item => item.id === v.id) === index
  );
  
  console.log('Variáveis únicas:', variaveisUnicas);
  
  // Extrair os IDs
  const ids = variaveisUnicas.map(v => {
    console.log(`Extraindo ID da variável ${v.nome}: ${v.id} (tipo: ${typeof v.id})`);
    return v.id;
  });
  
  console.log('IDs extraídos:', ids);
  
  // Verificar se todos os IDs são válidos
  const idsValidos = ids.every(id => {
    const isValid = typeof id === 'number' && !isNaN(id);
    console.log(`ID ${id} é válido? ${isValid}`);
    return isValid;
  });
  
  console.log('Todos os IDs são válidos?', idsValidos);
  
  if (idsValidos && ids.length > 0) {
    console.log('Definindo IDs no formulário:', ids);
    this.registerForm.get('variavel')?.setValue(ids);
  } else {
    console.log('IDs inválidos ou array vazio, definindo array vazio');
    this.registerForm.get('variavel')?.setValue([]);
  }
  
  // Verificar o valor final definido no formulário
  const valorFinal = this.registerForm.get('variavel')?.value;
  console.log('Valor final definido no formulário:', valorFinal);
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
  
  console.log('Variáveis encontradas na expressão:', variaveisUsadas);
  
  const variaveisIds = variaveisUsadas.map(v => v.id);
  
  // Verificar se todos os IDs são válidos
  const idsValidos = variaveisIds.every(id => typeof id === 'number' && !isNaN(id));
  
  if (idsValidos) {
    this.registerForm.get('variavel')?.setValue(variaveisIds);
    console.log('IDs das variáveis definidos:', variaveisIds);
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

  // Supondo que ensaio.tempoPrevisto seja uma string tipo "15 Minutos"
  let tempoPrevistoValor = '';
  let tempoPrevistoUnidade = '';
  if (ensaio.tempoPrevisto) {
    const partes = ensaio.tempoPrevisto ? ensaio.tempoPrevisto.split(' ') : [];
    tempoPrevistoValor = partes[0] || '';
    tempoPrevistoUnidade = partes.slice(1).join(' ') || '';
  }

  this.editForm.patchValue({
    id: ensaio.id,
    descricao: ensaio.descricao,
    responsavel: ensaio.responsavel,
    valor: ensaio.valor,
    tipo_ensaio: ensaio.tipo_ensaio_detalhes.id,
    tempoPrevistoValor: tempoPrevistoValor,
    tempoPrevistoUnidade: tempoPrevistoUnidade,
    variavel: ensaio.variavel,
    funcao: ensaio.funcao,
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
  const dadosAtualizados: Partial<Ensaio> = {
    descricao: this.editForm.value.descricao,
    responsavel: this.editForm.value.responsavel,
    valor: this.editForm.value.valor,
    tempo_previsto: tempo_previsto,
    tipo_ensaio: tipo_ensaio,
    variavel: this.editForm.value.variavel,
    funcao: this.editForm.value.funcao
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
      rejectButtonStyleClass: 'p-button-secondary',
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

submit() {
  const expressao = this.getExpressaoString();

  if (!expressao || expressao.trim() === '') {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A expressão não pode estar vazia.' });
    return;
  }

  if (!this.validarExpressaoComValores(expressao)) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Expressão inválida!' });
    return;
  }

  const variaveis = Array.isArray(this.registerForm.value.variavel)  
    ? this.registerForm.value.variavel
    : [this.registerForm.value.variavel];
    console.log('Enviando VVVVVV:', variaveis);
  this.ensaioService.registerEnsaio(
    this.registerForm.value.descricao,
    this.registerForm.value.responsavel,
    this.registerForm.value.valor,
    this.registerForm.value.tipoEnsaio,
    `${this.registerForm.value.tempoPrevistoValor} ${this.registerForm.value.tempoPrevistoUnidade}`,
    variaveis,
    this.registerForm.value.funcao,
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