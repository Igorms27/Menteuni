import { Routes } from '@angular/router';
import { authGuard, visitanteGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', canActivate: [visitanteGuard], loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'cadastro', canActivate: [visitanteGuard], loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage) },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage) },
      { path: 'checkin', loadComponent: () => import('./pages/checkin/checkin.page').then(m => m.CheckinPage) },
      { path: 'historico', loadComponent: () => import('./pages/historico/historico.page').then(m => m.HistoricoPage) },
      { path: 'conteudos', loadComponent: () => import('./pages/conteudos/conteudos.page').then(m => m.ConteudosPage) },
      { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage) },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
  { path: 'sono', canActivate: [authGuard], loadComponent: () => import('./pages/sono/sono.page').then(m => m.SonoPage) },
  { path: 'questionarios', canActivate: [authGuard], loadComponent: () => import('./pages/questionarios/questionarios.page').then(m => m.QuestionariosPage) },
  { path: 'questionarios/:id', canActivate: [authGuard], loadComponent: () => import('./pages/questionario/questionario.page').then(m => m.QuestionarioPage) },
  { path: '**', redirectTo: 'login' },
];
