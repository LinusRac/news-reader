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
  ) {
    console.log('=== NewsViewer INIT ===');
    console.log('isPreviewMode in constructor:', this.isPreviewMode);
    console.log('previewArticle in constructor:', this.previewArticle);
    console.log('ActivatedRoute:', this.route);
    console.log('Router:', this.router);
    console.log('NewsService:', this.newsService);
  }

  ngOnInit(): void {
    console.log('=== NewsViewer ngOnInit ===');
    console.log('isPreviewMode:', this.isPreviewMode);
    console.log('previewArticle:', this.previewArticle);
    
    // If in preview mode, use the provided preview article
    if (this.isPreviewMode === true && this.previewArticle) {
      console.log('Preview mode - using provided article:', this.previewArticle);
      this.article = this.previewArticle;
      this.isLoading = false;
      return;
    }
    
    // If in preview mode but no article yet, just set loading to false
    if (this.isPreviewMode === true) {
      console.log('Preview mode but no article yet');
      this.isLoading = false;
      return;
    }
    
    // Normal mode - load from route
    console.log('Normal mode - loading from route');
    console.log('Route snapshot:', this.route.snapshot);
    console.log('Route params:', this.route.snapshot.params);
    console.log('Route paramMap:', this.route.snapshot.paramMap);
    
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Extracted ID from route:', id);
    
    if (id) {
      this.loadArticle(id);
    } else {
      console.error('No article ID found in route');
      this.error = 'No article ID provided';
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('=== NewsViewer ngOnChanges ===', changes);
    
    // If previewArticle changes and we're in preview mode, update the article
    if (changes['previewArticle'] && this.isPreviewMode && this.previewArticle) {
      console.log('Preview article changed:', this.previewArticle);
      this.article = this.previewArticle;
      this.isLoading = false;
    }
  }

  loadArticle(id: string): void {
    console.log('=== LOADING ARTICLE ===');
    console.log('Article ID:', id);
    this.isLoading = true;
    this.error = null;
    
    // First try to get from local mock data for development
    const mockArticles: Article[] = [
      {
        id: 1,
        id_user: 101,
        abstract: 'Experts predict a steady economic growth for the upcoming year...',
        subtitle: 'Growth Forecast',
        update_date: '2024-06-01T10:30:00Z',
        category: 'Economy',
        title: 'Economic Growth in 2024',
        body: '<p>The economic outlook for 2024 appears increasingly positive as <strong>leading indicators</strong> point toward sustained growth across multiple sectors.</p><h3>Key Growth Drivers</h3><ul><li>Technology sector expansion</li><li>Infrastructure investments</li><li>Consumer spending recovery</li></ul><p>According to recent data, GDP is expected to grow by <em>3.2%</em> this year, marking a significant improvement from previous forecasts.</p><blockquote>This growth trajectory reflects the resilience of our economic fundamentals and the effectiveness of recent policy measures.</blockquote>',
        image_data: '',
        image_media_type: ''
      },
      {
        id: 2,
        id_user: 102,
        abstract: 'The government has announced the dates for the national elections...',
        subtitle: 'Election Dates Set',
        update_date: '2024-05-20T14:15:00Z',
        category: 'National',
        title: 'National Elections Announced',
        body: '<p>In a landmark announcement, the <strong>Election Commission</strong> has officially declared the dates for the upcoming national elections.</p><h3>Important Dates</h3><p>The elections will be conducted in multiple phases:</p><ol><li>Phase 1: April 15, 2024</li><li>Phase 2: April 22, 2024</li><li>Phase 3: April 29, 2024</li></ol><p>Voter registration is still open and citizens are encouraged to ensure their names appear on the electoral rolls.</p><p>For more information, visit the official election website or contact your local election office.</p>',
        image_data: '',
        image_media_type: ''
      },
      {
        id: 3,
        id_user: 103,
        abstract: 'The finals ended with a surprising victory for the underdogs...',
        subtitle: 'Underdogs Triumph',
        update_date: '2024-06-10T20:45:00Z',
        category: 'Sports',
        title: 'Championship Finals Results',
        body: '<p>In one of the most <strong>thrilling championship finals</strong> in recent history, the underdog team secured a stunning victory against all odds.</p><h3>Match Highlights</h3><p>The game was filled with spectacular moments:</p><ul><li>Early lead by the favorites</li><li>Dramatic comeback in the second half</li><li>Last-minute winning goal</li></ul><p>The victory marks the first championship title for this team in over <em>20 years</em>, making it a truly historic moment for their fans.</p><p>The celebration continued late into the night as thousands of supporters gathered in the city center to commemorate this remarkable achievement.</p>',
        image_data: '',
        image_media_type: ''
      },
      {
        id: 4,
        id_user: 104,
        abstract: 'A leading tech company has unveiled its latest smartphone model...',
        subtitle: 'Tech Launch',
        update_date: '2024-06-05T09:00:00Z',
        category: 'Technology',
        title: 'New Smartphone Released',
        body: '<p>The tech industry witnessed another milestone today as a <strong>major manufacturer</strong> introduced its revolutionary new smartphone.</p><h3>Key Features</h3><p>The new device boasts impressive specifications:</p><ul><li><strong>Advanced Camera System:</strong> 108MP main sensor with AI enhancement</li><li><strong>Battery Life:</strong> 48-hour usage with fast charging</li><li><strong>Display:</strong> 6.7" OLED with 120Hz refresh rate</li><li><strong>Performance:</strong> Latest generation processor</li></ul><h3>Availability</h3><p>The smartphone will be available in three variants:</p><ol><li>Standard Edition - $799</li><li>Pro Edition - $999</li><li>Pro Max Edition - $1,199</li></ol><p>Pre-orders begin next week, with general availability expected by the end of the month.</p>',
        image_data: '',
        image_media_type: ''
      }
    ];

    const mockArticle = mockArticles.find(a => a.id === parseInt(id));
    
    if (mockArticle) {
      // Use mock data
      this.article = mockArticle;
      if (mockArticle.id_user) {
        this.loadUsername(mockArticle.id_user);
      }
      this.isLoading = false;
    } else {
      // Try API call as fallback
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
  }

  private loadUsername(userId: number): void {
    console.log('Loading username for user ID:', userId);
    this.loginService.getUserById(userId).subscribe({
      next: (username) => {
        this.username = username;
        console.log('Username loaded:', username);
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
          console.log('Article deleted successfully');
          alert('Article deleted successfully!');
          this.router.navigate(['/list']); // Navigate back to list after deletion
        },
        error: (error) => {
          console.error('Error deleting article:', error);
          alert('Failed to delete the article. Please try again.');
        }
      });
    }
  }
}
