import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { ModalService } from '../../lib/services';

@Component({
  selector: 'quali-acad-calendar-field',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input()
  public isRequired: boolean = false;
  @Input()
  public control: any;
  @Input()
  public label: string = '';
  @Input()
  public showCalendarOnFocus = true;
  @Input()
  public min?: any = DateTime.fromFormat('01/01/1900', 'dd/MM/yyyy').toJSDate();
  @Input()
  public max?: any = DateTime.now().startOf('day').plus({ years: 1 }).toJSDate();
  @Input()
  public disabledDates: Date[] = [];
  @Input()
  public disabled: boolean = false;
  @Input()
  public defaultDate: Date = DateTime.now().toJSDate();
  @Input()
  public hiddenErrorMessage: boolean = false;
  @Input()
  public showTime = false;
  @Input()
  public showSeconds = false;
  @Input()
  public stepMinute = 1;

  get placeholder() {
    if (!this.label) {
      return '';
    }
    return `${this.label}${this.isRequired ? '*' : ''}`;
  }

  public keyFilter = '';

  constructor(private modalService: ModalService) {}

  public fieldErrorLabel(): string {
    if (this.control && this.control.invalid && this.control.touched) {
      if (this.control.hasError('required')) {
        return 'Campo obrigatório';
      }

      if (this.control.hasError('maxlength')) {
        return `Tamanho máximo permitido: ${this.control.errors['maxlength'].requiredLength}`;
      }

      return 'Campo inválido';
    }

    return '';
  }

  public onShowCalendar() {
    this.modalService.showModalBackground$.next(true);
  }

  public onHideCalendar() {
    this.modalService.showModalBackground$.next(false);
  }
}
