import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuDividerDirective, NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '../../services/upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../services/login/login.service';
import { ColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { Empresa } from '../registercompany/registercompany.component';
import { Filial } from '../filial/filial.component';




@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports:[
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,DividerModule],
  providers: [MessageService,UploadService]
})
export class WelcomeComponent implements OnInit  {

  isCollapsed = false;
  empresas:Empresa[]|undefined;
  filiais: Filial[]| undefined;
  hoje: number = Date.now();
  colaborador: any;
  constructor(
    private apiService: UploadService,
    private loginService: LoginService,
    private colaboradorService: ColaboradorService,
    private filialService: FilialService,
    private registercompanyService:RegisterCompanyService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getColaboradorInfo();
    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching users:',error);
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

  // async onUpload($event: FileUploadEvent) {

  //   const promises: any[] = [];
  //   $event.files.forEach(file => promises.push(this.apiService.upload));
  //   const observable = forkJoin([promises]);
  //   observable.subscribe({
  //     next: value => console.log(value),
  //     complete: () => console.log('all done')
  //   })

  // }
}