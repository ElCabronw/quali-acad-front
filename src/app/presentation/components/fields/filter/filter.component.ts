import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListItem } from '../../lib/models';
import { BaseDropdown } from '../../lib/services';
import { ObjectUtil, ValidationUtil } from '../../lib/utils';

export enum FieldType {
  DROPDOWN,
  TEXT,
  DATE,
  NUMBER,
  CURRENCY,
  DYNAMIC_DROPDOWN,
  DATE_RANGE,
  SLIDER
}

export type FilterField = {
  name: string;
  type: FieldType;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  label?: string;
  mask?: string;
  options?: ListItem[];
  filterTypes?: ListItem[];
  service?: BaseDropdown;
  defaultValue?: any;
  placeholder?: string;
  hidden?: boolean;
  dependencies?: string[];
  size?: 'small' | 'medium' | 'large' | 'largest' | 'full';
  minLengthToService?: number;
  initiateValue?: boolean;
  tooltip?: string;
  controler?: UntypedFormControl;
  dateMin?: Date;
  dateMax?: Date;
};

@Component({
  selector: 'quali-acad-filters',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input()
  public set fields(_fields: FilterField[]) {
    const isFirstSet = !this._fields.length && _fields?.length;
    this._fields = _fields;
    this.formGroup = new UntypedFormGroup({});

    this.fieldsSubscription.unsubscribe();
    this.fieldsSubscription = new Subscription();

    this.fields?.forEach((field) => {
      if (field?.defaultValue && typeof field?.defaultValue === 'object') {
        field.initiateValue = !!field.defaultValue?.code;
      } else {
        field.initiateValue = !!field.defaultValue;
      }
      if (field.type === FieldType.DATE_RANGE) {
        this.formGroup.addControl(
          field.name,
          new UntypedFormGroup({
            startDate: new UntypedFormControl({ value: field.defaultValue?.startDate, disabled: field.readonly }, [
              ...this.buildValidators(field),
              ValidationUtil.lowerThanOrEqualTo('endDate'),
            ]),
            endDate: new UntypedFormControl({ value: field.defaultValue?.endDate, disabled: field.readonly }, [
              ...this.buildValidators(field),
              ValidationUtil.greaterThanOrEqualTo('startDate'),
            ]),
          })
        );
      } else {
        if (field.controler) {
          this.formGroup.addControl(field.name, field.controler);
        } else {
          this.formGroup.addControl(
            field.name,
            new UntypedFormControl({ value: field.defaultValue, disabled: field.readonly }, this.buildValidators(field))
          );
        }
      }
    });

    this.fields
      ?.filter((field) => field.dependencies)
      .forEach((field) => {
        field.dependencies?.forEach((dependency) => {
          this.fieldsSubscription.add(
            this.formGroup.get(dependency)?.valueChanges.subscribe((value) => {
              this.formGroup.get(field.name)?.reset();
            })
          );
        });
      });

    this.patchFormFromQueryParams({ ...this.activatedRoute.snapshot.queryParams });

    if (this._fields?.length && this.formGroup.valid && isFirstSet) {
      this.search();
    }
    this.formBuilded.emit();

    this.fieldsSubscription.add(
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        this.patchFormFromQueryParams({ ...queryParams });
      })
    );
  }
  @Output()
  public onSearch = new EventEmitter<any>();
  @Output()
  public formBuilded = new EventEmitter<void>();

  public get fields() {
    return this._fields;
  }

  public fieldTypes = FieldType;
  public formGroup = new UntypedFormGroup({});
  private _fields: FilterField[] = [];
  private fieldsSubscription = new Subscription();

  get hideFilters() {
    return !this.fields?.filter((item) => !item.hidden).length;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.fieldsSubscription.unsubscribe();
  }

  public search() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const filterValue = this.formGroup.getRawValue();
      Object.keys(filterValue).forEach((key) => {
        // if (filterValue[key]?.hasOwnProperty('code')) {
        //   filterValue[key] = filterValue[key].code;
        // }
        if (filterValue[key]?.hasOwnProperty('name')) {
          filterValue[key] = filterValue[key].name; //Filtrar por nome enquanto nao tem backend.
        }
        if (!ObjectUtil.isValid(filterValue[key])) {
          const fieldType = this.fields.find((field) => field.name === key)?.type ?? FieldType.TEXT;
          filterValue[key] = [FieldType.DROPDOWN, FieldType.NUMBER].includes(fieldType) ? -1 : '';
        }
      });
      this.onSearch.emit(filterValue);
    }
  }

  public isTextFieldType(field: FilterField) {
    return [FieldType.TEXT, FieldType.NUMBER].includes(field.type);
  }

  public getFieldDependencies(field: FilterField) {
    if (!field.dependencies) {
      return undefined;
    }
    return field.dependencies.reduce((prev, curr) => {
      let depValue: any = this.formGroup.get(curr)?.value?.code;
      if (!ObjectUtil.isValid(depValue)) {
        depValue = -1;
      }
      return {
        ...prev,
        [curr]: depValue,
      };
    }, {});
  }

  public getGridClass(field: FilterField) {
    switch (field.size) {
      case 'small':
        return 'md:col-1';
      case 'medium':
        return 'md:col-3';
      case 'large':
        return 'md:col-4';
      case 'largest':
        return 'md:col-8';
      case 'full':
        return 'md:col-12';
      default:
        return 'md:col-4';
    }
  }

  private patchFormFromQueryParams(queryParams: any) {
    if (Object.keys(queryParams).length) {
      this.fields.forEach((field) => {
        if (queryParams.hasOwnProperty(field.name)) {
          try {
            queryParams[field.name] = queryParams[field.name]
              ? JSON.parse(queryParams[field.name])
              : queryParams[field.name];
          } catch (_) {}
          if (field.type === FieldType.DATE_RANGE) {
            queryParams[field.name] = {
              startDate: queryParams[field.name].startDate ? new Date(queryParams[field.name].startDate) : undefined,
              endDate: queryParams[field.name].endDate ? new Date(queryParams[field.name].endDate) : undefined,
            };
          }
          if (field.type === FieldType.DATE) {
            queryParams[field.name] = queryParams[field.name] ? new Date(queryParams[field.name]) : undefined;
          }
        }
      });
      this.formGroup.patchValue(queryParams);
    }
  }

  private buildValidators(field: FilterField): ValidatorFn[] {
    const validators = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }
    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }
    if (field.min) {
      validators.push(Validators.min(field.min));
    }
    if (field.max) {
      validators.push(Validators.max(field.max));
    }
    return validators;
  }
}
