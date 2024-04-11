import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, Validators } from '@angular/forms';
import { FormLayoutComponent } from "../../components/form-layout/form-layout.component";
import { RegisterCompanyService } from '../../services/registercompany.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';

interface RegisterCompanyForm{
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}

@Component({
    selector: 'app-registercompany',
    standalone: true,
    templateUrl: './registercompany.component.html',
    styleUrl: './registercompany.component.scss',
    imports: [
        ReactiveFormsModule,
        FormLayoutComponent,
        PrimaryInputComponent
        
    ],
    providers:[
      RegisterCompanyService
    ]
})
export class RegisterCompanyComponent {

  registercompanyForm!: FormGroup<RegisterCompanyForm>;

  
  constructor(
    private router: Router,
    private registercompanyService:RegisterCompanyService,
    private toastService: ToastrService,    
  )

    {
   this.registercompanyForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      cnpj: new FormControl('',[Validators.required, Validators.minLength(3)]),
      endereco: new FormControl('',[Validators.required, Validators.email]),
      cidade: new FormControl('',[Validators.required, Validators.minLength(6)]),
      estado: new FormControl('',[Validators.required, Validators.minLength(6)]),
      codigo: new FormControl('',[Validators.required, Validators.minLength(6)]),
      
    }); 
  }
  
  submit(){
    this.registercompanyService.registercompany(
      this.registercompanyForm.value.nome, 
      this.registercompanyForm.value.cnpj, 
      this.registercompanyForm.value.endereco, 
      this.registercompanyForm.value.cidade, 
      this.registercompanyForm.value.estado, 
      this.registercompanyForm.value.codigo
    ).subscribe({
    next: () => this.toastService.success("Cadastro feito com sucesso!!"),
    error: () => this.toastService.error("Erro!!")
  })
  }

  navigate(){
    this.router.navigate(["dashboard"])
  }

  @ViewChild('empresaModal',{static: false}) empresaModal?: ElementRef;
  close(){

    (this.empresaModal?.nativeElement as HTMLElement).style.display = 'none';
    document.body.classList.remove('modal-open');
}
}


