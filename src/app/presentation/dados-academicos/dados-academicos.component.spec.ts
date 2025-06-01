import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAcademicosComponent } from './dados-academicos.component';

describe('DadosAcademicosComponent', () => {
  let component: DadosAcademicosComponent;
  let fixture: ComponentFixture<DadosAcademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosAcademicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
