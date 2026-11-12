import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IonContent, IonIcon, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, addOutline, removeOutline, moon } from 'ionicons/icons';
import { ApiService, Sono } from '../../services/api.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemErro } from '../../services/erro';
import { QUALIDADE_SONO } from '../../services/escalas';

@Component({
  selector: 'app-sono',
  imports: [IonContent, IonIcon, DatePipe, DecimalPipe],
  templateUrl: './sono.page.html',
  styleUrl: './sono.page.scss',
})
export class SonoPage {
  private api = inject(ApiService);
  private aviso = inject(AvisoService);
  private nav = inject(NavController);

  qualidades = QUALIDADE_SONO;
  horas = signal(7);
  qualidade = signal<number | null>(null);
  enviando = signal(false);
  registros = signal<Sono[]>([]);

  constructor() { addIcons({ chevronBackOutline, addOutline, removeOutline, moon }); }

  ionViewWillEnter() { this.carregar(); }

  carregar() { this.api.sono(7).subscribe(r => this.registros.set(r)); }

  ajustar(delta: number) {
    this.horas.update(h => Math.min(24, Math.max(0, h + delta)));
  }

  salvar() {
    if (this.qualidade() === null) { this.aviso.mostrar('Escolha como foi a qualidade do seu sono.'); return; }
    this.enviando.set(true);
    this.api.registrarSono({ horasSono: this.horas(), qualidade: this.qualidade()! }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.qualidade.set(null);
        this.aviso.mostrar('Sono registrado. Boa noite de descanso faz toda diferença! 🌙');
        this.carregar();
      },
      error: e => { this.enviando.set(false); this.aviso.mostrar(mensagemErro(e)); },
    });
  }

  voltar() { this.nav.back(); }
}
