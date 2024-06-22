import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToStatus',
  standalone: true
})
export class BooleanToStatusPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Ativo' : 'Inativo';
  }

}
