import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorProductos } from './mantenedor-productos';

describe('MantenedorProductos', () => {
  let component: MantenedorProductos;
  let fixture: ComponentFixture<MantenedorProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenedorProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
