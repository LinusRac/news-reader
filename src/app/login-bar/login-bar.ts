import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-bar',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-bar.html',
  styleUrls: ['./login-bar.css']
})
export class LoginBar implements OnInit {
  username: string = '';
  password: string = '';

  constructor() {}

  ngOnInit(): void {}

  onLogin(): void {
    if (this.username && this.password) {
      console.log('Logging in with', this.username, this.password);
      // TODO: Replace with your authentication logic
      alert(`Welcome, ${this.username}!`);
    } else {
      alert('Please enter both username and password.');
    }
  }
}
