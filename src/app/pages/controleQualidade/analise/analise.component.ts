import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
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
import { PopoverModule } from 'primeng/popover';
import { HttpClient } from '@angular/common/http';
import { id } from 'date-fns/locale';

export interface Analise {
  id: number;
  data: string;
  amostra: any;
  estado: string;
}
interface FileWithInfo {
  file: File;
  descricao: string;
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
    PopoverModule
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
  ensaioSelecionado: any;
  modalOrdemVariaveisVisible: any;

  /**
   * Atualiza nomes das variáveis ao editar a descrição do ensaio
   */
  onDescricaoEnsaioChange(ensaio: any): void {
    this.atualizarNomesVariaveisEnsaio(ensaio);
  }
  analiseId: number | undefined;
  analiseAndamento: any;
  digitador: any;
  planosAnalise: Plano[] = [];
  produtosAmostra: ProdutoAmostra[] = [];
  materiais: Produto[] = [];
  analise: any;
  idAnalise: any;
  analisesSimplificadas: any[] = [];
  amostraImagensSelecionada: any;
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
  resultadosAnteriores: any[] = [];
  imagensAmostra: any[] = [];
  imagemAtualIndex: number = 0;
  modalImagensVisible = false;
  uploadedFilesWithInfo: FileWithInfo[] = [];
  ///
  public ultimoResultadoGravado: any = null;
  mostrandoResultadosAnteriores = false;
  mostrandoEnsaiosAnteriores = false;
  calculoSelecionadoParaPesquisa: any = null;
  ensaioSelecionadoParaPesquisa: any = null;
  carregandoResultados = false;
  drawerResultadosVisivel = false;
  drawerResultadosEnsaioVisivel = false;
  amostraId: any;
  //
  planoEnsaioId: any;
  editFormVisible = false;
  ensaiosDisponiveis: any[] = [];
  calculosDisponiveis: any[] = [];
  // Novos campos para adicionar/remover ensaios e cálculos
  modalAdicionarEnsaioVisible = false;
  modalAdicionarCalculoVisible = false;
  ensaiosSelecionadosParaAdicionar: any[] = [];
  calculosSelecionadosParaAdicionar: any[] = [];
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
  ) {}

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  private normalize(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
  ngOnInit(): void {
    this.analiseId = Number(this.route.snapshot.paramMap.get('id'));
    this.getDigitadorInfo();
    this.getAnalise();
    this.carregarEnsaiosECalculosDisponiveis();
  }
  getAnalise(): void {
    if (this.analiseId !== undefined) {
      this.analiseService.getAnaliseById(this.analiseId).subscribe(
        (analise) => {
          this.analise = analise;
          this.idAnalise = analise.id;
          this.loadAnalisePorId(analise);
          // Forçar detecção de mudanças após atualização dos dados
          this.cd.detectChanges();
          this.cd.markForCheck();
          // Caso loadAnalisePorId seja assíncrona, garantir detecção após ela também
          setTimeout(() => {
            this.cd.detectChanges();
            this.cd.markForCheck();
          }, 0);
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
  // Formata como 08.392 ( ajusta conforme a lógica sequencial)
  const parte1 = sequencialFormatado.slice(0, 2); // '08'
  const parte2 = sequencialFormatado.slice(2);    // '0008' -> '392' 
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
isOrdemExpressa(analise: any): boolean {
  return analise?.amostra_detalhes?.expressa_detalhes !== null;
}
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

visualizarImagens(amostraId: any): void {
  console.log('Visualizando imagens da amostra:', amostraId);
  this.amostraImagensSelecionada = amostraId;
  this.carregarImagensAmostra(amostraId);
}

carregarImagensAmostra(amostraId: number): void {
  this.amostraService.getImagensAmostra(amostraId).subscribe({
    next: (imagens) => {
      // Usar image_url em vez de image para ter a URL completa
      this.imagensAmostra = imagens.map((img: { image_url: any; image: any; }) => ({
        ...img,
        image: img.image_url || img.image // Usar image_url se disponível, senão fallback para image
      }));
      this.imagemAtualIndex = 0;
      this.modalImagensVisible = true;
      
      if (imagens.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'Informação',
          detail: 'Esta amostra não possui imagens anexadas.'
        });
      }
    },
    error: (error) => {
      console.error('Erro ao carregar imagens:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar imagens da amostra.'
      });
    }
  });
}

// Métodos para navegação entre imagens
proximaImagem(): void {
  if (this.imagemAtualIndex < this.imagensAmostra.length - 1) {
    this.imagemAtualIndex++;
  }
}

imagemAnterior(): void {
  if (this.imagemAtualIndex > 0) {
    this.imagemAtualIndex--;
  }
}

// Método para ir para uma imagem específica
irParaImagem(index: number): void {
  this.imagemAtualIndex = index;
}

// Método para deletar uma imagem
deletarImagem(imageId: number): void {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja deletar esta imagem?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.amostraService.deleteImagem(this.amostraImagensSelecionada.id, imageId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Imagem deletada com sucesso!'
          });
          
          
          this.carregarImagensAmostra(this.amostraImagensSelecionada.id);
        },
        error: (error) => {
          console.error('Erro ao deletar imagem:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar imagem.'
          });
        }
      });
    }
  });
}

downloadImagem(imagem: any): void {
  const link = document.createElement('a');
  link.href = imagem.image;
  link.download = `amostra_${this.amostraImagensSelecionada.numero}_imagem_${imagem.id}`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

onDescricaoChange(imagem: any): void {
  // Debounce para não fazer muitas requisições
  if (this.descricaoTimeout) {
    clearTimeout(this.descricaoTimeout);
  }
  
  this.descricaoTimeout = setTimeout(() => {
    this.salvarDescricaoImagem(imagem);
  }, 3000); // Salva após 3 segundos sem alterações
}

private descricaoTimeout: any;

salvarDescricaoImagem(imagem: any): void {
  // método no service para atualizar descrição
  this.amostraService.atualizarDescricaoImagem(imagem.id, imagem.descricao).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Descrição atualizada com sucesso!'
      });
    },
    error: (error) => {
      console.error('Erro ao atualizar descrição:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao atualizar descrição da imagem.'
      });
    }
  });
}

// Método para capturar mudanças na descrição durante o upload
onDescricaoInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;
  const descricao = target.value;
  
  if (this.uploadedFilesWithInfo[index]) {
    this.uploadedFilesWithInfo[index].descricao = descricao;
    console.log(`Descrição atualizada para arquivo ${index}: "${descricao}"`);
    console.log('Estado atual dos arquivos:', this.uploadedFilesWithInfo);
  }
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
    this.planoEnsaioId = null;
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
      planoId: planoDetalhes[0]?.id,
      tipo: 'NORMAL'
    };
    ensaioDetalhes = planoDetalhes[0]?.ensaio_detalhes || [];
    calculoDetalhes = planoDetalhes[0]?.calculo_ensaio_detalhes || [];
    this.planoEnsaioId = planoDetalhes[0]?.id || null;
  } else {
    console.error('Tipo de ordem não identificado');
    this.analisesSimplificadas = [];
    return;
  }
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
        valor: valorFinal, // Usa o valor salvo do banco
        responsavel: valorRecente ? analise.ultimo_ensaio.responsavel : ensaio.responsavel,
        digitador: valorRecente ? analise.ultimo_ensaio.digitador : ensaio.digitador || this.digitador,
      };
    });
  }
  // 2. Se há dados de ensaios salvos, também carregar as variáveis dos ensaios diretos
  if (analise.ultimo_ensaio && analise.ultimo_ensaio.ensaios_utilizados) {
    analise.ultimo_ensaio.ensaios_utilizados.forEach((ensaioSalvo: any) => {
      // Encontra o ensaio correspondente
      const ensaioOriginal = ensaioDetalhes.find((e: any) => String(e.id) === String(ensaioSalvo.id));
      if (ensaioOriginal && ensaioOriginal.funcao && Array.isArray(ensaioSalvo.variaveis_utilizadas)) {
        // Cria um mapa por tecnica para lookup rápido
        const mapSalvas: Record<string, any> = {};
        ensaioSalvo.variaveis_utilizadas.forEach((v: any) => {
          if (v.tecnica) mapSalvas[v.tecnica] = v;
        });
        // Atualiza cada variável do ensaio pelo valor correspondente salvo, usando campo tecnica
        ensaioOriginal.variavel_detalhes?.forEach((variavel: any) => {
          if (mapSalvas[variavel.tecnica] !== undefined) {
            variavel.valor = mapSalvas[variavel.tecnica].valor;
          }
        });
        // Log detalhado
        console.log('RESTORE DEBUG - Ensaio:', ensaioOriginal.descricao);
        ensaioOriginal.variavel_detalhes.forEach((v: any, idx: number) => {
          console.log(`  [${idx}] tecnica=${v.tecnica} valor=${v.valor}`);
        });
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
  // Monta estrutura final unificada
  this.analisesSimplificadas = [{
    // Dados da amostra (comum para ambos os tipos)
    amostraId: analise.amostra_detalhes?.id,
    amostraDataEntrada: analise.amostra_detalhes?.data_entrada,
    amostraDataColeta: analise.amostra_detalhes?.data_coleta,
    amostraDigitador: analise.amostra_detalhes?.digitador,
    amostraFornecedor: analise.amostra_detalhes?.fornecedor,
    amostraIdentificacaoComplementar: analise.amostra_detalhes?.identificacao_complementar,
    amostraImagens: analise.amostra_detalhes?.image,
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
      tipo: detalhesOrdem.tipo,
      idPlano: detalhesOrdem.planoId || null,
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
  // Após processar todos os dados, inicializa variáveis dos ensaios diretos (só se não foram carregadas do banco)
  setTimeout(() => {
      this.inicializarVariaveisEnsaios();
      this.mapearEnsaiosParaCalculos();
      // Agora sim, carrega o último resultado gravado para sobrescrever os valores corretamente
      this.carregarUltimoResultadoGravado();
      // O processamento dos ensaios diretos e recálculo dos cálculos deve acontecer após aplicar os valores restaurados
  }, 1000);
}
//----------------------------------SEGUNDO PASSO - INICIALIZAÇÃO DE VARIÁVEIS DOS ENSAIOS DIRETOS E MAPEARENSAIOSPARACALCULOS-------------------
inicializarVariaveisEnsaios() {
  if (!this.analisesSimplificadas || this.analisesSimplificadas.length === 0) return;
  const analiseData = this.analisesSimplificadas[0];
  const planoDetalhes = analiseData?.planoDetalhes || [];
  // Função auxiliar para criar variavel_detalhes a partir dos varX da função
  function criarVariaveisPorFuncao(funcao: string, ensaioDescricao: string) {
    const varMatches = (funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    return varList.map((varName, index) => ({
      nome: `${varName} (${ensaioDescricao})`, // Nome descritivo incluindo o ensaio
      tecnica: varName,
      valor: 0,
      varTecnica: varName,
      id: `${ensaioDescricao}_${varName}` // ID único
    }));
  }
  planoDetalhes.forEach((plano: any, planoIdx: number) => {
    if (plano.ensaio_detalhes) {
      plano.ensaio_detalhes.forEach((ensaio: any, ensaioIdx: number) => {
        if (ensaio.funcao) {
          // Só inicializa variáveis se variavel_detalhes não existir ou está vazia
          if (!Array.isArray(ensaio.variavel_detalhes) || ensaio.variavel_detalhes.length === 0) {
            ensaio.variavel_detalhes = criarVariaveisPorFuncao(ensaio.funcao, ensaio.descricao);
            console.log(`Preenchendo variavel_detalhes do ensaio '${ensaio.descricao}' automaticamente:`, ensaio.variavel_detalhes);
          } else {
            // Se já existem variáveis, verificar se têm nomes descritivos adequados
            ensaio.variavel_detalhes.forEach((variavel: any, index: number) => {
              if (!variavel.nome || variavel.nome === variavel.tecnica) {
                variavel.nome = `${variavel.tecnica} (${ensaio.descricao})`;
              }
              if (!variavel.id) {
                variavel.id = `${ensaio.id}_${variavel.tecnica}`;
              }
            });
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

// ---------------------------TERCEIRO PASSO - CARREGAR ULTIMO RESULTADO GRAVADO---------------/////
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
            ensaio.valor = ensaioSalvo.valor;
            if (Array.isArray(ensaio.variavel_detalhes)) {
              if (Array.isArray(ensaioSalvo.variaveis_utilizadas) && ensaioSalvo.variaveis_utilizadas.length > 0) {
                // Garante que cada variavel_detalhes tenha o campo tecnica correto
                // 1. Descobre os nomes técnicos da expressão (varX)
                const varMatches = (ensaio.funcao && ensaio.funcao.match(/var\d+/g)) || [];
                const tecnicaList = Array.from(new Set(varMatches));
                // 2. Atualiza cada variavel_detalhes
                ensaioSalvo.variaveis_utilizadas.forEach((vSalva: any, idx: number) => {
                  let vAtual = null;
                  // Se vier tecnica do backend, usa
                  if (vSalva.tecnica) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.tecnica === vSalva.tecnica);
                  }
                  // Se não vier tecnica, tenta associar pelo nome técnico da expressão
                  if (!vAtual && tecnicaList[idx]) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.tecnica === tecnicaList[idx]);
                    if (vAtual && !vAtual.tecnica) vAtual.tecnica = tecnicaList[idx];
                  }
                  // Se não, tenta por nome
                  if (!vAtual && vSalva.nome) {
                    vAtual = ensaio.variavel_detalhes.find((v: any) => v.nome === vSalva.nome);
                  }
                  // Se não, por ordem
                  if (!vAtual && ensaio.variavel_detalhes[idx]) {
                    vAtual = ensaio.variavel_detalhes[idx];
                  }
                  if (vAtual) {
                    vAtual.valor = vSalva.valor;
                    // Força o campo tecnica se não existir
                    if (!vAtual.tecnica && tecnicaList[idx]) vAtual.tecnica = tecnicaList[idx];
                  }
                });
                // Se houver variáveis extras no array, preenche com o valor do ensaio salvo
                ensaio.variavel_detalhes.forEach((v: any, idx: number) => {
                  if (typeof v.valor === 'undefined' || v.valor === null) v.valor = ensaioSalvo.valor;
                  // Força o campo tecnica se não existir
                  if (!v.tecnica && tecnicaList[idx]) v.tecnica = tecnicaList[idx];
                });
              } else {
                ensaio.variavel_detalhes.forEach((v: any, idx: number) => {
                  v.valor = ensaioSalvo.valor;
                  // Força o campo tecnica se não existir
                  const varMatches = (ensaio.funcao && ensaio.funcao.match(/var\d+/g)) || [];
                  if (!v.tecnica && varMatches[idx]) v.tecnica = varMatches[idx];
                });
              }
            }
          }
        });
      }
    });
    // 1. Processa todos os ensaios diretos (atualiza valores)
    this.processarTodosEnsaiosDiretos();

    // 2. Propaga o valor dos ensaios diretos para os cálculos dependentes
    const analiseData_aplicar = this.analisesSimplificadas[0];
    const planoDetalhes_aplicar = analiseData_aplicar?.planoDetalhes || [];
    planoDetalhes_aplicar.forEach((plano: any) => {
      if (plano.calculo_ensaio_detalhes && plano.ensaio_detalhes) {
        plano.calculo_ensaio_detalhes.forEach((calc: any) => {
          // Sincroniza valores dos ensaios diretos para os cálculos
          calc.ensaios_detalhes?.forEach((ensaioCalc: any) => {
            const ensaioDireto = plano.ensaio_detalhes.find((e: any) => e.id === ensaioCalc.id || e.tecnica === ensaioCalc.tecnica || e.descricao === ensaioCalc.descricao);
            if (ensaioDireto && typeof ensaioDireto.valor !== 'undefined') {
              ensaioCalc.valor = ensaioDireto.valor;
            }
          });
        });
      }
    });

    // 3. Recalcula todos os cálculos
    this.recalcularTodosCalculos();
    this.cd.detectChanges();
  }
//----------------------------------------QUARTO PASSO - PROCESSAMENTO DE RESULTADOS ANTERIORES E REPROCESSAMENTO DE CÁLCULOS-------------------
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
            // Buscar pelo campo tecnica primeiro
            let ensaioPlano = null;
            if (ensaioCalc.tecnica) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.tecnica === ensaioCalc.tecnica);
            }
            // Se não achou por tecnica, tenta por id, descricao, variavel
            if (!ensaioPlano && ensaioCalc.id) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.id === ensaioCalc.id);
            }
            if (!ensaioPlano && ensaioCalc.descricao) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.descricao === ensaioCalc.descricao);
            }
            if (!ensaioPlano && ensaioCalc.variavel) {
              ensaioPlano = plano.ensaio_detalhes.find((e: any) => e.variavel === ensaioCalc.variavel || e.nome === ensaioCalc.variavel);
            }
            if (ensaioPlano) {
              // Sempre preenche o campo tecnica se não existir
              if (!ensaioCalc.tecnica && ensaioPlano.tecnica) {
                ensaioCalc.tecnica = ensaioPlano.tecnica;
              }
              if (!ensaioPlano.tecnica && ensaioCalc.tecnica) {
                ensaioPlano.tecnica = ensaioCalc.tecnica;
              }
              const valorAntigo = ensaioCalc.valor;
              ensaioCalc.valor = ensaioPlano.valor;
              console.log(`✓ Sincronizado ${ensaioCalc.tecnica || ensaioCalc.descricao || ensaioCalc.variavel}: ${valorAntigo} → ${ensaioPlano.valor}`);
            } else {
              console.warn(`✗ Ensaio ${ensaioCalc.tecnica || ensaioCalc.descricao || ensaioCalc.variavel} (ID: ${ensaioCalc.id}, VAR: ${ensaioCalc.variavel}) não encontrado no plano`);
              console.log('Ensaios disponíveis no plano:', plano.ensaio_detalhes.map((e: any) => ({
                id: e.id,
                tecnica: e.tecnica,
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
//----------------------------QUINTO PASSO  CALCULAR ENSAOS DIRETOS-----------------------------------------------------------------------
  // Função a para garantir o mapeamento correto
  calcularEnsaioDiretoCorrigido(ensaio: any) {
    if (!ensaio || !ensaio.funcao || !Array.isArray(ensaio.variavel_detalhes)) return;
    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    const safeVars: any = {};
    // Log detalhado das variáveis na ordem da expressão, usando apenas tecnica
    console.log('--- Variáveis do ensaio (ordem da expressão, apenas tecnica) ---');
    varList.forEach((varName, idx) => {
      const variavel = ensaio.variavel_detalhes.find((v: any) => v.tecnica === varName);
      const valor = variavel && typeof variavel.valor !== 'undefined' ? Number(variavel.valor) : 0;
      safeVars[varName] = valor;
      console.log(`tecnica=${varName} [${idx}]: valor=${valor}`);
    });
    console.log('SafeVars final para avaliação (usando tecnica):', safeVars);
    try {
      const resultado = evaluate(ensaio.funcao, safeVars);
      ensaio.valor = Number(resultado.toFixed(4));
      console.log(`✓ Resultado calculado (usando tecnica): ${ensaio.valor}`);
    } catch (e) {
      ensaio.valor = 'Erro no cálculo';
      console.error('Erro no cálculo (usando tecnica):', e);
    }
  }
//----------------------SEXTO PASSO - CALCULAR-------------------------------------------------------------
calcular(calc: any, produto?: any) {
  console.log('=== MÉTODO CALCULAR INICIADO ===');
  console.log('Cálculo:', calc.descricao);
  console.log('Função:', calc.funcao);
  // Sincronizar valores de calc.ensaios_detalhes com os ensaios do plano (produto), usando tecnica
  if (produto && produto.planoEnsaios && Array.isArray(calc.ensaios_detalhes)) {
    calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
      // Busca o ensaio do plano com a mesma tecnica
      const ensaioPlano = produto.planoEnsaios.find((e: any) => e.tecnica === ensaioCalc.tecnica || e.variavel === ensaioCalc.tecnica);
      if (ensaioPlano && typeof ensaioPlano.valor !== 'undefined') {
        ensaioCalc.valor = ensaioPlano.valor;
      }
    });
  }
  if (!calc.ensaios_detalhes || !Array.isArray(calc.ensaios_detalhes)) {
    calc.resultado = 'Sem ensaios para calcular';
    console.log('Resultado: Sem ensaios para calcular');
    return;
  }
  // 1. DesCOBRE todos os varX e ensaioXX usados na expressão
  const varMatches = (calc.funcao.match(/\b(var\d+|ensaio\d+)\b/g) || []);
  const varList = Array.from(new Set(varMatches)) as string[];
  console.log('Variáveis encontradas na função:', varList);
  // 2. MontA safeVars usando apenas o campo tecnica/variavel
  const safeVars: any = {};
  varList.forEach((varName: string) => {
    // Busca pelo campo tecnica ou variavel
    const ensaio = calc.ensaios_detalhes.find((e: any) => e.tecnica === varName || e.variavel === varName);
    const valor = ensaio && typeof ensaio.valor !== 'undefined' ? Number(ensaio.valor) : 0;
    safeVars[varName] = valor;
    console.log(`SafeVars mapeado: ${varName} = ${valor}`);
  });
  console.log('SafeVars final para avaliação:', safeVars);
  // 3. AvaliA usando mathjs
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
sincronizarValoresEnsaios(produto: any, calc: any) {
  if (!produto.planoEnsaios || !calc.ensaios_detalhes) return;
  calc.ensaios_detalhes.forEach((ensaioCalc: any) => {
    const ensaioPlano = produto.planoEnsaios.find((e: any) => e.descricao === ensaioCalc.descricao);
    if (ensaioPlano) {
      ensaioCalc.valor = ensaioPlano.valor;
    }
  });
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
    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const uniqueVarList = Array.from(new Set(varMatches)) as string[];

    // Monta o objeto de variáveis usando apenas tecnica
    const safeVars: any = {};
    uniqueVarList.forEach((varTecnica: string) => {
      const variavel = ensaio.variavel_detalhes?.find((v: any) => v.tecnica === varTecnica);
      safeVars[varTecnica] = variavel && typeof variavel.valor !== 'undefined' ? Number(variavel.valor) : 0;
    });

    if (Object.keys(safeVars).length === 0) {
      ensaio.valor = 0;
      return;
    }

    const resultado = evaluate(ensaio.funcao, safeVars);
    ensaio.valor = isNaN(resultado) || !isFinite(resultado) ? 0 : Number(resultado.toFixed(4));
    this.recalcularTodosCalculos();
    this.forcarDeteccaoMudancas();
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

      // Salvar sempre o campo tecnica nas variáveis utilizadas
      const variaveisUtilizadas = ensaio.funcao && ensaio.variavel_detalhes
        ? ensaio.variavel_detalhes.map((v: any) => ({
            nome: v.nome,
            valor: v.valor,
            tecnica: v.tecnica // garante que tecnica sempre vai para o backend
          }))
        : [];

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
        variaveis_utilizadas: variaveisUtilizadas,
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



/**
 * Valida os dados antes de enviar para o backend
 */
private validarDadosParaSalvar(payload: any): { valido: boolean; erros: string[] } {
  const erros: string[] = [];

  // Validar ensaios
  payload.ensaios.forEach((ensaio: any, idx: number) => {
    if (!ensaio.descricao) {
      erros.push(`Ensaio ${idx + 1}: descrição obrigatória`);
    }
    if (ensaio.valores === null || ensaio.valores === undefined) {
      erros.push(`Ensaio ${idx + 1}: valor resultado obrigatório`);
    }
    
    // Validar variáveis utilizadas se o ensaio tem função
    if (ensaio.funcao && ensaio.variaveis_utilizadas.length === 0) {
      erros.push(`Ensaio ${idx + 1}: ensaio com função deve ter variáveis utilizadas`);
    }
    
    // Validar cada variável utilizada
    ensaio.variaveis_utilizadas.forEach((v: any, vIdx: number) => {
      if (!v.nome && !v.tecnica) {
        erros.push(`Ensaio ${idx + 1}, Variável ${vIdx + 1}: nome/técnica obrigatório`);
      }
      if (v.valor === null || v.valor === undefined) {
        erros.push(`Ensaio ${idx + 1}, Variável ${vIdx + 1}: valor obrigatório`);
      }
    });
  });

  // Validar cálculos
  payload.calculos.forEach((calc: any, idx: number) => {
    if (!calc.calculos) {
      erros.push(`Cálculo ${idx + 1}: descrição obrigatória`);
    }
    if (calc.valores.length === 0) {
      erros.push(`Cálculo ${idx + 1}: deve ter pelo menos um ensaio`);
    }
  });

  return {
    valido: erros.length === 0,
    erros: erros
  };
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
        digitador: item.responsavel ||  item.ensaio_responsavel || 'T/A',
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
                responsavel: item.ensaio_responsavel || 'N/A',
                digitador: item.ensaio_digitador || 'N/A'
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
              responsavel: item.ensaio_responsavel || 'N/A',
              digitador: item.ensaio_digitador || 'N/A'
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
    this.fecharResultadosAnteriores();
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
  this.ensaioSelecionadoParaPesquisa = null;
  }

  abrirDrawerResultados(calc: any, plano: any) {
    this.calculoSelecionadoParaPesquisa = calc;
    this.carregandoResultados = true;
    this.drawerResultadosVisivel = true;
    // Parâmetros obrigatórios para a API
    const calculoNome = calc.descricao || '';
    const ensaioIds = (calc.ensaios_detalhes || []).map((e: any) => e.id);
    console.log('Buscando resultados anteriores:', { calculoNome, ensaioIds, analiseId: this.analiseId });
    this.analiseService?.getResultadosAnteriores(calculoNome, ensaioIds, this.analiseId).subscribe({
      next: (resultados: any[]) => {
         console.log('Resultados recebidos:kkkkkkkkkkkkkkkkkkkkk', resultados);
  this.processarResultadosAnteriores(resultados, calc);
  this.carregandoResultados = false;
},
      error: (err: any) => {
        this.carregandoResultados = false;
        this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar resultados anteriores.' });
        console.error('Erro ao buscar resultados anteriores:', err);
      }
    });
  }

  fecharDrawerResultados() {
    this.drawerResultadosVisivel = false;
    this.calculoSelecionadoParaPesquisa = null;
    this.resultadosAnteriores = [];
  }

 abrirDrawerResultadosEnsaios(ensaio: any) {
    this.ensaioSelecionadoParaPesquisa = ensaio;
    this.carregandoResultados = true;
    this.drawerResultadosEnsaioVisivel = true;
    // Parâmetros obrigatórios para a API
    const ensaioNome = ensaio.descricao || '';
    const ensaioIds = [ensaio.id];
    console.log('Buscando resultados anteriores:', { ensaioNome, ensaioIds, analiseId: this.analiseId });
    this.analiseService?.getResultadosAnterioresEnsaios(ensaioNome, ensaioIds, this.analiseId).subscribe({
      next: (resultados: any[]) => {
        console.log('Resultados recebidos:kkkkkkkkkkkkkkkkkkkkk', resultados);
  this.processarResultadosAnterioresEnsaios(resultados, ensaio);
  this.carregandoResultados = false;
},
      error: (err: any) => {
        this.carregandoResultados = false;
        this.messageService?.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar resultados anteriores.' });
        console.error('Erro ao buscar resultados anteriores:', err);
      }
    });
  }

fecharDrawerResultadosEnsaios() {
    this.drawerResultadosEnsaioVisivel = false;
    this.ensaioSelecionadoParaPesquisa = null;
    this.resultadosAnteriores = [];
  }



  processarResultadosAnterioresEnsaios(resultados: any[], contextoAtual: any) {
  console.log('=== PROCESSANDO RESULTADOS ANTERIORES ===');
  console.log('Dados recebidos:', resultados);
  console.log('Contexto atual:', contextoAtual);

  if (!resultados || !Array.isArray(resultados) || resultados.length === 0) {
    this.resultadosAnteriores = [];
    return;
  }

  const analiseMap = new Map();
  resultados.forEach((item: any, index: number) => {
    const analiseId = item.analise_id;
    if (!analiseMap.has(analiseId)) {
      analiseMap.set(analiseId, {
        analiseId: analiseId,
        amostraNumero: item.amostra_numero || 'N/A',
        dataAnalise: item.data_analise || new Date(),
        dataFormatada: this.datePipe.transform(item.data_analise || new Date(), 'dd/MM/yyyy HH:mm') || 'Data não disponível',
        responsavel: item.responsavel || item.ensaio_responsavel || 'N/A',
        digitador: item.digitador || item.ensaio_digitador || 'N/A',
        resultadoCalculo: null,
        ensaiosUtilizados: []
      });
    }
    const analiseData = analiseMap.get(analiseId);

    // Processa resultado de cálculo, se houver
    if (item.tipo === 'CALCULO' && item.resultado_calculo !== null) {
      analiseData.resultadoCalculo = item.resultado_calculo;
    }

    // Processa ensaios (direto ou de cálculo)
    if (item.tipo === 'ENSAIO' && item.ensaio_descricao) {
      if (item.valor_ensaio && Array.isArray(item.valor_ensaio)) {
        item.valor_ensaio.forEach((valorItem: any) => {
          // Para drawer de ensaio direto, sempre adiciona; para cálculo, verifica se faz parte do cálculo
          let adicionar = true;
          if (contextoAtual.ensaios_detalhes) {
            adicionar = contextoAtual.ensaios_detalhes.some((e: any) =>
              e.id === valorItem.id ||
              e.descricao === valorItem.descricao ||
              this.normalize(e.descricao) === this.normalize(valorItem.descricao)
            );
          } else if (contextoAtual.id) {
            adicionar = valorItem.id === contextoAtual.id ||
                        valorItem.descricao === contextoAtual.descricao;
          }
          if (adicionar) {
            const jaExiste = analiseData.ensaiosUtilizados.find((e: any) =>
              e.id === valorItem.id || e.descricao === valorItem.descricao
            );
            if (!jaExiste) {
              analiseData.ensaiosUtilizados.push({
                id: valorItem.id,
                descricao: valorItem.descricao,
                valor: valorItem.valor,
                responsavel: item.ensaio_responsavel || 'N/A',
                digitador: item.ensaio_digitador || 'N/A'
              });
            }
          }
        });
      } else if (item.valor_ensaio) {
        let adicionar = true;
        if (contextoAtual.ensaios_detalhes) {
          adicionar = contextoAtual.ensaios_detalhes.some((e: any) =>
            e.id === item.ensaio_id ||
            e.descricao === item.ensaio_descricao ||
            this.normalize(e.descricao) === this.normalize(item.ensaio_descricao)
          );
        } else if (contextoAtual.id) {
          adicionar = item.ensaio_id === contextoAtual.id ||
                      item.ensaio_descricao === contextoAtual.descricao;
        }
        if (adicionar) {
          const jaExiste = analiseData.ensaiosUtilizados.find((e: any) =>
            e.id === item.ensaio_id || e.descricao === item.ensaio_descricao
          );
          if (!jaExiste) {
            analiseData.ensaiosUtilizados.push({
              id: item.ensaio_id,
              descricao: item.ensaio_descricao,
              valor: item.valor_ensaio,
              responsavel: item.ensaio_responsavel || 'N/A',
              digitador: item.ensaio_digitador || 'N/A'
            });
          }
        }
      }
      if (analiseData.responsavel === 'N/A' && item.ensaio_responsavel) {
        analiseData.responsavel = item.ensaio_responsavel;
      }
    }
  });

  // Exibe históricos de cálculo OU ensaio direto
  this.resultadosAnteriores = Array.from(analiseMap.values())
    .filter((item: any) => item.ensaiosUtilizados.length > 0)
    .sort((a: any, b: any) => new Date(b.dataAnalise).getTime() - new Date(a.dataAnalise).getTime());

  console.log('🎉 PROCESSAMENTO CONCLUÍDO!');
  console.log(`📊 Total de resultados processados: ${this.resultadosAnteriores.length}`);
  console.log('📋 Resultados finais:', this.resultadosAnteriores);
}

  // ============================= MÉTODOS PARA ADICIONAR/REMOVER ENSAIOS E CÁLCULOS =============================
  
  /**
   * Carrega os ensaios e cálculos disponíveis do backend
   */
  carregarEnsaiosECalculosDisponiveis(): void {
    // Carregar ensaios disponíveis
    this.ensaioService.getEnsaios().subscribe({
      next: (ensaios) => {
        this.ensaiosDisponiveis = ensaios;
        console.log('Ensaios disponíveis carregados:', this.ensaiosDisponiveis.length);
      },
      error: (error) => {
        console.error('Erro ao carregar ensaios disponíveis:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar ensaios disponíveis.'
        });
      }
    });

    // Carregar cálculos disponíveis
    this.ensaioService.getCalculoEnsaio().subscribe({
      next: (calculos) => {
        this.calculosDisponiveis = calculos;
        console.log('Cálculos disponíveis carregados:', this.calculosDisponiveis.length);
      },
      error: (error) => {
        console.error('Erro ao carregar cálculos disponíveis:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar cálculos disponíveis.'
        });
      }
    });
  }

  /**
   * Abre o modal para adicionar novos ensaios à análise
   */
  abrirModalAdicionarEnsaios(): void {
    if (!this.ensaiosDisponiveis.length) {
      this.carregarEnsaiosECalculosDisponiveis();
    }
    this.ensaiosSelecionadosParaAdicionar = [];
    this.modalAdicionarEnsaioVisible = true;
  }

  /**
   * Abre o modal para adicionar novos cálculos à análise
   */
  abrirModalAdicionarCalculos(): void {
    if (!this.calculosDisponiveis.length) {
      this.carregarEnsaiosECalculosDisponiveis();
    }
    this.calculosSelecionadosParaAdicionar = [];
    this.modalAdicionarCalculoVisible = true;
  }

  /**
   * Adiciona os ensaios selecionados à análise atual
   */
  adicionarEnsaios(): void {
    if (!this.ensaiosSelecionadosParaAdicionar.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione pelo menos um ensaio para adicionar.'
      });
      return;
    }

    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma análise carregada.'
      });
      return;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];

    if (!planoDetalhes.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Estrutura da análise inválida.'
      });
      return;
    }

    const plano = planoDetalhes[0];
    if (!plano.ensaio_detalhes) {
      plano.ensaio_detalhes = [];
    }

    // Filtrar ensaios que já não estão na análise
    const ensaiosExistentesIds = plano.ensaio_detalhes.map((e: any) => e.id);
    const novosEnsaios = this.ensaiosSelecionadosParaAdicionar.filter(
      ensaio => !ensaiosExistentesIds.includes(ensaio.id)
    );

    if (!novosEnsaios.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Todos os ensaios selecionados já estão na análise.'
      });
      return;
    }

    // Adicionar novos ensaios com estrutura padrão
    novosEnsaios.forEach(ensaio => {
      const novoEnsaio = {
        ...ensaio,
        valor: ensaio.valor || 0,
        responsavel: ensaio.responsavel || null,
        digitador: this.digitador || '',
        // Inicializar variáveis se for ensaio direto (com função)
        variavel_detalhes: ensaio.funcao ? this.criarVariaveisParaEnsaio(ensaio) : []
      };
      
      plano.ensaio_detalhes.push(novoEnsaio);
    });

    // Atualizar referências nos cálculos se necessário
    this.mapearEnsaiosParaCalculos();

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${novosEnsaios.length} ensaio(s) adicionado(s) com sucesso.`
    });

    this.modalAdicionarEnsaioVisible = false;
    this.ensaiosSelecionadosParaAdicionar = [];
    
    // Sincronizar com a ordem expressa se for análise expressa
    if (this.isAnaliseExpressa()) {
      this.sincronizarComOrdemExpressa();
    }
    // Recarregar toda a análise para forçar atualização total da página
    this.getAnalise();
  }

  /**
   * Adiciona um novo ensaio diretamente ao plano, se ordem for EXPRESSA
   * @param planoIdx índice do plano em planoDetalhes
   * @param ensaio objeto do novo ensaio (pode ser vazio para template)
   */
  adicionarEnsaioDireto(planoIdx: number, ensaio?: any): void {
    const analiseData = this.analisesSimplificadas[0];
    if (!analiseData || analiseData.ordemTipo !== 'EXPRESSA') return;
    const planoDetalhes = analiseData.planoDetalhes || [];
    if (!planoDetalhes[planoIdx]) return;
    if (!planoDetalhes[planoIdx].ensaio_detalhes) planoDetalhes[planoIdx].ensaio_detalhes = [];
    const novoEnsaio = ensaio || {
      id: Date.now(),
      descricao: '',
      valor: null,
      responsavel: this.digitador || '',
      variavel_detalhes: [],
      funcao: '',
      tipo_ensaio_detalhes: { nome: 'EXPRESSA' }
    };
    planoDetalhes[planoIdx].ensaio_detalhes.push(novoEnsaio);
    window.location.reload();
  }

  /**
   * Remove um ensaio do plano, se ordem for EXPRESSA
   * @param planoIdx índice do plano em planoDetalhes
   * @param ensaioIdx índice do ensaio em ensaio_detalhes
   */
  removerEnsaioDireto(planoIdx: number, ensaioIdx: number): void {
    const analiseData = this.analisesSimplificadas[0];
    if (!analiseData || analiseData.ordemTipo !== 'EXPRESSA') return;
    const planoDetalhes = analiseData.planoDetalhes || [];
    if (!planoDetalhes[planoIdx] || !planoDetalhes[planoIdx].ensaio_detalhes) return;
    planoDetalhes[planoIdx].ensaio_detalhes.splice(ensaioIdx, 1);
    window.location.reload();
  }
  /**
   * Adiciona os cálculos selecionados à análise atual
   */
  adicionarCalculos(): void {
    if (!this.calculosSelecionadosParaAdicionar.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Selecione pelo menos um cálculo para adicionar.'
      });
      return;
    }

    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhuma análise carregada.'
      });
      return;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];

    if (!planoDetalhes.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Estrutura da análise inválida.'
      });
      return;
    }

    const plano = planoDetalhes[0];
    if (!plano.calculo_ensaio_detalhes) {
      plano.calculo_ensaio_detalhes = [];
    }

    // Filtrar cálculos que já não estão na análise
    const calculosExistentesIds = plano.calculo_ensaio_detalhes.map((c: any) => c.id);
    const novosCalculos = this.calculosSelecionadosParaAdicionar.filter(
      calculo => !calculosExistentesIds.includes(calculo.id)
    );

    if (!novosCalculos.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Todos os cálculos selecionados já estão na análise.'
      });
      return;
    }

    // Adicionar novos cálculos com estrutura padrão
    novosCalculos.forEach(calculo => {
      const novoCalculo = {
        ...calculo,
        resultado: null,
        responsavel: calculo.responsavel || null,
        digitador: this.digitador || '',
        // Associar os ensaios disponíveis na análise se o cálculo não tem ensaios específicos
        ensaios_detalhes: calculo.ensaios_detalhes && calculo.ensaios_detalhes.length > 0
          ? calculo.ensaios_detalhes
          : (plano.ensaio_detalhes || []).map((e: any) => ({ ...e }))
      };
      
      plano.calculo_ensaio_detalhes.push(novoCalculo);
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${novosCalculos.length} cálculo(s) adicionado(s) com sucesso.`
    });

    this.modalAdicionarCalculoVisible = false;
    this.calculosSelecionadosParaAdicionar = [];
    
    // Sincronizar com a ordem expressa se for análise expressa
    if (this.isAnaliseExpressa()) {
      this.sincronizarComOrdemExpressa();
    }
    
    // Recarregar toda a análise para forçar atualização total da página
    this.getAnalise();
  }

  /**
   * Remove um ensaio da análise
   */
  removerEnsaio(ensaio: any, plano: any): void {
    console.log('removerEnsaio chamado:', { ensaio, plano });
    console.log('podeEditarEnsaiosCalculos():', this.podeEditarEnsaiosCalculos());
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o ensaio "${ensaio.descricao}" da análise?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        console.log('Usuário confirmou remoção do ensaio');
        if (!plano.ensaio_detalhes) {
          console.log('plano.ensaio_detalhes não existe');
          return;
        }

        const index = plano.ensaio_detalhes.findIndex((e: any) => e.id === ensaio.id);
        console.log('Index encontrado:', index);
        if (index !== -1) {
          plano.ensaio_detalhes.splice(index, 1);
          console.log('Ensaio removido do array');

          // Remover referências deste ensaio dos cálculos
          if (plano.calculo_ensaio_detalhes) {
            plano.calculo_ensaio_detalhes.forEach((calc: any) => {
              if (calc.ensaios_detalhes) {
                calc.ensaios_detalhes = calc.ensaios_detalhes.filter((e: any) => e.id !== ensaio.id);
              }
            });
            console.log('Referências do ensaio removidas dos cálculos');
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Ensaio "${ensaio.descricao}" removido com sucesso.`
          });

          // Sincronizar com a ordem expressa se for análise expressa
          if (this.isAnaliseExpressa()) {
            console.log('Sincronizando com ordem expressa...');
            this.sincronizarComOrdemExpressa();
          }

          this.cd.detectChanges();
        }
      }
    });
  }

  /**
   * Remove um cálculo da análise
   */
  removerCalculo(calculo: any, plano: any): void {
    console.log('removerCalculo chamado:', { calculo, plano });
    console.log('podeEditarEnsaiosCalculos():', this.podeEditarEnsaiosCalculos());
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja remover o cálculo "${calculo.descricao}" da análise?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        console.log('Usuário confirmou remoção do cálculo');
        if (!plano.calculo_ensaio_detalhes) {
          console.log('plano.calculo_ensaio_detalhes não existe');
          return;
        }

        const index = plano.calculo_ensaio_detalhes.findIndex((c: any) => c.id === calculo.id);
        console.log('Index encontrado:', index);
        if (index !== -1) {
          plano.calculo_ensaio_detalhes.splice(index, 1);
          console.log('Cálculo removido do array');

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Cálculo "${calculo.descricao}" removido com sucesso.`
          });

          // Sincronizar com a ordem expressa se for análise expressa
          if (this.isAnaliseExpressa()) {
            console.log('Sincronizando com ordem expressa...');
            this.sincronizarComOrdemExpressa();
          }

          this.cd.detectChanges();
        }
      }
    });
  }

  /**
   * Verifica se a análise é do tipo expressa (pode adicionar/remover ensaios e cálculos)
   */
  isAnaliseExpressa(): boolean {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) return false;
    const analiseData = this.analisesSimplificadas[0];
    return analiseData?.ordemTipo === 'EXPRESSA';
  }

  /**
   * Verifica se a análise permite edição (apenas para análises expressas)
   */
  podeEditarEnsaiosCalculos(): boolean {
    const isExpressa = this.isAnaliseExpressa();
    const hasPermission = this.hasGroup(['Admin', 'Master', 'Analista']);
    
    // console.log('podeEditarEnsaiosCalculos debug:', {
    //   isExpressa,
    //   hasPermission,
    //   analisesSimplificadas: this.analisesSimplificadas,
    //   ordemTipo: this.analisesSimplificadas?.[0]?.ordemTipo
    // });
    
    return isExpressa && hasPermission;
  }

  /**
   * Cria variáveis iniciais para um ensaio com função
   */
  private criarVariaveisParaEnsaio(ensaio: any): any[] {
    if (!ensaio.funcao) return [];

    const varMatches = (ensaio.funcao.match(/var\d+/g) || []);
    const varList: string[] = Array.from(new Set(varMatches));
    
    const descricao = ensaio.descricao || '';
    return varList.map((varName, index) => ({
      nome: descricao ? `${varName} (${descricao})` : varName,
      tecnica: varName,
      valor: 0,
      varTecnica: varName,
      id: `${ensaio.id}_${varName}`
    }));
  }

  /**
   * Atualiza os nomes das variáveis de um ensaio quando a descrição muda
   */
  atualizarNomesVariaveisEnsaio(ensaio: any): void {
    if (!ensaio || !Array.isArray(ensaio.variavel_detalhes)) return;
    const descricao = ensaio.descricao || '';
    ensaio.variavel_detalhes.forEach((v: any) => {
      v.nome = descricao ? `${v.tecnica} (${descricao})` : v.tecnica;
    });
  }

  /**
   * Obtém o nome de exibição amigável para uma variável
   */
  getVariavelDisplayName(variavel: any, ensaio: any): string {
    if (!variavel.nome || variavel.nome === variavel.tecnica) {
      // Se o nome não existe ou é igual ao técnico, criar um nome amigável
      return `${variavel.tecnica} (${ensaio.descricao})`;
    }
    return variavel.nome;
  }

  /**
   * Obtém ensaios disponíveis para adicionar (exclui os já presentes na análise)
   */
  getEnsaiosDisponiveis(): any[] {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      return this.ensaiosDisponiveis;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    const ensaiosExistentesIds = planoDetalhes.flatMap((plano: any) => 
      (plano.ensaio_detalhes || []).map((e: any) => e.id)
    );

    return this.ensaiosDisponiveis.filter(ensaio => 
      !ensaiosExistentesIds.includes(ensaio.id)
    );
  }

  /**
   * Obtém cálculos disponíveis para adicionar (exclui os já presentes na análise)
   */
  getCalculosDisponiveis(): any[] {
    if (!this.analisesSimplificadas || !this.analisesSimplificadas.length) {
      return this.calculosDisponiveis;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    const calculosExistentesIds = planoDetalhes.flatMap((plano: any) => 
      (plano.calculo_ensaio_detalhes || []).map((c: any) => c.id)
    );

    return this.calculosDisponiveis.filter(calculo => 
      !calculosExistentesIds.includes(calculo.id)
    );
  }

  /**
   * Fecha o modal de adicionar ensaios
   */
  fecharModalAdicionarEnsaios(): void {
    this.modalAdicionarEnsaioVisible = false;
    this.ensaiosSelecionadosParaAdicionar = [];
  }

  /**
   * Sincroniza ensaios e cálculos adicionados manualmente com a ordem expressa
   */
  private sincronizarComOrdemExpressa(): void {
    if (!this.isAnaliseExpressa() || !this.analisesSimplificadas.length) {
      return;
    }

    const analiseData = this.analisesSimplificadas[0];
    const planoDetalhes = analiseData?.planoDetalhes || [];
    
    if (!planoDetalhes.length) return;

    const plano = planoDetalhes[0];
    const ordemExpressaId = analiseData.ordemId;

    // Preparar IDs dos ensaios e cálculos atuais
    const ensaiosIds = (plano.ensaio_detalhes || []).map((e: any) => e.id).filter((id: any) => id);
    const calculosIds = (plano.calculo_ensaio_detalhes || []).map((c: any) => c.id).filter((id: any) => id);

    // Chamar o backend para atualizar a ordem expressa
    this.ordemService.atualizarEnsaiosCalculosExpressa(ordemExpressaId, ensaiosIds, calculosIds).subscribe({
      next: (response: any) => {
        // ...
      },
      error: (error: any) => {
        // ...
      }
    });
    window.location.reload();
  }

atualizarOrdemVariavel(variavel: any, novaOrdem: number): void {
  variavel.ordem = novaOrdem;
  // Reordenar array baseado na nova ordem
  this.ensaioSelecionado.variavel_detalhes.sort((a: { ordem: any; }, b: { ordem: any; }) => (a.ordem || 0) - (b.ordem || 0));
}

/**
 * Obtém as variáveis ordenadas de um ensaio
 */
getVariaveisOrdenadas(variaveis: any[]): any[] {
  if (!variaveis) return [];
  
  return variaveis.sort((a, b) => {
    // Se tem campo ordem definido, usa ele
    if (a.ordem !== undefined && b.ordem !== undefined) {
      return a.ordem - b.ordem;
    }
    
    // Caso contrário, ordena por nome
    if (a.nome && b.nome) {
      return a.nome.localeCompare(b.nome);
    }
    
    // Fallback por ID se existir
    if (a.id && b.id) {
      return a.id - b.id;
    }
    
    return 0;
  });
}

/**
 * Abre o modal para ordenar variáveis de um ensaio
 */
abrirModalOrdemVariaveis(ensaio: any): void {
  this.ensaioSelecionado = ensaio;
  
  // Inicializar campo ordem se não existir
  if (ensaio.variavel_detalhes && ensaio.variavel_detalhes.length > 0) {
    ensaio.variavel_detalhes.forEach((variavel: any, index: number) => {
      if (variavel.ordem === undefined || variavel.ordem === null) {
        variavel.ordem = index + 1;
      }
    });
  }
  
  this.modalOrdemVariaveisVisible = true;
}

/**
 * Move uma variável para cima ou para baixo na lista
 */
moverVariavelPara(direcao: 'cima' | 'baixo', index: number): void {
  if (!this.ensaioSelecionado?.variavel_detalhes) return;
  
  const variaveis = this.ensaioSelecionado.variavel_detalhes;
  
  if (direcao === 'cima' && index > 0) {
    [variaveis[index], variaveis[index - 1]] = [variaveis[index - 1], variaveis[index]];
  } else if (direcao === 'baixo' && index < variaveis.length - 1) {
    [variaveis[index], variaveis[index + 1]] = [variaveis[index + 1], variaveis[index]];
  }
  
  // Atualizar campo ordem baseado na nova posição
  variaveis.forEach((variavel: any, i: number) => {
    variavel.ordem = i + 1;
  });
}




}
