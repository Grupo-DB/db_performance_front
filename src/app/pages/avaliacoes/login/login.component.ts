import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DrawerModule } from 'primeng/drawer';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None, // Desativa o encapsulamento de estilos
  standalone: true,
  imports: [
    ReactiveFormsModule,ButtonModule,ToastModule,FloatLabelModule,IconFieldModule,InputIconModule,DividerModule,
    InputTextModule,InputGroupAddonModule,InputGroupModule,CommonModule, RouterLink,DrawerModule,AccordionModule
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
  
})
export class LoginComponent {
  loginForm!: FormGroup;
  toastrService: any;
  modalVisible: boolean = false;
  @ViewChild('emailInput') emailInput!: ElementRef;

  openModal(): void {
    this.modalVisible = true;

    // Aguarde o modal ser exibido antes de definir o foco
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 0);
  }

  constructor(
    private router: Router,
    private loginService:LoginService,
    private messageService: MessageService 
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    })
  }
  clearForm() {
    this.loginForm.reset();
  }

  submit() {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Login!', detail: 'Login feito com sucesso!' });
        setTimeout(() => {
          if (response.primeiro_acesso) {
            this.router.navigate(['/resetps']);
          } else {
            this.router.navigate(['/welcome/inicial']);
          }
        }, 500); // Delay of 500ms to allow message to be displayed
      },
      
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, verifique os dados e tente novamente.' });
      }
    });
  }
}
