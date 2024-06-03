import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,ButtonModule,ToastModule,
    PrimaryInputComponent,InputTextModule,InputGroupAddonModule,InputGroupModule
  ],
  providers: [
    LoginService,MessageService,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  toastrService: any;

  constructor(
    private router: Router,
    private loginService:LoginService,
    private messageService: MessageService 
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    })
  }
  clearForm() {
    this.loginForm.reset();
  }
  submit(){
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
    next: () => this.toastrService.success("Login feito com sucesso!!"),
    error: () => this.toastrService.error("Erro!!")
  })
  }

}
