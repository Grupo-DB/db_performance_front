import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { Filial } from '../filial/filial.component';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { Empresa } from '../registercompany/registercompany.component';


interface RegisterAreaForm{
  empresa: FormControl,
  filial: FormControl
  nome: FormControl,
}
export interface Area {
  id: number;
  empresa: string,
  filial: string,
  nome: string,
  empresaNome?: string; // Propriedade opcional
  filialNome?: string; // Propriedade opcional
}

@Component({
  selector: 'app-area',
  standalone: true,
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,AreaService,ConfirmationService,
    FilialService,RegisterCompanyService,
  ]
})

export class AreaComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[] = [];

  empresaSelecionadaId: number | null = null;

  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registerareaForm!: FormGroup<RegisterAreaForm>;
  @ViewChild('RegisterfilialForm') RegisterAreaForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private areaService: AreaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService 
  )

  {
    this.registerareaForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
     });
     this.editForm = this.fb.group({
      id: [''],
      empresa: [''],
      filial: [''],
      nome: [''],
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

    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.areaService.getAreas().subscribe(
      (areas: Area[]) => {
        this.areas = areas;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
    // 
    //this.carregarAreas();
  }
  // carregarAreas() {
  //   this.areaService.getAreas().subscribe((areas: any[]) => {
  //     this.areas = areas;
  //     // Para cada área, buscar os nomes das empresas e filiais
  //     this.areas.forEach(area => {
  //       this.registercompanyService.getEmpresa(area.empresa).subscribe((empresa: any) => {
  //         area.empresaNome = empresa.nome; // Adiciona o nome da empresa ao objeto area
  //       });
  //       this.filialService.getFilial(area.filial).subscribe((filial: any) => {
  //         area.filialNome = filial.nome; // Adiciona o nome da filial ao objeto area
  //       });
  //     });
  //   });
  // }
  
   onEmpresaSelecionada(empresa: any): void {
    const id = empresa.id;
    if (id !== undefined) {
      console.log('Empresa selecionada ID:', id); // Log para depuração
      this.empresaSelecionadaId = id;
      this.filiaisByEmpresa();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  filiaisByEmpresa(): void {
    if (this.empresaSelecionadaId !== null) {
      this.filialService.getFiliaisByEmpresa(this.empresaSelecionadaId).subscribe(data => {
        this.filiais = data;
        console.log('Filiais carregadas:', this.filiais); // Log para depuração
      });
    }
  } 
  
clear(table: Table) {
  table.clear();
}

clearForm() {
  this.registerareaForm.reset();
}
cleareditForm() {
  this.editForm.reset();
}
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}
abrirModalEdicao(area: Area) {
  this.editFormVisible = true;
  this.editForm.patchValue({
    id: area.id,
    empresa: area.empresa,
    filial: area.filial,
    nome: area.nome,
  });
}
saveEdit() {
  const areaId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const filialId = this.editForm.value.filial.id;
  const dadosAtualizados: Partial<Area> = {
    nome: this.editForm.value.nome,
    empresa: empresaId,
    filial: filialId,
    };
  
  this.areaService.editArea(areaId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Area atualizada com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a Area.' });
    }
  });
}
excluirArea(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta area?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.areaService.deleteArea(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Area excluída com sucesso',life:4000 });
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
    const empresaId = this.registerareaForm.value.empresa.id;
    const filialId = this.registerareaForm.value.filial.id;
    this.areaService.registerarea(
      this.registerareaForm.value.nome, 
      empresaId,
      filialId,
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Area registrada com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }),
    })
  }

}
