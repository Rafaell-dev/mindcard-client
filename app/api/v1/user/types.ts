export type User = {
  id: string;
  email: string;
  nome: string;
  faculdadeId: string;
  faculdadeNome: string;
  idioma: string;
  dataRegistro: string;
  xpTotal: number;
  sequenciaAtual: number;
  sequenciaRecorde: number;
};

export type UpdateUserData = {
  email?: string;
  nome?: string;
  senha?: string;
  faculdadeId?: string;
  faculdadeNome?: string;
  idioma?: string;
};
