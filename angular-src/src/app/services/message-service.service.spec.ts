import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message-service.service';

describe('MessageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
  });

  it('should be created', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));
});
