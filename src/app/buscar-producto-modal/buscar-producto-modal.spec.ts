import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProductoModal } from './buscar-producto-modal';

describe('BuscarProductoModal', () => {
  let component: BuscarProductoModal;
  let fixture: ComponentFixture<BuscarProductoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarProductoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarProductoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
