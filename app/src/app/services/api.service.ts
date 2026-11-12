import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from './auth.service';

export interface Checkin { id: number; humor: number; estresse: number; ansiedade: number; observacao?: string; criadoEm: string; }
export interface Sono { id: number; horasSono: number; qualidade: number; data: string; }
export interface Alerta { id: number; tipo: string; mensagem: string; criadoEm: string; }
export interface Conteudo { id: number; titulo: string; tipo: 'DICA' | 'ARTIGO' | 'APOIO' | 'VIDEO'; descricao: string; url?: string; }
export interface QuestionarioResumo { id: number; titulo: string; descricao: string; totalPerguntas: number; }
export interface Pergunta { id: number; texto: string; ordem: number; }
export interface QuestionarioDetalhe { id: number; titulo: string; descricao: string; perguntas: Pergunta[]; }
export interface Resultado { pontos: number; maximo: number; percentual: number; nivel: string; mensagem: string; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  registrarCheckin(d: { humor: number; estresse: number; ansiedade: number; observacao?: string }): Observable<Checkin> {
    return this.http.post<Checkin>(`${this.api}/checkins`, d);
  }
  checkins(limite = 30): Observable<Checkin[]> {
    return this.http.get<Checkin[]>(`${this.api}/checkins`, { params: { limite } });
  }

  registrarSono(d: { horasSono: number; qualidade: number }): Observable<Sono> {
    return this.http.post<Sono>(`${this.api}/sono`, d);
  }
  sono(limite = 30): Observable<Sono[]> {
    return this.http.get<Sono[]>(`${this.api}/sono`, { params: { limite } });
  }

  questionarios(): Observable<QuestionarioResumo[]> {
    return this.http.get<QuestionarioResumo[]>(`${this.api}/questionarios`);
  }
  questionario(id: number): Observable<QuestionarioDetalhe> {
    return this.http.get<QuestionarioDetalhe>(`${this.api}/questionarios/${id}`);
  }
  responder(id: number, respostas: Record<number, number>): Observable<Resultado> {
    return this.http.post<Resultado>(`${this.api}/questionarios/${id}/respostas`, { respostas });
  }

  conteudos(): Observable<Conteudo[]> {
    return this.http.get<Conteudo[]>(`${this.api}/conteudos`);
  }
  alertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.api}/alertas`);
  }
  marcarAlertaLido(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/alertas/${id}/lido`, {});
  }

  atualizarPerfil(nome: string): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.api}/auth/me`, { nome });
  }
}
