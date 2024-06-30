import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { AreaService } from '../../services/areas/registerarea.service';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../services/login/login.service';
interface RegisterSetorForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  nome: FormControl
}
export interface Setor {
  id: number;
  empresa: number;
  area: number;
  filial: number;
  nome: string;
}

@Component({
  selector: 'app-setor',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    FilialService,
      MessageService,ConfirmationService,
      RegisterCompanyService,GetFilialService
  ],
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.scss'
})

export class SetorComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: any[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  loading: boolean = true;
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  inputValue: string = '';
  registersetorForm!: FormGroup<RegisterSetorForm>;
  @ViewChild('RegisterfilialForm') RegisterSetorForm: any;
  @ViewChild('dt1') dt1!: Table;
  

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private setorService: SetorService,
    private areaService: AreaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginService: LoginService
    
  )
  {
    this.registersetorForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
   }); 
   this.editForm = this.fb.group({
    id: [''],
    empresa: [''],
    filial: [''],
    area:[''],
    nome: [''],
   }); 
 }

 hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
} 

 ngOnInit(): void {

  this.loading = false;

  this.filialService.getFiliais().subscribe(
    filiais => {
      this.filiais = filiais;
      this.mapFiliais();
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.areaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
      this.mapAreas();
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.registercompanyService.getCompanys().subscribe(
    empresas => {
      this.empresas = empresas;
      this.mapEmpresas();
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.setorService.getSetores().subscribe(
    (setores: Setor[]) => {
      this.setores = setores;
    },
    error => {
      console.error('Error fetching companies:', error);
    }
  );
}

mapEmpresas() {
  this.setores.forEach(setor => {
    const empresa = this.empresas?.find(empresa => empresa.id === setor.empresa);
    if (empresa) {
      setor.empresaNome = empresa.nome;
    }
  });
  this.loading = false;
}
mapFiliais() {
  this.setores.forEach(setor => {
    const filial = this.filiais?.find(filial => filial.id === setor.filial);
    if (filial) {
      setor.filialNome = filial.nome;
    }
  });
  this.loading = false;
}
mapAreas() {
  this.setores.forEach(setor => {
    const area = this.areas?.find(area => area.id === setor.area);
    if (area) {
      setor.areaNome = area.nome;
    }
  });
  this.loading = false;
}


getNomeEmpresa(id: number): string {
  const empresa = this.empresas?.find(emp => emp.id === id);
  return empresa ? empresa.nome : 'Empresa não encontrada';
}
getNomeFilial(id: number): string {
  const filial = this.filiais?.find(fil => fil.id === id);
  return filial ? filial.nome : 'Filial não encontrada';
}
getNomeArea(id: number): string {
  const area = this.areas?.find(are => are.id === id);
  return area ? area.nome : 'Area não encontrada';
}

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
onFilialSelecionada(filial: any): void {
  const id = filial.id;
  if (id !== undefined) {
    console.log('Filial selecionada ID:', id); // Log para depuração
    this.filialSelecionadaId = id;
    this.areasByFilial();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
areasByFilial(): void {
  if (this.filialSelecionadaId !== null) {
    this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
      this.areas = data;
      console.log('Areas carregadas:', this.areas); // Log para depuração
    });
  }
} 
cleareditForm() {
  this.editForm.reset();
}

clear(table: Table) {
  table.clear();
}

clearForm() {
this.registersetorForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
console.log();
}
abrirModalEdicao(setor: Setor) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: setor.id,
    nome: setor.nome,
    empresa: setor.empresa,
    filial: setor.filial,
    area: setor.area,
   
  });
}

saveEdit() {
  const setorId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const filialId = this.editForm.value.filial.id;
  const areaId = this.editForm.value.area.id;
  const dadosAtualizados: Partial<Setor> = {
    nome: this.editForm.value.nome,
    empresa: empresaId,
    filial: filialId,
    area: areaId,    
  };
  
  this.setorService.editSetor(setorId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Setor atualizado com sucesso!' });
      setTimeout(() => {
       window.location.reload(); // Atualiza a página após a exclusão
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: (err) => {
      console.error('Login error:', err); 
    
      if (err.status === 401) {
        this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
      } else if (err.status === 403) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
      } else if (err.status === 400) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
      } 
  }
  });
}

excluirSetor(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este setor?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.setorService.deleteSetor(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Setor excluído com sucesso!!', life: 1000 });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após a exclusão
          }, 1000); // Tempo em milissegundos (1 segundo de atraso)
        },
        error: (err) => {
          if (err.status === 403) {
            this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
          } 
        }
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
    }
  });
}

submit(){
  const empresaId = this.registersetorForm.value.empresa.id;
  const filialId = this.registersetorForm.value.filial.id;
  const areaId = this.registersetorForm.value.area.id;
  this.setorService.registersetor(
    this.registersetorForm.value.nome, 
    empresaId,
    filialId,
    areaId
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Setor registrado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após o registro
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: (err) => {
      console.error('Login error:', err); 
    
      if (err.status === 401) {
        this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
      } else if (err.status === 403) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
      } else if (err.status === 400) {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, tente novamente.' });
      } 
  }
  });
}

}
