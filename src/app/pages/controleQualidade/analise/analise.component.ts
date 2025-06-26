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
    InputIcon,FieldsetModule,MenuModule,SplitButtonModule,DrawerModule,SpeedDialModule
  ],
  animations: [
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
      this.analisesSimplificadas[0].planoDetalhes.forEach((plano: any) => {
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
//    if (analise && analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes) {
//     console.log('Análise carregada:', analise);
//     this.analisesSimplificadas = [{
//       amostraDataEntrada: analise.amostra_detalhes?.data_entrada,
//       amostraDataColeta: analise.amostra_detalhes?.data_coleta,
//       amostraDigitador: analise.amostra_detalhes?.digitador,
//       amostraFornecedor: analise.amostra_detalhes?.fornecedor,
//       amostraIdentificacaoComplementar: analise.amostra_detalhes?.identificacao_complementar,
//       amostraComplemento: analise.amostra_detalhes?.complemento,
//       amostraLocalColeta: analise.amostra_detalhes?.local_coleta,
//       amostraMaterial: analise.amostra_detalhes?.material_detalhes?.nome,
//       amostraNumero: analise.amostra_detalhes?.numero,
//       amostraPeriodoHora: analise.amostra_detalhes?.periodo_hora,
//       amostraPeriodoTurno: analise.amostra_detalhes?.periodo_turno,
//       amostraRepresentatividadeLote: analise.amostra_detalhes?.representatividade_lote,
//       amostraStatus: analise.amostra_detalhes?.status,
//       amostraSubtipo: analise.amostra_detalhes?.subtipo,
//       amostraTipoAmostra: analise.amostra_detalhes?.tipo_amostra_detalhes?.nome,
//       amostraNatureza: analise.amostra_detalhes?.tipo_amostra_detalhes?.natureza,
//       amostraTipoAmostragem: analise.amostra_detalhes?.tipo_amostragem,
//       amostraProdutoAmostra: analise.amostra_detalhes?.produto_amostra_detalhes?.nome,
//       amostraRegistroEmpresa: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_empresa,
//       amostraRegistroProduto: analise.amostra_detalhes?.produto_amostra_detalhes?.registro_produto,
//       estado: analise.estado,
//       ordemNumero: analise.amostra_detalhes?.ordem_detalhes?.numero,
//       ordemClassificacao: analise.amostra_detalhes?.ordem_detalhes?.classificacao,
//       ordemPlanoAnalise: analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.descricao,
//       planoDetalhes: analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes || [],
//       planoEnsaios: analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.ensaio_detalhes,
//       //planoCalculos: analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes?.calculo_ensaio_detalhes,
//     }];
//     console.log('Numero da Análise:', this.analisesSimplificadas[0].ordemNumero);
//   } else {
//     this.analisesSimplificadas = [];
//   }
// }


loadAnalisePorId(analise: any) {
  if (
    analise && 
    analise.amostra_detalhes?.ordem_detalhes?.plano_detalhes
  ) {
    const planoDetalhes = analise.amostra_detalhes.ordem_detalhes.plano_detalhes || [];
    // Ensaios
    // if (
    //   analise.ultimo_ensaio && 
    //   analise.ultimo_ensaio.ensaios_utilizados && 
    //   planoDetalhes[0]?.ensaio_detalhes
    // ) {
    //   const ultimoUtilizados = analise.ultimo_ensaio.ensaios_utilizados;
    //   planoDetalhes[0].ensaio_detalhes = planoDetalhes[0].ensaio_detalhes.map((ensaio: any) => {
    //     const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));
    //     //console.log('Procurando valor para', ensaio.descricao, 'ID:', ensaio.id, 'Encontrado:', valorRecente);
    //     return {
    //       ...ensaio,
    //       valor: valorRecente ? valorRecente.valor : ensaio.valor,
    //       responsavel: valorRecente ? analise.ultimo_ensaio.responsavel : ensaio.responsavel,
    //       digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
    //     };
    //   });
    // }

    if (planoDetalhes[0]?.ensaio_detalhes) {
  const ultimoUtilizados = analise.ultimo_ensaio?.ensaios_utilizados || [];
  planoDetalhes[0].ensaio_detalhes = planoDetalhes[0].ensaio_detalhes.map((ensaio: any) => {
    const valorRecente = ultimoUtilizados.find((u: any) => String(u.id) === String(ensaio.id));
    return {
      ...ensaio,
      valor: valorRecente ? valorRecente.valor : ensaio.valor ?? null,
      responsavel: valorRecente ? valorRecente.responsavel : ensaio.responsavel ?? null,
      digitador: valorRecente ? valorRecente.digitador : ensaio.digitador || this.digitador,
    };
  });
}

    console.log('ultimo_calculo:', analise.ultimo_calculo);
    console.log('ultimo_calculo.ensaios_utilizados:', analise.ultimo_calculo?.ensaios_utilizados);
    console.log('planoDetalhes[0].calculo_ensaio_detalhes:', planoDetalhes[0]?.calculo_ensaio_detalhes);


      // Cálculos
// if (
//   analise.calculos_detalhes &&
//   planoDetalhes[0]?.calculo_ensaio_detalhes
// ) {
//   planoDetalhes[0].calculo_ensaio_detalhes = planoDetalhes[0].calculo_ensaio_detalhes.map((calc: any) => {
//     // Busca o cálculo mais recente (maior id) com a mesma descrição
//     const calcBanco = analise.calculos_detalhes
//       .filter((c: any) => c.calculos === calc.descricao)
//       .sort((a: any, b: any) => b.id - a.id)[0];

//     const ensaiosUtilizados = calcBanco?.ensaios_utilizados || calc.ensaios_detalhes || [];
//     calc.ensaios_detalhes = ensaiosUtilizados.map((u: any, idx: number) => {
//       const original = (calc.ensaio_detalhes_original || calc.ensaios_detalhes || []).find((e: any) => String(e.id) === String(u.id));
//       const responsavelObj = this.responsaveis.find(r =>
//         r.value === u.responsavel || r.value === u.responsavel || r.value === u.responsavel
//       );
//       return {
//         ...u,
//         valor: u.valor,
//         responsavel: responsavelObj || null,
//         digitador: calcBanco?.digitador || this.digitador, 
//         tempo_previsto: original?.tempo_previsto ?? null,
//         tipo_ensaio_detalhes: original?.tipo_ensaio_detalhes ?? null,
//         variavel: u.variavel || original?.variavel
//       };
//     });
//     // O resultado do cálculo deve ser exibido no campo resultado do cálculo
//     return {
//       ...calc,
//       resultado: calcBanco?.resultados ?? calc.resultado,
//     };
//   });
// }

if (planoDetalhes[0]?.calculo_ensaio_detalhes) {
  const calculosDetalhes = analise.calculos_detalhes || [];
  planoDetalhes[0].calculo_ensaio_detalhes = planoDetalhes[0].calculo_ensaio_detalhes.map((calc: any) => {
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
            variavel: u.variavel || original?.variavel
          };
        })
      : (calc.ensaios_detalhes || []);
    return {
      ...calc,
      resultado: calcBanco?.resultados ?? calc.resultado,
    };
  });
}

    this.analisesSimplificadas = [{
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
      estado: analise.estado,
      ordemNumero: analise.amostra_detalhes?.ordem_detalhes?.numero,
      ordemClassificacao: analise.amostra_detalhes?.ordem_detalhes?.classificacao,
      ordemPlanoAnalise: planoDetalhes[0]?.descricao,
      planoDetalhes: planoDetalhes,
      planoEnsaios: planoDetalhes[0]?.ensaio_detalhes,
      planoCalculos: planoDetalhes[0]?.calculo_ensaio_detalhes,
    }];
    console.log('Numero da Análise:', planoDetalhes);
  } else {
    this.analisesSimplificadas = [];
  }
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
  
 varList.forEach((v: string) => {
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

salvarAnaliseResultados() {
  //this.getDigitadorInfo();
  // Monte os arrays de ensaios e cálculos a partir dos dados do seu formulário ou do seu objeto de análise
 const planoDetalhes = this.analisesSimplificadas[0]?.planoDetalhes || [];

const ensaios = planoDetalhes.flatMap((plano: any) =>
  (plano.ensaio_detalhes || []).map((ensaio: any) => ({
    ensaios: ensaio.id,
    descricao: ensaio.descricao,
    valores: ensaio.valor,
    responsavel: typeof ensaio.responsavel === 'object' && ensaio.responsavel !== null
      ? ensaio.responsavel.value // ou .nome
      : ensaio.responsavel,
    digitador: this.digitador,
    tempo_previsto: ensaio.tempo_previsto,
    tipo: ensaio.tipo_ensaio_detalhes?.nome,
    ensaios_utilizados: (plano.ensaio_detalhes || []).map((e: any) => ({
      id: e.id,
      descricao: e.descricao,
      valor: e.valor
    }))
  }))
);

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
        ? e.responsavel.value // ou .nome, conforme sua estrutura
        : e.responsavel
    }))
  }))
);



  const idAnalise = this.analiseId ?? 0;
  console.log('ID da análise:', idAnalise);
  const payload = {
    estado: 'PENDENTE',
    ensaios: ensaios,
    calculos: calculos
  };

  this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Análise registrada com sucesso.' });
     
     
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
