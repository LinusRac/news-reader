import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginBar } from "../login-bar/login-bar";
import { Article } from '../interfaces/article';
import { NewsService } from '../services/news-service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-news-viewer',
  imports: [LoginBar, CommonModule],
  templateUrl: './news-viewer.html',
  styleUrl: './news-viewer.css'
})
export class NewsViewer implements OnInit, OnChanges {
  @Input() previewArticle: Article | null = null; // For preview mode
  @Input() isPreviewMode: boolean = false; // Flag to determine if in preview mode
  
  article: Article | null = null;
  username: string | null = null; // Store fetched username separately
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // If in preview mode, use the provided preview article
    if (this.isPreviewMode === true && this.previewArticle) {
      this.article = this.previewArticle;
      this.isLoading = false;
      return;
    }
    
    // If in preview mode but no article yet, just set loading to false
    if (this.isPreviewMode === true) {
      this.isLoading = false;
      return;
    }
    
    // Normal mode - load from route
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadArticle(id);
    } else {
      this.error = 'No article ID provided';
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If previewArticle changes and we're in preview mode, update the article
    if (changes['previewArticle'] && this.isPreviewMode && this.previewArticle) {
      this.article = this.previewArticle;
      this.isLoading = false;
    }
  }

  loadArticle(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.newsService.getArticle(id).subscribe({
      next: (article) => {
        this.article = article;
        if (article.id_user) {
          this.loadUsername(article.id_user);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load article';
        this.isLoading = false;
        console.error('Error loading article:', err);
      }
    });
  }

  private loadUsername(userId: number): void {
    this.loginService.getUserById(userId).subscribe({
      next: (username) => {
        this.username = username;
      },
      error: (err) => {
        console.error('Error loading username:', err);
        this.username = `User ${userId}`;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Authentication check for template
  isLoggedIn(): boolean {
    return this.loginService.isLogged();
  }

  // Navigate to edit page
  editArticle(): void {
    if (this.article) {
      this.router.navigate(['/edit', this.article.id]);
    }
  }

  // Delete article functionality
  deleteArticle(): void {
    if (!this.isLoggedIn()) {
      alert('You must be logged in to delete articles.');
      return;
    }

    if (!this.article) {
      return;
    }

    if (confirm(`Are you sure you want to delete "${this.article.title}"?`)) {
      this.newsService.deleteArticle(this.article.id).subscribe({
        next: () => {
          alert('Article deleted successfully!');
          this.router.navigate(['/list']); // Navigate back to list after deletion
        },
        error: (error: any) => {
          console.error('Error deleting article:', error);
          alert('Failed to delete the article. Please try again.');
        }
      });
    }
  }
}
