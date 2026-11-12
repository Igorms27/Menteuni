import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, moonOutline, clipboardOutline, statsChartOutline, leafOutline, closeOutline, chevronForwardOutline, sparklesOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Alerta, ApiService, Checkin, Conteudo } from '../../services/api.service';
import { humor } from '../../services/escalas';

@Component({
  selector: 'app-inicio',
  imports: [IonContent, IonIcon, IonRefresher, IonRefresherContent, RouterLink],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.scss',
})
export class InicioPage {
  private api = inject(ApiService);
  auth = inject(AuthService);

  alertas = signal<Alerta[]>([]);
  ultimo = signal<Checkin | null>(null);
  dica = signal<Conteudo | null>(null);

  primeiroNome = computed(() => (this.auth.usuario()?.nome ?? '').split(' ')[0]);
  saudacao = computed(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  });
  checkinHoje = computed(() => {
    const c = this.ultimo();
    return !!c && new Date(c.criadoEm).toDateString() === new Date().toDateString();
  });
  humorHoje = computed(() => (this.ultimo() ? humor(this.ultimo()!.humor) : null));

  constructor() {
    addIcons({ heartOutline, moonOutline, clipboardOutline, statsChartOutline, leafOutline, closeOutline, chevronForwardOutline, sparklesOutline });
  }

  ionViewWillEnter() { this.carregar(); }

  carregar(ev?: CustomEvent) {
    forkJoin({ alertas: this.api.alertas(), checkins: this.api.checkins(1), conteudos: this.api.conteudos() })
      .subscribe({
        next: r => {
          this.alertas.set(r.alertas.slice(0, 3));
          this.ultimo.set(r.checkins[0] ?? null);
          const dicas = r.conteudos.filter(c => c.tipo === 'DICA');
          this.dica.set(dicas.length ? dicas[new Date().getDate() % dicas.length] : null);
          (ev?.target as HTMLIonRefresherElement | undefined)?.complete();
        },
        error: () => (ev?.target as HTMLIonRefresherElement | undefined)?.complete(),
      });
  }

  dispensar(a: Alerta) {
    this.alertas.update(l => l.filter(x => x.id !== a.id));
    this.api.marcarAlertaLido(a.id).subscribe();
  }
}
