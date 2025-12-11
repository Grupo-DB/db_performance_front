import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliadorComponent } from './avaliador.component';

describe('AvaliadorComponent', () => {
  let component: AvaliadorComponent;
  let fixture: ComponentFixture<AvaliadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
