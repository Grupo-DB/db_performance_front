import { Injectable } from '@angular/core';
import { CustoproducaoService } from '../../services/baseOrcamentariaServices/indicadoresCustoProducao/custoproducao.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class IndicadoresService {
  constructor(
    private custoProducaoService: CustoproducaoService,
    private messageService: MessageService
  ) {}

  getResultados(ano: number, periodo: number, callback: (resultados: any) => void): void {
    this.custoProducaoService.getResultados(ano, periodo).subscribe(
      (response) => {
        const resultados = Object.keys(response.resultados).map((key) => ({
          label: response.resultados[key].produto,
          projetado: response.resultados[key].projetado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0,
          realizado: response.resultados[key].realizado.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0,
          diferenca: response.resultados[key].diferenca.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0,
          diferencaPercentual: response.resultados[key].percentual,
          fabrica: response.resultados[key].fabrica,
          quantidadeProjetada: parseFloat(response.resultados[key].quantidade).toFixed(0),
          projetadoCcPai: response.resultados[key].projetado_cc_pai.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0,
          realizadoCcPai: response.resultados[key].realizado_cc_pai.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || 0,
          producao: parseFloat(response.resultados[key].producao).toFixed(0),
        }));
        callback(resultados);
      },
      (error) => {
        if (error.status === 404) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não existem dados correspondentes ao seu filtro.',
          });
        } else if (error.status === 500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail:
              'O parâmetro periodo contém meses futuros, o que não é permitido. Caso o período esteja correto verifique os demais dados ou informe o responsável.',
            life: 25000,
          });
        }
      }
    );
  }
}
