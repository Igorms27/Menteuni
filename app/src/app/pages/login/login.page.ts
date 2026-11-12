import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../services/erro';

@Component({
  selector: 'app-login',
  imports: [IonContent, IonIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  mostrarSenha = signal(false);
  enviando = signal(false);
  enviado = signal(false);
  demorando = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  constructor() {
    addIcons({ personOutline, lockClosedOutline, eyeOffOutline, eyeOutline });
  }

  invalido(campo: 'email' | 'senha'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  entrar(): void {
    this.enviado.set(true);
    if (this.form.invalid) return;
    this.enviando.set(true);
    this.timer = setTimeout(() => this.demorando.set(true), 4000);
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email.trim(), senha).subscribe({
      next: () => { this.parar(); this.router.navigateByUrl('/app/inicio', { replaceUrl: true }); },
      error: e => { this.parar(); this.avisar(mensagemErro(e)); },
    });
  }

  esqueciSenha(): void {
    this.avisar('Procure a coordenação do seu curso para redefinir sua senha.');
  }

  private parar() {
    clearTimeout(this.timer);
    this.enviando.set(false);
    this.demorando.set(false);
  }

  private async avisar(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'top', color: 'dark' });
    t.present();
  }
}
