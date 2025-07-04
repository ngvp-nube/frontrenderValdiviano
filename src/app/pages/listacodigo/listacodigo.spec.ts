import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listacodigo } from './listacodigo';

describe('Listacodigo', () => {
  let component: Listacodigo;
  let fixture: ComponentFixture<Listacodigo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listacodigo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listacodigo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
