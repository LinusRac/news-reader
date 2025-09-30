import { Injectable } from '@angular/core';
import { Article } from '../interfaces/article';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private newsUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/articles';  // URL to web api
  private articleUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/article';  // URL to web api

  constructor(private http: HttpClient) {
    this.APIKEY = null;
    // Initialize with anonymous API key
    this.setAnonymousApiKey();
    console.log('NewsService initialized with anonymous API key:', this.APIKEY_ANON);
  }

  // Set the corresponding APIKEY accordig to the received by email
  private APIKEY: string | null;
  private APIKEY_ANON = 'ANON02'; // Replace with your group's anonymous API key

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY_ANON
    })
  };

  // Modifies the APIKEY with the received value
  setUserApiKey(apikey: string | undefined) {
    if (apikey) {
      this.APIKEY = apikey;
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'PUIRESTAUTH apikey=' + this.APIKEY
      })
    };
    console.log('Apikey successfully changed ' + this.APIKEY);
  }

  setAnonymousApiKey() {
    this.setUserApiKey(this.APIKEY_ANON);
  }

  // Test API connectivity
  testApiConnection(): Observable<any> {
    console.log('Testing API connection with headers:', this.httpOptions);
    return this.http.get(this.newsUrl, this.httpOptions).pipe(
      tap(response => {
        console.log('API test successful:', response);
      }),
      catchError(error => {
        console.error('API test failed:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          headers: this.httpOptions.headers.keys()
        });
        throw error;
      })
    );
  }

  // Returns the list of news contain elements with the following fields:
  // {"id":...,
  //  "id_user":...,
  //  "abstract":...,
  //  "subtitle":...,
  //  "update_date":...,
  //  "category":...,
  //  "title":...,
  //  "thumbnail_image":...,
  //  "thumbnail_media_type":...}

  getArticles(): Observable<Article[]> {
    console.log('=== API CALL DEBUG ===');
    console.log('URL:', this.newsUrl);
    console.log('HTTP Options:', this.httpOptions);
    console.log('Current API Key:', this.APIKEY || this.APIKEY_ANON);
    
    return this.http.get<Article[]>(this.newsUrl, this.httpOptions).pipe(
      tap(response => {
        console.log('API Response received:', response);
        console.log('Number of articles:', response?.length || 0);
        
        // Check image data availability
        if (response && response.length > 0) {
          const firstArticle = response[0];
          console.log('First article data check:', {
            hasImageData: !!firstArticle.image_data,
            hasImageMediaType: !!firstArticle.image_media_type,
            hasThumbnailImage: !!(firstArticle as any).thumbnail_image,
            hasThumbnailMediaType: !!(firstArticle as any).thumbnail_media_type,
            articleKeys: Object.keys(firstArticle)
          });
        }
      }),
      catchError(error => {
        console.error('API Error Details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          headers: error.headers
        });
        
        if (error.status === 401) {
          console.error('Unauthorized - Check API key');
        } else if (error.status === 403) {
          console.error('Forbidden - API key may be invalid');
        } else if (error.status === 0) {
          console.error('Network error - Check internet connection and CORS');
        }
        
        throw error;
      })
    );
  }

  deleteArticle(article: Article | number | string): Observable<Article> {
    console.log('=== DELETE ARTICLE NEWSSERVICE ===');
    console.log('Article parameter:', article);
    console.log('Article type:', typeof article);
    
    let id: string | number;
    
    if (typeof article === 'object' && article !== null) {
      // It's an Article object
      id = article.id;
      console.log('Extracted ID from Article object:', id);
    } else {
      // It's a direct ID (number or string)
      id = article;
      console.log('Using direct ID:', id);
    }
    
    const url = `${this.articleUrl}/${id}`;
    
    console.log('Final ID used:', id);
    console.log('Delete URL:', url);
    console.log('HTTP Options:', this.httpOptions);
    console.log('Current API Key:', this.APIKEY);
    
    return this.http.delete<Article>(url, this.httpOptions).pipe(
      tap(response => {
        console.log('Delete successful:', response);
      }),
      catchError(error => {
        console.error('Delete failed:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        throw error;
      })
    );
  }


  // Returns an article which contains the following elements:
  // {"id":...,
  //  "id_user":...,
  //  "abstract":...,
  //  "subtitle":...,
  //  "update_date":...,
  //  "category":...,
  //  "title":...,
  //  "image_data":...,
  //  "image_media_type":...}


  getArticle(id: string|null): Observable<Article> {
    console.log('Requesting article id=' + id);
    const url = `${this.articleUrl}/${id}`;
    return this.http.get<Article>(url, this.httpOptions);

  }

  updateArticle(article: Article): Observable<Article> {
    console.log('Updating article id=' + article.id);
    return this.http.post<Article>(this.articleUrl, article, this.httpOptions);
  }

    createArticle(article: Article): Observable<Article> {
    // For creation, remove the ID field as it should be generated by the server
    const { id, ...articleForCreation } = article;
    
    console.log('Creating article via API:', {
      url: this.articleUrl,
      method: 'POST',
      headers: this.httpOptions.headers,
      articleData: {
        title: articleForCreation.title,
        category: articleForCreation.category,
        abstract: articleForCreation.abstract,
        hasImageData: !!articleForCreation.image_data,
        imageDataLength: articleForCreation.image_data?.length || 0,
        mediaType: articleForCreation.image_media_type
      }
    });
    
    return this.http.post<Article>(this.articleUrl, articleForCreation, this.httpOptions).pipe(
      tap(response => {
        console.log('Article created successfully:', response);
      }),
      catchError(error => {
        console.error('Create article failed:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          body: error.error,
          requestData: articleForCreation
        });
        throw error;
      })
    );
  }
}
