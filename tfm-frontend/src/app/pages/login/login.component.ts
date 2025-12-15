import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword = false;



  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = "T'has registrat correctament!";
      }
    });
  }
  ngOnInit(): void {
    if (this.auth.isLoggedIn() && this.router.url === '/login') {
      this.router.navigate(['/dashboard']);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      this.successMessage = 'Compte creat correctament! Ja pots iniciar sessió.';
    }
  }

  onSubmit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        // Token is handled by AuthService
        this.errorMessage = null;
        const redirect = localStorage.getItem('redirectAfterLogin') || '/dashboard';
        localStorage.removeItem('redirectAfterLogin');
        this.router.navigate([redirect]);
      },
      error: err => {
        console.error('Error de login', err);
        this.errorMessage = 'Credencials incorrectes. Torna-ho a intentar.';
      }
    });
  }
}
