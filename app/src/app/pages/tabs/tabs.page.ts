import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, statsChartOutline, leafOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="inicio"><ion-icon name="home-outline"></ion-icon><ion-label>Início</ion-label></ion-tab-button>
        <ion-tab-button tab="checkin"><ion-icon name="heart-outline"></ion-icon><ion-label>Check-in</ion-label></ion-tab-button>
        <ion-tab-button tab="historico"><ion-icon name="stats-chart-outline"></ion-icon><ion-label>Histórico</ion-label></ion-tab-button>
        <ion-tab-button tab="conteudos"><ion-icon name="leaf-outline"></ion-icon><ion-label>Dicas</ion-label></ion-tab-button>
        <ion-tab-button tab="perfil"><ion-icon name="person-circle-outline"></ion-icon><ion-label>Perfil</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>`,
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, heartOutline, statsChartOutline, leafOutline, personCircleOutline });
  }
}
