import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Avaliado } from '../avaliado/avaliado.component';
import { Avaliador } from '../avaliador/avaliador.component';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { ConfirmDialog } from 'primeng/confirmdialog';

interface RegisterAssociacaoForm{
  avaliador: FormControl,
  avaliado: FormControl
}

@Component({
  selector: 'app-avaliadoravaliados',
  standalone: true,
  imports: [
    TabMenuModule,NzIconModule,NzLayoutModule,NzMenuModule,ConfirmDialog,
    ReactiveFormsModule,FormsModule,PickListModule,CommonModule,
    InputMaskModule,DividerModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService
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

  templateUrl: './avaliadoravaliados.component.html',
  styleUrl: './avaliadoravaliados.component.scss'
})
export class AvaliadorAvaliadosComponent implements OnInit {
  avaliadores: Avaliador [] = [];
  avaliados: Avaliado [] | undefined;
  targetAvaliados!: Avaliado[];
  originalAvaliadores: Avaliador[] = [];
  avaliadoresOriginais: any[] = [];
  avaliadoresavaliados: any[]=[]; 
  loading: boolean = true; 
  
  registerassociacaoForm!: FormGroup<RegisterAssociacaoForm>;
  @ViewChild('RegisterAssociacaoForm') RegisterAssociacaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private avaliadorService: AvaliadorService,
    private avaliadoService: AvaliadoService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private confirmationService: ConfirmationService
  )
  {
    this.registerassociacaoForm = new FormGroup({
      avaliador: new FormControl('',[Validators.required]),
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
     this.avaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
        //this.mapAvaliadores();
        this.loading = false;
      },
      error =>{
        console.error('Error fetching users:', error);
      },
     );
    }
    
    
    confirmRemoval(avaliador: Avaliador, avaliado: Avaliado): void {
      this.confirmationService.confirm({
        message: `Tem certeza de que deseja remover ${avaliado.nome} do avaliador ${avaliador.nome}?`,
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-info',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.removeAvaliado(avaliador, avaliado);
        }
      });
    }
  
    removeAvaliado(avaliador: Avaliador, avaliado: Avaliado): void {
      this.avaliadorService.removeAvaliado(avaliador.id, avaliado.id).subscribe(
        (updatedAvaliador) => {
          // Atualiza o formulário localmente
          const index = this.avaliadores.findIndex((f) => f.id === avaliador.id);
          if (index !== -1) {
            this.avaliadores[index] = updatedAvaliador;
          }
  
          // Exibe mensagem de sucesso
          this.messageService.add({
            severity: 'success',
            summary: 'Removido',
            detail: `${avaliado.nome} foi removido com sucesso.`
          });
  
          // Atualiza a tabela
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erro ao remover avaliado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível remover o avaliado. Tente novamente.'
          });
        }
      );
    }


    clearForm() {
    this.registerassociacaoForm.reset();
    }
    
 

    filterTable(): void {
      if (!this.avaliadoresOriginais.length) {
        this.avaliadoresOriginais = [...this.avaliadores]; // Garante que temos os dados originais
      }
    
      if (!this.inputValue || this.inputValue.trim() === '') {
        this.avaliadores = [...this.avaliadoresOriginais]; // Restaura os dados originais
        return;
      }
    
      const searchValue = this.inputValue.trim().toLowerCase();
    
      this.avaliadores = this.avaliadoresOriginais.filter(avaliador =>
        avaliador.avaliados.some((avaliado: { nome: string; }) =>
          avaliado.nome.toLowerCase().includes(searchValue)
        )
      );
    }
    
    submit() {
      this.registerassociacaoForm.patchValue({
        avaliado: this.targetAvaliados
      });
      const avaliadorId = this.registerassociacaoForm.value.avaliador.id;
    
      this.targetAvaliados.forEach(avaliado => {
        const idAvaliado = avaliado.id;
        this.avaliadorService.registerassociacao(avaliadorId, idAvaliado).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Avaliados associados ao avaliador com sucesso!' }),
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
