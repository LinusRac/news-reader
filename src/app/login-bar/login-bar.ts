import { Component, OnInit, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NewsService } from '../services/news-service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-bar.html',
  styleUrls: ['./login-bar.css']
})
export class LoginBar implements OnInit, OnDestroy {
  private loginService = inject(LoginService);
  private newsService = inject(NewsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  private routerSubscription?: Subscription;

  // Login form data
  username: string = '';
  password: string = '';
  
  // Authentication state
  isLoggedIn: boolean = false;
  currentUser: string = '';
  
  // UI state
  isLoading: boolean = false;
  errorMessage: string = '';
  
  ngOnInit(): void {
    // Check login state from LoginService and update UI
    this.updateLoginState();
    
    // Set anonymous API key by default
    this.newsService.setAnonymousApiKey();
    
    // Subscribe to router events to update login state on navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update login state after navigation
      this.updateLoginState();
      this.cdr.detectChanges();
    });
  }
  
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  // Helper method to update login state from service
  private updateLoginState(): void {
    this.isLoggedIn = this.loginService.isLogged();
    
    if (this.isLoggedIn) {
      const user = this.loginService.getUser();
      // Use the actual property names from the API response
      this.currentUser = user?.username || user?.user || user?.Name || user?.Username || '';
    } else {
      this.currentUser = '';
    }
  }

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Login successful - update state from service
        this.updateLoginState();
        
        // Set user API key for authenticated requests
        if (response.apikey) {
          this.newsService.setUserApiKey(response.apikey);
        }
        
        // Clear form
        this.username = '';
        this.password = '';
        this.isLoading = false;
      },
      error: (error) => {
        // Login failed
        console.error('=== LOGIN COMPONENT ERROR ===');
        console.error('Full error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Incorrect username or password. Please check your credentials.';
          console.error('💡 Tip: Make sure you are using the correct username and password provided by your instructor.');
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request format. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Connection error. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = `Login failed: ${error.statusText || 'Unknown error'}`;
        }
        
        console.error('Error message shown to user:', this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  onLogout(): void {
    // Clear authentication state in LoginService
    this.loginService.logout();
    
    // Update local state from service
    this.updateLoginState();
    this.errorMessage = '';
    
    // Reset to anonymous API key
    this.newsService.setAnonymousApiKey();
  }

  // Clear error message when user starts typing
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
