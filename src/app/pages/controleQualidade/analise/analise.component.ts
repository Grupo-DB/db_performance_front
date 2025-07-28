import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule, IconField } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule, InputIcon } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { evaluate } from 'mathjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ProjecaoService } from '../../../services/baseOrcamentariaServices/dre/projecao.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { OrdemService } from '../../../services/controleQualidade/ordem.service';
import { Plano } from '../plano/plano.component';
import { ProdutoAmostra } from '../produto-amostra/produto-amostra.component';
import { Produto } from '../../baseOrcamentaria/dre/produto/produto.component';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { Inplace } from "primeng/inplace";
import { PopoverModule } from 'primeng/popover';
import { HttpClient } from '@angular/common/http';

export interface Analise {
  id: number;
  data: string;
  amostra: any;
  estado: string;
}


@Component({
  selector: 'app-analise',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule, CardModule,
    InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule,
    FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,
    ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink, IconField,
    InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,
    InputIcon, FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, AvatarModule,
    CdkDragPlaceholder,PopoverModule,Inplace
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
  providers: [
    MessageService, ConfirmationService, DatePipe
  ],
  templateUrl: './analise.component.html',
  styleUrl: './analise.component.scss'
})
export class AnaliseComponent implements OnInit {
  analiseId: number | undefined;
  analiseAndamento: any;
  digitador: any;
  planosAnalise: Plano[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  materiais: Produto[] = [];
  analise: any;
  idAnalise: any;
  analisesSimplificadas: any[] = [];

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
  planos: any;
  amostraNumero: any;
  planoDescricao: any;
  /////////////////
  resultadosAnteriores: any[] = [];
  mostrandoResultadosAnteriores = false;
  calculoSelecionadoParaPesquisa: any = null;
  carregandoResultados = false;


  constructor(
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
    private colaboradorService: ColaboradorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private produtoLinhaService: ProjecaoService,
    private amostraService: AmostraService,
    private ordemService: OrdemService,
    private ensaioService: EnsaioService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private httpClient: HttpClient
  ) { }

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.analiseId = Number(this.route.snapshot.paramMap.get('id'));
    this.getDigitadorInfo();
    this.getAnalise();
    this.mapearEnsaiosParaCalculos();
    this.recalcularTodosCalculos();
  }

  getAnalise(): void {
    if (this.analiseId !== undefined) {
      this.analiseService.getAnaliseById(this.analiseId).subscribe(
        (analise) => {
          this.analise = analise;
          this.idAnalise = analise.id;
          this.loadAnalisePorId(analise);
        },
        (error) => {
          console.error('Erro ao buscar análise:', error);
        }
      );
    }
  }

  getDigitadorInfo(): void {
  this.colaboradorService.getColaboradorInfo().subscribe(
    data => {
      this.digitador = data.nome;
      

      // Preencher o campo digitador em todos os ensaios já carregados
      this.analisesSimplificadas[0]?.planoDetalhes.forEach((plano: any) => {
        plano.ensaio_detalhes?.forEach((ensaio: any) => {
          ensaio.digitador = this.digitador;
          console.log('Digitador do ensaio:', ensaio.digitador);
        });
        plano.calculo_ensaio_detalhes?.forEach((calc: any) => {
          calc.digitador = this.digitador;
          // Se quiser mostrar também nos ensaios de cálculo:
          calc.ensaios_detalhes?.forEach((calc: any) => {
            calc.digitador = this.digitador;
          });
        });
      });
    },
    error => {
      console.error('Erro ao obter informações do colaborador:', error);
      this.digitador = null;
    }
  );
}

  loadPlanosAnalise() {
    this.ensaioService.getPlanoAnalise().subscribe(
      response => {
        this.planosAnalise = response;
      },
      error => {
        console.log('Erro ao carregar planos de análise', error);
      }
    );
  }

  loadLinhaProdutos(){
    this.produtoLinhaService.getProdutos().subscribe(
      response => {
        this.materiais = response;
      },
      error => {
        console.log('Erro ao carregar produtos', error);
      }
    );
  }



  loadProdutosAmostra(): void{
    this.amostraService.getProdutos().subscribe(
      response => {
        this.produtosAmostra = response;
      }
      , error => {
        console.log('Erro ao carregar produtos de amostra', error);
      }
    )
  }
  
  gerarNumero(materialNome: string, sequencial: number): string {
  const ano = new Date().getFullYear().toString().slice(-2); // Ex: '25'
  const sequencialFormatado = sequencial.toString().padStart(6, '0'); // Ex: '000008'
  // Formata como 08.392 (você pode ajustar conforme a lógica do seu sequencial)
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' -> '392' se quiser os 3 últimos
  return `${materialNome}${ano} ${parte1}.${parte2}`;
}



formatarDatas(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string' && this.isDate(value)) {
        obj[key] = this.datePipe.transform(value, 'dd/MM/yyyy');
      } else if (typeof value === 'object' && value !== null) {
        this.formatarDatas(value); // Formatar objetos aninhados recursivamente
      }
    }
  }
}

isDate(value: string): boolean {
  return !isNaN(Date.parse(value));
}

// Método auxiliar para verificar tipo de ordem
isOrdemExpressa(analise: any): boolean {
  return analise?.amostra_detalhes?.expressa_detalhes !== null;
}

// Método auxiliar para verificar tipo de ordem normal
isOrdemNormal(analise: any): boolean {
  return analise?.amostra_detalhes?.ordem_detalhes !== null;
}

// Método auxiliar para obter dados da ordem (normal ou expressa)
getOrdemData(analise: any): any {
  if (this.isOrdemExpressa(analise)) {
    return {
      detalhes: analise.amostra_detalhes.expressa_detalhes,
      tipo: 'EXPRESSA'
    };
  } else if (this.isOrdemNormal(analise)) {
    return {
      detalhes: analise.amostra_detalhes.ordem_detalhes,
      tipo: 'NORMAL'
    };
  }
  return null;
}

sincronizarValoresEnsaios(produto: any, calc: any) {
  if (!produto.planoEnsaios || !calc.ensaios_detalhes) return;
  calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
    const ensaioPlano = produto.planoEnsaios.find((e: any) => e.descricao === ensaioCalc.descricao);
    if (ensaioPlano) {
      ensaioCalc.valor = ensaioPlano.valor;
    }
  });
}

mapearEnsaiosParaCalculos() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  planoDetalhes.forEach((plano: any) => {
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        const varMatches = (calc.funcao.match(/var\d+/g) || []);
        const variaveisNecessarias: string[] = Array.from(new Set(varMatches));
        if (!calc.ensaios_detalhes) calc.ensaios_detalhes = [];
        variaveisNecessarias.forEach((varNecessaria: string) => {
          let ensaio = calc.ensaios_detalhes.find((e: any) => e.variavel === varNecessaria);
          // Só adiciona se existir correspondente descritivo no plano
          if (!ensaio) {
            // Tenta encontrar no plano.ensaio_detalhes por id, variavel ou nome
            let ensaioPlano = plano.ensaio_detalhes?.find((e: any) => e.variavel === varNecessaria || e.nome === varNecessaria);
            if (!ensaioPlano) {
              // Tenta por ordem (var0 = idx 0, etc)
              const idx = Number(varNecessaria.replace('var', ''));
              ensaioPlano = plano.ensaio_detalhes && plano.ensaio_detalhes[idx] ? plano.ensaio_detalhes[idx] : null;
            }
            if (ensaioPlano) {
              // Evita duplicidade: só adiciona se não existir ensaio com mesmo id ou descricao
              const jaExiste = calc.ensaios_detalhes.some((e: any) =>
                (e.id !== null && ensaioPlano.id !== null && e.id === ensaioPlano.id) ||
                (e.descricao && ensaioPlano.descricao && e.descricao === ensaioPlano.descricao)
              );
              if (!jaExiste) {
                ensaio = {
                  id: ensaioPlano.id,
                  descricao: ensaioPlano.descricao,
                  variavel: ensaioPlano.variavel || varNecessaria,
                  valor: ensaioPlano.valor,
                  responsavel: ensaioPlano.responsavel,
                  digitador: this.digitador
                };
                calc.ensaios_detalhes.push(ensaio);
              }
            }
            // Se não encontrar correspondente, NÃO cria ensaio para varX
          }
        });
        // Garante que todos os valores não sejam null
        calc.ensaios_detalhes.forEach((e: any) => {
          if (e.valor === null || e.valor === undefined) e.valor = 0;
        });
      });
    }
  });
}

calcular(calc: any, produto?: any) {
  console.log('=== MÉTODO CALCULAR INICIADO ===');
  console.log('Cálculo:', calc.descricao);
  console.log('Função:', calc.funcao);

  if (produto) {
    this.sincronizarValoresEnsaios(produto, calc);
  }

  if (!calc.ensaios_detalhes || !Array.isArray(calc.ensaios_detalhes)) {
    calc.resultado = 'Sem ensaios para calcular';
    console.log('Resultado: Sem ensaios para calcular');
    return;
  }

  // 1. Descubra todos os varX usados na expressão
  const varMatches = (calc.funcao.match(/var\d+/g) || []);
const varList = Array.from(new Set(varMatches)) as string[];
console.log('Variáveis encontradas na função:', varList);

  // 2. Monte safeVars usando as variáveis EXATAS da função
  const safeVars: any = {};

  // Tenta mapear cada varX da função para o ensaio correspondente
  varList.forEach((varName: string, idx: number) => {
    // Procura um ensaio que tenha exatamente essa variável
    let ensaio = calc.ensaios_detalhes.find((e: any) => e.variavel === varName);

    // Se não encontrar, tenta pelo índice (caso a ordem bata)
    if (!ensaio && calc.ensaios_detalhes[idx]) {
      ensaio = calc.ensaios_detalhes[idx];
    }

    // Se ainda não encontrar, tenta por nome do campo (caso tenha um campo nome igual ao varName)
    if (!ensaio) {
      ensaio = calc.ensaios_detalhes.find((e: any) => e.nome === varName);
    }

    // Se encontrou, usa o valor; senão, 0
    if (ensaio) {
      const valor = Number(ensaio.valor) || 0;
      safeVars[varName] = valor;
      console.log(`Mapeamento: ${varName} = ${valor} (de ${ensaio.descricao || ensaio.nome || 'sem descrição'})`);
    } else {
      safeVars[varName] = 0;
      console.warn(`Variável ${varName} não encontrada em nenhum ensaio, usando 0`);
    }
  });

  console.log('SafeVars final para avaliação:', safeVars);

  // 3. Avalie usando mathjs
  try {
    const resultado = evaluate(calc.funcao, safeVars);
    calc.resultado = Number(resultado.toFixed(4));
    console.log(`✓ Resultado calculado: ${calc.resultado}`);
  } catch (e) {
    calc.resultado = 'Erro no cálculo';
    console.error('Erro no cálculo:', e);
  }

  console.log('=== MÉTODO CALCULAR FINALIZADO ===\n');
}




private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

recalcularTodosCalculos() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;

  console.log('=== INICIANDO RECÁLCULO DE TODOS OS CÁLCULOS ===');
  
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];

  planoDetalhes.forEach((plano: any) => {
    console.log('Processando plano:', plano.descricao);
    
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        console.log('=== PROCESSANDO CÁLCULO:', calc.descricao, '===');
        console.log('Ensaios do cálculo ANTES da sincronização:', calc.ensaios_detalhes);
        
        // SINCRONIZAR valores dos ensaios antes de calcular
        if (calc.ensaios_detalhes && plano.ensaio_detalhes) {
          calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
            // Buscar pelo ID primeiro, depois pela descrição, depois pela variável
            let ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.id === ensaioCalc.id);

            if (!ensaioPlano) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.descricao === ensaioCalc.descricao);
            }

            if (!ensaioPlano && ensaioCalc.variavel) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.variavel === ensaioCalc.variavel || e.nome === ensaioCalc.variavel);
            }

            if (ensaioPlano) {
              const valorAntigo = ensaioCalc.valor;
              ensaioCalc.valor = ensaioPlano.valor;
              console.log(`✓ Sincronizado ${ensaioCalc.descricao || ensaioCalc.variavel}: ${valorAntigo} → ${ensaioPlano.valor}`);
            } else {
              console.warn(`✗ Ensaio ${ensaioCalc.descricao || ensaioCalc.variavel} (ID: ${ensaioCalc.id}, VAR: ${ensaioCalc.variavel}) não encontrado no plano`);
              console.log('Ensaios disponíveis no plano:', plano.ensaio_detalhes.map((e: any) => ({
                id: e.id,
                descricao: e.descricao,
                valor: e.valor,
                variavel: e.variavel,
                nome: e.nome
              })));
            }
          });
        }
        
        console.log('Ensaios do cálculo APÓS sincronização:', calc.ensaios_detalhes);
        
        // Agora calcular com os valores atualizados
        this.calcular(calc, plano);
        console.log(`✓ Cálculo ${calc.descricao} resultado FINAL: ${calc.resultado}`);
        console.log('=== FIM CÁLCULO:', calc.descricao, '===\n');
      });
    }
  });
  
  console.log('=== FIM RECÁLCULO DE TODOS OS CÁLCULOS ===');
}

calcularEnsaios(ensaios: any[], produto: any) {
  const planoCalculos = produto.planoCalculos || [];
  if (!planoCalculos.length) {
    produto.resultado = 'Sem função';
    return;
  }

  planoCalculos.forEach((calc: { funcao: any; ensaios_detalhes: any[]; resultado: string; }) => {
    let funcaoSubstituida = calc.funcao;
    calc.ensaios_detalhes.forEach((ensaio: any) => {
      const valor = ensaio.valor !== undefined && ensaio.valor !== null ? ensaio.valor : 0;
      funcaoSubstituida = funcaoSubstituida.replace(
        new RegExp('\\b' + ensaio.descricao + '\\b', 'gi'),
        valor
      );
    });
    console.log('Função final para eval:', funcaoSubstituida);
    try {
      calc.resultado = eval(funcaoSubstituida);
    } catch (e) {
      calc.resultado = 'Erro no cálculo';
    }
  });

  produto.resultado = planoCalculos[0]?.resultado;
}

calcularTodosCalculosDoPlano(plano: any) {
  if (plano && plano.calculo_ensaio_detalhes) {
    plano.calculo_ensaio_detalhes.forEach((calc: any) => this.calcular(calc, plano));
  }
}


//////////////////////////////////////////////Nova Versão////////////////////////////////////////////////////
atualizarVariavelEnsaio(ensaio: any, variavel: any, novoValor: any) {
  // Atualiza o valor na lista de variáveis descritivas (garante referência correta)
  const idx = ensaio.variavel_detalhes.findIndex((v: any) => v === variavel || v.nome === variavel.nome);
  const valorNum = parseFloat(novoValor) || 0;
  if (idx !== -1) {
    ensaio.variavel_detalhes[idx].valor = valorNum;
  }
  variavel.valor = valorNum;
  console.log(`Variável ${variavel.nome} atualizada para: ${valorNum}`);
  // Recalcular o ensaio direto
  this.calcularEnsaioDireto(ensaio);
}

forcarDeteccaoMudancas() {
  this.cd.detectChanges();
}

calcularEnsaioDireto(ensaio: any) {
  if (!ensaio.funcao) {
    ensaio.valor = 0;
    return;
  }

  try {
    // Verificar se todas as variáveis necessárias na função estão presentes
    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const uniqueVarList = Array.from(new Set(varMatches)) as string[];

    // Não criar nem manter nenhum campo varX em ensaio.variavel_detalhes
    if (!ensaio.variavel_detalhes) {
      ensaio.variavel_detalhes = [];
    }
    // Manter apenas variáveis descritivas (não técnicas)
    ensaio.variavel_detalhes = ensaio.variavel_detalhes.filter((v: any) => !/^var\d+$/.test(v.nome));
    const variaveisDescritivas = ensaio.variavel_detalhes;

    // Mapeamento: varX -> variável descritiva por id, nome ou ordem
    const safeVars: any = {};
    uniqueVarList.forEach((varTecnica: string) => {
      const match = varTecnica.match(/^var(\d+)$/);
      let valor = 0;
      if (match) {
        const idx = Number(match[1]);
        // 1. Tenta encontrar variável cujo id === idx
        let varById = variaveisDescritivas.find((v: any) => v.id === idx);
        // 2. Se não encontrar, tenta por nome contendo o índice
        let varByName = !varById ? variaveisDescritivas.find((v: any) => v.nome && v.nome.match(new RegExp(`\\b${idx}\\b`))) : null;
        // 3. Se não encontrar, tenta por ordem
        let varByOrder = !varById && !varByName && variaveisDescritivas[idx] ? variaveisDescritivas[idx] : null;
        const varFinal = varById || varByName || varByOrder;
        if (varFinal && typeof varFinal.valor !== 'undefined') {
          valor = parseFloat(varFinal.valor);
          if (isNaN(valor)) valor = 0;
        }
      }
      safeVars[varTecnica] = valor;
    });

    // Verificar se temos variáveis para calcular
    if (Object.keys(safeVars).length === 0) {
      ensaio.valor = 0;
      return;
    }

    // Calcular usando mathjs
    const resultado = evaluate(ensaio.funcao, safeVars);

    // Verificar se o resultado é válido
    if (isNaN(resultado) || !isFinite(resultado)) {
      ensaio.valor = 0;
    } else {
      ensaio.valor = Number(resultado.toFixed(4)); // Limitar a 4 casas decimais
    }

    // Após calcular o ensaio direto, recalcular TODOS os cálculos
    this.recalcularTodosCalculos();
    this.forcarDeteccaoMudancas();
  } catch (error) {
    ensaio.valor = 0;
  }
}

recalcularCalculosDependentes(ensaioAlterado: any) {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;

  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];

  planoDetalhes.forEach((plano: any) => {
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        console.log('Verificando cálculo:', calc.descricao);
        console.log('Ensaios do cálculo:', calc.ensaios_detalhes);
        console.log('Ensaio alterado:', ensaioAlterado);

        // Verificar se este cálculo usa o ensaio alterado
        const usaEnsaio = calc.ensaios_detalhes?.some((e: any) => {
          const comparaId = e.id === ensaioAlterado.id;
          const comparaDescricao = e.descricao === ensaioAlterado.descricao;
          
          console.log(`Comparando: ${e.id} === ${ensaioAlterado.id} = ${comparaId}`);
          console.log(`Comparando: "${e.descricao}" === "${ensaioAlterado.descricao}" = ${comparaDescricao}`);
          
          return comparaId || comparaDescricao;
        });

        console.log('Usa ensaio:', usaEnsaio);

        if (usaEnsaio) {
          console.log('Recalculando cálculo:', calc.descricao);
          
          // Sincronizar o valor do ensaio alterado no cálculo
          calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
            if (ensaioCalc.id === ensaioAlterado.id || ensaioCalc.descricao === ensaioAlterado.descricao) {
              console.log(`Atualizando valor de ${ensaioCalc.descricao} de ${ensaioCalc.valor} para ${ensaioAlterado.valor}`);
              ensaioCalc.valor = ensaioAlterado.valor;
            }
          });

          // Recalcular o cálculo
          this.calcular(calc, plano);
          console.log('Resultado do cálculo:', calc.resultado);
        }
      });
    }
  });
}

recalcularTodosEnsaiosDirectos(plano: any) {
  if (plano && plano.ensaio_detalhes) {
    plano.ensaio_detalhes.forEach((ensaio: any) => {
      if (ensaio.funcao) {
        this.calcularEnsaioDireto(ensaio);
      }
    });
  }
}

inicializarVariaveisEnsaios() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;

  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];

  planoDetalhes.forEach((plano: any) => {
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any) => {
        if (ensaio.funcao && (!ensaio.variavel_detalhes || ensaio.variavel_detalhes.length === 0)) {
          // Extrair variáveis da função
          const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
          const varList: string[] = Array.from(new Set(varMatches));

          ensaio.variavel_detalhes = varList.map((varName: string) => ({
            nome: varName,
            valor: 0
          }));
        }
      });
    }
  });
}


loadAnalisePorId(analise: any) {
  if (!analise || !analise.amostra_detalhes) {
    this.analisesSimplificadas = [];
    return;
  }

  let planoDetalhes: any[] = [];

  const isOrdemExpressa = analise.amostra_detalhes.expressa_detalhes !== null;
  const isOrdemNormal = analise.amostra_detalhes.ordem_detalhes !== null;

  console.log('Tipo de ordem detectado:', {
    isOrdemExpressa,
    isOrdemNormal,
    expressa_detalhes: analise.amostra_detalhes.expressa_detalhes,
    ordem_detalhes: analise.amostra_detalhes.ordem_detalhes
  });

  let detalhesOrdem: any = {};
  let ensaioDetalhes: any[] = [];
  let calculoDetalhes: any[] = [];

  if (isOrdemExpressa) {
    // Processar dados da ordem expressa
    const expressaDetalhes = analise.amostra_detalhes.expressa_detalhes;
    
    detalhesOrdem = {
      id: expressaDetalhes.id,
      numero: expressaDetalhes.numero,
      data: expressaDetalhes.data,
      responsavel: expressaDetalhes.responsavel,
      digitador: expressaDetalhes.digitador,
      classificacao: expressaDetalhes.classificacao,
      tipo: 'EXPRESSA'
    };

    ensaioDetalhes = expressaDetalhes.ensaio_detalhes || [];
    calculoDetalhes = expressaDetalhes.calculo_ensaio_detalhes || [];

  } else if (isOrdemNormal) {
    // Processar dados da ordem normal
    const ordemDetalhes = analise.amostra_detalhes.ordem_detalhes;
    const planoDetalhes = ordemDetalhes.plano_detalhes || [];

    detalhesOrdem = {
      id: ordemDetalhes.id,
      numero: ordemDetalhes.numero,
      data: ordemDetalhes.data,
      responsavel: ordemDetalhes.responsavel,
      digitador: ordemDetalhes.digitador,
      classificacao: ordemDetalhes.classificacao,
      planoAnalise: planoDetalhes[0]?.descricao,
      tipo: 'NORMAL'
    };

    ensaioDetalhes = planoDetalhes[0]?.ensaio_detalhes || [];
    calculoDetalhes = planoDetalhes[0]?.calculo_ensaio_detalhes || [];

  } else {
    console.error('Tipo de ordem não identificado');
    this.analisesSimplificadas = [];
    return;
  }

  // ===== NOVA LÓGICA PARA CARREGAR VALORES SALVOS =====
  
  // 1. Processar ensaios - incluindo valores calculados salvos
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados && ensaioDetalhes.length > 0) {
    const ultimoUtilizados = analise.ultimo_ensaio.ensaios_utilizados;
    
    ensaioDetalhes = ensaioDetalhes.map((ensaio: any) => {
      const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));
      
      // Se é um ensaio direto (tem função) e foi salvo, usar o valor salvo
      const valorFinal = valorRecente ? valorRecente.valor : ensaio.valor;
      
      console.log(`Carregando ensaio ${ensaio.descricao}:`, {
        temFuncao: !!ensaio.funcao,
        valorBanco: valorRecente?.valor,
        valorOriginal: ensaio.valor,
        valorFinal: valorFinal
      });

      return {
        ...ensaio,
        valor: valorFinal, // Usar o valor salvo do banco
        responsavel: valorRecente ? analise.ultimo_ensaio.responsavel : ensaio.responsavel,
        digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
      };
    });
  }

  // 2. Se há dados de ensaios salvos, também carregar as variáveis dos ensaios diretos
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados) {
    analise.ultimo_ensaio.ensaios_utilizados.forEach((ensaioSalvo: any) => {
      // Encontrar o ensaio correspondente
      const ensaioOriginal = ensaioDetalhes.find((e: any) => String(e.id) === String(ensaioSalvo.id));
      
      if (ensaioOriginal && ensaioOriginal.funcao && ensaioSalvo.variaveis_utilizadas) {
        // Restaurar as variáveis salvas
        ensaioOriginal.variavel_detalhes = ensaioSalvo.variaveis_utilizadas.map((v: any) => ({
          nome: v.nome,
          valor: v.valor
        }));
        
        console.log(`Restaurando variáveis do ensaio ${ensaioOriginal.descricao}:`, ensaioOriginal.variavel_detalhes);
      }
    });
  }

  // 3. Processar cálculos (mesmo para ambos os tipos)
  if (calculoDetalhes.length > 0) {
    const calculosDetalhes = analise.calculos_detalhes || [];
    calculoDetalhes = calculoDetalhes.map((calc: any) => {
      const calcBanco = calculosDetalhes
        .filter((c: any) => c.calculos === calc.descricao)
        .sort((a: any, b: any) => b.id - a.id)[0];

      const ensaiosUtilizados = calcBanco?.ensaios_utilizados || calc.ensaios_detalhes || [];
      calc.ensaios_detalhes = ensaiosUtilizados.length
        ? ensaiosUtilizados.map((u: any) => {
            const original = (calc.ensaio_detalhes_original || calc.ensaios_detalhes || []).find((e: any) => String(e.id) === String(u.id));
            const responsavelObj = this.responsaveis.find(r =>
              r.value === u.responsavel || r.value === u.responsavel || r.value === u.responsavel
            );
            return {
              ...u,
              valor: u.valor,
              responsavel: responsavelObj || u.responsavel || null,
              digitador: calcBanco?.digitador || this.digitador,
              tempo_previsto: original?.tempo_previsto ?? null,
              tipo_ensaio_detalhes: original?.tipo_ensaio_detalhes ?? null,
              variavel: u.variavel || original?.variavel,
            };
          })
        : (calc.ensaios_detalhes || []);
      return {
        ...calc,
        resultado: calcBanco?.resultados ?? calc.resultado,
      };
    });
  }

  // Montar estrutura final unificada
  this.analisesSimplificadas = [{
    // Dados da amostra (comum para ambos os tipos)
    amostraDataEntrada: analise.amostra_detalhes?.data_entrada,
    amostraDataColeta: analise.amostra_detalhes?.data_coleta,
    amostraDigitador: analise.amostra_detalhes?.digitador,
    amostraFornecedor: analise.amostra_detalhes?.fornecedor,
    amostraIdentificacaoComplementar: analise.amostra_detalhes?.identificacao_complementar,
    amostraComplemento: analise.amostra_detalhes?.complemento,
    amostraLocalColeta: analise.amostra_detalhes?.local_coleta,
    amostraMaterial: analise.amostra_detalhes?.material_detalhes?.nome,
    amostraNumero: analise.amostra_detalhes?.numero,
    amostraPeriodoHora: analise.amostra_detalhes?.periodo_hora,
    amostraPeriodoTurno: analise.amostra_detalhes?.periodo_turno,
    amostraRepresentatividadeLote: analise.amostra_detalhes?.representatividade_lote,
    amostraStatus: analise.amostra_detalhes?.status,
    amostraSubtipo: analise.amostra_detalhes?.subtipo,
    amostraTipoAmostra: analise.amostra_detalhes?.tipo_amostra_detalhes?.nome,
    amostraNatureza: analise.amostra_detalhes?.tipo_amostra_detalhes?.natureza,
    amostraTipoAmostragem: analise.amostra_detalhes?.tipo_amostragem,
    amostraProdutoAmostra: analise.amostra_detalhes?.produto_amostra_detalhes?.nome,
    amostraRegistroEmpresa: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_empresa,
    amostraRegistroProduto: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_produto,
    
    // Estado da análise
    estado: analise.estado,
    
    // Dados da ordem (unificados)
    ordemId: detalhesOrdem.id,
    ordemNumero: detalhesOrdem.numero,
    ordemData: detalhesOrdem.data,
    ordemResponsavel: detalhesOrdem.responsavel,
    ordemDigitador: detalhesOrdem.digitador,
    ordemClassificacao: detalhesOrdem.classificacao,
    ordemTipo: detalhesOrdem.tipo,
    ordemPlanoAnalise: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
    
    // Dados dos ensaios e cálculos (unificados)
    planoEnsaios: ensaioDetalhes,
    planoCalculos: calculoDetalhes,
    
    // Estrutura para compatibilidade com código existente
    planoDetalhes: [{
      id: detalhesOrdem.id,
      descricao: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
      ensaio_detalhes: ensaioDetalhes,
      calculo_ensaio_detalhes: calculoDetalhes,
      tipo: detalhesOrdem.tipo
    }]
  }];

  console.log('Análise processada:', {
    tipo: detalhesOrdem.tipo,
    ensaios: ensaioDetalhes.length,
    calculos: calculoDetalhes.length,
    estruturaFinal: this.analisesSimplificadas[0]
  });

  planoDetalhes.forEach((plano: any) => {
  if (plano.ensaio_detalhes) {
    plano.ensaio_detalhes.forEach((ensaio: any, idx: number) => {
      if (!ensaio.variavel) {
        ensaio.variavel = `var${idx}`;
      }
    });
  }
});

  // Após processar todos os dados, inicializar variáveis dos ensaios diretos (só se não foram carregadas do banco)
  setTimeout(() => {
    this.inicializarVariaveisEnsaios();
    this.mapearEnsaiosParaCalculos();
    // Recalcular os cálculos com os valores carregados
    this.recalcularTodosCalculos();
  }, 1000);
}



salvarAnaliseResultados() {
  // Verificar se há dados para salvar
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Aviso', 
      detail: 'Nenhum dado de análise encontrado para salvar.' 
    });
    return;
  }

  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  
  console.log('Salvando análise:', {
    tipo: analiseData.ordemTipo,
    planoDetalhes: planoDetalhes
  });

  // Montar ensaios (incluindo valores calculados dos ensaios diretos)
  const ensaios = planoDetalhes.flatMap((plano: any) =>
    (plano.ensaio_detalhes || []).map((ensaio: any) => {
      // Para ensaios diretos (com função), usar o valor calculado
      const valorFinal = ensaio.funcao ? ensaio.valor : ensaio.valor;
      
      console.log(`Salvando ensaio ${ensaio.descricao}:`, {
        temFuncao: !!ensaio.funcao,
        valorOriginal: ensaio.valor,
        valorFinal: valorFinal,
        variaveis: ensaio.variavel_detalhes
      });

      return {
        ensaios: ensaio.id,
        descricao: ensaio.descricao,
        valores: valorFinal, // Usar o valor calculado
        responsavel: typeof ensaio.responsavel === 'object' && ensaio.responsavel !== null
          ? ensaio.responsavel.value
          : ensaio.responsavel,
        digitador: this.digitador,
        tempo_previsto: ensaio.tempo_previsto,
        tipo: ensaio.tipo_ensaio_detalhes?.nome,
        funcao: ensaio.funcao || null,
        // Para ensaios diretos, incluir as variáveis utilizadas
        variaveis_utilizadas: ensaio.funcao && ensaio.variavel_detalhes 
          ? ensaio.variavel_detalhes.map((v: any) => ({
              nome: v.nome,
              valor: v.valor
            }))
          : [],
        ensaios_utilizados: (plano.ensaio_detalhes || []).map((e: any) => ({
          id: e.id,
          descricao: e.descricao,
          valor: e.valor
        }))
      };
    })
  );

  // Montar cálculos (funciona para ambos os tipos)
  const calculos = planoDetalhes.flatMap((plano: any) =>
    (plano.calculo_ensaio_detalhes || []).map((calc: any) => ({
      calculos: calc.descricao,
      valores: (calc.ensaios_detalhes || []).map((e: any) => e.valor),
      resultados: calc.resultado,
      digitador: this.digitador,
      ensaios_utilizados: (calc.ensaios_detalhes || []).map((e: any) => ({
        id: e.id,
        descricao: e.descricao,
        valor: e.valor,
        variavel: e.variavel,
        responsavel: typeof e.responsavel === 'object' && e.responsavel !== null
          ? e.responsavel.value
          : e.responsavel
      }))
    }))
  );

  const idAnalise = this.analiseId ?? 0;
  const payload = {
    estado: 'PENDENTE',
    ensaios: ensaios,
    calculos: calculos
  };

  console.log('Payload completo para análise:', {
    idAnalise,
    tipoOrdem: analiseData.ordemTipo,
    totalEnsaios: ensaios.length,
    totalCalculos: calculos.length,
    ensaiosDetalhados: ensaios,
    calculosDetalhados: calculos,
    payload
  });

  this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    next: () => {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Sucesso', 
        detail: `Análise ${analiseData.ordemTipo?.toLowerCase() || 'processada'} registrada com sucesso.` 
      });
    },
    error: (err) => {
      console.error('Erro ao registrar análise:', err);
      if (err.status === 401) {
        this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
      } else if (err.status === 403) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
      } else if (err.status === 400) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
      }
    }
  });
}

///--------------------------------CONSULTAR RESULTADOS-------------------------------///////

// ...existing code...

buscarResultadosAnteriores(calc: any) {
  console.log('=== INICIANDO BUSCA DE RESULTADOS ANTERIORES ===');
  console.log('Cálculo:', calc);
  
  if (!calc || !calc.ensaios_detalhes || calc.ensaios_detalhes.length === 0) {
    console.error('ERRO: Nenhum ensaio encontrado');
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Nenhum ensaio encontrado para pesquisar resultados anteriores.'
    });
    return;
  }

  this.calculoSelecionadoParaPesquisa = calc;
  this.carregandoResultados = true;
  this.mostrandoResultadosAnteriores = true;

  const ensaioIds = calc.ensaios_detalhes.map((ensaio: any) => ensaio.id);

  console.log('Parâmetros da busca:', {
    calculoDescricao: calc.descricao,
    ensaioIds: ensaioIds,
    limit: 10
  });

  // USAR O SERVICE NORMALMENTE - IGUAL TODOS OS OUTROS ENDPOINTS
  this.analiseService.getResultadosAnteriores(calc.descricao, ensaioIds, 10)
    .subscribe({
      next: (resultados: any[]) => {
        console.log('✅ Resultados recebidos via service:', resultados);
        this.processarResultadosAnteriores(resultados, calc);
        this.carregandoResultados = false;

        if (this.resultadosAnteriores.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Informação',
            detail: 'Nenhum resultado anterior encontrado para este cálculo.'
          });
        }
      },
      error: (error: any) => {
        console.error('❌ Erro no service:', error);
        this.carregandoResultados = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: `Erro ao buscar resultados: ${error.message}`
        });
      }
    });
}

processarResultadosAnteriores(resultados: any[], calcAtual: any) {
  console.log('=== PROCESSANDO RESULTADOS ANTERIORES ===');
  console.log('Dados recebidos:', resultados);
  console.log('Cálculo atual:', calcAtual);

  if (!resultados || !Array.isArray(resultados) || resultados.length === 0) {
    console.log('Nenhum dado para processar');
    this.resultadosAnteriores = [];
    return;
  }

  console.log(`📊 Processando ${resultados.length} itens...`);

  // Agrupar por análise_id
  const analiseMap = new Map();

  resultados.forEach((item: any, index: number) => {
    console.log(`📝 Processando item ${index + 1}:`, item);
    
    const analiseId = item.analise_id;
    
    if (!analiseMap.has(analiseId)) {
      // Inicializar dados da análise
      analiseMap.set(analiseId, {
        analiseId: analiseId,
        amostraNumero: item.amostra_numero || 'N/A',
        dataAnalise: item.data_analise || new Date(),
        dataFormatada: this.datePipe.transform(item.data_analise || new Date(), 'dd/MM/yyyy HH:mm') || 'Data não disponível',
        responsavel: item.responsavel || 'N/A',
        digitador: item.digitador || 'N/A',
        resultadoCalculo: null,
        ensaiosUtilizados: []
      });
    }

    const analiseData = analiseMap.get(analiseId);

    // Processar baseado no tipo
    if (item.tipo === 'CALCULO' && item.resultado_calculo !== null) {
      console.log(`📊 Resultado de cálculo encontrado: ${item.resultado_calculo}`);
      analiseData.resultadoCalculo = item.resultado_calculo;
    }

    if (item.tipo === 'ENSAIO' && item.ensaio_descricao) {
      console.log(`🧪 Processando ensaio: ${item.ensaio_descricao}`);
      console.log('🧪 Valor ensaio (raw):', item.valor_ensaio);
      
      // CORREÇÃO AQUI: tratar valor_ensaio como array
      if (item.valor_ensaio && Array.isArray(item.valor_ensaio)) {
        item.valor_ensaio.forEach((valorItem: any) => {
          console.log('🧪 Processando valor do array:', valorItem);
          
          // Verificar se este ensaio é usado no cálculo atual
          const ensaioUsado = calcAtual.ensaios_detalhes?.some((e: any) => 
            e.id === valorItem.id || 
            e.descricao === valorItem.descricao ||
            this.normalize(e.descricao) === this.normalize(valorItem.descricao)
          );

          console.log(`Ensaio ${valorItem.descricao} é usado no cálculo atual:`, ensaioUsado);

          if (ensaioUsado) {
            // Verificar se já existe este ensaio na lista
            const ensaioExistente = analiseData.ensaiosUtilizados.find((e: any) => 
              e.id === valorItem.id || e.descricao === valorItem.descricao
            );

            if (!ensaioExistente) {
              analiseData.ensaiosUtilizados.push({
                id: valorItem.id,
                descricao: valorItem.descricao,
                valor: valorItem.valor, // Usar o valor do objeto
                responsavel: item.ensaio_responsavel || 'N/A'
              });
              console.log(`✅ Ensaio adicionado: ${valorItem.descricao} = ${valorItem.valor}`);
            }
          }
        });
      } else if (item.valor_ensaio) {
        // Se não for array, tratar como valor simples (fallback)
        console.log('🧪 Valor ensaio não é array, tratando como simples');
        
        const ensaioUsado = calcAtual.ensaios_detalhes?.some((e: any) => 
          e.id === item.ensaio_id || 
          e.descricao === item.ensaio_descricao ||
          this.normalize(e.descricao) === this.normalize(item.ensaio_descricao)
        );

        if (ensaioUsado) {
          const ensaioExistente = analiseData.ensaiosUtilizados.find((e: any) => 
            e.id === item.ensaio_id || e.descricao === item.ensaio_descricao
          );

          if (!ensaioExistente) {
            analiseData.ensaiosUtilizados.push({
              id: item.ensaio_id,
              descricao: item.ensaio_descricao,
              valor: item.valor_ensaio,
              responsavel: item.ensaio_responsavel || 'N/A'
            });
          }
        }
      }

      // Atualizar dados básicos se não foram definidos
      if (analiseData.responsavel === 'N/A' && item.ensaio_responsavel) {
        analiseData.responsavel = item.ensaio_responsavel;
      }
    }
  });

  // Converter para array e filtrar apenas análises com resultado de cálculo
  this.resultadosAnteriores = Array.from(analiseMap.values())
    .filter((item: any) => {
      const temResultado = item.resultadoCalculo !== null && item.resultadoCalculo !== undefined;
      const temEnsaios = item.ensaiosUtilizados.length > 0;
      
      console.log(`📋 Análise ${item.analiseId}:`, {
        temResultado,
        resultado: item.resultadoCalculo,
        temEnsaios,
        qtdEnsaios: item.ensaiosUtilizados.length,
        ensaios: item.ensaiosUtilizados.map((e: any) => `${e.descricao}=${e.valor}`).join(', ')
      });
      
      return temResultado && temEnsaios;
    })
    .sort((a: any, b: any) => new Date(b.dataAnalise).getTime() - new Date(a.dataAnalise).getTime());

  console.log('🎉 PROCESSAMENTO CONCLUÍDO!');
  console.log(`📊 Total de resultados processados: ${this.resultadosAnteriores.length}`);
  console.log('📋 Resultados finais:', this.resultadosAnteriores);
}

aplicarResultadosAnteriores(resultadoAnterior: any) {
  console.log('Aplicando resultados anteriores:', resultadoAnterior);
  
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Nenhuma análise carregada para aplicar os valores.'
    });
    return;
  }

  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];

  let valoresAplicados = 0;

  planoDetalhes.forEach((plano: any) => {
    // Aplicar nos cálculos
    if (plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes.forEach((calc: any) => {
        if (calc.descricao === this.calculoSelecionadoParaPesquisa?.descricao) {
          console.log('Aplicando valores no cálculo:', calc.descricao);
          
          // Aplicar valores dos ensaios
          if (calc.ensaios_detalhes && resultadoAnterior.ensaiosUtilizados) {
            calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
              const ensaioAnterior = resultadoAnterior.ensaiosUtilizados.find((e: any) => 
                e.id === ensaioCalc.id || e.descricao === ensaioCalc.descricao
              );
              
              if (ensaioAnterior) {
                console.log(`Aplicando valor: ${ensaioCalc.descricao} = ${ensaioAnterior.valor}`);
                ensaioCalc.valor = ensaioAnterior.valor;
                if (ensaioAnterior.responsavel) {
                  ensaioCalc.responsavel = ensaioAnterior.responsavel;
                }
                valoresAplicados++;

                // Sincronizar com ensaio direto se existir
                const ensaioDireto = plano.ensaio_detalhes?.find((e: any) => 
                  e.id === ensaioCalc.id || e.descricao === ensaioCalc.descricao
                );
                if (ensaioDireto) {
                  ensaioDireto.valor = ensaioAnterior.valor;
                  if (ensaioAnterior.responsavel) {
                    ensaioDireto.responsavel = ensaioAnterior.responsavel;
                  }
                }
              }
            });
          }

          // Recalcular o cálculo com os novos valores
          this.calcular(calc, plano);
          console.log('Cálculo recalculado. Resultado:', calc.resultado);
        }
      });
    }
  });

  if (valoresAplicados > 0) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${valoresAplicados} valores aplicados com sucesso. Cálculo atualizado.`
    });
    
    // Fechar o dialog
    this.fecharResultadosAnteriores();
    
    // Forçar detecção de mudanças
    this.forcarDeteccaoMudancas();
  } else {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: 'Nenhum valor foi aplicado. Verifique se os ensaios correspondem.'
    });
  }
}

fecharResultadosAnteriores() {
  this.mostrandoResultadosAnteriores = false;
  this.resultadosAnteriores = [];
  this.calculoSelecionadoParaPesquisa = null;
}


}
