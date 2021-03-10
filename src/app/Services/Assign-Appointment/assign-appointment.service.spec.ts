import { TestBed } from '@angular/core/testing';

import { AssignAppointmentService } from './assign-appointment.service';

describe('AssignAppointmentService', () => {
  let service: AssignAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
