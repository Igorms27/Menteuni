import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErro(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) return 'Não foi possível conectar ao servidor. Verifique sua internet.';
    if (e.error?.mensagem) return e.error.mensagem;
  }
  return 'Algo deu errado. Tente novamente.';
}
