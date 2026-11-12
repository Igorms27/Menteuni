import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemErro } from '../../services/erro';
import { HUMORES, NIVEIS } from '../../services/escalas';

@Component({
  selector: 'app-checkin',
  imports: [IonContent, FormsModule],
  templateUrl: './checkin.page.html',
  styleUrl: './checkin.page.scss',
})
export class CheckinPage {
  private api = inject(ApiService);
  private aviso = inject(AvisoService);
  private router = inject(Router);

  humores = HUMORES;
  niveis = NIVEIS;
  escala = [1, 2, 3, 4, 5];

  humor = signal<number | null>(null);
  estresse = signal<number | null>(null);
  ansiedade = signal<number | null>(null);
  observacao = '';
  enviando = signal(false);
  concluido = signal(false);

  get completo() { return this.humor() !== null && this.estresse() !== null && this.ansiedade() !== null; }

  salvar() {
    if (!this.completo) { this.aviso.mostrar('Responda as três perguntas para salvar.'); return; }
    this.enviando.set(true);
    this.api.registrarCheckin({
      humor: this.humor()!, estresse: this.estresse()!, ansiedade: this.ansiedade()!,
      observacao: this.observacao.trim() || undefined,
    }).subscribe({
      next: () => { this.enviando.set(false); this.concluido.set(true); },
      error: e => { this.enviando.set(false); this.aviso.mostrar(mensagemErro(e)); },
    });
  }

  novo() {
    this.humor.set(null); this.estresse.set(null); this.ansiedade.set(null);
    this.observacao = ''; this.concluido.set(false);
  }

  irInicio() { this.novo(); this.router.navigateByUrl('/app/inicio'); }
}
