import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaavaliadoresComponent } from './mapaavaliadores.component';

describe('MapaavaliadoresComponent', () => {
  let component: MapaavaliadoresComponent;
  let fixture: ComponentFixture<MapaavaliadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaavaliadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaavaliadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
