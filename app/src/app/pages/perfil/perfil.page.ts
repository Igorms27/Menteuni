import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, AlertController, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, shieldCheckmarkOutline, informationCircleOutline, logOutOutline, chevronForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemErro } from '../../services/erro';

@Component({
  selector: 'app-perfil',
  imports: [IonContent, IonIcon, FormsModule],
  templateUrl: './perfil.page.html',
  styleUrl: './perfil.page.scss',
})
export class PerfilPage {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private aviso = inject(AvisoService);
  private alert = inject(AlertController);
  private nav = inject(NavController);

  editando = signal(false);
  nome = '';
  versao = '1.0.0';
  iniciais = computed(() => (this.auth.usuario()?.nome ?? '?').split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase());

  constructor() { addIcons({ createOutline, shieldCheckmarkOutline, informationCircleOutline, logOutOutline, chevronForwardOutline }); }

  editar() { this.nome = this.auth.usuario()?.nome ?? ''; this.editando.set(true); }

  salvar() {
    if (!this.nome.trim()) { this.aviso.mostrar('Informe seu nome.'); return; }
    this.api.atualizarPerfil(this.nome.trim()).subscribe({
      next: u => { this.auth.atualizarUsuario(u); this.editando.set(false); this.aviso.mostrar('Perfil atualizado.'); },
      error: e => this.aviso.mostrar(mensagemErro(e)),
    });
  }

  async privacidade() {
    const a = await this.alert.create({
      header: 'Privacidade',
      message: 'Seus registros são pessoais e protegidos. Eles ficam vinculados apenas à sua conta, acessada com senha e token seguro (JWT), e não são compartilhados com professores ou colegas.',
      buttons: ['Entendi'],
    });
    a.present();
  }

  async sobre() {
    const a = await this.alert.create({
      header: 'Sobre o MenteUni',
      message: `Versão ${this.versao}. Projeto acadêmico desenvolvido por estudantes da UNICEPLAC. O app não substitui acompanhamento profissional. Em caso de crise, ligue 188 (CVV).`,
      buttons: ['Fechar'],
    });
    a.present();
  }

  async sair() {
    const a = await this.alert.create({
      header: 'Sair da conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sair', role: 'destructive', handler: () => { this.auth.sair(); this.nav.navigateRoot('/login'); } },
      ],
    });
    a.present();
  }
}
