import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefinirSenhaComponent } from './redefinirsenha.component';

describe('RedefinirsenhaComponent', () => {
  let component: RedefinirSenhaComponent;
  let fixture: ComponentFixture<RedefinirSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedefinirSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedefinirSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
