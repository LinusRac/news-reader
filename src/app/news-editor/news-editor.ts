import { Component } from '@angular/core';
import { LoginBar } from "../login-bar/login-bar";

@Component({
  selector: 'app-news-editor',
  imports: [LoginBar],
  templateUrl: './news-editor.html',
  styleUrl: './news-editor.css'
})
export class NewsEditor {

}
