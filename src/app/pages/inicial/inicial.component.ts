import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { UploadService } from '../../services/upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificacoesService } from '../../services/notifications/notificacoes.service';
import { UserService } from '../../services/users/user.service';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';



@Component({
  selector: 'app-inicial',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,
    RouterLink,DividerModule,FormsModule,MessagesModule,ToastModule
  ],
  providers: [MessageService,UploadService],
  templateUrl: './inicial.component.html',
  styleUrl: './inicial.component.scss'
})
export class InicialComponent implements OnInit {
  notificacoes: any[] = [];
  unreadCount: number = 0;
  messages: any[] = [];
  constructor(
    private msg: NzMessageService,
    private userService: UserService,
    private notificacoesService: NotificacoesService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {

    this.getUnreadCount();

    this.notificacoesService.getNotifications().subscribe(
      notificacoes => {
        this.notificacoes = notificacoes;
        this.updateMessages();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );


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
        console.log('Notificações marcadas como lidas!', data);
        this.getUnreadNotifications();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Todas as notificações foram marcadas como lidas!'
        });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após a exclusão
         }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      (error: any) => {
        console.error('Erro ao marcar notificações como lidas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao marcar todas as notificações como lidas.'
        });
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

  updateMessages(): void {
    this.unreadCount = this.notificacoes.length;
    this.messages = this.notificacoes.map(notificacao => ({
      severity: 'success',
      summary: notificacao.verb,
      detail: notificacao.description
    }));
  }
}

