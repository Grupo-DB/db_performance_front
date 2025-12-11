import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
   console.log('control =>', control);
       const password = control.get('password');
       const confirmPassword = control.get('confirmPassword');

       return password && confirmPassword && password.value !== confirmPassword.value ? { confere: true}
       :null;
    };