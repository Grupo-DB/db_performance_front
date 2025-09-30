import { Component } from '@angular/core';
import { HotTableModule } from '@handsontable/angular-wrapper';

@Component({
  selector: 'app-test-table',
  standalone: true,
  imports: [HotTableModule],
  template: `
    <div style="margin: 20px;">
      <h3>Teste Simples Handsontable</h3>
  <hot-table themeName="ht-theme-main" [settings]="settings"></hot-table>
    </div>
  `
})
export class TestTableComponent {
  settings = {
    data: [
      ['A', 1, 2, 3],
      ['B', 4, 5, 6],
      ['C', 7, 8, 9]
    ],
    colHeaders: ['Letra', 'Col1', 'Col2', 'Col3'],
    rowHeaders: true,
    height: 200,
    licenseKey: 'non-commercial-and-evaluation'
  };
}