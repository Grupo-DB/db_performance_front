import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { RegisterTipoAvaliacaoService } from '../../services/tipoavaliacoes/registertipoavaliacao.service';
import { GetTipoAvalicaoService } from '../../services/tipoavaliacoes/gettipoavaliacao.service';

interface RegisterTipoAvaliacaoForm{
  nome: FormControl,
}

@Component({
  selector: 'app-tipoavaliacao',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './tipoavaliacao.component.html',
  styleUrl: './tipoavaliacao.component.scss'
})
export class TipoAvaliacaoComponent implements OnInit {
  tipoavaliacoes: any[] = [];

  registertipoavaliacaoForm!: FormGroup<RegisterTipoAvaliacaoForm>;
  @ViewChild('RegisterfilialForm') RegisterTipoAvaliacaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registertipoavaliacaoService: RegisterTipoAvaliacaoService,
    private gettipoavalicaoService: GetTipoAvalicaoService
  )    
  {
    this.registertipoavaliacaoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
   }); 
 }
 ngOnInit(): void {
 this.gettipoavalicaoService.getTipoavaliacoes().subscribe(
  tipoavaliacoes => {
    this.tipoavaliacoes = tipoavaliacoes;
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
this.registertipoavaliacaoForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  this.registertipoavaliacaoService.registertipoavaliacao(
    this.registertipoavaliacaoForm.value.nome,
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}
navigate(){
  this.router.navigate(["dashboard"])
}
}