import { TestBed } from '@angular/core/testing';

import { TransfertService } from './transfert.service';

describe('TransfertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransfertService = TestBed.get(TransfertService);
    expect(service).toBeTruthy();
  });
});
