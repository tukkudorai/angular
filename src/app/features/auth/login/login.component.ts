import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator]] // Added strict validation here
  });

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

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/feed']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login unsuccessful. Please check your credentials.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Trigger all validation UI if they try to submit empty
    }
  }
}