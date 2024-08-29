import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateuserComponent } from './CreateuserComponent';

describe('LoginComponent', () => {
  let component: CreateuserComponent;
  let fixture: ComponentFixture<CreateuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
