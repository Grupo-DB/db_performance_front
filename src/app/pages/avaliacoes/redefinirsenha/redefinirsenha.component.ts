import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { passwordValidator } from '../createuser/passwordValidator';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-redefinirsenha',
  standalone: true,
  imports: [CommonModule,ToastModule,ReactiveFormsModule,FormsModule,InputTextModule,InputGroupAddonModule,InputGroupModule],
  providers: [MessageService,ToastrService],
  templateUrl: './redefinirsenha.component.html',
  styleUrl: './redefinirsenha.component.scss'
})
export class RedefinirSenhaComponent implements OnInit {
  resetPasswordForm: FormGroup;
  uid: string;
  token: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
    },{ validators: passwordValidator  });
    
  
    this.uid = '';  // Inicialize com string vazia
    this.token = '';   // Inicialize com string vazia
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  clearForm() {
    this.resetPasswordForm.reset();
  }

  submit() {
    const formData = {
      new_password: this.resetPasswordForm.value.newPassword,
    };

    this.http.post(`http://172.50.10.79:8008/management/reset-password/${this.uid}/${this.token}/`, formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha redefinida com sucesso!' });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao redefinir senha.' });
      }
    });
  }
}
