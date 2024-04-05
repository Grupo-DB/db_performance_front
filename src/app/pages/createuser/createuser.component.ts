import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { AbstractControl, FormControl, FormGroup, FormRecord, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { CreateuserService } from '../../services/createuser.service';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from './passwordValidator';
import { AuthInterceptor } from '../../services/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginService } from '../../services/login.service';


interface CreateuserForm {
  first_name: FormControl,
  last_name: FormControl,
  username: FormControl,
  password: FormControl,
  confirmPassword: FormControl
}


@Component({
  selector: 'app-createuser',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    
  ],
  providers: [
    CreateuserService,
    LoginService
  ],
  templateUrl: './createuser.component.html',
  styleUrl: './createuser.component.scss'
})
export class CreateuserComponent {
  createuserForm!: FormGroup<CreateuserForm>;

  
  constructor(
    private router: Router,
    private createuserService:CreateuserService,
    private toastService: ToastrService,
    
  )
  
  
  
  {
    this.createuserForm = new FormGroup({
      first_name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      last_name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      username: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
      
    }, { validators: passwordValidator  }); 

    

  }



  submit(){
    this.createuserService.createuser(this.createuserForm.value.first_name, this.createuserForm.value.last_name, this.createuserForm.value.username, this.createuserForm.value.password,this.createuserForm.value.confirmPassword, ).subscribe({
      next: () => this.toastService.success("Usuário cadastrado com sucesso!"),
      error: () => this.toastService.error("Erro, revise os dados!")
    })
  }

  navigate(){
    this.router.navigate(["login"])
  }

}
