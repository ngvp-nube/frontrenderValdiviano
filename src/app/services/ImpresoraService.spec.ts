import { TestBed } from '@angular/core/testing';

import { QzService } from '../services/ImpresoraService';

describe('QzService', () => {
  let service: QzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
