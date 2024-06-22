import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpsComponent } from './resetps.component';

describe('ResetpsComponent', () => {
  let component: ResetpsComponent;
  let fixture: ComponentFixture<ResetpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
