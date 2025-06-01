import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAcademicosViewComponent } from './dados-academicos-view.component';

describe('DadosAcademicosViewComponent', () => {
  let component: DadosAcademicosViewComponent;
  let fixture: ComponentFixture<DadosAcademicosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosAcademicosViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosAcademicosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
