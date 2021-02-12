import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgInitComponent } from './ng-init.component';

describe('NgInitComponent', () => {
  let component: NgInitComponent;
  let fixture: ComponentFixture<NgInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgInitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
