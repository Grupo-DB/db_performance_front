import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [DialogModule,ConfirmDialogModule],
  providers:[MessageService,ConfirmationService],
  templateUrl: './termos.component.html',
  styleUrl: './termos.component.scss'
})
export class TermosComponent implements OnInit {
  display: boolean = true;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.checkTerms();
  }
  checkTerms() {
    if (localStorage.getItem('termsAccepted') === 'true') {
      this.display = false;
    }
  }

  acceptTerms() {
    localStorage.setItem('termsAccepted', 'true');
    this.display = false;
  }

}
