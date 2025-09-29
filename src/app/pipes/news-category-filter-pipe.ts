import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newsCategoryFilter'
})
export class NewsCategoryFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
