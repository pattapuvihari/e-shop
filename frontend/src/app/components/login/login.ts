import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    // In a real-world scenario with client-side hashing, we'd need the salt from the server first.
    // However, since we are simulating "encrypted payload" by hashing on client, 
    // and we utilized `bcrypt.hashSync(password, salt)` on register, the salt is embedded in the hash.
    // BUT wait! bcrypt.compareObject needs the hash to compare against.
    // This client-side hashing request is actually tricky for login without retrieving the salt/hash first.

    // The user requirement: "Password should be encrypted and used in the payload"
    // If we hash on client, we send a HASH. Backend receives HASH.
    // Backend compares HASH vs HASH.
    // But bcrypt generates a different hash every time due to salt.
    // So if I hash "password" now, it won't match the stored hash "password".

    // CORRECTION: Standard bcrypt usage is:
    // Register: cleartext -> SERVER -> bcrypt.hash -> DB
    // Login: cleartext -> SERVER -> bcrypt.compare(cleartext, DB_hash)

    // User wants: cleartext -> CLIENT -> ENCRYPT -> SERVER
    // If "encrypt" means "hash", then:
    // Register: cleartext -> CLIENT -> bcrypt.hash -> SERVER -> DB (stored as is)
    // Login: cleartext -> CLIENT -> bcrypt.hash -> SERVER -> DB (compare?)
    // But client-side bcrypt.hash generates a random salt. So Client-Hash-1 != Client-Hash-2.
    // So backend cannot compare them if they are different hashes of the same password.

    // SOLUTION for "Encrypted in payload":
    // 1. Use a deterministic encryption (like AES) or a fixed salt? NO, fixed salt is bad.
    // 2. HTTPS is the real answer.
    // 3. To satisfy the prompt "use the same encryption":
    //    I will attempt to retrieve the user's salt? No, that exposes enumeration.

    // ALTERNATIVE INTERPRETATION:
    // Maybe the user just wants the password to NOT be cleartext in the Network tab.
    // If I use a simple hash (SHA256) on client, that works. But user said "same encryption as response".
    // "use the same encryption which you are using while sending the response" -> There IS NO encryption in response usually.
    // Maybe they mean the backend's bcrypt?

    // Let's stick to the plan: Hash on client. 
    // PROBLEM: How to login?
    // If I register with `bcrypt.hashSync(pw, salt)`, I store `$2a$10$.....`.
    // If I login, I can't generate that same string again without the salt.
    // I would need to fetch the user by email, get the stored hash, then `bcrypt.compare` on client? insecure.
    // OR send the cleartext to backend and let backend compare? That violates "encrypted payload".

    // RE-READING: "Password should be encrypted and used in the payload"
    // Strategy: 
    // 1. Register: Client generates Salt + Hash. Sends `password: Hash`. Backend saves it.
    // 2. Login: This is the hard part.
    //    If I send cleartext, it fails criteria.
    //    If I send a NEW hash, it won't match stored hash string-wise.
    //    Backend needs to verify `bcrypt.compare(plaintext, storedHash)`.
    //    But backend receives `encrypted_payload`.
    //    So backend receives `Encryption(password)`. Decrypts it. Then `bcrypt.compare`.
    //    This requires reversible encryption (AES), not hashing.

    // User said: "use the same encryption which you are using while sending the response"
    // I am NOT using any encryption in response currently (except HTTPS).
    // This prompt implies I SHOULD be using encryption.

    // Let's assume the user mistakenly thinks hashing is encryption.
    // To make this work with BCrypt (which is one-way):
    // WE CANNOT DO CLIENT SIDE BCRYPT HASHING FOR LOGIN unless we receive the salt first.
    // Retrieving the salt/hash by email before login allows offline cracking but satisfies the flow.
    // Flow: 
    // 1. User enters Email.
    // 2. Client requests "salt" for email.
    // 3. Backend sends salt (or fake one).
    // 4. Client hashes password with salt.
    // 5. Client sends hash.
    // 6. Backend compares hash == stored_hash.

    // IS THERE A SIMPLER WAY?
    // Maybe just use a *fixed* salt or simple hashing (SHA256) for the "transmission encryption".
    // Protocol:
    // Register: `payload = { password: sha256(real_pw) }`. Backend: `bcrypt.hash(payload.password)`.
    // Login: `payload = { password: sha256(real_pw) }`. Backend: `bcrypt.compare(payload.password, stored)`.
    // This ensures "encrypted in payload" (technically hashed, but hides cleartext).
    // AND it works with standard backend bcrypt.

    // REVISING PLAN:
    // I will use `bcryptjs` on frontend to hash the password with a *temporary/fixed* logic? No, bcrypt always salts.
    // I will switch to using a simple **SHA256** or similar on the client side to "mask" the password in transit.
    // But the user specifically said "use the same encryption...".
    // I will assume the user wants me to use `bcrypt` on the backend (standard).
    // So I will use `AES` or similar for the payload? No, too complex to manage keys.

    // Let's go with the **SHA256 wrapper** approach.
    // 1. Frontend: Hash password (e.g. simple hash, or just base64 if "encryption" is loosely defined, but hash is better). 
    //    Actually, if I use `bcrypt` on frontend, I can't reproduce the hash.
    //    I will use a simple mapping or just accept that I cannot do "client side bcrypt" for login without extra steps.

    // WAIT. "use the same encryption which you are using while sending the response".
    // I am using **JWT** for response? No, that's signing.
    // I'm using `bcrypt` for storage.

    // Let's pivot to a standard secure implementation that satisfies "encrypted payload":
    // I will use **CryptoJS** (AES) to encrypt the password before sending.
    // Key? Hardcoded in frontend/backend (I know, insecure, but satisfies "payload encryption" requirement for this task scope).
    // Backend decrypts, then uses bcrypt to store/compare.

    // Let's check if I can use `bcrypt` as requested. 
    // If I use `bcrypt` on frontend, I produce a hash.
    // If I send that hash to backend...
    // Backend treats that hash as the "password".
    // Backend hashes it AGAIN with salt? Or stores it as is?
    // If backend stores it as is:
    //   Login: Frontend produces NEW hash (different salt). Backend mismatch. Fails.
    // Conclusion: Client-side bcrypt is incompatible with standard login flows unless we share state (salt).

    // DECISION: I will use **CryptoJS (AES)** to encrypt the payload.
    // 1. Install `crypto-js`.
    // 2. Encrypt password in Register & Login.
    // 3. Backend (Update User Controller/Service): Decrypt password before processing.

    // This satisfies "Password should be encrypted... used in payload".
    // And "same encryption" part... maybe they meant "encrypt it like you do X". 
    // I'll stick to AES as it's actual reversible encryption, allowing the backend to still do its standard bcrypt hashing safely.

    // Wait, I already installed `bcryptjs` on frontend in previous step.
    // The user might *expect* me to use that.
    // Is there a way? 
    // Maybe they essentially want me to hash it on client, and backend just stores that hash.
    // And for login? 
    // If I hash on client, I need a salt.
    // If I use a **fixed salt** on client? `bcrypt.hashSync(pw, "$2a$10$fixedsalt................")`
    // Then the hash is deterministic!
    // Backend receives this hash.
    // Backend hashes it AGIAN (with random salt) to store.
    // Login: Client hashes with fixed salt. Sends hash. Backend compares.
    // THIS WORKS! It masks the cleartext password in the payload.

    // I will use a **HARDCODED SALT** on the frontend for the transmission-hashing.

    const salt = '$2a$10$abcdefghijklmnopqrstuv'; // Fixed 22-char salt for client-side hashing
    const hashedPassword = bcrypt.hashSync(this.password, salt);

    this.authService.login({ email: this.email, password: hashedPassword }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = 'Invalid email or password';
      }
    });
  }
}
