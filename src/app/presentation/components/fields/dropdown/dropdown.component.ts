import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListItem } from '../../lib/models';
import { BaseDropdown } from '../../lib/services';
import { ObjectUtil } from '../../lib/utils';

export type DropdownButtonAction = {
  label: string;
  onClick: (value: any) => void;
};

@Component({
  selector: 'quali-acad-dropdown-field',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropDownComponent implements OnInit, OnDestroy {
  @Input()
  set options(_options: ListItem[]) {
    this._options = _options;
    this.pagedSuggestions = this.options || [];
  }
  @Input()
  public isNgContent = false;
  @Input()
  public forceSelection = true;
  @Input()
  public isRequired: boolean | undefined = false;
  @Input()
  set control(_control: any) {
    this._control = _control;
    if (this.control) {
      this.subscription.add(
        this.control.valueChanges.subscribe(() => {
          this.setControlValueFromSuggestions();
        })
      );
    }
  }
  @Input()
  public label: string = '';
  @Input()
  public service: BaseDropdown | undefined;
  @Input()
  public paged = true;
  @Input()
  public buttonAction: DropdownButtonAction | undefined;
  @Input()
  public dependencies: any;
  @Input()
  public hiddenErrorMessage: boolean = false;
  @Input()
  public dynamicFilters?: ListItem[];
  @Input()
  public minLengthToService: number = 0;
  @Input()
  public initialLoad = true;
  @Input()
  public disabled = false;
  @Input()
  public limitScrollPage: number = 20;
  @Input()
  public inputId?: string;
  @Output()
  public onFocus = new EventEmitter();
  @Output()
  public onChange = new EventEmitter();

  get control() {
    return this._control;
  }

  get options() {
    return this._options;
  }

  get placeholder() {
    if (!this.label) {
      return '';
    }
    return `${this.label}${this.isRequired ? '*' : ''}`;
  }

  public pagedSuggestions: ListItem[] = [];
  public unlistenAutocompleteVirtualScroll = () => {};
  public selectedDynamicFilter: any = this.dynamicFilters ? this.dynamicFilters[0].code : undefined;

  private _control: any;
  private _options: any[] = [];
  private currentScrollPage = -1;
  private currentScrollIndex = 0;
  private subscription = new Subscription();
  private currentSearchQuery = '';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.control && this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
    if (this.initialLoad) {
      this.search(null, true);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.unlistenAutocompleteVirtualScroll) {
      this.unlistenAutocompleteVirtualScroll();
    }
  }

  public fieldErrorLabel(): string {
    if (this.control?.invalid && this.control.touched) {
      if (this.control.hasError('required')) {
        return 'Campo obrigatório';
      }

      return this.control?.errors && typeof this.control.errors['invalid'] === 'string'
        ? this.control?.errors['invalid']
        : 'Campo inválido';
    }

    return '';
  }

  public search($event?: any, forceSearch = false): void {
    this.currentSearchQuery = $event?.query.toUpperCase() || '';
    this.currentScrollPage = -1;
    this.currentScrollIndex = 0;
    if (forceSearch || this.currentSearchQuery.length >= this.minLengthToService) {
      this.pageResults();
    } else {
      this.pagedSuggestions = [];
    }
  }

  public onOpenAutocompletePanel(): void {
    const autocompletePanel = document.querySelector('.p-autocomplete-panel');
    if (autocompletePanel && this.paged && this.currentSearchQuery.length >= this.minLengthToService) {
      this.unlistenAutocompleteVirtualScroll = this.renderer.listen(autocompletePanel, 'scroll', (event) => {
        const eventHeight = event.target.scrollHeight - event.target.clientHeight - 150;

        if (Math.round(event.target.scrollTop) >= eventHeight) {
          this.pageResults();
        }
      });
    }
  }

  public onHideAutocompletePanel(): void {
    if (this.paged) {
      this.unlistenAutocompleteVirtualScroll();
    }
  }

  private pageResults(): void {
    if (this.service) {
      this.currentScrollPage++;
      this.service
        .getPaged(
          encodeURIComponent(this.currentSearchQuery),
          this.currentScrollPage,
          this.limitScrollPage,
          this.dependencies
        )
        .subscribe({
          next: (response) => {
            this.pagedSuggestions = this.currentScrollPage === 0 ? response : this.pagedSuggestions?.concat(response);
            const controlValue = typeof this.control.value == 'object' ? this.control.value?.code : this.control.value;
            if (this.control.value && this.pagedSuggestions?.find((item) => item.code == controlValue)) {
              this.setControlValueFromSuggestions();
            }
            if (this.forceSelection) {
              this.handleSearchErrors();
            }
          },
          error: (err) => {},
        });
    } else {
      const filteredOptions = this.filterListByQuery(this.options, this.currentSearchQuery.toUpperCase());
      this.pagedSuggestions = filteredOptions.slice(0, this.currentScrollIndex + this.limitScrollPage);

      if (this.options?.length && this.options.length > this.limitScrollPage) {
        this.currentScrollIndex = this.currentScrollIndex + this.limitScrollPage;
      }

      this.setControlValueFromSuggestions();
      if (this.forceSelection) {
        this.handleSearchErrors();
      }
    }
  }

  private setControlValueFromSuggestions() {
    const code =
      (ObjectUtil.isValid(this.control.value?.code) && `${this.control.value?.code}`) || `${this.control.value}`;
    if (this.control.value && this.pagedSuggestions?.length) {
      let itemsArray = this.pagedSuggestions;
      if (this.options?.length) {
        itemsArray = this.options;
      }
      const itemFromSuggestions = itemsArray.find((opt) => `${opt.code}`.toUpperCase() === code.toUpperCase());
      if (itemFromSuggestions) {
        this.control.setValue(itemFromSuggestions, { emitEvent: false });
      } else {
        this.service?.getById(+code).subscribe((response) => {
          this.control.setValue(response, { emitEvent: false });
        });
      }
    } else if (this.control.value && !this.pagedSuggestions?.length) {
      this.service?.getById(+code).subscribe((response) => {
        this.control.setValue(response, { emitEvent: false });
      });
    }
  }

  private handleSearchErrors() {
    if (this.pagedSuggestions?.length) {
      delete this.control.errors?.itemNotFound;
    } else if (this.currentSearchQuery) {
      this.control.setErrors({ itemNotFound: true });
    }
  }

  private filterListByQuery(list: ListItem[] = [], query: string): ListItem[] {
    return list.filter(
      (opt) => String(opt.code).toUpperCase().includes(query) || opt.name.toUpperCase().includes(query)
    );
  }
}
