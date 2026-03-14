import { TestBed } from '@angular/core/testing';

import { Carrinho } from './carrinho';

describe('Carrinho', () => {
  let service: Carrinho;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Carrinho);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
