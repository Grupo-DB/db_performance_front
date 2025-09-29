import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HotTableModule } from '@handsontable/angular-wrapper';
import { HyperFormula } from 'hyperformula';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
@Component({
  selector: 'app-calculos',
  standalone: true,
  imports: [HotTableModule],
  templateUrl: './calculos.component.html',
  styleUrls: ['./calculos.component.scss']
})
export class CalculosComponent implements AfterViewInit, OnDestroy {

  @ViewChild('hotContainer', { static: false }) hotContainer!: ElementRef<HTMLDivElement>;
  private hot?: Handsontable;
  private hfInstance?: HyperFormula;

  constructor() {
    registerAllModules();
  }

  ngAfterViewInit(): void {
    // Ensure the container exists after the view has initialized
    const container = this.hotContainer?.nativeElement;
    if (!container) {
      return;
    }

    // Create a HyperFormula engine instance (required for formulas support)
    this.hfInstance = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

    // Add more examples: per-row Total (SUM), Average (AVERAGE), Goal check (IF), and % of grand total (ROUND)
    const data: (string | number)[][] = [
      ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford', 'Total', 'Média', 'Meta 2019?', '% da Linha'],
      ['2017', 10, 11, 12, 13, 15, 16, '=SUM(B2:G2)', '=AVERAGE(B2:G2)', '=IF(D2>=12,"✓","✗")', '=ROUND(H2/$H$7*100,2)'],
      ['2018', 10, 11, 12, 13, 15, 16, '=SUM(B3:G3)', '=AVERAGE(B3:G3)', '=IF(D3>=12,"✓","✗")', '=ROUND(H3/$H$7*100,2)'],
      ['2019', 10, 11, 12, 13, 15, 16, '=SUM(B4:G4)', '=AVERAGE(B4:G4)', '=IF(D4>=12,"✓","✗")', '=ROUND(H4/$H$7*100,2)'],
      ['2020', 10, 11, 12, 13, 15, 16, '=SUM(B5:G5)', '=AVERAGE(B5:G5)', '=IF(D5>=12,"✓","✗")', '=ROUND(H5/$H$7*100,2)'],
      ['2021', 10, 11, 12, 13, 15, 16, '=SUM(B6:G6)', '=AVERAGE(B6:G6)', '=IF(D6>=12,"✓","✗")', '=ROUND(H6/$H$7*100,2)'],
      // Linha de totais por marca (exemplo claro de células com fórmulas HyperFormula)
      ['Total por marca', '=SUM(B2:B6)', '=SUM(C2:C6)', '=SUM(D2:D6)', '=SUM(E2:E6)', '=SUM(F2:F6)', '=SUM(G2:G6)', '=SUM(H2:H6)', '', '', ''],
    ];

    this.hot = new Handsontable(container, {
      themeName: 'ht-theme-main',
      data,
      startRows: 5,
      startCols: 11,
      height: 'auto',
      width: 'auto',
      colHeaders: true,
      rowHeaders: true,
      // Highlight formula cells and total rows for clarity
      cells: (row, col) => {
        const props: any = {};
        // Zero-based indexes: header row = 0, data rows 1..5, totals row = 6
        const isHeader = row === 0;
        const isTotalsRow = row === 6;
        // Columns H (7), I (8), J (9), K (10) contain formulas on data rows
        const isFormulaColumn = col >= 7 && col <= 10;
        if (!isHeader && isFormulaColumn && !isTotalsRow) {
          props.className = (props.className ? props.className + ' ' : '') + 'formula-cell';
        }
        if (isTotalsRow) {
          props.className = (props.className ? props.className + ' ' : '') + 'calculated-cell';
        }
        return props;
      },
      formulas: {
        engine: this.hfInstance,
      },
      minSpareRows: 1,
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: 'non-commercial-and-evaluation',
    });
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