import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustoproducaoComponent } from './custoproducao.component';

describe('CustoproducaoComponent', () => {
  let component: CustoproducaoComponent;
  let fixture: ComponentFixture<CustoproducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustoproducaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustoproducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
