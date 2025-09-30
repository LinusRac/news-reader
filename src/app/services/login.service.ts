import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private user: User | null = null;
  private userCache = new Map<number, string>(); // Cache for user ID to username mapping

  private loginUrl = 'http://sanger.dia.fi.upm.es/pui-rest-news/login';
  private message: string | null = null;

  private httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'x-www-form-urlencoded')
  };

  constructor(private http: HttpClient) { }

  isLogged() {
    return this.user != null;
  }

  login(name: string, pwd: string): Observable<User> {
    const usereq = new HttpParams()
      .set('username', name)
      .set('passwd', pwd);

    return this.http.post<User>(this.loginUrl, usereq).pipe(
      tap(user => {
        this.user = user;
      })
    );
  }

  getUser() {
    return this.user;
  }

  logout() {
    this.user = null;
  }

  // Get username by user ID with caching
  getUserById(userId: number): Observable<string> {
    // Check cache first
    if (this.userCache.has(userId)) {
      return of(this.userCache.get(userId)!);
    }

    // If API endpoint exists, use it
    // const url = `${this.userUrl}/${userId}`;
    // return this.http.get<User>(url).pipe(
    //   tap(user => {
    //     if (user && user.Name) {
    //       this.userCache.set(userId, user.Name);
    //     }
    //   }),
    //   map(user => user.Name || `User ${userId}`),
    //   catchError(this.handleUserError<string>(`getUserById id=${userId}`, `User ${userId}`))
    // );

    // For now, return a default username until API is implemented
    const defaultUsername = `User ${userId}`;
    this.userCache.set(userId, defaultUsername);
    return of(defaultUsername);
  }

  // Clear user cache when needed
  clearUserCache(): void {
    this.userCache.clear();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.user = null;
      
      // Log error for debugging and future remote logging
      this.logError(operation, error);
      
      // Show user-friendly error message
      this.showUserError(operation, error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleUserError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // For user lookup errors, don't show alerts, just log
      this.logError(operation, error);
      
      // Return the fallback result
      return of(result as T);
    };
  }

  // Centralized error logging - ready for remote logging integration
  private logError(operation: string, error: any): void {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      operation: operation,
      message: error.message || 'Unknown error',
      status: error.status || 'Unknown status',
      url: error.url || 'Unknown URL',
      userId: this.user?.apikey || 'Anonymous',
      userAgent: navigator.userAgent
    };

    // Console logging for development
    console.error(`[${operation}] Error:`, errorInfo);

    // TODO: Send to remote logging service when ready
    // Example implementations:
    // this.sendToApplicationInsights(errorInfo);
    // this.sendToSentry(errorInfo);
    // this.sendToCustomEndpoint(errorInfo);
  }

  // User-friendly error display
  private showUserError(operation: string, error: any): void {
    let userMessage = '';
    
    // Transform technical errors into user-friendly messages
    switch (operation) {
      case 'login':
        if (error.status === 401) {
          userMessage = 'Invalid username or password. Please try again.';
        } else if (error.status === 0) {
          userMessage = 'Cannot connect to server. Please check your internet connection.';
        } else {
          userMessage = 'Login failed. Please try again later.';
        }
        break;
      
      default:
        if (error.status === 0) {
          userMessage = 'Cannot connect to server. Please check your internet connection.';
        } else {
          userMessage = `Operation failed. Please try again later.`;
        }
    }

    // TODO: Replace with better UI notification system
    // Options: Angular Material Snackbar, custom toast, modal dialog
    window.alert(`Error: ${userMessage}`);
    
    // Future implementation examples:
    // this.snackBar.open(userMessage, 'Close', { duration: 5000 });
    // this.notificationService.showError(userMessage);
    // this.modalService.showErrorDialog(userMessage);
  }

  // Future method for remote logging integration
  // private sendToCustomEndpoint(errorInfo: any): void {
  //   const loggingUrl = 'https://your-logging-endpoint.com/api/errors';
  //   this.http.post(loggingUrl, errorInfo).subscribe({
  //     next: () => console.log('Error logged successfully'),
  //     error: (err) => console.warn('Failed to log error remotely:', err)
  //   });
  // }

}
