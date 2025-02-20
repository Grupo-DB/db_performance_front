import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriospdfComponent } from './relatoriospdf.component';

describe('RelatoriospdfComponent', () => {
  let component: RelatoriospdfComponent;
  let fixture: ComponentFixture<RelatoriospdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatoriospdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatoriospdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
