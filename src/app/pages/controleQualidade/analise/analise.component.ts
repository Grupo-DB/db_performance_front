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

export interface Analise {
  id: number;
  data: string;
  amostra: any;
  estado: string;
}


@Component({
  selector: 'app-analise',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,IconField,
    InputNumberModule,AutoCompleteModule,MultiSelectModule,DatePickerModule,StepperModule,
    InputIcon,FieldsetModule,MenuModule,SplitButtonModule,DrawerModule,SpeedDialModule,AvatarModule
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
  ) { }

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.analiseId = Number(this.route.snapshot.paramMap.get('id'));
    this.getDigitadorInfo();
    this.getAnalise();
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



irLinkExterno(analise: any) {
  window.open(`/welcome/controleQualidade/analise`, analise.id);
}

editar(amostra: any) {
  // lógica para editar
}
excluir(amostra: any) {
  // lógica para excluir
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

// loadAnalisePorId(analise: any) {
//   if (!analise || !analise.amostra_detalhes) {
//     this.analisesSimplificadas = [];
//     return;
//   }

//   // Detectar se é ordem normal ou expressa
//   const isOrdemExpressa = analise.amostra_detalhes.expressa_detalhes !== null;
//   const isOrdemNormal = analise.amostra_detalhes.ordem_detalhes !== null;

//   console.log('Tipo de ordem detectado:', {
//     isOrdemExpressa,
//     isOrdemNormal,
//     expressa_detalhes: analise.amostra_detalhes.expressa_detalhes,
//     ordem_detalhes: analise.amostra_detalhes.ordem_detalhes
//   });

//   let detalhesOrdem: any = {};
//   let ensaioDetalhes: any[] = [];
//   let calculoDetalhes: any[] = [];

//   if (isOrdemExpressa) {
//     // Processar dados da ordem expressa
//     const expressaDetalhes = analise.amostra_detalhes.expressa_detalhes;
    
//     detalhesOrdem = {
//       id: expressaDetalhes.id,
//       numero: expressaDetalhes.numero,
//       data: expressaDetalhes.data,
//       responsavel: expressaDetalhes.responsavel,
//       digitador: expressaDetalhes.digitador,
//       classificacao: expressaDetalhes.classificacao,
//       tipo: 'EXPRESSA'
//     };

//     ensaioDetalhes = expressaDetalhes.ensaio_detalhes || [];
//     calculoDetalhes = expressaDetalhes.calculo_ensaio_detalhes || [];

//     console.log('Dados ordem expressa:', { detalhesOrdem, ensaioDetalhes, calculoDetalhes });

//   } else if (isOrdemNormal) {
//     // Processar dados da ordem normal
//     const ordemDetalhes = analise.amostra_detalhes.ordem_detalhes;
//     const planoDetalhes = ordemDetalhes.plano_detalhes || [];

//     detalhesOrdem = {
//       id: ordemDetalhes.id,
//       numero: ordemDetalhes.numero,
//       data: ordemDetalhes.data,
//       responsavel: ordemDetalhes.responsavel,
//       digitador: ordemDetalhes.digitador,
//       classificacao: ordemDetalhes.classificacao,
//       planoAnalise: planoDetalhes[0]?.descricao,
//       tipo: 'NORMAL'
//     };

//     ensaioDetalhes = planoDetalhes[0]?.ensaio_detalhes || [];
//     calculoDetalhes = planoDetalhes[0]?.calculo_ensaio_detalhes || [];

//     console.log('Dados ordem normal:', { detalhesOrdem, ensaioDetalhes, calculoDetalhes });

//   } else {
//     console.error('Tipo de ordem não identificado');
//     this.analisesSimplificadas = [];
//     return;
//   }

//   // Processar ensaios (mesmo para ambos os tipos)
//   if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados && ensaioDetalhes.length > 0) {
//     const ultimoUtilizados = analise.ultimo_ensaio.ensaios_utilizados;
//     ensaioDetalhes = ensaioDetalhes.map((ensaio: any) => {
//       const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));
//       return {
//         ...ensaio,
//         valor: valorRecente ? valorRecente.valor : ensaio.valor,
//         responsavel: valorRecente ? analise.ultimo_ensaio.responsavel : ensaio.responsavel,
//         digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
//       };
//     });
//   }

//   // Processar cálculos (mesmo para ambos os tipos)
//   if (calculoDetalhes.length > 0) {
//     const calculosDetalhes = analise.calculos_detalhes || [];
//     calculoDetalhes = calculoDetalhes.map((calc: any) => {
//       const calcBanco = calculosDetalhes
//         .filter((c: any) => c.calculos === calc.descricao)
//         .sort((a: any, b: any) => b.id - a.id)[0];

//       const ensaiosUtilizados = calcBanco?.ensaios_utilizados || calc.ensaios_detalhes || [];
//       calc.ensaios_detalhes = ensaiosUtilizados.length
//         ? ensaiosUtilizados.map((u: any) => {
//             const original = (calc.ensaio_detalhes_original || calc.ensaios_detalhes || []).find((e: any) => String(e.id) === String(u.id));
//             const responsavelObj = this.responsaveis.find(r =>
//               r.value === u.responsavel || r.value === u.responsavel || r.value === u.responsavel
//             );
//             return {
//               ...u,
//               valor: u.valor,
//               responsavel: responsavelObj || u.responsavel || null,
//               digitador: calcBanco?.digitador || this.digitador,
//               tempo_previsto: original?.tempo_previsto ?? null,
//               tipo_ensaio_detalhes: original?.tipo_ensaio_detalhes ?? null,
//               variavel: u.variavel || original?.variavel,
//             };
//           })
//         : (calc.ensaios_detalhes || []);
//       return {
//         ...calc,
//         resultado: calcBanco?.resultados ?? calc.resultado,
//       };
//     });
//   }

//   // Montar estrutura final unificada
//   this.analisesSimplificadas = [{
//     // Dados da amostra (comum para ambos os tipos)
//     amostraDataEntrada: analise.amostra_detalhes?.data_entrada,
//     amostraDataColeta: analise.amostra_detalhes?.data_coleta,
//     amostraDigitador: analise.amostra_detalhes?.digitador,
//     amostraFornecedor: analise.amostra_detalhes?.fornecedor,
//     amostraIdentificacaoComplementar: analise.amostra_detalhes?.identificacao_complementar,
//     amostraComplemento: analise.amostra_detalhes?.complemento,
//     amostraLocalColeta: analise.amostra_detalhes?.local_coleta,
//     amostraMaterial: analise.amostra_detalhes?.material_detalhes?.nome,
//     amostraNumero: analise.amostra_detalhes?.numero,
//     amostraPeriodoHora: analise.amostra_detalhes?.periodo_hora,
//     amostraPeriodoTurno: analise.amostra_detalhes?.periodo_turno,
//     amostraRepresentatividadeLote: analise.amostra_detalhes?.representatividade_lote,
//     amostraStatus: analise.amostra_detalhes?.status,
//     amostraSubtipo: analise.amostra_detalhes?.subtipo,
//     amostraTipoAmostra: analise.amostra_detalhes?.tipo_amostra_detalhes?.nome,
//     amostraNatureza: analise.amostra_detalhes?.tipo_amostra_detalhes?.natureza,
//     amostraTipoAmostragem: analise.amostra_detalhes?.tipo_amostragem,
//     amostraProdutoAmostra: analise.amostra_detalhes?.produto_amostra_detalhes?.nome,
//     amostraRegistroEmpresa: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_empresa,
//     amostraRegistroProduto: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_produto,
    
//     // Estado da análise
//     estado: analise.estado,
    
//     // Dados da ordem (unificados)
//     ordemId: detalhesOrdem.id,
//     ordemNumero: detalhesOrdem.numero,
//     ordemData: detalhesOrdem.data,
//     ordemResponsavel: detalhesOrdem.responsavel,
//     ordemDigitador: detalhesOrdem.digitador,
//     ordemClassificacao: detalhesOrdem.classificacao,
//     ordemTipo: detalhesOrdem.tipo,
//     ordemPlanoAnalise: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
    
//     // Dados dos ensaios e cálculos (unificados)
//     planoEnsaios: ensaioDetalhes,
//     planoCalculos: calculoDetalhes,
    
//     // Estrutura para compatibilidade com código existente
//     planoDetalhes: [{
//       id: detalhesOrdem.id,
//       descricao: detalhesOrdem.planoAnalise || 'ORDEM EXPRESSA',
//       ensaio_detalhes: ensaioDetalhes,
//       calculo_ensaio_detalhes: calculoDetalhes,
//       tipo: detalhesOrdem.tipo
//     }]
//   }];

//   console.log('Análise processada:', {
//     tipo: detalhesOrdem.tipo,
//     ensaios: ensaioDetalhes.length,
//     calculos: calculoDetalhes.length,
//     estruturaFinal: this.analisesSimplificadas[0]
//   });
// }


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



calcular(calc: any, produto?: any) {
  if (produto) {
    this.sincronizarValoresEnsaios(produto, calc);
  }
  if (!calc.ensaios_detalhes || !Array.isArray(calc.ensaios_detalhes)) {
    calc.resultado = 'Sem ensaios para calcular';
    return;
  }

  // 1. Descubra todos os varX usados na expressão
  const varMatches = (calc.funcao.match(/var\d+/g) || []);
  const varList = Array.from(new Set(varMatches)).filter((v): v is string => typeof v === 'string');

  // 2. Monte safeVars automaticamente
 const safeVars: any = {};
calc.ensaios_detalhes.forEach((ensaio: any) => {
  if (ensaio.variavel) {
    safeVars[ensaio.variavel] = Number(ensaio.valor) ?? 0;
  }
});

  // Preenche variáveis faltantes com 0
  
(varList as string[]).forEach((v: string) => {
  if (!(v in safeVars)) safeVars[v] = 0;
});

  // 3. Avalie usando mathjs
  console.log('Função final para eval:', calc.funcao, safeVars);
  try {
    calc.resultado = evaluate(calc.funcao, safeVars);
  } catch (e) {
    calc.resultado = 'Erro no cálculo';
  }
}


private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

recalcularTodosCalculos(produto: any) {
  if (produto && produto.planoCalculos) {
    produto.planoCalculos.forEach((calc: any) => this.calcular(calc));
  }
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


// salvarAnaliseResultados() {
//   // Verificar se há dados para salvar
//   if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) {
//     this.messageService.add({ 
//       severity: 'warn', 
//       summary: 'Aviso', 
//       detail: 'Nenhum dado de análise encontrado para salvar.' 
//     });
//     return;
//   }

//   const analiseData = this.analisesSimplificadas[0];
//   const planoDetalhes = analiseData?.planoDetalhes || [];
  
//   console.log('Salvando análise:', {
//     tipo: analiseData.ordemTipo,
//     planoDetalhes: planoDetalhes
//   });

//   // Montar ensaios (funciona para ambos os tipos)
//   const ensaios = planoDetalhes.flatMap((plano: any) =>
//     (plano.ensaio_detalhes || []).map((ensaio: any) => ({
//       ensaios: ensaio.id,
//       descricao: ensaio.descricao,
//       valores: ensaio.valor,
//       responsavel: typeof ensaio.responsavel === 'object' && ensaio.responsavel !== null
//         ? ensaio.responsavel.value
//         : ensaio.responsavel,
//       digitador: this.digitador,
//       tempo_previsto: ensaio.tempo_previsto,
//       tipo: ensaio.tipo_ensaio_detalhes?.nome,
//       ensaios_utilizados: (plano.ensaio_detalhes || []).map((e: any) => ({
//         id: e.id,
//         descricao: e.descricao,
//         valor: e.valor
//       }))
//     }))
//   );

//   // Montar cálculos (funciona para ambos os tipos)
//   const calculos = planoDetalhes.flatMap((plano: any) =>
//     (plano.calculo_ensaio_detalhes || []).map((calc: any) => ({
//       calculos: calc.descricao,
//       valores: (calc.ensaios_detalhes || []).map((e: any) => e.valor),
//       resultados: calc.resultado,
//       digitador: this.digitador,
//       ensaios_utilizados: (calc.ensaios_detalhes || []).map((e: any) => ({
//         id: e.id,
//         descricao: e.descricao,
//         valor: e.valor,
//         variavel: e.variavel,
//         responsavel: typeof e.responsavel === 'object' && e.responsavel !== null
//           ? e.responsavel.value
//           : e.responsavel
//       }))
//     }))
//   );

//   const idAnalise = this.analiseId ?? 0;
//   const payload = {
//     estado: 'PENDENTE',
//     ensaios: ensaios,
//     calculos: calculos
//   };

//   console.log('Payload para análise:', {
//     idAnalise,
//     tipoOrdem: analiseData.ordemTipo,
//     totalEnsaios: ensaios.length,
//     totalCalculos: calculos.length,
//     payload
//   });

//   this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
//     next: () => {
//       this.messageService.add({ 
//         severity: 'success', 
//         summary: 'Sucesso', 
//         detail: `Análise ${analiseData.ordemTipo.toLowerCase()} registrada com sucesso.` 
//       });
//     },
//     error: (err) => {
//       console.error('Erro ao registrar análise:', err);
//       if (err.status === 401) {
//         this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
//       } else if (err.status === 403) {
//         this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
//       } else if (err.status === 400) {
//         this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
//       } else {
//         this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
//       }
//     }
//   });
// }

//////////////////////////////////////////////Nova Versão////////////////////////////////////////////////////
atualizarVariavelEnsaio(ensaio: any, variavel: any, novoValor: any) {
  variavel.valor = parseFloat(novoValor) || 0;
  console.log(`Variável ${variavel.nome} atualizada para: ${variavel.valor}`);
  
  // Recalcular o ensaio
  this.calcularEnsaioDireto(ensaio);
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
    
    console.log('Variáveis da função:', uniqueVarList);
    console.log('Variáveis disponíveis:', ensaio.variavel_detalhes);

    // Criar mapeamento entre variáveis técnicas e descritivas
    const mapeamentoVariaveis: any = {};
    
    if (ensaio.variavel_detalhes && ensaio.variavel_detalhes.length > 0) {
      ensaio.variavel_detalhes.forEach((variavel: any, index: number) => {
        const varTecnica = `var${index}`; // var1, var2, var3...
        mapeamentoVariaveis[varTecnica] = variavel;
        console.log(`Mapeamento: ${varTecnica} = ${variavel.nome} (valor: ${variavel.valor})`);
      });
    }

    // Criar objeto com as variáveis e seus valores para o mathjs
    const safeVars: any = {};

    uniqueVarList.forEach((varTecnica: string) => {
      const varMapeada = mapeamentoVariaveis[varTecnica];
      if (varMapeada) {
        let valor = parseFloat(varMapeada.valor);
        if (isNaN(valor)) {
          valor = 0;
        }
        safeVars[varTecnica] = valor;
        console.log(`${varTecnica} = ${valor} (de ${varMapeada.nome})`);
      } else {
        safeVars[varTecnica] = 0;
        console.warn(`Variável ${varTecnica} não encontrada no mapeamento, usando 0`);
      }
    });

    // Verificar se temos variáveis para calcular
    if (uniqueVarList.length === 0) {
      console.warn('Nenhuma variável encontrada na função');
      ensaio.valor = 0;
      return;
    }

    console.log('Função do ensaio:', ensaio.funcao);
    console.log('Variáveis finais para cálculo:', safeVars);

    // Calcular usando mathjs
    const resultado = evaluate(ensaio.funcao, safeVars);
    
    // Verificar se o resultado é válido
    if (isNaN(resultado) || !isFinite(resultado)) {
      console.error('Resultado inválido:', resultado);
      ensaio.valor = 0;
    } else {
      ensaio.valor = Number(resultado.toFixed(4)); // Limitar a 4 casas decimais
    }

    console.log('Resultado do ensaio:', ensaio.valor);

    // Após calcular o ensaio direto, recalcular todos os cálculos que dependem dele
    this.recalcularCalculosDependentes(ensaio);

  } catch (error) {
    console.error('Erro no cálculo do ensaio:', error);
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
        // Verificar se este cálculo usa o ensaio alterado
        const usaEnsaio = calc.ensaios_detalhes?.some((e: any) => 
          e.id === ensaioAlterado.id || e.descricao === ensaioAlterado.descricao
        );

        if (usaEnsaio) {
          // Sincronizar o valor do ensaio alterado no cálculo
          calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
            if (ensaioCalc.id === ensaioAlterado.id || ensaioCalc.descricao === ensaioAlterado.descricao) {
              ensaioCalc.valor = ensaioAlterado.valor;
            }
          });

          // Recalcular o cálculo
          this.calcular(calc, plano);
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

  // Detectar se é ordem normal ou expressa
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

    console.log('Dados ordem expressa:', { detalhesOrdem, ensaioDetalhes, calculoDetalhes });

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

    console.log('Dados ordem normal:', { detalhesOrdem, ensaioDetalhes, calculoDetalhes });

  } else {
    console.error('Tipo de ordem não identificado');
    this.analisesSimplificadas = [];
    return;
  }

  // Processar ensaios (mesmo para ambos os tipos)
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados && ensaioDetalhes.length > 0) {
    const ultimoUtilizados = analise.ultimo_ensaio.ensaios_utilizados;
    ensaioDetalhes = ensaioDetalhes.map((ensaio: any) => {
      const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));
      return {
        ...ensaio,
        valor: valorRecente ? valorRecente.valor : ensaio.valor,
        responsavel: valorRecente ? analise.ultimo_ensaio.responsavel : ensaio.responsavel,
        digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
      };
    });
  }

  // Processar cálculos (mesmo para ambos os tipos)
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

  // Após processar todos os dados, inicializar variáveis dos ensaios diretos
  setTimeout(() => {
    this.inicializarVariaveisEnsaios();
    // Calcular todos os ensaios diretos que têm função
    this.analisesSimplificadas[0]?.planoDetalhes.forEach((plano: any) => {
      this.recalcularTodosEnsaiosDirectos(plano);
    });
  }, 100);
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

  // Montar ensaios (incluindo variáveis dos ensaios diretos)
  const ensaios = planoDetalhes.flatMap((plano: any) =>
    (plano.ensaio_detalhes || []).map((ensaio: any) => ({
      ensaios: ensaio.id,
      descricao: ensaio.descricao,
      valores: ensaio.valor,
      responsavel: typeof ensaio.responsavel === 'object' && ensaio.responsavel !== null
        ? ensaio.responsavel.value
        : ensaio.responsavel,
      digitador: this.digitador,
      tempo_previsto: ensaio.tempo_previsto,
      tipo: ensaio.tipo_ensaio_detalhes?.nome,
      funcao: ensaio.funcao,
      variaveis_utilizadas: ensaio.variavel_detalhes?.map((v: any) => ({
        nome: v.nome,
        valor: v.valor
      })) || [],
      ensaios_utilizados: (plano.ensaio_detalhes || []).map((e: any) => ({
        id: e.id,
        descricao: e.descricao,
        valor: e.valor
      }))
    }))
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

  console.log('Payload para análise:', {
    idAnalise,
    tipoOrdem: analiseData.ordemTipo,
    totalEnsaios: ensaios.length,
    totalCalculos: calculos.length,
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








}
