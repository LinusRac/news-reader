import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../interfaces/article';

@Pipe({
  name: 'newsTextSearch',
  standalone: true
})
export class NewsTextSearchPipe implements PipeTransform {

  /**
   * Filters articles by checking if any searchable attribute contains the search text.
   * Similar to email filtering pipes from Programming-of-User-Interfaces
   */
  transform(articles: Article[], searchText: string): Article[] {
    if (!searchText || !articles) return articles;

    const toCompare = searchText.toLowerCase().trim();
    if (toCompare === '') return articles;

    return articles.filter(article => {
      return (
        article.title?.toLowerCase().includes(toCompare) ||
        article.abstract?.toLowerCase().includes(toCompare) ||
        article.subtitle?.toLowerCase().includes(toCompare) ||
        article.body?.toLowerCase().includes(toCompare) ||
        article.category?.toLowerCase().includes(toCompare)
      );
    });
  }
}
