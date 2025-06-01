import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'quali-acad-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrl: './slider-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SliderFieldComponent {
  @Input()
  public isRequired: boolean = false;
  @Input()
  public control: any;
  @Input()
  public label: string = '';
  @Input()
  public value: boolean | undefined = false;
  @Input()
  public groupName: string = '';
  @Input()
  public disabled = false;
  @Output()
  public valueChange = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {}
}
