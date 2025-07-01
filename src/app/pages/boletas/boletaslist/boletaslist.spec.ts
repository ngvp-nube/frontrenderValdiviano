import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boletaslist } from './boletaslist';

describe('Boletaslist', () => {
  let component: Boletaslist;
  let fixture: ComponentFixture<Boletaslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boletaslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Boletaslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
