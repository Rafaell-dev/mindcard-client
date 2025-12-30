"use client";

import { useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";
import { Check } from "lucide-react";
import type {
  PerguntaOnboarding,
  OpcaoPergunta,
  RespostaOnboarding,
} from "@/app/api/v1/onboarding/types";
import { TipoResposta } from "@/app/api/v1/onboarding/types";
import { validateBirthDate } from "./useDateValidation";

interface OnboardingQuestionProps {
  /** The question to render */
  pergunta: PerguntaOnboarding;
  /** Current answer value */
  resposta: RespostaOnboarding | undefined;
  /** Callback when answer changes */
  onRespostaChange: (resposta: RespostaOnboarding) => void;
}

/**
 * Renders a single onboarding question based on its type
 */
export function OnboardingQuestion({
  pergunta,
  resposta,
  onRespostaChange,
}: OnboardingQuestionProps) {
  const handleMultiplaEscolha = (opcao: OpcaoPergunta) => {
    onRespostaChange({
      perguntaId: pergunta.id,
      opcaoId: opcao.id,
      respostaTexto: opcao.valor,
    });
  };

  const handleTextoLivre = (texto: string) => {
    onRespostaChange({
      perguntaId: pergunta.id,
      respostaTexto: texto,
    });
  };

  const handleData = (data: string) => {
    onRespostaChange({
      perguntaId: pergunta.id,
      respostaTexto: data,
    });
  };

  return (
    <div className="space-y-6">
      {/* Question text */}
      <h3 className="text-xl font-semibold text-foreground text-center">
        {pergunta.texto}
      </h3>

      {/* Response input based on type */}
      <div className="mt-6">
        {pergunta.tipoResposta === TipoResposta.MULTIPLA_ESCOLHA && (
          <MultiplaEscolhaInput
            opcoes={pergunta.opcoes}
            selectedOpcaoId={resposta?.opcaoId}
            onSelect={handleMultiplaEscolha}
          />
        )}

        {pergunta.tipoResposta === TipoResposta.TEXTO_LIVRE && (
          <TextoLivreInput
            value={resposta?.respostaTexto || ""}
            onChange={handleTextoLivre}
          />
        )}

        {pergunta.tipoResposta === TipoResposta.DATA && (
          <DataInput
            value={resposta?.respostaTexto || ""}
            onChange={handleData}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Multiple choice selection cards
 */
function MultiplaEscolhaInput({
  opcoes,
  selectedOpcaoId,
  onSelect,
}: {
  opcoes: OpcaoPergunta[];
  selectedOpcaoId?: string;
  onSelect: (opcao: OpcaoPergunta) => void;
}) {
  const sortedOpcoes = [...opcoes].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="grid gap-3">
      {sortedOpcoes.map((opcao) => {
        const isSelected = selectedOpcaoId === opcao.id;

        return (
          <Button
            key={opcao.id}
            variant="outline"
            className={cn(
              "relative w-full h-auto py-4 px-6 justify-start text-left transition-all duration-200",
              "hover:bg-primary/5 hover:border-primary/50 input-border",
              isSelected && [
                "bg-primary/10 border-primary",
                "ring-2 ring-primary/20",
              ]
            )}
            onClick={() => onSelect(opcao)}
          >
            <div className="flex items-center gap-4 w-full">
              {/* Selection indicator */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>

              {/* Option text */}
              <span
                className={cn(
                  "text-base font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {opcao.texto}
              </span>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Free text input
 */
function TextoLivreInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Digite sua resposta..."
      className="w-full h-12 text-base px-4"
    />
  );
}

/**
 * Date input with separate Day, Month, Year fields
 * Includes validation with error messages displayed in red
 */
function DataInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [touched, setTouched] = useState({
    day: false,
    month: false,
    year: false,
  });

  // Parse existing value (format: YYYY-MM-DD)
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { day: "", month: "", year: "" };
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return { year: parts[0], month: parts[1], day: parts[2] };
    }
    return { day: "", month: "", year: "" };
  };

  const { day, month, year } = parseDate(value);

  // Validate the current values
  const validation = validateBirthDate(day, month, year);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: "day" | "month" | "year", val: string) => {
    // Only allow numbers
    const numericVal = val.replace(/\D/g, "");

    let newDay = day;
    let newMonth = month;
    let newYear = year;

    if (field === "day") {
      // Limit to 2 digits and max 31
      newDay = numericVal.slice(0, 2);
      if (parseInt(newDay) > 31) newDay = "31";

      // Auto-focus move to month
      if (newDay.length === 2 && val.length >= 2) {
        monthRef.current?.focus();
      }
    } else if (field === "month") {
      // Limit to 2 digits and max 12
      newMonth = numericVal.slice(0, 2);
      if (parseInt(newMonth) > 12) newMonth = "12";

      // Auto-focus move to year
      if (newMonth.length === 2 && val.length >= 2) {
        yearRef.current?.focus();
      }
    } else if (field === "year") {
      // Limit to 4 digits
      newYear = numericVal.slice(0, 4);
    }

    // Format as YYYY-MM-DD for the backend
    if (newDay && newMonth && newYear && newYear.length === 4) {
      const formattedDate = `${newYear}-${newMonth.padStart(
        2,
        "0"
      )}-${newDay.padStart(2, "0")}`;
      onChange(formattedDate);
    } else {
      // Store partial values in a temporary format
      onChange(`${newYear}-${newMonth}-${newDay}`);
    }
  };

  const handleBlur = (field: "day" | "month" | "year") => {
    setTouched((prev: { day: boolean; month: boolean; year: boolean }) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Show errors only after field has been touched or all fields have values
  const allFieldsFilled = day && month && year && year.length === 4;
  const showDayError =
    (touched.day || allFieldsFilled) && validation.errors.day;
  const showMonthError =
    (touched.month || allFieldsFilled) && validation.errors.month;
  const showYearError =
    (touched.year || allFieldsFilled) && validation.errors.year;
  const showGeneralError = allFieldsFilled && validation.errors.general;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start justify-center gap-4">
        {/* Day */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Dia
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={day}
            onChange={(e) => handleChange("day", e.target.value)}
            onBlur={() => handleBlur("day")}
            placeholder="DD"
            ref={dayRef}
            className={cn(
              "w-16 h-12 text-center text-lg font-medium rounded-2xl bg-background focus:outline-none transition-colors",
              showDayError
                ? "border-2 border-red-500 focus:border-red-500"
                : "input-border"
            )}
          />
          {showDayError && (
            <span className="text-xs text-red-500 text-center max-w-20">
              {validation.errors.day}
            </span>
          )}
        </div>

        {/* Month */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Mês
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={month}
            onChange={(e) => handleChange("month", e.target.value)}
            onBlur={() => handleBlur("month")}
            placeholder="MM"
            ref={monthRef}
            className={cn(
              "w-16 h-12 text-center text-lg font-medium rounded-2xl bg-background focus:outline-none transition-colors",
              showMonthError
                ? "border-2 border-red-500 focus:border-red-500"
                : "input-border"
            )}
          />
          {showMonthError && (
            <span className="text-xs text-red-500 text-center max-w-20">
              {validation.errors.month}
            </span>
          )}
        </div>

        {/* Year */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Ano
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(e) => handleChange("year", e.target.value)}
            onBlur={() => handleBlur("year")}
            placeholder="AAAA"
            ref={yearRef}
            className={cn(
              "w-20 h-12 text-center text-lg font-medium rounded-2xl bg-background focus:outline-none transition-colors",
              showYearError
                ? "border-2 border-red-500 focus:border-red-500"
                : "input-border"
            )}
          />
          {showYearError && (
            <span className="text-xs text-red-500 text-center max-w-24">
              {validation.errors.year}
            </span>
          )}
        </div>
      </div>

      {/* General error message */}
      {showGeneralError && (
        <span className="text-sm text-red-500 text-center">
          {validation.errors.general}
        </span>
      )}
    </div>
  );
}
