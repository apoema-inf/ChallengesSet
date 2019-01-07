import { TestBed } from '@angular/core/testing';

import { DesafiosService } from './desafios.service';

describe('DesafiosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesafiosService = TestBed.get(DesafiosService);
    expect(service).toBeTruthy();
  });
});
