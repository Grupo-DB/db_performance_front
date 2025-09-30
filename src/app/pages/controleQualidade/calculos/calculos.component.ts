import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotTableModule,GridSettings, HotTableComponent } from '@handsontable/angular-wrapper';
import { HyperFormula } from 'hyperformula';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
@Component({
  selector: 'app-calculos',
  standalone: true,
  imports: [CommonModule, FormsModule, HotTableModule],
  templateUrl: './calculos.component.html',
  styleUrls: ['./calculos.component.scss']
})
export class CalculosComponent implements OnDestroy {
  @ViewChild(HotTableComponent, { static: false })
  readonly hotTable!: HotTableComponent;
  private hot?: Handsontable;
  private hfInstance?: HyperFormula;

  constructor() {
    registerAllModules();
    // Engine de fórmulas para o Handsontable
    this.hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  }

  // ngAfterViewInit(): void {
  //   // Ensure the container exists after the view has initialized
  //   const container = this.hotContainer?.nativeElement;
  //   if (!container) {
  //     return;
  //   }

    // Create a HyperFormula engine instance (required for formulas support)
  //  this.hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

  //   // Add more examples: per-row Total (SUM), Average (AVERAGE), Goal check (IF), and % of grand total (ROUND)
  //   const data: any[][] = [
  //     ['', { label: 'Marcas', colspan: 6 }, { label: 'Cálculos', colspan: 4 }],
  //     ['% de água adicionada na argamassa', '%', 'P', '16,8 %',],
  //     ['Massa conjunto vazio e úmido (funil + papel umido)', 'g', 'm1', 12, 13, 15, 16, '=SUM(B3:G3)', '=AVERAGE(B3:G3)', '=IF(D3>=12,"✓","✗")', '=ROUND(H3/$H$7*100,2)'],
  //     ['Massa conjunto com argamassa antes da sucção', 'g', 'm2', 12, 13, 15, 16, '=SUM(B4:G4)', '=AVERAGE(B4:G4)', '=IF(D4>=12,"✓","✗")', '=ROUND(H4/$H$7*100,2)'],
  //     ['Massa conjunto com argamassa após a sucção', 'g', 'm3', 12, 13, 15, 16, '=SUM(B5:G5)', '=AVERAGE(B5:G5)', '=IF(D5>=12,"✓","✗")', '=ROUND(H5/$H$7*100,2)'],
  //     ['Massa de argamassa úmida contida no funil antes da sucção', 'g', 'm4', 12, 13, 15, 16, '=SUM(B6:G6)', '=AVERAGE(B6:G6)', '=IF(D6>=12,"✓","✗")', '=ROUND(H6/$H$7*100,2)'],
  //     ['Massa de argamassa úmida contida no funil após a sucção', 'g', 'm5', 12, 13, 15, 16, '=SUM(B7:G7)', '=AVERAGE(B7:G7)', '=IF(D7>=12,"✓","✗")', '=ROUND(H7/$H$7*100,2)'],
  //     ['Massa da água contida antes da sucção', 'g', 'm6', 12, 13, 15, 16, '=SUM(B8:G8)', '=AVERAGE(B8:G8)', '=IF(D8>=12,"✓","✗")', '=ROUND(H8/$H$7*100,2)'],
  //     ['Massa da água perdida', 'g', 'm7', 12, 13, 15, 16, '=SUM(B9:G9)', '=AVERAGE(B9:G9)', '=IF(D9>=12,"✓","✗")', '=ROUND(H9/$H$7*100,2)'],
  //     ['Massa de água retida', 'g', 'm8', 'm6 -m7',99],
  //     // Linha de totais por marca (exemplo claro de células com fórmulas HyperFormula)
  //     ['Total por marca', '=SUM(B2:B6)', '=SUM(C2:C6)', '=SUM(D2:D6)', '=SUM(E2:E6)', '=SUM(F2:F6)', '=SUM(G2:G6)', '=SUM(H2:H6)', '', '', ''],
  //   ];

  //   this.hot = new Handsontable(container, {
  //     themeName: 'ht-theme-main',
  //     data,
  //     startRows: 5,
  //     startCols: 11,
  //     height: 'auto',
  //     width: 'auto',
  //     colHeaders: true,
  //     rowHeaders: true,
  //     // Highlight formula cells and total rows for clarity
  //     cells: (row, col) => {
  //       const props: any = {};
  //       // Zero-based indexes: header row = 0, data rows 1..5, totals row = 6
  //       const isHeader = row === 0;
  //       const isTotalsRow = row === 6;
  //       // Columns H (7), I (8), J (9), K (10) contain formulas on data rows
  //       const isFormulaColumn = col >= 7 && col <= 10;
  //       if (!isHeader && isFormulaColumn && !isTotalsRow) {
  //         props.className = (props.className ? props.className + ' ' : '') + 'formula-cell';
  //       }
  //       if (isTotalsRow) {
  //         props.className = (props.className ? props.className + ' ' : '') + 'calculated-cell';
  //       }
  //       return props;
  //     },
  //     formulas: {
  //       engine: this.hfInstance,
  //     },
  //     minSpareRows: 1,
  //     autoWrapRow: true,
  //     autoWrapCol: true,
  //     licenseKey: 'non-commercial-and-evaluation',
  //   });
  //}

  
  // Dados devem conter apenas valores primitivos. Cabeçalhos mesclados via nestedHeaders.
  readonly data: (string | number)[][] = [
    // Linha 1 (index 0): AMOSTRA (merge B1:D1) e valor em E1
    ['', 'AMOSTRA', '', '', 'ARGA25 07,363'],
    ['% de água adicionada na argamassa', '%', 'P', 0.168, ''],
    ['Massa conjunto vazio e úmido  (funil + papel úmido)', 'g', 'm1', 2450.0, ''],
    ['Massa conjunto com argamassa antes da sucção', 'g', 'm2', 3666.0, ''],
    ['Massa conjunto com argamassa após a sucção', 'g', 'm3', 3628.0, ''],
    ['Massa de argamassa úmida contida no funil antes da sucção', 'g', 'm4', 'm2 - m1', '=D4-D3'],
    ['Massa de argamassa úmida contida no funil após a sucção', 'g', 'm5', 'm3 - m1', '=D5-D3'],
    ['Massa da água contida antes da sucção', 'g', 'm6', 'm4 × P', '=E6*D2'],
    ['Massa da água perdida', 'g', 'm7', 'm4 - m5', '=E6-E7'],
    ['Massa de água retida', 'g', 'm8', 'm6 - m7', '=E8-E9'],
    ['', '%Retenção', '%', 'm8 / m6 × 100', '=ROUND(E10/E8*100,2)'],
  ];

  readonly data2: (string | number)[][] = [
    // Linha 1 (index 0): AMOSTRA (merge B1:D1) e valor em E1
    ['', 'AMOSTRA', '', '', 'ARGA25 07,363'],
    // Linha 2: % de água adicionada na argamassa (P)
    ['% de água adicionada na argamassa', '%', 'P', 0.168, ''],
  ];

  // Configuração base (genérica) aplicada a todas as tabelas
  readonly baseSettings: Partial<GridSettings> & { [key: string]: any } = {
    themeName: 'ht-theme-main',
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    autoWrapRow: true,
    autoWrapCol: true,
    stretchH: 'all',
    columnWidths: 'auto',
    contextMenu: true,
    formulas: { engine: this.hfInstance ?? HyperFormula },
    licenseKey: 'non-commercial-and-evaluation',
  };

  // Configuração específica da tabela de Retenção de Água (headers/merges/cells)
  private readonly retencaoSettings: Partial<GridSettings> & { [key: string]: any } = {
    colHeaders: ['', '', '', '', ''],
    nestedHeaders: [[{ label: 'CÁLCULO DA RETENÇÃO DE ÁGUA ARGAMASSA', colspan: 5 }]],
    mergeCells: [
      { row: 0, col: 1, rowspan: 1, colspan: 3 },
      { row: 1, col: 3, rowspan: 1, colspan: 2 },
      { row: 2, col: 3, rowspan: 1, colspan: 2 },
      { row: 3, col: 3, rowspan: 1, colspan: 2 },
      { row: 4, col: 3, rowspan: 1, colspan: 2 },
    ],
    cells: (row: number, col: number) => {
      const props: any = {};
      if (col === 4) {
        props.type = 'numeric';
        if (row === 1) {
          props.numericFormat = { pattern: '0.0 %' };
        } else if (row === 10) {
          props.numericFormat = { pattern: '0,0.00' };
          props.className = (props.className ? props.className + ' ' : '') + 'summary-row demo-cell';
        } else {
          props.numericFormat = { pattern: '0,0.00' };
        }
      }
      if (col === 0) {
        props.className = (props.className ? props.className + ' ' : '') + 'desc-cell';
      }
      if (col === 3) {
        if (row === 1) {
          props.type = 'numeric';
          props.numericFormat = { pattern: '0.0 %' };
        } else if (row >= 2 && row <= 4) {
          props.type = 'numeric';
          props.numericFormat = { pattern: '0,0.00' };
        } else {
          props.className = (props.className ? props.className + ' ' : '') + 'formula-text';
        }
      }
      if (row === 10) {
        props.className = (props.className ? props.className + ' ' : '') + 'summary-row demo-cell';
      }
      if (row === 0) {
        props.readOnly = true;
        props.className = (props.className ? props.className + ' ' : '') + 'sample-row';
      }
      return props;
    },
  };

  // Catálogo de tabelas (pode crescer com novas tabelas)
  readonly tables: Array<{
    id: string;
    label: string;
    data: (string | number)[][];
    settings?: Partial<GridSettings> & { [key: string]: any };
  }> = [
    { id: 'retencao', label: 'Retenção de Água', data: this.data, settings: this.retencaoSettings },
    {
      id: 'simples',
      label: 'Tabela Simples',
      data: this.data2,
      settings: {
        // Cabeçalho diferente para demonstrar a troca
        nestedHeaders: [
          [{ label: 'Cálculo  e Validação da Determinação do TEMPO EM ABERTO em Argamassas Colantes', colspan: 5 }],
          [{ label: 'Tempo em aberto: É o intervalo de tempo, expresso em minutos, durante o qual a argamassa colante, aplicada na superfície mantém sua capacidade de aderência, permitindo o assentamento das peças cerâmicas resultando em uma resistência igual ou maior a 0,5 MPa quando submetida ao ensaio de aderência conforme ABNT NBR 14081-4', colspan: 5 }]
        ],
        // Limpa quaisquer merges anteriores
        mergeCells: [],
        // Usa cabeçalhos padrão (A, B, C, ...)
        colHeaders: true,
      }
    },
  ];

  currentTableId: string = 'retencao';

  // Dados/Config ativos conforme o seletor
  get activeData(): (string | number)[][] {
    return this.tables.find(t => t.id === this.currentTableId)?.data ?? this.data;
  }

  get activeSettings(): Partial<GridSettings> & { [key: string]: any } {
    const selected = this.tables.find(t => t.id === this.currentTableId);
    // Força a atualização/limpeza de seções sensíveis (nestedHeaders/mergeCells/colHeaders)
    const nestedHeaders = selected?.settings?.nestedHeaders ?? [];
    const mergeCells = selected?.settings?.mergeCells ?? [];
    const colHeaders = selected?.settings?.colHeaders ?? true;
    return { ...this.baseSettings, nestedHeaders, mergeCells, colHeaders, ...(selected?.settings || {}) };
  }

  onSelectTable(id: any) {
    this.currentTableId = String(id);
  }


  ngOnDestroy(): void {
    // Destroy Handsontable first, then HyperFormula engine to avoid leaks
    try {
      this.hot?.destroy();
    } finally {
      this.hfInstance?.destroy();
    }
  }

}