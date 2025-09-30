import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../interfaces/article';
import { NewsService } from '../services/news-service';
import { NewsViewer } from '../news-viewer/news-viewer';
import * as _ from 'lodash';

@Component({
  selector: 'app-news-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NewsViewer],
  templateUrl: './news-editor.html',
  styleUrls: ['./news-editor.css']
})
export class NewsEditor implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);

  article: Article = {
    id: 0,
    title: '',
    subtitle: '',
    abstract: '',
    body: '',
    category: '',
    author: '',
    update_date: new Date().toISOString(),
    modificationDate: new Date().toISOString()
  };

  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' | 'info' = 'info';
  
  // Image upload properties
  imageError: string | null = null;
  isImageSaved: boolean = false;
  cardImageBase64: string | null = null;

  // Preview functionality
  showPreview: boolean = false;
  previewArticle: Article | null = null;

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    console.log('NewsEditor initialized with articleId:', articleId);
    
    if (articleId && articleId !== 'new') {
      this.isEditMode = true;
      console.log('Loading article for editing, ID:', articleId);
      this.loadArticle(+articleId);
    } else {
      console.log('Creating new article');
    }
  }

  loadArticle(id: number): void {
    console.log('Loading article from API, ID:', id);
    this.newsService.getArticle(id.toString()).subscribe({
      next: (article) => {
        this.article = { ...article };
        console.log('Article loaded successfully from API:', article);
        
        // Handle image data if present
        if (article.image_data && article.image_media_type) {
          this.cardImageBase64 = article.image_data;
          this.isImageSaved = true;
        }
      },
      error: (error) => {
        console.error('Error loading article from API:', error);
        this.showFeedback('Article not found or could not be loaded from server', 'error');
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.feedbackMessage = '';

    try {
      // Set author if not already set
      if (!this.article.author) {
        this.article.author = 'Anonymous'; // You can get this from a user service
      }
      
      // Set dates
      if (this.isEditMode) {
        this.article.modificationDate = new Date().toISOString();
      } else {
        this.article.update_date = new Date().toISOString();
        this.article.modificationDate = new Date().toISOString();
      }

      // Make API calls directly
      try {
        if (this.isEditMode) {
          console.log('Updating article with API:', this.article);
          this.newsService.updateArticle(this.article).subscribe({
            next: (updatedArticle) => {
              console.log('Article updated successfully via API:', updatedArticle);
              this.showFeedback('Article updated successfully!', 'success');
              this.isSubmitting = false;
              // Navigate back after successful save
              setTimeout(() => {
                this.goBack();
              }, 2000);
            },
            error: (error) => {
              console.error('Error updating article via API:', error);
              this.showFeedback(`Error updating article: ${error.status} - ${error.statusText || error.message}`, 'error');
              this.isSubmitting = false;
            }
          });
        } else {
          console.log('Creating article with API:', this.article);
          console.log('Article data summary:', {
            title: this.article.title,
            category: this.article.category,
            abstract: this.article.abstract,
            body: this.article.body,
            author: this.article.author,
            hasImageData: !!this.article.image_data,
            imageDataLength: this.article.image_data?.length,
            imageMediaType: this.article.image_media_type,
            isImageSaved: this.isImageSaved
          });
          
          this.newsService.createArticle(this.article).subscribe({
            next: (createdArticle) => {
              console.log('Article created successfully via API:', createdArticle);
              this.showFeedback('Article created successfully!', 'success');
              this.isSubmitting = false;
              // Navigate back after successful save
              setTimeout(() => {
                this.goBack();
              }, 2000);
            },
            error: (error) => {
              console.error('Error creating article via API:', error);
              this.showFeedback(`Error creating article: ${error.status} - ${error.statusText || error.message}`, 'error');
              this.isSubmitting = false;
            }
          });
        }
        
      } catch (error) {
        console.error('Unexpected error:', error);
        this.showFeedback('Error saving article. Please try again.', 'error');
        this.isSubmitting = false;
      }

    } catch (error) {
      this.showFeedback('Error saving article. Please try again.', 'error');
      this.isSubmitting = false;
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    this.showFeedback('Failed to load image preview', 'error');
  }
  
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const MAX_SIZE = 20971520;
      const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

      if (fileInput.target.files[0].size > MAX_SIZE) {
        this.imageError =
          'Maximum size allowed is ' + MAX_SIZE / 1000 + 'Mb';
        return false;
      }
      if (!_.includes(ALLOWED_TYPES, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;

          this.article.image_media_type = fileInput.target.files[0].type;
          const head = this.article.image_media_type!.length + 13;
          this.article.image_data = e.target.result.substring(head, e.target.result.length);

        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
    return true;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    
    // Auto-hide feedback after 5 seconds
    setTimeout(() => {
      this.feedbackMessage = '';
    }, 5000);
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
    
    console.log('Toggle preview:', this.showPreview);
    
    if (this.showPreview) {
      // Create preview article with current form data
      this.previewArticle = {
        ...this.article,
        image_data: this.cardImageBase64?.split(',')[1] || '', // Remove data:image/png;base64, prefix
        image_media_type: this.cardImageBase64 ? this.getImageMediaType() : ''
      };
      console.log('Created preview article:', this.previewArticle);
    }
  }

  private getImageMediaType(): string {
    if (!this.cardImageBase64) return '';
    
    if (this.cardImageBase64.includes('data:image/png')) return 'image/png';
    if (this.cardImageBase64.includes('data:image/jpeg')) return 'image/jpeg';
    if (this.cardImageBase64.includes('data:image/jpg')) return 'image/jpg';
    if (this.cardImageBase64.includes('data:image/gif')) return 'image/gif';
    
    return 'image/jpeg'; // Default fallback
  }
}
