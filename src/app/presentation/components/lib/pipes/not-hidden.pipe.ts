import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notHidden',
})
export class NotHiddenPipe implements PipeTransform {
  transform(value: any[]): any[] {
    return value?.filter((item) => !item.hidden) || [];
  }
}
