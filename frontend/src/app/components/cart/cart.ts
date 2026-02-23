import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {

  constructor(public cartService: CartService) { }

  total = computed(() => {
    return this.cartService.getCartItems()().reduce((sum, item) => sum + Number(item.price), 0);
  });
}

