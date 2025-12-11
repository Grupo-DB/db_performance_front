import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrocustopaiComponent } from './centrocustopai.component';

describe('CentrocustopaiComponent', () => {
  let component: CentrocustopaiComponent;
  let fixture: ComponentFixture<CentrocustopaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrocustopaiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentrocustopaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
