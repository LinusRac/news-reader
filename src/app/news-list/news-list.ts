import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Article } from '../interfaces/article';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { NewsService } from '../services/news-service';
import { LoginService } from '../services/login.service';
import { NewsTextSearchPipe } from '../pipes/news-text-search-pipe';
import { NewsCategoryFilterPipe } from '../pipes/news-category-filter-pipe';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NavigationBar, NewsTextSearchPipe, NewsCategoryFilterPipe],
  templateUrl: './news-list.html',
  styleUrls: ['./news-list.css']
})
export class NewsList implements OnInit {
  private router = inject(Router);
  private newsService = inject(NewsService);
  private loginService = inject(LoginService);
  
  // Filter state - managed by navigation bar
  selectedCategory: string = 'All';
  searchText: string = '';
  
  // Articles data
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  constructor() {
  }
  
  ngOnInit(): void {
    this.loadArticles();
  }
  
  // Navigation bar event handlers
  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  onSearchTextChanged(searchText: string): void {
    this.searchText = searchText;
    this.applyFilters();
  }
  
  onCreateArticleClicked(): void {
    this.createArticle();
  }
  
  // Apply filters using pipes
  private applyFilters(): void {
    let filtered = this.articles;
    
    // Apply category filter
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      const categoryPipe = new NewsCategoryFilterPipe();
      filtered = categoryPipe.transform(filtered, this.selectedCategory);
    }
    
    // Apply text search filter
    if (this.searchText) {
      const searchPipe = new NewsTextSearchPipe();
      filtered = searchPipe.transform(filtered, this.searchText);
    }
    
    this.filteredArticles = filtered;
  }
  
  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.newsService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles || [];
        this.applyFilters(); // Apply current filters
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articles from API:', error);
        this.errorMessage = 'Failed to load articles from server. Please check your connection and try again.';
        this.isLoading = false;
        this.articles = []; // Clear any existing articles
      }
    });
  }

  viewArticle(articleId: number): void {
    this.router.navigate(['/view', articleId]).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  editArticle(articleId: number): void {
    this.router.navigate(['/edit', articleId]);
  }

  createArticle(): void {
    this.router.navigate(['/edit/new']);
  }
  
  refreshArticles(): void {
    this.loadArticles();
  }

  onMouseEnter(event: Event): void {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.transform = 'translateY(-2px)';
      element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
  }

  onMouseLeave(event: Event): void {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = 'none';
    }
  }

  onImageError(event: any, article: Article): void {
    // Set fallback to favicon
    event.target.src = '/favicon.ico';
    
    // Optional: You could also try a different fallback image
    // event.target.src = 'https://via.placeholder.com/400x150/cccccc/666666?text=No+Image';
  }

  // Authentication check for template
  isLoggedIn(): boolean {
    return this.loginService.isLogged();
  }

  // Delete article functionality
  deleteArticle(article: Article): void {
    if (!this.isLoggedIn()) {
      alert('You must be logged in to delete articles.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      this.newsService.deleteArticle(article.id).subscribe({
        next: () => {
          // Remove the article from the local arrays
          this.articles = this.articles.filter(a => a.id !== article.id);
          this.applyFilters(); // Refresh the filtered list
        },
        error: (error) => {
          console.error('Error deleting article:', error);
          alert('Failed to delete the article. Please try again.');
        }
      });
    }
  }
}