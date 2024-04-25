import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { MessageService } from 'primeng/api';
import { RegisterFormularioService } from '../../services/formularios/registerformulario.service';
import { GetPerguntaService } from '../../services/perguntas/getpergunta.service';
import { GetFormularioService } from '../../services/formularios/getformulario.service';


interface RegisterFormularioForm{
  nome: FormControl,
  
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {
  formularios: any[] = [];

  registerformularioForm!: FormGroup<RegisterFormularioForm>;
  @ViewChild('RegisterfilialForm') RegisterFormularioForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getformularioService: GetFormularioService,
    private registerformularioService: RegisterFormularioService,
    private getperguntaService: GetPerguntaService,
  )
  {
    this.registerformularioForm = new FormGroup({
      nome: new FormControl('',[Validators.required]),

     }); 
   }

   ngOnInit(): void {
    this.getformularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
}

clear(table: Table) {
  table.clear();
}

clearForm() {
this.registerformularioForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  //const perguntaId = this.registerformularioForm.value.perguntas.id;
  this.registerformularioService.registerformulario( 
    this.registerformularioForm.value.nome,
    
    
    
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}


navigate(){
  this.router.navigate(["dashboard"])
}


}
