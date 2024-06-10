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

interface RegisterAssociacaoForm{
  formulario: FormControl,
  avaliado: FormControl
}
@Component({
  selector: 'app-vincular',
  standalone: true,
  imports: [
    NzIconModule,NzLayoutModule,NzMenuModule,TabMenuModule,
    ReactiveFormsModule,FormsModule,PickListModule,
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
  formularios: Formulario[]|undefined;
  avaliados: Avaliado [] | undefined;
  targetAvaliados!: Avaliado[];
  vinculados: any[]=[]; 
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
  )
  {
    this.registerassociacaoForm = new FormGroup({
      formulario: new FormControl('',[Validators.required]),
      avaliado: new FormControl('',[Validators.required]), 
     }); 
   }

   ngOnInit(): void {
     this.targetAvaliados=[]
     this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
      },
      error =>{
        console.error('Error fetching users:', error);
      },
     );
     this.formularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
      },
      error =>{
        console.error('Error fetching users:', error);
      },
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
          
          next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
          error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
        });
      });
    }
}
