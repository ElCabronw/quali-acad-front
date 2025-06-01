import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentType, ListItem } from '../../../components/lib/models';

import { MaskUtil } from '../../../components/lib/utils';

@Component({
  selector: 'quali-acad-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TextFieldComponent implements OnInit, OnDestroy {
  @Input()
  public isRequired: boolean = false;
  @Input()
  public label: string = '';
  @Input()
  public maxlength: string = '';
  @Input()
  public isPassword = false;
  @Input()
  public numeric = false;
  @Input()
  public numericPositive = false;
  @Input()
  public numericDotComma = false;
  @Input()
  public decimal = false;
  @Input()
  public onlyText = false;
  @Input()
  public alphaNumeric = false;
  @Input()
  public alphaNumericAndWhitespace = false;
  @Input()
  public mask?: string;
  @Input()
  public autoClear = true;
  @Input()
  public readonly = false;
  @Input()
  public rightIcon = '';
  @Input()
  public centered = false;
  @Input()
  public enableDocumentTypeChoice = false;
  @Input()
  public hiddenErrorMessage: boolean = false;
  @Input()
  public leftLabel?: string;
  @Input()
  set control(_control: any) {
    this._control = _control;
    if (this.enableDocumentTypeChoice) {
      this.handleInitialDocumentTypeState();
    }

    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
      this.controlSubscription = new Subscription();
    }
    this.controlSubscription.add(
      this.control.valueChanges.subscribe((value: string) => {
        if (this.enableDocumentTypeChoice && !this.lastTypedValue && value?.length > 11) {
          this.handleInitialDocumentTypeState();
        }
        this.lastTypedValue = value;
      })
    );
  }
  @Input()
  public inputId?: string;
  @Input()
  public slotChar = '_';
  @Output()
  public blurEvent = new EventEmitter();
  @Output()
  public enterKeyPress = new EventEmitter();
  @Output()
  public backSpaceKeyPress = new EventEmitter();
  @Output()
  public focusEvent = new EventEmitter();
  @Output()
  public onDocumentTypeChange = new EventEmitter<ListItem>();

  public isPasswordVisible = false;
  public validateOnly = false;

  get placeholder() {
    if (!this.label) {
      return '';
    }
    return `${this.label}${this.isRequired ? '*' : ''}`;
  }

  get keyfilter() {
    this.validateOnly = false;
    if (this.numeric) {
      return 'int';
    }
    if (this.numericPositive) {
      return 'pint';
    }
    if (this.decimal) {
      this.validateOnly = true;
      return /^(\d+(?:[\,]\d{2})?)$/;
    }
    if (this.onlyText) {
      this.validateOnly = true;
      return /^[a-zA-ZÀ-ú\s]*$/gm;
    }
    if (this.alphaNumeric) {
      return 'alphanum';
    }
    if (this.alphaNumericAndWhitespace) {
      return /^[A-Za-zÀ-ú0-9 ]*$/gm;
    }
    if (this.numericDotComma) {
      return 'money';
    }
    return /[\s\S]*/;
  }

  get control() {
    return this._control;
  }

  get showPasswordIcon() {
    return this.isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  public documentTypes: ListItem[] = [
    {
      name: 'CPF',
      code: DocumentType.CPF,
    },
    {
      name: 'CNPJ',
      code: DocumentType.CNPJ,
    },
  ];

  public selectedDocumentType = this.documentTypes[1];

  private lastBlurValue = '';
  private lastTypedValue = '';
  private subscription = new Subscription();
  private controlSubscription = new Subscription();
  private _control: any;

  ngOnInit() {
    if (this.enableDocumentTypeChoice) {
      this.setDocumentType(this.selectedDocumentType.code);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.controlSubscription.unsubscribe();
  }

  public onBlur() {
    this.control.markAsTouched();
    if (this.lastBlurValue !== this.control.value) {
      this.lastBlurValue = this.control.value;
      setTimeout(() => {
        this.blurEvent.emit(this.control.value);
      });
    }
  }

  public onEnterPress() {
    this.onBlur();
    this.enterKeyPress.emit();
  }
  public onBackSpacePress() {
    this.onBlur();
    this.backSpaceKeyPress.emit();
  }

  public onFocus($event: Event) {
    const target = $event.target as HTMLInputElement;
    if (this.mask) {
      const firstUnderscore = target?.value.indexOf('_');
      const selectionIndex = (firstUnderscore >= 0 ? firstUnderscore : target?.value.length) || 0;
      target?.setSelectionRange(selectionIndex, selectionIndex);
    }
    this.focusEvent.emit(target?.value);
  }

  public toggleShowPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public handleDocumentTypeChange() {
    if (this.selectedDocumentType.code === DocumentType.CNPJ) {
      this.setDocumentType(DocumentType.CPF);
    } else {
      this.setDocumentType(DocumentType.CNPJ);
    }
  }

  private handleInitialDocumentTypeState() {
    if (this.control?.value) {
      if (this.control.value.length === 11) {
        this.setDocumentType(DocumentType.CPF);
      } else {
        this.setDocumentType(DocumentType.CNPJ);
      }
    } else {
      this.setDocumentType(DocumentType.CPF);
    }
  }

  private setDocumentType(documentType: DocumentType) {
    switch (documentType) {
      case DocumentType.CNPJ:
        this.selectedDocumentType = this.documentTypes[1];
        this.mask = MaskUtil.CNPJ_TEXT_FIELD_PATTERN;
        break;
      case DocumentType.CPF:
        this.selectedDocumentType = this.documentTypes[0];
        this.mask = MaskUtil.CPF_TEXT_FIELD_PATTERN;
        break;
    }
    this.onDocumentTypeChange.emit(this.selectedDocumentType);
  }
}
