import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderFieldComponent } from './slider-field.component';

describe('SliderFieldComponent', () => {
  let component: SliderFieldComponent;
  let fixture: ComponentFixture<SliderFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
