import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
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
import { GetPerguntaService } from '../../services/perguntas/getpergunta.service';
import { RegisterPerguntaService } from '../../services/perguntas/registerpergunta.service';


interface RegisterPerguntaForm{
  texto: FormControl,
}

@Component({
  selector: 'app-pergunta',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './pergunta.component.html',
  styleUrl: './pergunta.component.scss'
})
export class PerguntaComponent implements OnInit{
  perguntas: any[] = [];

  registerperguntaForm!: FormGroup<RegisterPerguntaForm>;
  @ViewChild('RegisterfilialForm') RegisterPerguntaForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registerperguntaService: RegisterPerguntaService,
    private getperguntaService: GetPerguntaService
  ) 
  {
    this.registerperguntaForm = new FormGroup({
      texto: new FormControl('',[Validators.required, Validators.minLength(3)]),
   }); 
 }
 
 ngOnInit(): void {
  this.getperguntaService.getPerguntas().subscribe(
   perguntas => {
     this.perguntas = perguntas;
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
 this.registerperguntaForm.reset();
 }
 
 filterTable() {
 this.dt1.filterGlobal(this.inputValue, 'contains');
 }
 
 submit(){
   this.registerperguntaService.registerpergunta(
     this.registerperguntaForm.value.texto,
   ).subscribe({
     next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
     error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
   })
 }
 navigate(){
   this.router.navigate(["dashboard"])
 }

}
