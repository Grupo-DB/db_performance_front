import { Injectable } from '@angular/core';

export interface BoletimCalcario {
  dataAmostra: string;
  periodo: string;
  local: string;
  informacaoComplementar: string;
  riSiO2: string;
  r0: string;
  granulometria: {
    ret10: number;
    ret20: number;
    ret50: number;
    pas50: number;
  };
  re: string;
  pn: string;
  calc: string;
  horario: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoletimService {
  gerarBoletimCalcario(): BoletimCalcario {
    return {
      dataAmostra: '11/02/26',
      periodo: '10:30',
      local: 'Mangueirão',
      informacaoComplementar: 'Banc 05 F 24',
      riSiO2: '',
      r0: '',
      granulometria: {
        ret10: 0.0,
        ret20: 0.0,
        ret50: 0.0,
        pas50: 0.0,
      },
      re: '-',
      pn: '-',
      calc: 'Calc26 10.557',
      horario: '16:10',
    };
  }
}
