import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoAmostraComponent } from './produto-amostra.component';

describe('ProdutoAmostraComponent', () => {
  let component: ProdutoAmostraComponent;
  let fixture: ComponentFixture<ProdutoAmostraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoAmostraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoAmostraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
