import { Component, ElementRef, OnDestroy, computed, inject, signal, viewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { forkJoin } from 'rxjs';
import {
  Chart, LineController, LineElement, PointElement, BarController, BarElement,
  CategoryScale, LinearScale, Legend, Tooltip, Filler,
} from 'chart.js';
import { ApiService, Checkin, Sono } from '../../services/api.service';
import { humor } from '../../services/escalas';

Chart.register(LineController, LineElement, PointElement, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, Filler);
Chart.defaults.font.family = "'DM Sans', system-ui, sans-serif";
Chart.defaults.color = '#7d6e62';

@Component({
  selector: 'app-historico',
  imports: [IonContent, IonSpinner, DatePipe, DecimalPipe],
  templateUrl: './historico.page.html',
  styleUrl: './historico.page.scss',
})
export class HistoricoPage implements OnDestroy {
  private api = inject(ApiService);

  canvasEmocoes = viewChild<ElementRef<HTMLCanvasElement>>('emocoes');
  canvasSono = viewChild<ElementRef<HTMLCanvasElement>>('sono');
  private graficos: Chart[] = [];

  periodo = signal<7 | 30>(7);
  checkins = signal<Checkin[]>([]);
  sonos = signal<Sono[]>([]);
  carregando = signal(true);

  mediaHumor = computed(() => media(this.checkins().map(c => c.humor)));
  mediaEstresse = computed(() => media(this.checkins().map(c => c.estresse)));
  mediaSono = computed(() => media(this.sonos().map(s => s.horasSono)));
  humorMedio = computed(() => (this.mediaHumor() ? humor(Math.round(this.mediaHumor()!)) : null));

  humorEmoji(v: number) { return humor(v).emoji; }

  ionViewWillEnter() { this.carregar(); }
  ngOnDestroy() { this.destruir(); }

  mudarPeriodo(p: 7 | 30) { this.periodo.set(p); this.carregar(); }

  carregar() {
    this.carregando.set(true);
    const desde = Date.now() - this.periodo() * 24 * 3600 * 1000;
    forkJoin({ c: this.api.checkins(100), s: this.api.sono(100) }).subscribe({
      next: ({ c, s }) => {
        this.checkins.set(c.filter(x => new Date(x.criadoEm).getTime() >= desde).reverse());
        this.sonos.set(s.filter(x => new Date(x.data + 'T12:00:00').getTime() >= desde).reverse());
        this.carregando.set(false);
        setTimeout(() => this.desenhar());
      },
      error: () => this.carregando.set(false),
    });
  }

  private desenhar() {
    this.destruir();
    const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const el1 = this.canvasEmocoes()?.nativeElement;
    if (el1 && this.checkins().length) {
      const c = this.checkins();
      this.graficos.push(new Chart(el1, {
        type: 'line',
        data: {
          labels: c.map(x => fmt(x.criadoEm)),
          datasets: [
            serie('Humor', c.map(x => x.humor), '#6b917d'),
            serie('Estresse', c.map(x => x.estresse), '#e2a65a'),
            serie('Ansiedade', c.map(x => x.ansiedade), '#7b8fd6'),
          ],
        },
        options: opcoes(1, 5),
      }));
    }
    const el2 = this.canvasSono()?.nativeElement;
    if (el2 && this.sonos().length) {
      const s = this.sonos();
      this.graficos.push(new Chart(el2, {
        type: 'bar',
        data: {
          labels: s.map(x => fmt(x.data + 'T12:00:00')),
          datasets: [{ label: 'Horas de sono', data: s.map(x => x.horasSono), backgroundColor: '#92b39d', borderRadius: 8, maxBarThickness: 28 }],
        },
        options: { ...opcoes(0, 12), plugins: { legend: { display: false } } },
      }));
    }
  }

  private destruir() { this.graficos.forEach(g => g.destroy()); this.graficos = []; }
}

function media(v: number[]): number | null {
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

function serie(label: string, data: number[], cor: string) {
  return { label, data, borderColor: cor, backgroundColor: cor, tension: 0.35, pointRadius: 3, borderWidth: 2.5 };
}

function opcoes(min: number, max: number): any {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min, max, ticks: { stepSize: max > 5 ? 2 : 1 }, grid: { color: '#efe9df' }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } },
    },
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } } },
  };
}
