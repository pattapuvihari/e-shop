import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Filter criteria
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  selectedBrands: { [key: string]: boolean } = {};
  selectedColors: { [key: string]: boolean } = {};
  sortBy: string = 'featured';

  // Available options (could be dynamic in a real app)
  brands: string[] = ['Apple', 'Dell', 'HP', 'Samsung', 'Google', 'Generic'];
  colors: string[] = ['Black', 'Silver', 'Blue', 'Titanium'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;

        // Listen to query params for search
        this.route.queryParams.subscribe(params => {
          this.searchTerm = params['q'] || '';
          this.applyFilters();
        });
      },
      error: (e) => console.error('Error loading products', e)
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Search Term
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Price Filter
      const matchesMinPrice = this.minPrice === null || product.price >= this.minPrice;
      const matchesMaxPrice = this.maxPrice === null || product.price <= this.maxPrice;

      // Rating Filter
      const matchesRating = this.minRating === null || product.rating >= this.minRating;

      // Brand Filter
      const activeBrands = Object.keys(this.selectedBrands).filter(b => this.selectedBrands[b]);
      const matchesBrand = activeBrands.length === 0 || (product.brand && activeBrands.includes(product.brand));

      // Color Filter
      const activeColors = Object.keys(this.selectedColors).filter(c => this.selectedColors[c]);
      const matchesColor = activeColors.length === 0 || (product.color && activeColors.includes(product.color));

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesRating && matchesBrand && matchesColor;
    });

    this.sortProducts();
  }

  sortProducts() {
    if (this.sortBy === 'price-low-high') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high-low') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      this.filteredProducts.sort((a, b) => b.rating - a.rating);
    } else {
      // featured - default sort (by id)
      this.filteredProducts.sort((a, b) => a.id - b.id);
    }
  }
}
