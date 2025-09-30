import { Pipe, PipeTransform } from '@angular/core';
import { Article } from '../interfaces/article';

@Pipe({
  name: 'newsCategoryFilter',
  standalone: true
})
export class NewsCategoryFilterPipe implements PipeTransform {

  /**
   * Filters articles by category. Similar to email category filtering.
   * @param articles Array of articles
   * @param category Category to filter by ('All' shows all articles)
   */
  transform(articles: Article[], category: string): Article[] {
    if (!articles) return [];
    if (!category || category === '' || category === 'All') return articles;
    
    return articles.filter(article => 
      article.category?.toLowerCase() === category.toLowerCase()
    );
  }
}
