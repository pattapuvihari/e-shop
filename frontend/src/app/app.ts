import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'frontend';
  searchQuery: string = '';
  user: any = null;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(x => this.user = x);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  search() {
    this.router.navigate(['/'], { queryParams: { q: this.searchQuery } });
  }
}
