import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-bar.html',
  styleUrls: ['./login-bar.css']
})
export class LoginBar implements OnInit {

  username: string = '';
  password: string = '';
  errorMessage: any = null;



  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  onLogin(): void {
    if (this.username && this.password) {
      console.log('Logging in with', this.username, this.password);
      
      this.loginService.login(this.username, this.password).subscribe({
          next: (user: User) => console.log('User:', user),   // when a value arrives
          error: (err) => {
            this.errorMessage = "Wrong Username or Password";
          },   // if something goes wrong
      })
    
    } else {
      alert('Please enter both username and password.');
    }
  }

  closeError() {
    this.errorMessage = null;
  }
}
