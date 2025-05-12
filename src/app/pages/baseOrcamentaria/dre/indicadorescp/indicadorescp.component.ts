import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { CustoproducaoService } from '../../../../services/baseOrcamentariaServices/indicadoresCustoProducao/custoproducao.service';
import { CentroCusto } from '../../orcamentoBase/centrocusto/centrocusto.component';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-indicadorescp',
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,
    NzMenuModule,InputGroupModule,InputGroupAddonModule,ToastModule,
    DropdownModule,InputTextModule,TableModule,DialogModule,ButtonModule,
    MessagesModule,InputNumberModule,SelectModule,MultiSelectModule,ProgressSpinnerModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,InputNumberModule,InplaceModule,
    TreeTableModule,FloatLabelModule,PopoverModule
  ],
  providers: [
    MessageService,ConfirmationService,
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
  templateUrl: './indicadorescp.component.html',
  styleUrl: './indicadorescp.component.scss'
})
export class IndicadorescpComponent implements OnInit {
  ano: number = 2025;
  periodo!: number;
  resultados:any;
  selectedCcsPais: any[] = [];
  centrosCusto: CentroCusto[]| undefined;
  detalhes: any | undefined; 
  loading: boolean = false;
  selectedResultado: any = null;
 
  @ViewChild('op') op!: Popover;
  @ViewChild('RegisterProjecaoForm') RegisterProjecaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));
  
constructor(
  private loginService: LoginService,
  private messageService: MessageService,
  private custoProducaoService: CustoproducaoService,
  private centroCustoService: CentrocustoService
) {}
  ngOnInit(): void {
    //this.getResultados();
  }


  getResultados(): void{
    this.loading = true;
    this.custoProducaoService.getResultados(this.ano, this.periodo).subscribe(
      response => {
        this.resultados = Object.keys(response.resultados).map((key) => ({
          label: response.resultados[key].produto,
          projetado: response.resultados[key].projetado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0,
          realizado: response.resultados[key].realizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0,
          diferenca: response.resultados[key].diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0,
          diferencaPercentual: response.resultados[key].percentual,
          fabrica: response.resultados[key].fabrica,
          quantidadeProjetada: parseFloat(response.resultados[key].quantidade).toFixed(0),
          projetadoCcPai: response.resultados[key].projetado_cc_pai.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0,
          realizadoCcPai: response.resultados[key].realizado_cc_pai.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0,
          producao: parseFloat(response.resultados[key].producao).toFixed(0),      
      }));
      this.loading = false;
     
    },error =>{
      if (error.status === 404) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
      } else if (error.status === 500) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'O parâmetro periodo contém meses futuros, o que não é permitido.Caso o período esteja correto verifique os demais dados ou informe o responsável.',life: 25000 });
      }
    
    });
    

  }

  displayResultado(event: Event, resultado: any, popover: any): void {
    this.selectedResultado = resultado; 
    
    popover.toggle(event); 
}

hidePopover() {
    this.op.hide();
}
  
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  } 
}
