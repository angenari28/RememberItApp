import { TestBed } from '@angular/core/testing';

import { RememberDbService } from './remember.db.service';

describe('RememberDbService', () => {
  let service: RememberDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RememberDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
