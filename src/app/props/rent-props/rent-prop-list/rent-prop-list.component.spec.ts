import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentPropListComponent } from './rent-prop-list.component';

describe('RentPropListComponent', () => {
  let component: RentPropListComponent;
  let fixture: ComponentFixture<RentPropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentPropListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentPropListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
