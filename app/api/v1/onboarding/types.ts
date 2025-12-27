/**
 * Tipos de resposta suportados pelo questionário de onboarding
 */
export enum TipoResposta {
  MULTIPLA_ESCOLHA = "MULTIPLA_ESCOLHA",
  TEXTO_LIVRE = "TEXTO_LIVRE",
  DATA = "DATA",
}

/**
 * Opção de resposta para perguntas de múltipla escolha
 */
export interface OpcaoPergunta {
  id: string;
  texto: string;
  valor: string;
  ordem: number;
}

/**
 * Pergunta do questionário de onboarding
 */
export interface PerguntaOnboarding {
  id: string;
  ordem: number;
  texto: string;
  tipoResposta: TipoResposta;
  obrigatoria: boolean;
  opcoes: OpcaoPergunta[];
}

/**
 * Resposta do usuário para uma pergunta
 */
export interface RespostaOnboarding {
  perguntaId: string;
  respostaTexto?: string;
  opcaoId?: string;
}

/**
 * Request body para salvar respostas
 */
export interface SalvarRespostasRequest {
  respostas: RespostaOnboarding[];
}

/**
 * Status de conclusão do onboarding
 */
export interface OnboardingStatus {
  completo: boolean;
  totalPerguntas: number;
  perguntasRespondidas: number;
  perguntasPendentes: string[];
}
