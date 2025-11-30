export type MindcardItem = {
    id: string;
    titulo: string;
    tipo: "ABERTA" | "ALTERNATIVA" | "MULTIPLA_ESCOLHA";
    dificuldade: "FACIL" | "MEDIO" | "DIFICIL";
    pergunta: string;
    respostaCorreta: string;
    alternativaTexto: string | null;
    mindcardId: string;
};