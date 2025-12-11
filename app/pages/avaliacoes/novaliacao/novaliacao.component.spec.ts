import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaliacaoComponent } from './novaliacao.component';

describe('NovaliacaoComponent', () => {
  let component: NovaliacaoComponent;
  let fixture: ComponentFixture<NovaliacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaliacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NovaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
