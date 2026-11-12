import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSpinner, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ApiService, QuestionarioDetalhe, Resultado } from '../../services/api.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemErro } from '../../services/erro';
import { OPCOES_QUESTIONARIO } from '../../services/escalas';

@Component({
  selector: 'app-questionario',
  imports: [IonContent, IonIcon, IonSpinner],
  templateUrl: './questionario.page.html',
  styleUrl: './questionario.page.scss',
})
export class QuestionarioPage {
  private api = inject(ApiService);
  private aviso = inject(AvisoService);
  private route = inject(ActivatedRoute);
  nav = inject(NavController);

  opcoes = OPCOES_QUESTIONARIO;
  q = signal<QuestionarioDetalhe | null>(null);
  indice = signal(0);
  respostas = signal<Record<number, number>>({});
  enviando = signal(false);
  resultado = signal<Resultado | null>(null);

  pergunta = computed(() => this.q()?.perguntas[this.indice()]);
  total = computed(() => this.q()?.perguntas.length ?? 0);
  progresso = computed(() => this.total() ? ((this.indice() + 1) / this.total()) * 100 : 0);
  ultima = computed(() => this.indice() === this.total() - 1);

  constructor() {
    addIcons({ chevronBackOutline });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.questionario(id).subscribe({
      next: q => this.q.set(q),
      error: e => this.aviso.mostrar(mensagemErro(e)),
    });
  }

  escolher(valor: number) {
    const p = this.pergunta();
    if (!p) return;
    this.respostas.update(r => ({ ...r, [p.id]: valor }));
    if (!this.ultima()) setTimeout(() => this.indice.update(i => i + 1), 220);
  }

  anterior() {
    if (this.indice() > 0) this.indice.update(i => i - 1);
    else this.nav.back();
  }

  enviar() {
    const q = this.q();
    if (!q || Object.keys(this.respostas()).length < q.perguntas.length) {
      this.aviso.mostrar('Responda todas as perguntas.');
      return;
    }
    this.enviando.set(true);
    this.api.responder(q.id, this.respostas()).subscribe({
      next: r => { this.enviando.set(false); this.resultado.set(r); },
      error: e => { this.enviando.set(false); this.aviso.mostrar(mensagemErro(e)); },
    });
  }
}
