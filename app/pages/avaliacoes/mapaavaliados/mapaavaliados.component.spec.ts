import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaavaliadosComponent } from './mapaavaliados.component';

describe('MapaavaliadosComponent', () => {
  let component: MapaavaliadosComponent;
  let fixture: ComponentFixture<MapaavaliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaavaliadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaavaliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
