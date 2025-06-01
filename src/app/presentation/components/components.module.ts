import { ButtonModule } from "primeng/button";
import { ButtonComponent } from "./fields/button";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FieldErrorMessageComponent } from "./fields/field-error-message/field-error-message.component";
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { KeyFilterModule } from 'primeng/keyfilter';
import { TextFieldComponent } from "./fields/text-field/text-field.component";
import { DropdownModule } from "primeng/dropdown";
import { DropDownComponent } from "./fields/dropdown/dropdown.component";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from 'primeng/tooltip';
import { CalendarComponent } from "./fields/calendar/calendar.component";
import { FiltersComponent } from "./fields/filter/filter.component";
import { PipesModule } from "./lib/pipes/pipes.module";
import { IesService } from "../../core/services/ies.service";
import { SliderFieldComponent } from "./fields/slider-field/slider-field.component";
@NgModule({
  declarations: [ButtonComponent,SliderFieldComponent,FieldErrorMessageComponent,TextFieldComponent,DropDownComponent,CalendarComponent,FiltersComponent],
  imports: [
  ButtonModule,
  CommonModule,
  TooltipModule,
  AutoCompleteModule,
  CalendarModule,
  DropdownModule,
  InputMaskModule,
  FormsModule,
  PipesModule,
  KeyFilterModule,
  FormsModule,
ReactiveFormsModule,
],
  exports: [ButtonComponent,SliderFieldComponent,FieldErrorMessageComponent,TextFieldComponent,DropDownComponent,CalendarComponent,FiltersComponent],
})
export class ComponentsModule { }
