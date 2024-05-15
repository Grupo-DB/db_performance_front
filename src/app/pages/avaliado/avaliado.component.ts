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
import { AreaService } from '../../services/areas/registerarea.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { GetAvaliadorService } from '../../services/avaliadores/getavaliador.service';
import { RegisterAvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { GetColaboradorService } from '../../services/colaboradores/get-colaborador.service';
import { UserService } from '../../services/users/user.service';
import { GetFormularioService } from '../../services/formularios/getformulario.service';
import { AvaliadoService } from '../../services/avaliados/avaliado.service';


interface RegisterAvaliadoForm{
  colaborador: FormControl,
  formulario: FormControl,
  avaliador: FormControl
}
interface Colaborador {
  nome: string
}
interface Formulario {
  nome: string
  perguntas: string
}
interface Avaliador {
  colaborador_nome: string
}

@Component({
  selector: 'app-avaliado',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,AreaService,
    GetCompanyService,GetFilialService
  ],
  templateUrl: './avaliado.component.html',
  styleUrl: './avaliado.component.scss'
})
export class AvaliadoComponent implements OnInit {
  colaboradores: Colaborador[]| undefined;
  formularios: Formulario[]| undefined;
  avaliadores: any[] = [];
  avaliados: any[] = [];
  registeravaliadoForm!: FormGroup<RegisterAvaliadoForm>;
  @ViewChild('RegisteravaliadoForm') RegisterAvaliadoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcolaboradorService: GetColaboradorService,
    private getformularioService: GetFormularioService,
    private avaliadoService: AvaliadoService,
    private getavaliadorService: GetAvaliadorService,
  )
  {
    this.registeravaliadoForm = new FormGroup({
      colaborador: new FormControl('',[Validators.required]),
      formulario: new FormControl('',[Validators.required]),
      avaliador: new FormControl('',[Validators.required]),
     }); 
   }

   ngOnInit(): void {

    this.getcolaboradorService.getColaboradores().subscribe(
      colaboradores => {
        this.colaboradores = colaboradores;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    //this.carregarAvaliadores();

    this.getavaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.getformularioService.getFormularios().subscribe(
      formularios =>{
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
  this.registeravaliadoForm.reset();
  }
  
  filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  // carregarAvaliadores() {
  //   this.getavaliadorService.getAvaliadores().subscribe(
  //     (data: any[]) => {
  //       this.avaliadores = data;
  //     },
  //     error => {
  //       console.error('Erro ao carregar avaliadores:', error);
  //     }
  //   );
  // }

  // onChangeAvaliador(idAvaliador: number) {
  //   if (idAvaliador) {
  //     this.getavaliadorService.getNomeColaborador(idAvaliador).subscribe(
  //       (colaborador: any) => {
  //         const nomeColaborador = colaborador.nome;  // Supondo que o nome está em 'nome'
  //         this.registeravaliadoForm.patchValue({ avaliador: nomeColaborador });
  //       },
  //       error => {
  //         console.error('Erro ao obter nome do colaborador:', error);
  //       }
  //     );
  //   } else {
  //     this.registeravaliadoForm.patchValue({ avaliador: '' });
  //   }
  // }

  submit(){
    const colaboradorId = this.registeravaliadoForm.value.colaborador.id;
    const formularioId = this.registeravaliadoForm.value.formulario.id;
    const avaliadorId = this.registeravaliadoForm.value.avaliador.id;
    this.avaliadoService.registeravaliado(
    colaboradorId,
    formularioId,
    avaliadorId  
    ).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
  
  
  navigate(){
    this.router.navigate(["dashboard"])
  }

}
