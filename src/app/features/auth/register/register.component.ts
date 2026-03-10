import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = '';
  successMessage: string = '';

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, this.nameValidator]], 
    email: ['', [Validators.required, this.emailDomainValidator]], 
    password: ['', [Validators.required, this.passwordValidator]], 
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator }); 

  // Validator: English letters only, min 1 word, first letter capitalized
  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^[A-Z][a-zA-Z]*(\s[A-Z][a-zA-Z]*)*$/;
    return regex.test(value) ? null : { invalidName: true };
  }

  // Validator: valid email format with domains like 'com', 'org', or 'in'
  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in)$/i;
    return regex.test(value) ? null : { invalidDomain: true };
  }

  // Validator: 8-16 chars, lower, upper, digit, special
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const isValidLength = value.length >= 8 && value.length <= 16;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    if (!isValidLength) {
      return { invalidLength: true };
    }
    if (!(hasUpper && hasLower && hasNumeric && hasSpecial)) {
      return { weakPassword: true };
    }
    
    return null;
  }

  // Validator: Passwords must match
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Account created successfully! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMessage = 'Email is already associated with an existing account.';
          } else {
            this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched(); 
    }
  }
}