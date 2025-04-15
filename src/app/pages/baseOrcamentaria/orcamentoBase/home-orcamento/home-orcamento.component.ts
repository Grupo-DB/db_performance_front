import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { trigger, transition, style, animate } from '@angular/animations';
import { FilialSga } from '../../orcamentoRealizado/realizado/realizado.component';
import { CurvaService } from '../../../../services/baseOrcamentariaServices/curva/curva.service';
import { NzProgressModule } from 'ng-zorro-antd/progress';
@Component({
  selector: 'app-home-orcamento',
  standalone: true,
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,DividerModule,ToastModule,
    FloatLabelModule,MultiSelectModule,InputNumberModule,ProgressSpinnerModule,
    FormsModule,RadioButtonModule,NzProgressModule
  ],
  animations:[
    trigger('slideAnimation', [
                transition(':enter', [
                  style({ transform: 'translateX(100%)' }),
                  animate('2s ease-out', style({ transform: 'translateX(0)' })),
                ]),
              ]),
              trigger('efeitoFade',[
                transition(':enter',[
                  style({ opacity: 0 }),
                  animate('2s', style({ opacity:1 }))
                ])
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
  templateUrl: './home-orcamento.component.html',
  styleUrl: './home-orcamento.component.scss'
})
export class HomeOrcamentoComponent implements OnInit {
  orcadosResultadosCcsPai: any;
  realizadosResultadosCcsPai: any;
  orcadosResultadosGruposItens: any;
  realizadosResultadosGruposItens: any;
  ano: number = 2025;
  filial: number[] = [0, 1,2, 3,4, 5,6, 7];
  periodo: any[] = [];
  filiaisSga: FilialSga[] = []
  loading: boolean = false;
  selectedCodManagers: any[] = [
    'Matriz','F07 - CD MPA','F08 - UP ATM','F09 - CD MFL',
     'F09 - CD MFL' ]

  gestores: { nome: string; orcado: number; realizado: number; porcentagem: number }[] = [];

  constructor(
  private  loginService: LoginService,
  private curvaService: CurvaService
  ){}

  ngOnInit(): void {
    this.loading = true;
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos 1
  this.periodo = Array.from({ length: mesAtual }, (_, i) => i + 1);
    this.calcularOrcado();
    this.calcularRealizado();
   
    }

  calcularOrcado(): void {
    this.curvaService.getGarficoOrcamento(this.ano,this.periodo,this.selectedCodManagers).subscribe(
      (response) => {
        this.orcadosResultadosCcsPai = response.total_por_cc_pai;
        console.log('Dados do orcadosResultadosCcsPai:', this.orcadosResultadosCcsPai);
        this.orcadosResultadosGruposItens = response.total_por_grupo_itens;
        console.log('Dados do orcadosResultadosGruposItens:', this.orcadosResultadosGruposItens);
        //this.calcularProgresso();
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );
  }

  calcularRealizado(): void {
    this.curvaService.calcularRealizado(this.ano,this.periodo,this.filial).subscribe(
      (response) => {
        this.realizadosResultadosCcsPai = response.agrupado_por_pai;
        console.log('Dados do CCS rEALIZADOS', this.realizadosResultadosCcsPai);
        this.realizadosResultadosGruposItens = response.dicionario_soma_nomes;
        console.log('Dados do realizadosResultadosGruposItens:', this.realizadosResultadosGruposItens);
        this.calcularProgresso();
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );    
  }

  calcularProgresso(): void {
    // Verifica se os dados de orçado e realizado estão disponíveis
    if (!this.orcadosResultadosCcsPai || !this.realizadosResultadosCcsPai) {
      console.error('Dados de orçado ou realizado estão ausentes.');
      return;
    }
  
    // Calcula a porcentagem para cada gestor
    this.gestores = Object.keys(this.orcadosResultadosCcsPai).map(nome => {
      // Trata o valor orçado
      const orcado = parseFloat(
        String(this.orcadosResultadosCcsPai[nome]?.saldo || 0).replace(/\./g, '').replace(/,/g, '.')
      );
    
      // Trata o valor realizado usando a lógica mencionada
      let realizado = 0;
      if (this.realizadosResultadosCcsPai[nome]) {
        try {
          const realizadoObj = JSON.parse(this.realizadosResultadosCcsPai[nome].replace(/'/g, '"')); // Converte JSON inválido
          realizado = Number(realizadoObj?.saldo) || 0;
        } catch (error) {
          console.error(`Erro ao parsear JSON para ${nome}:`, this.realizadosResultadosCcsPai[nome], error);
        }
      }
    
      // Calcula a porcentagem
      const porcentagem = orcado > 0 ? (realizado / orcado) * 100 : 0;
    
      // Retorna o objeto formatado
      return {
        nome,
        orcado,
        realizado,
        porcentagem: Math.min(porcentagem, 100), // Limita a porcentagem a no máximo 100%
      };
    });
  
    console.log('Gestores com progresso calculado:', this.gestores);
  }


  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

}
