import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function justificativaValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const respostaControl = control.get('resposta');
    const justificativaControl = control.get('justificativa');
    if (respostaControl && justificativaControl) {
      const resposta = respostaControl.value;
      const justificativa = justificativaControl.value;
      if ((resposta === 5 || resposta === 1) && !justificativa) {
        return { justificativaRequired: true };
      }
    }
    return null;
  };
}