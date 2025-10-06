import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginBar } from '../login-bar/login-bar';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginBar],
  templateUrl: './navigation-bar.html',
  styleUrls: ['./navigation-bar.css']
})
export class NavigationBar implements OnInit {
  private loginService = inject(LoginService);

  // Navigation state
  isCollapsed: boolean = true;
  
  // Filter outputs
  @Output() categorySelected = new EventEmitter<string>();
  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() createArticleClicked = new EventEmitter<void>();
  
  // Filter data
  categories: string[] = ['All', 'National', 'International', 'Economy', 'Sports', 'Technology'];
  selectedCategory: string = 'All';
  searchText: string = '';
  
  // User state
  get isLoggedIn(): boolean {
    return this.loginService.isLogged();
  }
  
  ngOnInit(): void {
    // Emit initial filter state
    this.onCategorySelect(this.selectedCategory);
  }
  
  // Category selection
  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
  
  // Search functionality
  onSearchChange(): void {
    this.searchTextChanged.emit(this.searchText);
  }
  
  // Clear search
  clearSearch(): void {
    this.searchText = '';
    this.onSearchChange();
  }
  
  // Category formatting helper
  formatCategoryName(category: string): string {
    if (!category) return '';
    if (category === 'All') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
  
  // Article creation
  onCreateArticle(): void {
    this.createArticleClicked.emit();
  }
  
  // Mobile navigation toggle
  toggleNavigation(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  
  // Close mobile menu when item is selected
  closeNavigation(): void {
    this.isCollapsed = true;
  }
}