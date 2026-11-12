import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
})
export class App {
  constructor() {
    // acorda o servidor do render
    fetch(environment.apiUrl.replace(/\/api$/, '/')).catch(() => {});
  }
}
