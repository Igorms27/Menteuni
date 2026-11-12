export const HUMORES = [
  { valor: 1, emoji: '😞', nome: 'Muito mal' },
  { valor: 2, emoji: '😕', nome: 'Mal' },
  { valor: 3, emoji: '😐', nome: 'Neutro' },
  { valor: 4, emoji: '🙂', nome: 'Bem' },
  { valor: 5, emoji: '😄', nome: 'Muito bem' },
];

export const NIVEIS = ['Muito baixo', 'Baixo', 'Médio', 'Alto', 'Muito alto'];

export const QUALIDADE_SONO = ['Péssima', 'Ruim', 'Regular', 'Boa', 'Ótima'];

export const OPCOES_QUESTIONARIO = [
  { valor: 0, nome: 'Nunca' },
  { valor: 1, nome: 'Às vezes' },
  { valor: 2, nome: 'Frequentemente' },
  { valor: 3, nome: 'Quase sempre' },
];

export function humor(valor: number) {
  return HUMORES.find(h => h.valor === valor) ?? HUMORES[2];
}
