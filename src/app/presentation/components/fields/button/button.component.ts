import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonType =
  | 'success'
  | 'success-outlined'
  | 'default'
  | 'default-filled'
  | 'default-outlined'
  | 'default-outlined-gray'
  | 'default-outlined-gray-icon-red'
  | 'default-outlined-gray-icon-gray'
  | 'cancel'
  | 'cancel-filled'
  | 'light-outline';

@Component({
  selector: 'quali-acad-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  public disabled = false;
  @Input()
  public label = '';
  @Input()
  public type: ButtonType = 'default';
  @Input()
  public leftIcon = '';
  @Input()
  public rightIcon = '';
  @Input()
  public noShadow = false;
  @Input()
  public round = false;
  @Input()
  public style: any = {};
  @Input()
  public loading: boolean = false;
  @Output()
  public onClick = new EventEmitter<any>();

  get styleClass() {
    return `button shadow-3 ${this.type} ${this.noShadow && 'no-shadow'}`;
  }
}
