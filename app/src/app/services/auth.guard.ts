import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).logado ? true : inject(Router).createUrlTree(['/login']);

export const visitanteGuard: CanActivateFn = () =>
  inject(AuthService).logado ? inject(Router).createUrlTree(['/app/inicio']) : true;
