import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaContabilComponent } from './conta-contabil.component';

describe('ContaContabilComponent', () => {
  let component: ContaContabilComponent;
  let fixture: ComponentFixture<ContaContabilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaContabilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContaContabilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
