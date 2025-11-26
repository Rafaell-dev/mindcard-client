"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { searchUniversities, University } from "@/app/api/v1/university/route";

export function UniversitySearch({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string, id?: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(value);
  const [results, setResults] = React.useState<University[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setLoading(true);
        try {
          const data = await searchUniversities(searchTerm);
          setResults(data);
        } catch (error) {
          console.error("Failed to fetch universities", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (uni: University) => {
    setSearchTerm(uni.nome);
    onChange(uni.nome, uni.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 rounded-2xl px-4 text-base font-normal font-sans input-border hover:bg-background hover:text-foreground"
          disabled={disabled}
        >
          {value ? value : "Selecione a faculdade..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite o nome da faculdade..."
            value={searchTerm}
            onValueChange={(val) => {
              setSearchTerm(val);
              onChange(val, undefined);
            }}
          />
          <CommandList>
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              </div>
            )}
            {!loading && results.length === 0 && searchTerm.length >= 3 && (
              <CommandEmpty>Nenhuma faculdade encontrada.</CommandEmpty>
            )}
            {!loading && results.length > 0 && (
              <CommandGroup>
                {results.map((uni) => (
                  <CommandItem
                    key={uni.id}
                    value={uni.nome}
                    onSelect={() => handleSelect(uni)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === uni.nome ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{uni.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {uni.sigla} - {uni.uf}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
