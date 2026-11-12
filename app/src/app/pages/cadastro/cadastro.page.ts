import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { mensagemErro } from '../../services/erro';

function senhasIguais(g: AbstractControl): ValidationErrors | null {
  return g.get('senha')?.value === g.get('confirmar')?.value ? null : { senhasDiferentes: true };
}

type Campo = 'nome' | 'email' | 'senha' | 'confirmar';

@Component({
  selector: 'app-cadastro',
  imports: [IonContent, IonIcon, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.page.html',
  styleUrl: './cadastro.page.scss',
})
export class CadastroPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  mostrarSenha = signal(false);
  mostrarConfirmar = signal(false);
  enviando = signal(false);
  enviado = signal(false);
  demorando = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', [Validators.required]],
  }, { validators: senhasIguais });

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline });
  }

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    const erroGrupo = campo === 'confirmar' && this.form.hasError('senhasDiferentes');
    return (c.invalid || erroGrupo) && (c.touched || this.enviado());
  }

  criarConta(): void {
    this.enviado.set(true);
    if (this.form.invalid) return;
    this.enviando.set(true);
    this.timer = setTimeout(() => this.demorando.set(true), 4000);
    const { nome, email, senha } = this.form.getRawValue();
    this.auth.cadastrar(nome.trim(), email.trim(), senha).subscribe({
      next: () => { this.parar(); this.router.navigateByUrl('/app/inicio', { replaceUrl: true }); },
      error: e => { this.parar(); this.avisar(mensagemErro(e)); },
    });
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
