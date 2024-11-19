import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrocustoComponent } from './centrocusto.component';

describe('CentrocustoComponent', () => {
  let component: CentrocustoComponent;
  let fixture: ComponentFixture<CentrocustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrocustoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentrocustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
