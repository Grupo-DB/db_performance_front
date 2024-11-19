import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home-orcamento',
  standalone: true,
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink
  ],
  templateUrl: './home-orcamento.component.html',
  styleUrl: './home-orcamento.component.scss'
})
export class HomeOrcamentoComponent {

  constructor(
  private  loginService: LoginService,
  ){}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 





}
