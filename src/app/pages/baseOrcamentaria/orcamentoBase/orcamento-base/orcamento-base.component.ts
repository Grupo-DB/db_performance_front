import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownFilterOptions, DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { CentroCustoPai } from '../centrocustopai/centrocustopai.component';
import { CentroCusto } from '../centrocusto/centrocusto.component';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RaizSinteticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizSintetica/raiz-sintetica.service';
import { RaizAnaliticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizAnalitica/raiz-analitica.service';
import { RaizAnalitica } from '../raiz-analitica/raiz-analitica.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from "primeng/floatlabel"
import { ContaContabilService } from '../../../../services/baseOrcamentariaServices/orcamento/ContaContabil/conta-contabil.service';
import { OrcamentoBaseService } from '../../../../services/baseOrcamentariaServices/orcamento/OrcamentoBase/orcamento-base.service';

interface RegisterOrcamentoBaseForm{
  ccPai: FormControl;
  centroCusto: FormControl;
  gestor: FormControl;
  empresa: FormControl;
  filial: FormControl;
  area: FormControl;
  setor: FormControl;
  ambiente: FormControl;
  raizSintetica: FormControl;
  raizSinteticaDesc: FormControl;
  raizAnalitica: FormControl;
  raizAnaliticaDesc: FormControl;
  raizAnaliticaCod: FormControl;
  contaContabil: FormControl;
  contaContabilDesc: FormControl;
  raizContGrupoDesc: FormControl;
  periodicidade: FormControl;
  mensalTipo: FormControl;
  mesEspecifico: FormControl;
  mesesRecorrentes: FormControl;
  suplementacao: FormControl;
  baseOrcamento: FormControl;
  idBase: FormControl;
  valor: FormControl;
  ano: FormControl;
  tipoCusto: FormControl;
}

export interface OrcamentoBase{
  id: number;
  ano: Date;
  centro_de_custo_pai: string;
  centro_custo_nome: string;
  gestor: string;
  empresa: string;
  filial: string;
  area: string;
  setor: string;
  ambiente: string;
  raiz_sintetica: string;
  raiz_sintetica_desc: string;
  raiz_analitica: string;
  raiz_analitica_desc: string;
  raiz_analitica_cod: string;
  conta_contabil: string;
  conta_contabil_descricao: string;
  raiz_contabil_grupo: string;
  raiz_contabil_grupo_desc: string;
  periodicidade: string;
  mensal_tipo: string;
  mes_especifico: string;
  meses_recorrentes: string;
  suplementacao: string;
  base_orcamento: string;
  id_base: string;
  valor: string;
  valor_ajustado: string;
  valor_real: string;
  tipoCusto: string;
}

@Component({
  selector: 'app-orcamento-base',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,MatFormFieldModule,MatSelectModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule,MultiSelectModule,InputSwitchModule,InputNumberModule,FloatLabelModule
  ],
  providers: [
    MessageService,ConfirmationService,CurrencyPipe
  ],
  templateUrl: './orcamento-base.component.html',
  styleUrl: './orcamento-base.component.scss'
})
export class OrcamentoBaseComponent implements OnInit{
  ano!: string;
  ccsPai: CentroCustoPai[] = [];
  centrosCusto: CentroCusto [] = [];
  orcamentosBases: any[] = [];
  //
  selectedCcPai:any [] = [];
  selectedCc: any [] = [];
  ccsPaiDetalhes: any | undefined;
  selectedGestor: any [] = [];
  ccsDetalhes: any | undefined;
  raizSinteticaDetalhes: any;
  raizesAnaliticas: RaizAnalitica[]|undefined;
  //
  filterValue: string | undefined = '';
  registerForm!: FormGroup <RegisterOrcamentoBaseForm>;
  //
  contaContabil: any;
  // Variáveis para armazenar as escolhas do usuário
  selectedPeriodicidade: string = '';
  selectedMensalTipo: string = '';
  selectedRaizAnalitica: RaizAnalitica | null = null;
  selectedMesEspecifico: number | null = null;
  selectedMesesRecorrentes: number[] = [];
  //
  detalhaOrcamentoBaseVisible: boolean = false;
  orcamentoBaseDetalhes: any;
  //
  rcGrupoDesc: any;
  idBase: any;
  contaContabilDesc: any;
  raizAnaliticaDesc: any;
  raizAnaliticaCod: any;
  //
  tipoCusto!: any;
  gestor: any = null;
  porcentagemDissidio!: number;
  //
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  @ViewChild('RegisterOrcamentoBaseForm') RegisterOrcamentoBaseForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  recorrencias = [
    { key: 'mensal', value:'Mensal'},
    { key: 'anual', value:'Anual'}
  ]
  
  mensalTipos = [
   { key:'especifico', value:'Específico' },
   { key:'recorrente', value:'Recorrente'}
  ]

  baseOrcamentos = [
    { key:'contratos', value:'Contratos' },
    { key:'planejamentoEquipes', value:'Planejamento de Equipes' },
    { key:'planejamentoProducao', value:'Planejamento Produção' },
    { key:'usoConsumo', value:'Uso e Consumo' },
    { key:'depreciacao', value:'Depreciação' }
  ]

  tiposCustos = [
    { key: '3401', value:'Despesas Administrativas' },
    { key: '3402', value: 'Despesas Comerciais'},
    { key: '42', value: 'Custos Indiretos'},

  ]

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  constructor(
    private loginService: LoginService,
    private ccsPaiService: CentrocustopaiService,
    private centrosCustoService: CentrocustoService,
    private raizSinteticaService: RaizSinteticaService,
    private raizAnaliticaService: RaizAnaliticaService,
    private contaContabilService: ContaContabilService,
    private orcamentoBaseService: OrcamentoBaseService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private currencyPipe: CurrencyPipe
  ){
    this.registerForm = new FormGroup({
      ccPai: new FormControl(''),
      centroCusto: new FormControl(''),
      gestor: new FormControl(''),
      empresa: new FormControl(''),
      filial: new FormControl(''),
      area: new FormControl(''),
      setor: new FormControl(''),
      ambiente: new FormControl(''),
      raizSintetica: new FormControl(''),
      raizSinteticaDesc: new FormControl(''),
      raizAnalitica: new FormControl(''),
      raizAnaliticaDesc: new FormControl(''),
      raizAnaliticaCod: new FormControl(''),
      contaContabil: new FormControl(''),
      contaContabilDesc: new FormControl(''),
      raizContGrupoDesc: new FormControl(''),
      periodicidade: new FormControl(''),
      mensalTipo: new FormControl(''),
      mesEspecifico: new FormControl(''),
      mesesRecorrentes: new FormControl(''),
      suplementacao: new FormControl(''),
      baseOrcamento: new FormControl(''),
      idBase: new FormControl(''),
      valor: new FormControl(''),
      ano: new FormControl(''),
      tipoCusto: new FormControl(''),
    });
    this.editForm = this.fb.group({
      id:[''],
      ano:[''],
      centro_de_custo_pai:[''],
      centro_custo_nome:[''],
      gestor:[''],
      empresa:[''],
      filial:[''],
      area:[''],
      setor:[''],
      ambiente:[''],
      raiz_sintetica:[''],
      raiz_sintetica_desc:[''],
      raiz_analitica:[''],
      raiz_analitica_desc:[''],
      raiz_analitica_cod:[''],
      conta_contabil:[''],
      conta_contabil_descricao:[''],
      raiz_contabil_grupo_desc:[''],
      periodicidade:[''],
      mensal_tipo:[''],
      mes_especifico:[''],
      meses_recorrentes:[''],
      suplementacao:[''],
      base_orcamento:[''],
      id_base:[''],
      valor:[''],
      valor_ajustado:[''],
      valor_real:['']
    })
  }

  ngOnInit(): void {
    this.ccsPaiService.getCentrosCustoPai().subscribe(
      ccsPai => {
        this.ccsPai = ccsPai.map(ccPai =>({
          ...ccPai,
          label: `${ccPai.nome} - ${ccPai.filial_detalhes.nome}`
        }))
      },
      error => {
        console.error('Não carregou',error)
      }
    )

    this.centrosCustoService.getCentroCusto().subscribe(
      centrosCusto => {
        this.centrosCusto = centrosCusto
      }, error => {
        console.error('Não Carregou',error)
      } 
    )
    
    this.raizAnaliticaService.getRaizesAnaliticas().subscribe(
      raizesAnaliticas => {
        this.raizesAnaliticas = raizesAnaliticas.map(raizAnalitica =>({
          ...raizAnalitica,
          label: `${raizAnalitica.raiz_contabil} - ${raizAnalitica.descricao}`,
          raizAnaliticaDesc :raizAnalitica.descricao,
          raizAnaliticaCod :raizAnalitica.raiz_contabil
        }))
      },error =>{
        console.error('Não carregou',error)
      }
    )

    this.registerForm.valueChanges.subscribe(values => {
      console.log('Valores do formulário:', values);
    });

    this.orcamentoBaseService.getOrcamentosBases().subscribe(
      orcamentosBases =>{
        this.orcamentosBases = orcamentosBases;
      }, error => {
        console.error('Não Carregou', error)
      }
    )
   
  }

  getNomeCcPai(id: number): string {
    const ccPai = this.ccsPai?.find(ccPai => ccPai.id === id);
    return ccPai ? ccPai.nome : 'CcPai não encontrado';
  }

  getNomeCc(id: number): string {
    const cc = this.centrosCusto?.find(cc => cc.id === id);
    return cc ? cc.nome : 'Cc não encontrado';
  }
 
  abrirModalEdicao(orcamentoBase: OrcamentoBase){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: orcamentoBase.id,
      ano: orcamentoBase.ano,
      centro_de_custo_pai: orcamentoBase.centro_de_custo_pai,
      centro_custo_nome: orcamentoBase.centro_custo_nome,
      gestor: orcamentoBase.gestor,
      empresa: orcamentoBase.empresa,
      filial: orcamentoBase.filial,
      area: orcamentoBase.area,
      setor: orcamentoBase.setor,
      ambiente: orcamentoBase.ambiente,
      raiz_sintetica: orcamentoBase.raiz_sintetica,
      raiz_sintetica_desc: orcamentoBase.raiz_sintetica_desc,
      raiz_analitica: orcamentoBase.raiz_analitica,
      raiz_analitica_desc: orcamentoBase.raiz_analitica_desc,
      raiz_analitica_cod: orcamentoBase.raiz_analitica_cod,
      conta_contabil: orcamentoBase.conta_contabil,
      conta_contabil_descricao: orcamentoBase.conta_contabil_descricao,
      raiz_contabil_grupo_desc: orcamentoBase.raiz_contabil_grupo_desc,
      periodicidade: orcamentoBase.periodicidade,
      mensal_tipo: orcamentoBase.mensal_tipo,
      mes_especifico: orcamentoBase.mes_especifico,
      meses_recorrentes: orcamentoBase.meses_recorrentes,
      suplementacao: orcamentoBase.suplementacao,
      base_orcamento: orcamentoBase.base_orcamento,
      id_base: orcamentoBase.id_base,
      valor: orcamentoBase.valor,
      valor_ajustado: orcamentoBase.valor_ajustado,
      valor_real: orcamentoBase.valor_real
    })
  }
  saveEdit(){
    const orcamentoBaseId = this.editForm.value.id;
    const dadosAtualizados: Partial<OrcamentoBase> = {
      ano: this.editForm.value.ano,
      centro_de_custo_pai: this.editForm.value.centro_de_custo_pai,
      centro_custo_nome: this.editForm.value.centro_custo_nome,
      gestor: this.editForm.value.gestor,
      empresa: this.editForm.value.empresa,
      filial: this.editForm.value.filial,
      area: this.editForm.value.area,
      setor: this.editForm.value.setor,
      ambiente: this.editForm.value.ambiente,
      raiz_sintetica: this.editForm.value.raiz_sintetica,
      raiz_sintetica_desc: this.editForm.value.raiz_sintetica_desc,
      raiz_analitica: this.editForm.value.raiz_analitica,
      raiz_analitica_desc: this.editForm.value.raiz_analitica_desc,
      raiz_analitica_cod: this.editForm.value.raiz_analitica_cod,
      conta_contabil: this.editForm.value.conta_contabil,
      conta_contabil_descricao: this.editForm.value.conta_contabil_descricao,
      raiz_contabil_grupo_desc: this.editForm.value.raiz_contabil_grupo_desc,
      periodicidade: this.editForm.value.periodicidade,
      mensal_tipo: this.editForm.value.mensal_tipo,
      mes_especifico: this.editForm.value.mes_especifico,
      meses_recorrentes: this.editForm.value.meses_recorrentes,
      suplementacao: this.editForm.value.suplementacao,
      base_orcamento: this.editForm.value.base_orcamento,
      id_base: this.editForm.value.id_base,
      valor: this.editForm.value.valor,
      valor_ajustado: this.editForm.value.valor_ajustado,
      valor_real: this.editForm.value.valor_real
    };
    this.orcamentoBaseService.editOrcamentoBase(orcamentoBaseId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Orçamento Base atualizado com sucesso!' });
        setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
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

  excluirOrcamentoBase(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esse Orçamento Base?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.orcamentoBaseService.deleteOrcamentoBase(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Orçamento Base excluído com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }

  onCcPaiSelecionado(ccPaiId: any): void {
    //const id = this.selectedCcPai
    if (ccPaiId) {
      console.log('Centro de Custo Pai selecionado ID:', ccPaiId); // Log para depuração
      this.selectedCcPai = ccPaiId; // Atualiza a variável
      this.ccsByCcPai(); // Chama a API com o ID
      this.ccPaiDetalhes();
    } else {
      console.error('O ID do cc é indefinido');
    }
  }

  ccsByCcPai(): void{
    if (this.selectedCcPai !==null) {
    this.centrosCustoService.getCentroCustoByCcPai(this.selectedCcPai).subscribe(data => {
      this.centrosCusto = data;
      console.log('ccs carregados:', this.centrosCusto)
    });
  }
}

  onCcSelecionado(ccId: any): void{
    if (ccId){
      this.selectedCc = ccId;
      this.ccDetalhes();
      this.getRaizSinteticaDetalhes();
    } else {
      console.error('O ID do cc é indefinido');
    }
  }

  ccPaiDetalhes():Promise <void>{
    return new Promise((resolve, reject) => {
      if(this.selectedCcPai !== undefined){
        this.ccsPaiService.getCentrosCustoPaiDetalhes(this.selectedCcPai).subscribe(
          (response) => {
            this.ccsPaiDetalhes = response
            console.log('detalhes: ', this.ccsPaiDetalhes)
            resolve(); // Resolva a Promise após a conclusão
          },
          error =>{
            console.error('Não carregou', error)
          }
        )
      }
    })
  }

  ccDetalhes():Promise<void>{
    return new Promise((resolve, reject) => {
      if(this.selectedCc !== undefined){
        this.centrosCustoService.getCentroCustoDetalhe(this.selectedCc).subscribe(
          (response) => {
            this.ccsDetalhes = response
            resolve();
          },
          error => {
            console.error('Não Carregou', error)
          }
        )
      }
    })
  }

  getRaizSinteticaDetalhes(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.selectedCc !== undefined) {
        this.raizSinteticaService.getRaizSinteticaByCc(this.selectedCc).subscribe(
          (response) => {
            if (response && response.length > 0) {
              this.raizSinteticaDetalhes = response[0];
              console.log('Raiz Sintética Detalhes:', this.raizSinteticaDetalhes);
              resolve(); // Resolve a promessa com sucesso
            } else {
              console.error('Nenhum detalhe encontrado para a Raiz Sintética');
              reject(new Error('Nenhum detalhe encontrado para a Raiz Sintética'));
            }
          },
          (error) => {
            console.error('Não Carregou', error);
            reject(error); // Rejeita a promessa em caso de erro
          }
        );
      } else {
        const errorMessage = 'selectedCc está indefinido';
        console.error(errorMessage);
        reject(new Error(errorMessage)); // Rejeita a promessa caso `selectedCc` seja indefinido
      }
    });
  }

  onRaizAnaliticaSelecionada(raizAnalitica: RaizAnalitica){
    this.selectedRaizAnalitica = raizAnalitica;
    this.montarContaContabil();
  }

  montarContaContabil() {
    if (this.raizSinteticaDetalhes && this.selectedRaizAnalitica) {
      const raizContabilSintetica = this.raizSinteticaDetalhes.raiz_contabil; // Pegue da raiz sintética
      const raizContabilAnalitica = this.selectedRaizAnalitica.raiz_contabil; // Pegue da raiz analítica selecionada
  
      // Combine os valores para formar `conta_contabil`
      this.contaContabil = `${raizContabilAnalitica}`;
      this.raizContabilGrupoDesc(this.contaContabil);
      this.montarIdBase();
      this.montarTipoCusto();
      console.log('Conta Contábil Montada:', this.contaContabil);
    } else {
      console.warn('Raiz Sintética ou Raiz Analítica não estão definidas');
    }
  }



  montarTipoCusto() {
    const custosInsumos = [
      '4101021', '4102021', '4103021', '4104021', '4105021', '4106021',
      '4107021', '4108021', '4109021', '4110021', '4111021', '4112021'
    ];
    const custosMateriaPrima = [
      '4101023', '4102023', '4103023', '4104023', '4105023', '4106023',
      '4107023', '4108023', '4109023', '4110023', '4111023', '4112023'
    ];
    const custosEmbalagens = [
      '4101022', '4102022', '4103022', '4104022', '4105022', '4106022',
      '4107022', '4108022', '4109022', '4110022', '4111022', '4112022'
    ];
  
    const caracteres = this.contaContabil.substring(0, 4); // Pega os 4 primeiros dígitos
    const contaCompleta = this.contaContabil.substring(0,7); // A conta completa para comparação
  
    console.log('Conta completa:', contaCompleta); // Log para verificar o valor da conta
    console.log('Prefixo:', caracteres); // Log do prefixo avaliado
  
    if (caracteres === '3401') {
      this.tipoCusto = 'Despesas Administrativas';
    } else if (caracteres === '3402') {
      this.tipoCusto = 'Despesas Comerciais';
    } else if (caracteres.startsWith('42')) {
      this.tipoCusto = 'Custos Indiretos';
    } else if (caracteres.startsWith('41')) {
      console.log('Conta iniciada com 41, verificando detalhes...');
  
      // Verifica os tipos de custos diretos fixos
      if (custosInsumos.includes(contaCompleta)) {
        this.tipoCusto = 'Custo Direto Variável Insumos';
        console.log('Categorizado como: Custo Direto Variável Insumos');
      } else if (custosMateriaPrima.includes(contaCompleta)) {
        this.tipoCusto = 'Custo Direto Variável Matéria Prima';
        console.log('Categorizado como: Custo Direto Variável Matéria Prima');
      } else if (custosEmbalagens.includes(contaCompleta)) {
        this.tipoCusto = 'Custo Direto Variável Embalagens';
        console.log('Categorizado como: Custo Direto Variável Embalagens');
      } else {
        this.tipoCusto = 'Custo Direto Fixo';
        console.log('Categorizado como: Custo Direto Fixo');
      }
    } else {
      // Caso desconhecido
      this.tipoCusto = 'Tipo de custo desconhecido';
      console.warn('Tipo de custo desconhecido para a conta:', this.contaContabil);
    }
  }

  montarIdBase(){
    if(this.ccsDetalhes && this.contaContabil ){
      const ccCodigo = this.ccsDetalhes.codigo;
      this.idBase = `${ccCodigo}${this.contaContabil}`
    }
  }

  raizContabilGrupoDesc(contaContabil: any): void{
    this.contaContabilService.getContaContabilByOb(contaContabil).subscribe(
      rcGrupoDesc => {
        this.rcGrupoDesc = rcGrupoDesc[0].nivel_4_nome;
        this.contaContabilDesc = rcGrupoDesc[0].nivel_analitico_nome;
        console.log('Descrição:',rcGrupoDesc)
      },error => {
        console.error('Não Carregou', error)
      }
    )
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  
  resetFunction(options: DropdownFilterOptions | undefined) {
    if (options && options.reset) {
      options.reset();
      this.filterValue = '';
    } else {
      console.warn('As opções de filtro ou a função reset não estão definidas');
    }
  }

  customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
    if (options && options.filter) {
      options.filter(event);
    } else {
      console.warn('Opções de filtro não definidas ou filtro ausente');
    }
  }

  calcularDissidio(porcentagemDissidio: number){
    this.orcamentoBaseService.aplicarDissidio(this.porcentagemDissidio).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Porcentagem de dissídio aplicada com sucesso!' });
        setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
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

  visualizarOrcamentoBaseDetalhes(id: number) {
    this.detalhaOrcamentoBaseVisible = true;
    this.orcamentoBaseService.getOrcamentoBaseDetalhe(id).subscribe(
      detalhes => {
        if (detalhes.valor) {
          detalhes.valor = this.currencyPipe.transform(detalhes.valor, 'BRL', 'symbol', '1.2-2');
        }
        if (detalhes.valor_ajustado) {
          detalhes.valor_ajustado = this.currencyPipe.transform(detalhes.valor_ajustado, 'BRL', 'symbol', '1.2-2');
        }
        if (detalhes.valor_real) {
          detalhes.valor_real = this.currencyPipe.transform(detalhes.valor_real, 'BRL', 'symbol', '1.2-2');
        }
  
        this.orcamentoBaseDetalhes = detalhes;
      },
      error => {
        console.error('Não Carregou', error);
      }
    );
  }

  clear(table: Table) {
    table.clear();
  }
  clearForm() {
    this.registerForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }


  submit(){
    const raizAnaliticaId = this.registerForm.value.raizAnalitica.id;
    const raizAnaliticaDesc = this.registerForm.value.raizAnalitica.descricao;
    const raizAnaliticaCod = this.registerForm.value.raizAnalitica.raiz_contabil;
    let mesesRecorrentes = this.registerForm.value.mesesRecorrentes;

    // Se for uma string, converta para array de números
    if (typeof mesesRecorrentes === 'string') {
    mesesRecorrentes = mesesRecorrentes.split(',').map((mes: string) => parseInt(mes.trim(), 10));
    }
    this.orcamentoBaseService.registerOrcamentoBase(
      this.registerForm.value.ano,
      this.registerForm.value.ccPai,
      this.registerForm.value.centroCusto,
      this.registerForm.value.gestor,
      this.registerForm.value.empresa,
      this.registerForm.value.filial,
      this.registerForm.value.area,
      this.registerForm.value.setor,
      this.registerForm.value.ambiente,
      this.registerForm.value.raizSintetica,
      this.registerForm.value.raizSinteticaDesc,
      raizAnaliticaId,
      raizAnaliticaDesc,
      raizAnaliticaCod,
      this.registerForm.value.contaContabil,
      this.registerForm.value.contaContabilDesc,
      this.registerForm.value.raizContGrupoDesc,
      this.registerForm.value.periodicidade,
      this.registerForm.value.mensalTipo,
      this.registerForm.value.mesEspecifico,
      mesesRecorrentes,
      //this.registerForm.value.mesesRecorrentes.join(','),
      this.registerForm.value.suplementacao,
      this.registerForm.value.baseOrcamento,
      this.registerForm.value.idBase,
      this.registerForm.value.valor,
      this.registerForm.value.tipoCusto
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Orçamento Base registrado com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
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
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, tente novamente.' });
        } 
      }
    });
  }

}
