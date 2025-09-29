import { Component } from '@angular/core';
import { LoginBar } from "../login-bar/login-bar";

@Component({
  selector: 'app-news-list',
  imports: [LoginBar],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css'
})
export class NewsList {

}
