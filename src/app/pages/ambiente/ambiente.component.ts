import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { AmbienteService } from '../../services/ambientes/ambiente.service';


interface RegisterAmbienteForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl
  nome: FormControl
}
export interface Ambiente{
  id: number;
  empresa: number;
  area: number;
  filial: number;
  setor: number;
  nome: string;
}

@Component({
  selector: 'app-ambiente',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    FilialService,
      MessageService,ConfirmationService,
      RegisterCompanyService,GetFilialService
  ],
  templateUrl: './ambiente.component.html',
  styleUrl: './ambiente.component.scss'
})
export class AmbienteComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  ambientes:Ambiente[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registerambienteForm!: FormGroup<RegisterAmbienteForm>;
  @ViewChild('RegisterAmbienteForm') RegisterAmbienteForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private setorService: SetorService,
    private areaService: AreaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private ambienteService: AmbienteService 
  )
  {
    this.registerambienteForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
      setor: new FormControl('',[Validators.required]),
   }); 
  }
  ngOnInit(): void {
    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.areaService.getAreas().subscribe(
      areas => {
        this.areas = areas;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  
    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.setorService.getSetores().subscribe(
      setores => {
        this.setores = setores;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.ambienteService.getAmbientes().subscribe(
      (ambientes: Ambiente[]) => {
        this.ambientes = ambientes;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  cleareditForm() {
    this.editForm.reset();
  }
  
  clear(table: Table) {
    table.clear();
  }
  
  clearForm() {
  this.registerambienteForm.reset();
  }
  
  filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
  }
  abrirModalEdicao(ambiente: Ambiente) {
    this.editFormVisible = true;
    this.editForm.patchValue({  
      id: ambiente.id,
      empresa: ambiente.empresa,
      filial: ambiente.filial,
      area: ambiente.area,
      setor: ambiente.setor,
      nome: ambiente.nome,
    });
  }
  saveEdit() {
    const ambienteId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa.id;
    const filialId = this.editForm.value.filial.id;
    const areaId = this.editForm.value.area.id;
    const setorId = this.editForm.value.setor.id
    const dadosAtualizados: Partial<Ambiente> = {
      empresa: empresaId,
      filial: filialId,
      area: areaId,
      setor: setorId,
      nome: this.editForm.value.nome,
    };
    
    this.setorService.editSetor(ambienteId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Ambiente atualizado com sucesso!' });
        setTimeout(() => {
         window.location.reload(); // Atualiza a página após a exclusão
        }, 2000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar o setor.' });
      }
    });
  }
  excluirAmbiente(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este Ambiente?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.setorService.deleteSetor(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ambiente excluído com sucesso',life:4000 });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a exclusão
          }, 2000); // Tempo em milissegundos (1 segundo de atraso)
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 3000 });
      }
    });
  }
  submit(){
    const empresaId = this.registerambienteForm.value.empresa.id;
    const filialId = this.registerambienteForm.value.filial.id;
    const areaId = this.registerambienteForm.value.area.id;
    const setorId = this.registerambienteForm.value.setor.id;
    this.ambienteService.registerAmbiente( 
      empresaId,
      filialId,
      areaId,
      setorId,
      this.registerambienteForm.value.nome,
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Setor registrado com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }

}
