import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nom = '';
  email = '';
  contrasenya = '';
  confirmarContrasenya = '';
  errorMessage: string | undefined;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.auth.register({
      nom: this.nom,
      email: this.email,
      contrasenya: this.contrasenya,
      contrasenya_confirmation: this.confirmarContrasenya
    }).subscribe({
      next: () => {

        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: err => {
        if (err.status === 422 && err.error.errors?.email) {
          this.errorMessage = 'Aquest correu electrònic ja està registrat.';
        } else {
          this.errorMessage = 'Hi ha hagut un error. Torna-ho a provar.';
        }
      }
    });
  }
}
