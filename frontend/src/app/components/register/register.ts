import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  gender = '';
  dob = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    this.error = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    // Hash password on client side with fixed salt for transmission security
    const salt = '$2a$10$abcdefghijklmnopqrstuv';
    const hashedPassword = bcrypt.hashSync(this.password, salt);

    const user = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phone,
      password: hashedPassword,
      gender: this.gender,
      dateOfBirth: this.dob
    };

    this.authService.register(user).subscribe({
      next: () => {
        // Log the user in automatically
        this.authService.login({ email: this.email, password: hashedPassword }).subscribe(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'Registration failed. Email might already be in use.';
      }
    });
  }
}
