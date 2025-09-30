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

    // For now, use mock data since we don't know the exact API endpoint
    return this.getMockUserById(userId);
  }

  // Mock user data for development/testing
  private getMockUserById(userId: number): Observable<string> {
    const mockUsers = new Map<number, string>([
      [101, 'John Smith'],
      [102, 'Maria Garcia'],
      [103, 'David Johnson'],
      [104, 'Sarah Chen'],
      [105, 'Michael Brown'],
      [106, 'Emma Wilson'],
      [107, 'Alex Turner'],
      [108, 'Lisa Anderson']
    ]);

    const username = mockUsers.get(userId) || `User ${userId}`;
    
    // Cache the result
    this.userCache.set(userId, username);
    
    return of(username);
  }

  // Clear user cache when needed
  clearUserCache(): void {
    this.userCache.clear();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.user = null;
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      window.alert(`Error: ${operation} failed: ${error.message}`); // erster versuch einer Fehlermeldung

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleUserError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // For user lookup errors, don't show alerts, just log
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      
      // Return the fallback result
      return of(result as T);
    };
  }

}
