import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Filial } from '../filial/filial.component';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { Empresa } from '../registercompany/registercompany.component';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { SelectModule } from 'primeng/select';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';

interface RegisterAreaForm{
  empresa: FormControl,
  filial: FormControl
  nome: FormControl,
}
export interface Area {
  id: number;
  empresa: number,
  filial: number,
  nome: string,
  
}

@Component({
  selector: 'app-area',
  standalone: true,
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,FloatLabelModule,
    TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,AreaService,ConfirmationService,
    FilialService,RegisterCompanyService,
  ],
  animations:[
              trigger('efeitoFade',[
                      transition(':enter',[
                        style({ opacity: 0 }),
                        animate('2s', style({ opacity:1 }))
                      ])
                    ]),
                    trigger('efeitoZoom', [
                      transition(':enter', [
                        style({ transform: 'scale(0)' }),
                        animate('2s', style({ transform: 'scale(1)' })),
                      ]),
                    ]),
                    trigger('bounceAnimation', [
                      transition(':enter', [
                        animate('4.5s ease-out', keyframes([
                          style({ transform: 'scale(0.5)', offset: 0 }),
                          style({ transform: 'scale(1.2)', offset: 0.5 }),
                          style({ transform: 'scale(1)', offset: 1 }),
                        ])),
                      ]),
                    ]),
                    trigger('swipeAnimation', [
                      transition(':enter', [
                        style({ transform: 'translateX(-100%)' }),
                        animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
                      ]),
                      transition(':leave', [
                        style({ transform: 'translateX(0)' }),
                        animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
                      ]),
                    ]),
                    trigger('swipeAnimationReverse', [
                      transition(':enter', [
                        style({ transform: 'translateX(100%)' }),
                        animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
                      ]),
                      transition(':leave', [
                        style({ transform: 'translateX(0)' }),
                        animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
                      ]),
                    ]),
            ],
})

export class AreaComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: any[] = [];
  loading: boolean = true;
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
    private confirmationService: ConfirmationService,
    private loginService: LoginService 
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

      this.registercompanyService.getCompanys().subscribe(
        empresas => {
          this.empresas = empresas;
          this.mapEmpresas();
          console.log();
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
    
  }
  
  mapEmpresas() {
    this.areas.forEach(area => {
      const empresa = this.empresas?.find(empresa => empresa.id === area.empresa);
      if (empresa) {
        area.empresaNomes = empresa.nome;
      }
    });
    this.loading = false;
  }
  mapFiliais() {
    this.areas.forEach(area => {
      const filial = this.filiais?.find(filial => filial.id === area.filial);
      if (filial) {
        area.filialNome = filial.nome;
      }
    });
    this.loading = false;
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
  
  getNomeEmpresa(id: number): string {
    const empresa = this.empresas?.find(emp => emp.id === id);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  }
  getNomeFilial(id: number): string {
    const filial = this.filiais?.find(fil => fil.id === id);
    return filial ? filial.nome : 'Filial não encontrada';
  }


clear(table: Table) {
  table.clear();
}

clearForm() {
  this.registerareaForm.reset();
}
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
  }
cleareditForm() {
  this.editForm.reset();
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
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Área atualizada com sucesso!' });
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
excluirArea(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta área?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.areaService.deleteArea(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Área excluída com sucesso!!', life: 1000 });
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
    const empresaId = this.registerareaForm.value.empresa.id;
    const filialId = this.registerareaForm.value.filial.id;
    this.areaService.registerarea(
      this.registerareaForm.value.nome, 
      empresaId,
      filialId,
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Área registrada com sucesso!' });
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
