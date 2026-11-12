import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario { id: number; nome: string; email: string; }
interface AuthResponse { token: string; usuario: Usuario; }

const TOKEN_KEY = 'menteuni_token';
const USER_KEY = 'menteuni_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  readonly usuario = signal<Usuario | null>(this.lerUsuario());

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, senha })
      .pipe(tap(r => this.salvarSessao(r)));
  }

  cadastrar(nome: string, email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/cadastro`, { nome, email, senha })
      .pipe(tap(r => this.salvarSessao(r)));
  }

  sair(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.usuario.set(null);
  }

  atualizarUsuario(u: Usuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    this.usuario.set(u);
  }

  get token(): string | null { return localStorage.getItem(TOKEN_KEY); }
  get logado(): boolean { return !!this.token; }

  private salvarSessao(r: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, r.token);
    localStorage.setItem(USER_KEY, JSON.stringify(r.usuario));
    this.usuario.set(r.usuario);
  }

  private lerUsuario(): Usuario | null {
    try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'); } catch { return null; }
  }
}
