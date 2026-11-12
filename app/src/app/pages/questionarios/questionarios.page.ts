import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, clipboardOutline } from 'ionicons/icons';
import { ApiService, QuestionarioResumo } from '../../services/api.service';

@Component({
  selector: 'app-questionarios',
  imports: [IonContent, IonIcon, IonSpinner, RouterLink],
  template: `
    <ion-content class="mu-page">
      <div class="mu-container interna">
        <div class="mu-topbar">
          <button class="mu-back" (click)="nav.back()" aria-label="Voltar"><ion-icon name="chevron-back-outline"></ion-icon></button>
          <h1>Questionários</h1>
        </div>
        <p class="mu-page-sub">Perguntas rápidas para você se conhecer melhor. Elas não são um diagnóstico, apenas um momento de reflexão.</p>

        @if (carregando()) {
          <div class="mu-loading"><ion-spinner name="crescent"></ion-spinner></div>
        }
        @for (q of lista(); track q.id) {
          <a class="mu-card item" [routerLink]="['/questionarios', q.id]">
            <span class="ic"><ion-icon name="clipboard-outline"></ion-icon></span>
            <div class="txt">
              <h3>{{ q.titulo }}</h3>
              <p>{{ q.descricao }}</p>
              <span class="mu-badge">{{ q.totalPerguntas }} perguntas · ~2 min</span>
            </div>
            <ion-icon name="chevron-forward-outline" class="seta"></ion-icon>
          </a>
        }
      </div>
    </ion-content>`,
  styles: [`
    .item { display: flex; gap: 14px; align-items: center; text-decoration: none; }
    .ic { width: 46px; height: 46px; border-radius: 16px; background: #fdf0e1; color: #c48a3f; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .txt { flex: 1; }
    h3 { margin: 0 0 4px; font-size: 1rem; font-weight: 600; color: var(--mu-text); }
    p { margin: 0 0 10px; font-size: .85rem; color: var(--mu-muted); line-height: 1.45; }
    .seta { color: var(--mu-icon); font-size: 20px; }
  `],
})
export class QuestionariosPage {
  private api = inject(ApiService);
  nav = inject(NavController);
  lista = signal<QuestionarioResumo[]>([]);
  carregando = signal(true);

  constructor() { addIcons({ chevronBackOutline, chevronForwardOutline, clipboardOutline }); }

  ionViewWillEnter() {
    this.api.questionarios().subscribe({
      next: l => { this.lista.set(l); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }
}
