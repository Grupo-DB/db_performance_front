import { Component } from '@angular/core';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { passwordValidator } from '../createuser/passwordValidator';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
interface CreatepassForm{
  newPassword: FormControl,
  confirmPassword: FormControl,
}


@Component({
  selector: 'app-resetps',
  standalone: true,
  imports: [CommonModule,ToastModule,ReactiveFormsModule,FormsModule,InputTextModule,InputGroupAddonModule,InputGroupModule],
  providers: [MessageService,ToastrService],
  templateUrl: './resetps.component.html',
  styleUrl: './resetps.component.scss'
})


export class ResetpsComponent {
  createpassForm!: FormGroup<CreatepassForm>;

  constructor(private loginService: LoginService, private router: Router,private messageService: MessageService) {

    this.createpassForm = new FormGroup({
      newPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
    },{ validators: passwordValidator  });

  }

  clearForm() {
    this.createpassForm.reset();
  }


  updatePassword() {
    this.loginService.updatePasswordFirstLogin(
      this.createpassForm.value.newPassword
    ).subscribe(() => {
      this.router.navigate(['/welcome/inicial']);
    });
  }


}
