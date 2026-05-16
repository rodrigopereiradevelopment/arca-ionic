import { TestBed } from '@angular/core/testing';

import { Comparacao } from './comparacao';

describe('Comparacao', () => {
  let service: Comparacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comparacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
