import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
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
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { ProjetadoService } from '../../../../services/baseOrcamentariaServices/projetado/projetado.service';
import { CentroCusto } from '../../orcamentoBase/centrocusto/centrocusto.component';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { PprService } from '../../../../services/baseOrcamentariaServices/ppr.service';

@Component({
  selector: 'app-ppr-orcamento',
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,
    NzMenuModule,InputGroupModule,InputGroupAddonModule,ToastModule,
    DropdownModule,InputTextModule,TableModule,DialogModule,ButtonModule,
    MessagesModule,InputNumberModule,SelectModule,MultiSelectModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,
    FloatLabelModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ppr-orcamento.component.html',
  styleUrl: './ppr-orcamento.component.scss'
})
export class PprOrcamentoComponent implements OnInit {
  ccsDespesasAdm: any[] = [6,10,12,23,46,50];
  periodo: any[] = [];
  centrosCusto: CentroCusto[]|undefined;
  ano: number = new Date().getFullYear();
  teste: any;
  filial: any[] = [0];
  variavelMatriz: any;
  fixoMatriz: any;
    constructor(
        private fb: FormBuilder, 
        private loginService: LoginService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private pprService: PprService,
        private centroCustoService: CentrocustoService
      ) {}
  ngOnInit(): void {
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos 1
    this.periodo = Array.from({ length: mesAtual }, (_, i) => i + 1);
    this.carregarCcs(this.ccsDespesasAdm)
  }

      hasGroup(groups: string[]): boolean {
        return this.loginService.hasAnyGroup(groups);
      } 

      carregarCcs(ccPaiId: any): void{
        this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
          centrosCusto =>{
            this.centrosCusto = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
            //this.calculosOrcamentosRealizados();
            console.log('Ccs',this.centrosCusto);
            this.calcularRealizado();
          }, error =>{
            console.error('Não rolou',error)
          }
          
        )
      }

     calcularRealizado(): void {
        this.pprService.calcularRealizado(this.centrosCusto, this.ano, this.periodo, this.filial).subscribe(
          response =>{
            this.teste = response
            this.calcularCustoMatriz();
          }
        )
  }

    calcularCustoMatriz(): void {
      this.pprService.calcularCusto(this.ano, this.periodo, this.filial).subscribe(
        response =>{
          this.variavelMatriz = response.variavel;
          this.fixoMatriz = response.fixo;
        }
      )
}
}