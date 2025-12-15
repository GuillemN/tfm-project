import { TestBed } from '@angular/core/testing';

import { UserItemStatusService } from './user-item-status.service';

describe('UserItemStatusService', () => {
  let service: UserItemStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserItemStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
