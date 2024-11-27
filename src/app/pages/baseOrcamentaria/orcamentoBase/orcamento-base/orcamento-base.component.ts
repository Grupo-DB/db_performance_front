import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TableModule } from 'primeng/table';
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

interface RegisterOrcamentoBaseForm{
  ccPai: FormControl;
  centroCusto: FormControl;
  periodicidade: FormControl;
  mensalTipo: FormControl;
  mesesRecorrentes: FormControl;
  suplementacao: FormControl;
  baseOrcamento: FormControl;

}

export interface OrcamentoBase{
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
  conta_contabil: string;
  conta_contabil_descricao: string;
  raiz_contabil_grupo: string;
  raiz_contabil_grupo_desc: string;
  recorrencia: string;
  mensal_tipo: string;
  mes_especifico: string;
  meses_recorrentes: string;
  suplementacao: string;
  base_orcamento: string;
  id_base: string;
  valor: string;
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
    MessageService,ConfirmationService
  ],
  templateUrl: './orcamento-base.component.html',
  styleUrl: './orcamento-base.component.scss'
})
export class OrcamentoBaseComponent implements OnInit{
  ano!: string;
  ccsPai: CentroCustoPai[] = [];
  centrosCusto: CentroCusto [] = [];
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
    { key:'usoConsumo', value:'Uso e Consumo' }
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
  ){
    this.registerForm = new FormGroup({
      ccPai: new FormControl(''),
      centroCusto: new FormControl(''),
      periodicidade: new FormControl(''),
      mensalTipo: new FormControl(''),
      mesesRecorrentes: new FormControl(''),
      suplementacao: new FormControl(''),
      baseOrcamento: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.ccsPaiService.getCentrosCustoPai().subscribe(
      ccsPai => {
        this.ccsPai = ccsPai.map(ccPai =>({
          ...ccPai,
          label: `${ccPai.nome} - ${ccPai.filial.nome}`
        }))
      },
      error => {
        console.error('Não carregou',error)
      }
    )
    
    this.raizAnaliticaService.getRaizesAnaliticas().subscribe(
      raizesAnaliticas => {
        this.raizesAnaliticas = raizesAnaliticas.map(raizAnalitica =>({
          ...raizAnalitica,
          label: `${raizAnalitica.raiz_contabil} - ${raizAnalitica.descricao}`
        }))
      },error =>{
        console.error('Não carregou',error)
      }
    )
   
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
      this.contaContabil = `${raizContabilSintetica}${raizContabilAnalitica}`;
      console.log('Conta Contábil Montada:', this.contaContabil);
    } else {
      console.warn('Raiz Sintética ou Raiz Analítica não estão definidas');
    }
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
}