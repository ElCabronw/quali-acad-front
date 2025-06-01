import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldErrorMessageComponent } from './field-error-message.component';

describe('FieldErrorMessageComponent', () => {
  let component: FieldErrorMessageComponent;
  let fixture: ComponentFixture<FieldErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldErrorMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
