import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';


interface cadastrarForm{
  name: FormControl,
  email: FormControl,
  senha: FormControl,
  senhaConfirm: FormControl
}


@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarComponent {
  cadastrarForm!: FormGroup;
  toastrService: any;

  constructor(
    private router: Router,
    private loginService:LoginService
  ){
    this.cadastrarForm = new FormGroup({
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      senha: new FormControl('',[Validators.required, Validators.minLength(6)]),
      senhaConfirm: new FormControl('',[Validators.required, Validators.minLength(6)]),
    })
  }

  submit(){
    this.loginService.login(this.cadastrarForm.value.email, this.cadastrarForm.value.senha).subscribe({})
    next: () => this.toastrService.success("Login feito com sucesso!!")
    error: () => this.toastrService.error("Erro!!")
  }

  navigate(){
    this.router.navigate(["login"])
  }

}
