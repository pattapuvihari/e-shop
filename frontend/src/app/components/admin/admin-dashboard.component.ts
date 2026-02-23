import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    product: Product = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        rating: 0,
        brand: '',
        color: '',
        fullDescription: '',
        discount: 0,
        specifications: {}
    };

    specsInput: string = '';
    searchId: number | null = null;
    message: string = '';
    isEditMode: boolean = false;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
    }

    searchProduct() {
        if (!this.searchId) return;
        this.productService.getProduct(this.searchId).subscribe({
            next: (p) => {
                this.product = p;
                this.specsInput = JSON.stringify(p.specifications || {}, null, 2);
                this.isEditMode = true;
                this.message = 'Product found.';
            },
            error: (err) => {
                this.message = 'Product not found.';
                this.resetForm();
            }
        });
    }

    saveProduct() {
        try {
            if (this.specsInput) {
                this.product.specifications = JSON.parse(this.specsInput);
            } else {
                this.product.specifications = {};
            }
        } catch (e) {
            this.message = 'Invalid JSON in specifications.';
            return;
        }

        if (this.isEditMode) {
            this.productService.update(this.product.id, this.product).subscribe({
                next: (p) => {
                    this.message = 'Product updated successfully.';
                    this.product = p;
                },
                error: (err) => this.message = 'Error updating product.'
            });
        } else {
            // Create new
            const { id, ...newProduct } = this.product; // Remove ID for creation
            this.productService.create(newProduct as Product).subscribe({
                next: (p) => {
                    this.message = 'Product created successfully.';
                    this.resetForm();
                },
                error: (err) => this.message = 'Error creating product.'
            });
        }
    }

    deleteProduct() {
        if (!this.isEditMode) return;
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.remove(this.product.id).subscribe({
                next: () => {
                    this.message = 'Product deleted.';
                    this.resetForm();
                },
                error: () => this.message = 'Error deleting product.'
            });
        }
    }

    resetForm() {
        this.product = {
            id: 0,
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            rating: 0,
            brand: '',
            color: '',
            fullDescription: '',
            discount: 0,
            specifications: {}
        };
        this.specsInput = '';
        this.isEditMode = false;
        this.searchId = null;
    }
}
