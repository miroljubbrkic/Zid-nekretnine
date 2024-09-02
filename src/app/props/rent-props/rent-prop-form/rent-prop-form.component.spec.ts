import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentPropFormComponent } from './rent-prop-form.component';

describe('RentPropFormComponent', () => {
  let component: RentPropFormComponent;
  let fixture: ComponentFixture<RentPropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentPropFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentPropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
