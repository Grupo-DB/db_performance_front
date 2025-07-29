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
  // Propriedade para armazenar o último resultado gravado
  public ultimoResultadoGravado: any = null;

  // Método para carregar o último resultado gravado da análise atual
  public carregarUltimoResultadoGravado(): void {
    if (!this.analiseId) {
      this.messageService?.add({ severity: 'warn', summary: 'Aviso', detail: 'Nenhuma análise selecionada.' });
      return;
    }

    // Buscar o primeiro cálculo e os ids dos ensaios relacionados
    let calculoNome = '';
    let ensaioIds: any[] = [];
    if (this.analisesSimplificadas.length > 0) {
      const planoDetalhes = this.analisesSimplificadas[0]?.planoDetalhes || [];
      if (planoDetalhes.length > 0 && planoDetalhes[0].calculo_ensaio_detalhes?.length > 0) {
        const calc = planoDetalhes[0].calculo_ensaio_detalhes[0];
        calculoNome = calc.descricao || '';
        ensaioIds = (calc.ensaios_detalhes || []).map((e: any) => e.id);
      }
    }

    if (!calculoNome || !Array.isArray(ensaioIds) || ensaioIds.length === 0) {
      this.messageService?.add({ severity: 'warn', summary: 'Aviso', detail: 'Não foi possível identificar cálculo e ensaios para buscar resultados anteriores.' });
      return;
    }

    this.analiseService?.getResultadosAnteriores(calculoNome, ensaioIds, this.analiseId).subscribe({
      next: (resultados: any[]) => {
        this.processarResultadosAnteriores(resultados, { ensaios_detalhes: [] });
        if (Array.isArray(this.resultadosAnteriores) && this.resultadosAnteriores.length > 0) {
          this.ultimoResultadoGravado = this.resultadosAnteriores[0];
          console.log('Último resultado gravado carregado:', this.ultimoResultadoGravado);
          this.aplicarUltimoResultadoGravado();
        } else {
          this.ultimoResultadoGravado = null;
          this.messageService?.add({ severity: 'info', summary: 'Info', detail: 'Nenhum resultado gravado encontrado.' });
        }
      },
      error: (err: any) => {
        this.ultimoResultadoGravado = null;
        this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar resultados anteriores.' });
        console.error('Erro ao buscar resultados anteriores:', err);
      }
    });
  }

  // Aplica os valores do último resultado gravado nos ensaios e variáveis do modelo
  public aplicarUltimoResultadoGravado(): void {
    if (!this.ultimoResultadoGravado || !this.analisesSimplificadas.length) return;
    const planoDetalhes = this.analisesSimplificadas[0]?.planoDetalhes || [];
    // Atualiza ensaios
    planoDetalhes.forEach((plano: any) => {
      if (plano.ensaio_detalhes) {
        plano.ensaio_detalhes.forEach((ensaio: any) => {
          const ensaioSalvo = this.ultimoResultadoGravado.ensaiosUtilizados?.find((e: any) => String(e.id) === String(ensaio.id));
          if (ensaioSalvo) {
            // Sempre aplica o valor do ensaio salvo
            ensaio.valor = ensaioSalvo.valor;
            // Atualiza variáveis se existirem
            if (Array.isArray(ensaio.variavel_detalhes)) {
              // Sempre preenche todas as variáveis do ensaio com o valor salvo
              if (Array.isArray(ensaioSalvo.variaveis_utilizadas) && ensaioSalvo.variaveis_utilizadas.length > 0) {
                ensaioSalvo.variaveis_utilizadas.forEach((vSalva: any, idx: number) => {
                  // Atualiza por nome ou por ordem
                  let vAtual = ensaio.variavel_detalhes.find((v: any) => v.nome === vSalva.nome);
                  if (!vAtual && ensaio.variavel_detalhes[idx]) vAtual = ensaio.variavel_detalhes[idx];
                  if (vAtual) vAtual.valor = vSalva.valor;
                });
                // Se houver variáveis extras no array, preenche com o valor do ensaio salvo
                ensaio.variavel_detalhes.forEach((v: any) => {
                  if (typeof v.valor === 'undefined' || v.valor === null) v.valor = ensaioSalvo.valor;
                });
              } else {
                // Sempre aplica o valor do ensaio salvo em todas as variáveis
                ensaio.variavel_detalhes.forEach((v: any) => { v.valor = ensaioSalvo.valor; });
              }
            }
          }
        });
      }
    });
    // Processa os ensaios diretos com os valores restaurados
    this.processarTodosEnsaiosDiretos();
    // Força atualização dos cálculos e da tela
    this.recalcularTodosCalculos();
    this.cd.detectChanges();
  }
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
    //this.mapearEnsaiosParaCalculos();
    //this.recalcularTodosCalculos();
  }

  getAnalise(): void {
    if (this.analiseId !== undefined) {
      this.analiseService.getAnaliseById(this.analiseId).subscribe(
        (analise) => {
          this.analise = analise;
          this.idAnalise = analise.id;
          this.loadAnalisePorId(analise);
          // Removido: carregarUltimoResultadoGravado() será chamado após inicialização dos ensaios/cálculos
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
          //console.log('Digitador do ensaio:', ensaio.digitador);
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

//==================================PASSO 1 - GET ANÁLISE POR ID ===========================
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
    planoDetalhes = ordemDetalhes.plano_detalhes || [];

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
      // Agora sim, carregar o último resultado gravado para sobrescrever os valores corretamente
      this.carregarUltimoResultadoGravado();
      // O processamento dos ensaios diretos e recálculo dos cálculos deve acontecer após aplicar os valores restaurados
      // Isso é feito dentro de aplicarUltimoResultadoGravado()
  }, 1000);
}

  // Método para mapear ensaios para cálculos (garante que cada cálculo tenha os ensaios corretos associados)
  mapearEnsaiosParaCalculos() {
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    planoDetalhes.forEach((plano: any) => {
      if (plano.calculo_ensaio_detalhes && plano.ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calculo: any) => {
          // Se o cálculo não tem ensaios associados, associa todos os ensaios do plano
          if (!Array.isArray(calculo.ensaios_detalhes) || calculo.ensaios_detalhes.length === 0) {
            calculo.ensaios_detalhes = plano.ensaio_detalhes.map((e: any) => ({ ...e }));
          }
        });
      }
    });
  }

//----------------------------------SEGUNDO PASSO - INICIALIZAÇÃO DE VARIÁVEIS DOS ENSAIOS DIRETOS-------------------
inicializarVariaveisEnsaios() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;

  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];

  // Função auxiliar para criar variavel_detalhes a partir dos varX da função
  function criarVariaveisPorFuncao(funcao: string) {
    const varMatches = (funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    return varList.map(varName => ({
      nome: varName,
      tecnica: varName,
      valor: 0,
      varTecnica: varName
    }));
  }

  planoDetalhes.forEach((plano: any, planoIdx: number) => {
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any, ensaioIdx: number) => {
        if (ensaio.funcao) {
          // Só inicializa variáveis se variavel_detalhes não existir (nem vazio, nem preenchido)
          if (!Array.isArray(ensaio.variavel_detalhes)) {
            ensaio.variavel_detalhes = criarVariaveisPorFuncao(ensaio.funcao);
            console.log(`Preenchendo variavel_detalhes do ensaio '${ensaio.descricao}' automaticamente:`, ensaio.variavel_detalhes);
          }
          // Se a função não contém nenhum varX, mas contém nomes amigáveis, converte para nomes técnicos
          const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
          const varList: string[] = Array.from(new Set(varMatches));
          if (varList.length === 0 && Array.isArray(ensaio.variavel_detalhes)) {
            let funcaoConvertida = ensaio.funcao;
            ensaio.variavel_detalhes.forEach((variavel: any) => {
              if (variavel.nome && variavel.tecnica) {
                // Substitui todas as ocorrências do nome amigável pelo nome técnico
                const regex = new RegExp(variavel.nome, 'g');
                funcaoConvertida = funcaoConvertida.replace(regex, variavel.tecnica);
              }
            });
            // Se converteu pelo menos um nome, atualiza a função
            if (funcaoConvertida !== ensaio.funcao) {
              console.log(`Convertendo funcao do ensaio '${ensaio.descricao}' para nomes técnicos: '${ensaio.funcao}' -> '${funcaoConvertida}'`);
              ensaio.funcao = funcaoConvertida;
            }
          }
        }
        if (ensaio.funcao) {
          console.log(`Plano[${planoIdx}] Ensaio[${ensaioIdx}] (${ensaio.descricao}): variavel_detalhes final:`, ensaio.variavel_detalhes);
        }
      });
    }
  });
}

  // Função corrigida para garantir o mapeamento correto
  calcularEnsaioDiretoCorrigido(ensaio: any) {
  if (!ensaio || !ensaio.funcao || !Array.isArray(ensaio.variavel_detalhes)) return;
  const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
  const varList: string[] = Array.from(new Set(varMatches));
  const safeVars: any = {};

  // Log detalhado das variáveis antes do cálculo
  console.log('--- Variáveis do ensaio antes do cálculo ---');
  ensaio.variavel_detalhes.forEach((v: any, idx: number) => {
    console.log(`variavel_detalhes[${idx}]: nome=${v.nome}, valor=${v.valor}, tipo=${typeof v.valor}`);
  });

  // Para cada varX, associa ao valor da variável descritiva pelo índice
  varList.forEach((varName) => {
    const idx = parseInt(varName.replace('var', ''), 10);
    let valor = 0;
    if (ensaio.variavel_detalhes[idx] && typeof ensaio.variavel_detalhes[idx].valor !== 'undefined') {
      valor = Number(ensaio.variavel_detalhes[idx].valor);
    }
    safeVars[varName] = valor;
    console.log(`SafeVars mapeado: ${varName} = ${valor}`);
  });

  console.log('SafeVars final para avaliação (corrigido):', safeVars);
  try {
    const resultado = evaluate(ensaio.funcao, safeVars);
    ensaio.valor = Number(resultado.toFixed(4));
    console.log(`✓ Resultado calculado (corrigido): ${ensaio.valor}`);
  } catch (e) {
    ensaio.valor = 'Erro no cálculo';
    console.error('Erro no cálculo (corrigido):', e);
  }
}

  processarTodosEnsaiosDiretos() {
    if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];

    console.log('=== INICIANDO O PROCESSAMENTO DE TODOS OS ENSAIOS DIRETOS ===');
    planoDetalhes.forEach((plano: any) => {
      console.log('Processando plano (ensaios diretos):', plano.descricao);
      if (plano.ensaio_detalhes) {
        plano.ensaio_detalhes.forEach((ensaio: any) => {
          if (ensaio.funcao) {
            this.calcularEnsaioDiretoCorrigido(ensaio);
          }
        });
      }
    });
    console.log('=== FIM RECÁLCULO DE TODOS OS ENSAIOS DIRETOS ===');
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


  // 1. Descubra todos os varX e ensaioXX usados na expressão
  const varMatches = (calc.funcao.match(/\b(var\d+|ensaio\d+)\b/g) || []);
  const varList = Array.from(new Set(varMatches)) as string[];
  console.log('Variáveis encontradas na função:', varList);

  // 2. Monte safeVars usando as variáveis EXATAS da função
  const safeVars: any = {};

  // Tenta mapear cada varX ou ensaioXX da função para o ensaio/cálculo correspondente
  varList.forEach((varName: string, idx: number) => {
    // Procura por campo variavel, ensaioTecnico ou tecnica
    let ensaio = calc.ensaios_detalhes.find((e: any) =>
      e.variavel === varName ||
      e.ensaioTecnico === varName ||
      e.tecnica === varName
    );

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
  // Sincronizar valor para variável técnica (varX) correspondente, se existir
  if (variavel.nome && !/^var\d+$/.test(variavel.nome)) {
    // Procurar se existe uma variável técnica (varX) que deve receber esse valor
    const varTecnica = ensaio.variavel_detalhes.find((v: any) => /^var\d+$/.test(v.nome) && (variavel.nome.includes(v.nome) || v.nome.includes(variavel.nome)));
    if (varTecnica) {
      varTecnica.valor = valorNum;
      console.log(`Sincronizado valor ${valorNum} para variável técnica ${varTecnica.nome}`);
    }
  }
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
      // === PROCESSANDO ENSAIO DIRETO: <descricao> ===
      console.log('=== PROCESSANDO ENSAIO DIRETO:', ensaio.descricao, '===');
      console.log('Função:', ensaio.funcao);
      // Extrair as variáveis técnicas da função (var0, var1, ...)
      const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
      const uniqueVarList = Array.from(new Set(varMatches)) as string[];

      if (!ensaio.variavel_detalhes) {
        ensaio.variavel_detalhes = [];
      }
      // Não filtra mais variáveis técnicas, mantém apenas as descritivas já existentes
      const variaveisDescritivas = ensaio.variavel_detalhes;

      // Só associar automaticamente se a quantidade de variáveis descritivas for igual à de varX
      if (variaveisDescritivas.length === uniqueVarList.length) {
        uniqueVarList.forEach((varTecnica, idx) => {
          if (variaveisDescritivas[idx] && !variaveisDescritivas[idx].varTecnica) {
            variaveisDescritivas[idx].varTecnica = varTecnica;
          }
        });
      }

      // Sincronizar valores das variáveis descritivas com os campos de input (se houver)
      variaveisDescritivas.forEach((v: any, idx: number) => {
        if (typeof v.valor === 'undefined' || v.valor === null) {
          v.valor = 0;
        }
        console.log(`Variável descritiva [${idx}]: ${v.nome} = ${v.valor}, varTecnica = ${v.varTecnica}`);
      });

      // Mapeamento: varX -> variável descritiva por nome (contendo varX), depois por ordem, depois última disponível
      const safeVars: any = {};
      console.log('Variáveis descritivas disponíveis:', variaveisDescritivas.map((v: any, i: number) => `[${i}] ${v.nome} = ${v.valor}`));
      uniqueVarList.forEach((varTecnica: string) => {
        const match = varTecnica.match(/^var(\d+)$/);
        let valor = 0;
        let varByName = null;
        // 0. Tenta encontrar por campo varTecnica
        let varByVarTecnica = variaveisDescritivas.find((v: any) => v.varTecnica === varTecnica);
        if (varByVarTecnica && typeof varByVarTecnica.valor !== 'undefined') {
          valor = parseFloat(varByVarTecnica.valor);
          if (isNaN(valor)) valor = 0;
          console.log(`Mapeamento por varTecnica: ${varTecnica} => ${varByVarTecnica.nome} = ${valor}`);
        } else if (match) {
          // 1. Tenta encontrar variável cujo nome contém o nome técnico (ex: "(var3)")
          varByName = variaveisDescritivas.find((v: any) => v.nome && v.nome.includes(varTecnica));
          if (varByName && typeof varByName.valor !== 'undefined') {
            valor = parseFloat(varByName.valor);
            if (isNaN(valor)) valor = 0;
            console.log(`Mapeamento por nome: ${varTecnica} => ${varByName.nome} = ${valor}`);
          } else {
            // 2. Se não encontrar, tenta por ordem
            const idx = Number(match[1]);
            if (variaveisDescritivas[idx] && typeof variaveisDescritivas[idx].valor !== 'undefined') {
              valor = parseFloat(variaveisDescritivas[idx].valor);
              if (isNaN(valor)) valor = 0;
              console.log(`Mapeamento por ordem: ${varTecnica} => [${idx}] ${variaveisDescritivas[idx].nome} = ${valor}`);
            } else if (variaveisDescritivas.length > 0) {
              // 3. Se não encontrar, usa a última variável descritiva disponível
              const ultima = variaveisDescritivas[variaveisDescritivas.length - 1];
              valor = parseFloat(ultima.valor);
              if (isNaN(valor)) valor = 0;
              console.log(`Mapeamento fallback: ${varTecnica} => última (${ultima.nome}) = ${valor}`);
            } else {
              valor = 0;
              console.log(`Mapeamento: ${varTecnica} não encontrado, valor 0`);
            }
          }
        }
        safeVars[varTecnica] = valor;
        console.log(`Mapeamento final: ${varTecnica} = ${valor}`);
      });

      // Se não houver variáveis, resultado é 0
      if (Object.keys(safeVars).length === 0) {
        ensaio.valor = 0;
        console.log('Resultado: 0 (sem variáveis)');
        return;
      }

      // Calcular usando mathjs
      const resultado = evaluate(ensaio.funcao, safeVars);

      // Verificar se o resultado é válido
      if (isNaN(resultado) || !isFinite(resultado)) {
        ensaio.valor = 0;
        console.log('Resultado: 0 (inválido)');
      } else {
        ensaio.valor = Number(resultado.toFixed(4));
        console.log(`✓ Resultado calculado: ${ensaio.valor}`);
      }

      // Após calcular o ensaio direto, recalcular TODOS os cálculos
      this.recalcularTodosCalculos();
      this.forcarDeteccaoMudancas();
      console.log('=== FIM ENSAIO DIRETO:', ensaio.descricao, '===\n');
    } catch (error) {
      ensaio.valor = 0;
      console.error('Erro no cálculo do ensaio direto:', error);
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

  // Chamada para salvar a análise no backend
  this.analiseService.registerAnaliseResultados(idAnalise, payload).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Análise salva com sucesso!' });
      // Aqui você pode recarregar dados ou navegar, se desejar
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar análise.' });
      console.error('Erro ao salvar análise:', err);
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
