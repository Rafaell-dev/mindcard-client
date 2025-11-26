import { MindcardItem } from "../mindcard-item/types";

export type CreateMindcardResponse = {
  success: boolean;
  message: string;
  data: {
    mindcardId: string;
    jobId: string;
    status: string;
  };
};

export type Mindcard = {
  id: string;
  titulo: string;
  fonteArquivo: string;
  promptPersonalizado?: string;
  usuarioId: string;
  dataCriacao: string;
  statusProcessamento: "PENDENTE" | "PROCESSANDO" | "CONCLUIDO" | "ERRO";
  jobId?: string;
  mensagemErro?: string;
  iniciadoEm?: string;
  concluidoEm?: string;
  progresso?: number; // Mocking this for now as API might not return it yet
  totalCards?: number; // Mocking this for now
  dificuldade?: "Fácil" | "Médio" | "Difícil"; // Mocking this for now
  sequencia?: number; // Mocking this for now
  itens?: MindcardItem[]; // Mocking this for now
};
