import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { TipoAvaliacao } from '../tipoavaliacao/tipoavaliacao.component';
import { Avaliado } from '../avaliado/avaliado.component';
import { AvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { AvaliadoService } from '../../services/avaliados/avaliado.service';
import { TipoAvaliacaoService } from '../../services/tipoavaliacoes/registertipoavaliacao.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { Divider, DividerModule } from 'primeng/divider';
import { Formulario } from '../formulario/formulario.component';
import { FormularioService } from '../../services/formularios/registerformulario.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login/login.service';

interface RegisterAssociacaoForm{
  formulario: FormControl,
  avaliado: FormControl
}
@Component({
  selector: 'app-vincular',
  standalone: true,
  imports: [
    NzIconModule,NzLayoutModule,NzMenuModule,TabMenuModule,
    ReactiveFormsModule,FormsModule,PickListModule,CommonModule,
    FormLayoutComponent,InputMaskModule,DividerModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,
  ],
  providers:[
    MessageService,
  ],
  templateUrl: './vincular.component.html',
  styleUrl: './vincular.component.scss'
})
export class VincularComponent implements OnInit {
  tipoavaliacoes: TipoAvaliacao[]|undefined;
  formularios: Formulario [] = [];
  avaliados: Avaliado [] | undefined;
  targetAvaliados!: Avaliado[];
  vinculados: any[]=[];
  loading: boolean = true; 
  registerassociacaoForm!: FormGroup<RegisterAssociacaoForm>;
  @ViewChild('RegisterAssociacaoForm') RegisterAssociacaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private formularioService: FormularioService,
    private avaliadoService: AvaliadoService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService
  )
  {
    this.registerassociacaoForm = new FormGroup({
      formulario: new FormControl('',[Validators.required]),
      avaliado: new FormControl('',[Validators.required]), 
     }); 
   }

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

   ngOnInit(): void {
     this.targetAvaliados=[]
     this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
        this.loading = false;
      },
      error =>{
        console.error('Error fetching users:', error);
      },
     );
     this.formularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
        this.mapFormularios();
        this.loading = false;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    }

    mapFormularios(): void {
      this.formularios.forEach(formulario => {
        const perguntasTexto = formulario.perguntas.map(pergunta => pergunta.texto).join(', ');
        formulario.perguntasTexto = perguntasTexto;
      });
    }
    
    removeAvaliado(formulario: Formulario, avaliado: Avaliado): void {
      this.formularioService.removeAvaliado(formulario.id, avaliado.id).subscribe(
        updatedFormulario => {
          // Atualiza o formulário localmente
          const index = this.formularios.findIndex(f => f.id === formulario.id);
          if (index !== -1) {
            this.formularios[index] = updatedFormulario;
            this.mapFormularios(); // Atualiza o texto das perguntas
          }
        },
        error => {
          console.error('Erro ao remover avaliado:', error);
        }
      );
    }

    clear(table: Table) {
      table.clear();
    }
    
    clearForm() {
    this.registerassociacaoForm.reset();
    }
    
    filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
    }
    
    submit() {
      this.registerassociacaoForm.patchValue({
        avaliado: this.targetAvaliados
      });
      const formularioId = this.registerassociacaoForm.value.formulario.id;
    
      this.targetAvaliados.forEach(avaliado => {
        const idAvaliado = avaliado.id;
        this.formularioService.registerassociacao(formularioId, idAvaliado).subscribe({  
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Avaliados associados ao formulário com sucesso!' }),
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após o registro
            }, 1000);
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
      });
    }
}
