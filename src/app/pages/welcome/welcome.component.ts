import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { UploadService } from '../../services/upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';




@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports:[
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink],
  providers: [MessageService,UploadService]
})
export class WelcomeComponent  {

  isCollapsed = false;
  


  constructor(
    private apiService: UploadService,
    private msg: NzMessageService
  ) {}

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