import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { leafOutline, bookOutline, callOutline, openOutline, chevronDownOutline } from 'ionicons/icons';
import { ApiService, Conteudo } from '../../services/api.service';

@Component({
  selector: 'app-conteudos',
  imports: [IonContent, IonIcon, IonSpinner],
  templateUrl: './conteudos.page.html',
  styleUrl: './conteudos.page.scss',
})
export class ConteudosPage {
  private api = inject(ApiService);
  lista = signal<Conteudo[]>([]);
  carregando = signal(true);
  aberto = signal<number | null>(null);
  apoio = computed(() => this.lista().filter(c => c.tipo === 'APOIO'));
  demais = computed(() => this.lista().filter(c => c.tipo !== 'APOIO'));

  constructor() { addIcons({ leafOutline, bookOutline, callOutline, openOutline, chevronDownOutline }); }

  ionViewWillEnter() {
    this.api.conteudos().subscribe({
      next: l => { this.lista.set(l); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  alternar(id: number) { this.aberto.update(a => (a === id ? null : id)); }
  icone(c: Conteudo) { return c.tipo === 'ARTIGO' ? 'book-outline' : 'leaf-outline'; }
  abrir(url?: string) { if (url) window.open(url, '_blank'); }
}
