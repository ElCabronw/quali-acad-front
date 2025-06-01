import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'quali-acad-field-error-message',
  templateUrl: './field-error-message.component.html',
  styleUrls: ['./field-error-message.component.scss'],
})
export class FieldErrorMessageComponent implements OnInit {
  @Input()
  public control: any;
  constructor() {}

  ngOnInit(): void {}

  public fieldErrorLabel(): string {
    if (this.control && this.control.invalid && this.control.touched) {
      if (this.control.hasError('required')) {
        return 'Campo obrigatório';
      }

      if (this.control.hasError('minlength')) {
        return `Tamanho mínimo: ${this.control.errors['minlength'].requiredLength}`;
      }

      if (this.control.hasError('maxlength')) {
        return `Tamanho máximo permitido: ${this.control.errors['maxlength'].requiredLength}`;
      }

      return typeof this.control.errors['invalid'] === 'string' ? this.control.errors['invalid'] : 'Campo inválido';
    }

    return '';
  }
}
