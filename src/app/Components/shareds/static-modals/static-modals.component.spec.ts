import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticModalsComponent } from './static-modals.component';

describe('StaticModalsComponent', () => {
  let component: StaticModalsComponent;
  let fixture: ComponentFixture<StaticModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticModalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
