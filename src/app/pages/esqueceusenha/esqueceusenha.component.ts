import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { passwordValidator } from '../createuser/passwordValidator';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';






@Component({
  selector: 'app-esqueceusenha',
  standalone: true,
  imports: [CommonModule,ToastModule,ReactiveFormsModule,FormsModule,InputTextModule,InputGroupAddonModule,InputGroupModule,PrimaryInputComponent],
  providers: [MessageService,ToastrService],
  templateUrl: './esqueceusenha.component.html',
  styleUrl: './esqueceusenha.component.scss'
})
export class EsqueceuSenhaComponent {
  forgotPasswordForm: FormGroup;



  constructor(private http: HttpClient, private router: Router,private messageService: MessageService) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  clearForm() {
    this.forgotPasswordForm.reset();
  }

  submit() {
    this.http.post('http://172.50.10.79:8008/management/forgot-password/', this.forgotPasswordForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Email enviado com sucesso!' });
        // Redireciona para a página de login após o sucesso
        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao enviar email.' });
      }
    });
  }
}
