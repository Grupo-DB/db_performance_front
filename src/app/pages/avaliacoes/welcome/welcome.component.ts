import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuDividerDirective, NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '../../../services/avaliacoesServices/upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { Empresa } from '../registercompany/registercompany.component';
import { Filial } from '../filial/filial.component';
import { UserService } from '../../../services/avaliacoesServices/users/user.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NotificacoesService } from '../../../services/avaliacoesServices/notifications/notificacoes.service'; 


@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports:[
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,DividerModule,FormsModule],
  providers: [MessageService,UploadService]
})
export class WelcomeComponent implements OnInit,OnDestroy  {

  isCollapsed = false;
  empresas:Empresa[]|undefined;
  filiais: Filial[]| undefined;
  hoje: number = Date.now();
  colaborador: any;
  notificacoes: any[] = [];
  unreadCount: number = 0;
  subject: any;
  message: any;
  recipient_list: any;
  private intervalId: any;
  isLoading: boolean = true;

  constructor(
    private apiService: UploadService,
    private loginService: LoginService,
    private colaboradorService: ColaboradorService,
    private filialService: FilialService,
    private registercompanyService:RegisterCompanyService,
    private msg: NzMessageService,
    private userService: UserService,
    private notificacoesService: NotificacoesService
  ) {}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  } 
  
  ngOnInit(): void {
    
    this.getColaboradorInfo();
    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
        setTimeout(() => {
          this.isLoading = false; // Defina como false após o tempo de atraso
        }, 3200); // Tempo de atraso em milissegundos (2 segundos)
      },
      error => {
        console.error('Error fetching users:',error);
        setTimeout(() => {
          this.isLoading = false; // Defina como false após o tempo de atraso
        }, 3200); // Tempo de atraso em milissegundos (2 segundos)
      }
    );

    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.startClock();

    this.getUnreadCount();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startClock(): void {
    this.intervalId = setInterval(() => {
      this.hoje = Date.now();
    }, 1000); // Atualiza a cada segundo
  }


  getUnreadNotifications(): void {
    this.notificacoesService.getUnreadNotifications().subscribe(
      (data: any) => {
        this.notificacoes = data;
      },
      (error: any) => {
        console.error('Erro ao buscar notificações não lidas:', error);
      }
    );
  }

  markAllAsRead(): void {
    this.notificacoesService.markAllAsRead().subscribe(
      (data: any) => {
        console.log('Notificações marcadas como lidas:', data);
        this.getUnreadNotifications();
        
      },
      (error: any) => {
        console.error('Erro ao marcar notificações como lidas:', error);
      }
    );
  }

  getUnreadCount(): void {
    this.notificacoesService.getUnreadCount().subscribe(
      (data: any) => {
        this.unreadCount = data.unread_count;
      },
      (error: any) => {
        console.error('Erro ao contar notificações não lidas:', error);
      }
    );
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
      
    }
  }

  logout() {
    this.loginService.logout();
  }

  getColaboradorInfo(): void {
    this.colaboradorService.getColaboradorInfo().subscribe(
      data => {
        this.colaborador = data;
      },
      error => {
        console.error('Erro ao obter informações do colaborador:', error);
        this.colaborador = null; // Garanta que avaliador seja null em caso de erro
      }
    );
  }

  getNomeEmpresa(id: number): string {
    const empresa = this.empresas?.find(emp => emp.id === id);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  }
  getNomeFilial(id: number): string {
    const filial = this.filiais?.find(fil => fil.id === id);
    return filial ? filial.nome : 'Filial não encontrada';
  }


  sendEmail() {
    this.userService.sendEmail(this.subject, this.message, this.recipient_list).subscribe(
      response => {
        console.log('Email sent successfully', response);
      },
      error => {
        console.error('Error sending email', error);
      }
    );
  }



}