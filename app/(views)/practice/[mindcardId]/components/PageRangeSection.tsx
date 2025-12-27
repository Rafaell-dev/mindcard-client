"use client";

import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

interface PageRangeSectionProps {
  startPage: number;
  endPage: number;
  totalPages: number | null;
  disabled?: boolean;
  onStartPageChange: (value: number) => void;
  onEndPageChange: (value: number) => void;
  error?: string | null;
}

/**
 * Componente para seleção de intervalo de páginas
 * Responsabilidade: permitir ao usuário definir páginas inicial e final
 */
export function PageRangeSection({
  startPage,
  endPage,
  totalPages,
  disabled = false,
  onStartPageChange,
  onEndPageChange,
  error,
}: PageRangeSectionProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onStartPageChange(value);
    } else if (e.target.value === "") {
      onStartPageChange(1);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onEndPageChange(value);
    } else if (e.target.value === "") {
      onEndPageChange(totalPages || 1);
    }
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-base font-bold">Intervalo de páginas</Label>
        </div>
        {totalPages && (
          <span className="text-sm text-muted-foreground">
            {totalPages} páginas total
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={1}
          max={totalPages || undefined}
          value={startPage}
          onChange={handleStartChange}
          disabled={disabled || !totalPages}
          className="input-border h-12 rounded-2xl px-4 text-center"
          placeholder="1"
        />
        <span className="text-sm text-muted-foreground flex-shrink-0">
          para
        </span>
        <Input
          type="number"
          min={1}
          max={totalPages || undefined}
          value={endPage}
          onChange={handleEndChange}
          disabled={disabled || !totalPages}
          className="input-border h-12 rounded-2xl px-4 text-center"
          placeholder={totalPages?.toString() || ""}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!totalPages && (
        <p className="text-sm text-muted-foreground">
          Faça upload de um arquivo para definir o intervalo de páginas.
        </p>
      )}
    </section>
  );
}
