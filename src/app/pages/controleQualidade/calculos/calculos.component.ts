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
export class CalculosComponent implements AfterViewInit, OnDestroy {
  @ViewChild(HotTableComponent, { static: false })
  readonly hotTable!: HotTableComponent;
  private hot?: Handsontable;
  private hfInstance?: HyperFormula;

  constructor() {
    registerAllModules();
    // Engine de fórmulas para o Handsontable
    this.hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  }
  ngAfterViewInit(): void {
    // Guarda referência da instância do Handsontable criada pelo wrapper
    // para que possamos ler dados no afterChange
    queueMicrotask(() => {
      this.hot = this.hotTable?.hotInstance as any;
    });
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

   // Configuração base (genérica) aplicada a todas as tabelas
  readonly baseSettings: Partial<GridSettings> & { [key: string]: any } = {
    themeName: 'ht-theme-main',
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    autoWrapRow: true,
    autoWrapCol: true,
    stretchH: 'all',
    contextMenu: true,
    allowInvalid: true,
    formulas: { engine: this.hfInstance ?? HyperFormula },
    licenseKey: 'non-commercial-and-evaluation',
    readOnly: false,
    afterChange: (changes: any, source: string) => {
      if (!changes || source === 'loadData') return;
      const hot = this.hotTable?.hotInstance as any;
      if (!hot) return;
      // Captura o snapshot atual e grava no dataset da tabela ativa
      const snapshot = hot.getData();
      const selected = this.tables.find(t => t.id === this.currentTableId);
      if (!selected) return;
      // Substitui o conteúdo do array mantendo a referência
      selected.data.length = 0;
      for (const row of snapshot) selected.data.push([...row]);
    },
  };

//===========================================  TABELA01  =========================================== 
  // Dados da Tabela 1 – Retenção de Água
  readonly data: (string | number)[][] = [
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

//===========================================  TABELA02  ===========================================
  // TABELA 2 – Tempo em Aberto (estrutura simples, sem merges para facilitar edição)
  // Colunas: Cp | Aresta (mm) | Carga (Kgf) | S | S/A | A | A/P | P | F | Resist (MPa) | Avaliação Pontual
  readonly tempoAbertoData: (string | number)[][] = (() => {
    const rows: (string | number)[][] = [];
    for (let i = 1; i <= 10; i++) {
      rows.push([String(i).padStart(2, '0'), 50, '', '', '', '', '', '', '', '', '']);
    }
    // linha de média (posição 10, index 10)
    rows.push(['Média', '', '', '', '', '', '', '', '', '=IF(COUNT(J1:J10)=0, "", ROUND(AVERAGE(J1:J10),2))', '']);
    return rows;
  })();

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
      const props: any = { readOnly: false };
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

//===========================================  TABELA02  ===========================================
  // Configuração específica – Tabela 2: Tempo em Aberto
  private readonly tempoAbertoSettings: Partial<GridSettings> & { [key: string]: any } = {
    // Cabeçalho superior (fora da grade de dados)
    // nestedHeaders: [
    //   [
    //     { label: 'Cálculo e Validação da Determinação do TEMPO EM ABERTO em Argamassas Colantes', colspan: 11 }
    //   ],
    //   [
    //     { label: 'Tempo em aberto: intervalo de tempo (min) no qual a argamassa colante mantém sua capacidade de aderência (≥ 0,5 MPa) conforme ABNT NBR 14081-4.', colspan: 11 }
    //   ]
    // ],
    width: '100%',
    height: 'auto',
    colHeaders: [
      'Cp', 'Aresta (mm)', 'Carga (Kgf)', 'S', 'S/A', 'A', 'A/P', 'P', 'F', 'Resist (MPa)', 'Avaliação Pontual'
    ],
    rowHeaders: false,
    //wordWrap: true,
    manualColumnResize: true,
    autoWrapRow: true,
    autoWrapCol: true,
    stretchH: 'none',
    // Larguras compactas por coluna (11 colunas)
    colWidths: [40, 70, 80, 60, 80, 70, 100, 80, 70, 80, 130],
    //fixedRowsTop: 3, // congela bloco superior + cabeçalho interno
    mergeCells: [],
    // IMPORTANT: define um cells() explícito para não herdar regras da tabela 1
    cells: (row: number, col: number) => {
      const props: any = { readOnly: false };
      // Linha de média (última linha)
      const isAvgRow = row === 10;
      if (isAvgRow) {
        props.readOnly = true;
        if (col === 9) {
          props.type = 'numeric';
          props.numericFormat = { pattern: '0.0' };
        }
        return props;
      }
      // Cp e Aresta são fixos
      if (col === 0 || col === 1) props.readOnly = true;
      // Carga e Resist numéricos
      if (col === 2) props.type = 'numeric'; // Kgf
      if (col === 9) {
        props.type = 'numeric';
        props.numericFormat = { pattern: '0.0' };
      }
      // Avaliação Pontual: somente leitura com renderer conforme Resist
      if (col === 10) {
        props.readOnly = true;
        props.renderer = (instance: any, td: HTMLTableCellElement, r: number) => {
          const resist = instance.getDataAtCell(r, 9);
          const text = typeof resist === 'number' && !isNaN(resist)
            ? (resist >= 0.5 ? 'Válido!' : 'Inválido!')
            : '';
          td.textContent = text;
          td.className = (td.className || '') + (text === 'Válido!' ? ' eval-valid' : text ? ' eval-invalid' : '');
        };
      }
      return props;
    },
  };

//===========================================  TABELA03  ===========================================
readonly data2: (string | number)[][] = [
    // Linha 1 (index 0): AMOSTRA (merge B1:D1) e valor em E1
    ['', 'AMOSTRA', '', '', 'ARGA25 07,363'],
    ['% de água adicionada na argamassa', '%', 'P', 0.168, ''],

  ];

//===========================================  CATÁLOGO DE TABELAS  ===========================================
  // Catálogo de tabelas (pode crescer com novas tabelas)
  readonly tables: Array<
  {
    id: string;
    label: string;
    data: (string | number)[][];
    settings?: Partial<GridSettings> & { [key: string]: any };
  }
    > = 
  [
    { id: 'retencao', label: 'Retenção de Água', data: this.data, settings: this.retencaoSettings },
    { id: 'tempo-aberto', label: 'Tempo em Aberto (Tabela 2)', data: this.tempoAbertoData, settings: this.tempoAbertoSettings },
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
        mergeCells: [
          { row: 0, col: 1, rowspan: 1, colspan: 3 },
        ],
        // Usa cabeçalhos padrão (A, B, C, ...)
        colHeaders: true,
      }
    },
  ];

  currentTableId: string = 'retencao';
  private _settingsCache?: { id: string; value: Partial<GridSettings> & { [key: string]: any } };
  private _dataCache?: { id: string; value: (string | number)[][] };
  // Dados/Config ativos conforme o seletor
  get activeData(): (string | number)[][] {
    if (this._dataCache?.id === this.currentTableId) return this._dataCache.value;
    const val = this.tables.find(t => t.id === this.currentTableId)?.data ?? this.data;
    this._dataCache = { id: this.currentTableId, value: val };
    return val;
  }

  get activeSettings(): Partial<GridSettings> & { [key: string]: any } {
    if (this._settingsCache?.id === this.currentTableId) return this._settingsCache.value;
    const selected = this.tables.find(t => t.id === this.currentTableId);
    const nestedHeaders = selected?.settings?.nestedHeaders ?? [];
    const mergeCells = selected?.settings?.mergeCells ?? [];
    const colHeaders = selected?.settings?.colHeaders ?? true;
    const cells = selected?.settings?.cells ?? ((row: number, col: number) => ({}));
    const value = { ...this.baseSettings, nestedHeaders, mergeCells, colHeaders, cells, ...(selected?.settings || {}) };
    this._settingsCache = { id: this.currentTableId, value };
    return value;
  }


}