import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginBar } from '../login-bar/login-bar';
import { Article } from '../interfaces/article';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [FormsModule, CommonModule, LoginBar],
  templateUrl: './news-list.html',
  styleUrls: ['./news-list.css']
})
export class NewsList implements OnInit{
  ngOnInit(): void {
  }

  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = ['National', 'Economy', 'Sports', 'Technology'];

  articles: Article[] = [
    {
      id: 1,
      id_user: 101,
      abstract: 'Experts predict a steady economic growth for the upcoming year...',
      subtitle: 'Growth Forecast',
      update_date: '2024-06-01',
      category: 'Economy',
      title: 'Economic Growth in 2024',
      image_data: '',
      image_media_type: ''
    },
    {
      id: 2,
      id_user: 102,
      abstract: 'The government has announced the dates for the national elections...',
      subtitle: 'Election Dates Set',
      update_date: '2024-05-20',
      category: 'National',
      title: 'National Elections Announced',
      image_data: '',
      image_media_type: ''
    },
    {
      id: 3,
      id_user: 103,
      abstract: 'The finals ended with a surprising victory for the underdogs...',
      subtitle: 'Underdogs Triumph',
      update_date: '2024-06-10',
      category: 'Sports',
      title: 'Championship Finals Results',
      image_data: '',
      image_media_type: ''
    },
    {
      id: 4,
      id_user: 104,
      abstract: 'A leading tech company has unveiled its latest smartphone model...',
      subtitle: 'Tech Launch',
      update_date: '2024-06-05',
      category: 'Technology',
      title: 'New Smartphone Released',
      image_data: '',
      image_media_type: ''
    }
  ];


}