import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newsTextSearch'
})
export class NewsTextSearchPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
