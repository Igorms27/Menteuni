import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class AvisoService {
  private toast = inject(ToastController);

  async mostrar(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'top', color: 'dark' });
    await t.present();
  }
}
