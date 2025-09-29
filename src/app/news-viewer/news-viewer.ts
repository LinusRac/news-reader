import { Component } from '@angular/core';
import { LoginBar } from "../login-bar/login-bar";

@Component({
  selector: 'app-news-viewer',
  imports: [LoginBar],
  templateUrl: './news-viewer.html',
  styleUrl: './news-viewer.css'
})
export class NewsViewer {

}
