import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Puntoventa } from './puntoventa';

describe('Puntoventa', () => {
  let component: Puntoventa;
  let fixture: ComponentFixture<Puntoventa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Puntoventa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Puntoventa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
