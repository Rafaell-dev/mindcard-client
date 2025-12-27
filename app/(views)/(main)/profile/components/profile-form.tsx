"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { User } from "@/app/actions/user";
import { updateUserAction } from "@/app/actions/user";
import { toast } from "sonner";
import { UniversitySearch } from "./university-search";

type ProfileFormProps = {
  user: User | null;
  userId: string;
};

export function ProfileForm({ user, userId }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Perfil salvo com sucesso!");
    } else if (state.error) {
      toast.error("Falha ao salvar perfil. Por favor, tente novamente.");
    }
  }, [state]);

  return (
    <form action={formAction} className="mx-auto w-full space-y-6">
      <input type="hidden" name="userId" value={userId} />

      <div className="space-y-2">
        <Label htmlFor="nome" className="text-base font-bold">
          Nome <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nome"
          name="nome"
          defaultValue={user?.nome || ""}
          className="input-border h-12 rounded-2xl px-4"
          placeholder="Seu nome completo"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="faculdade" className="text-base font-bold">
          Faculdade <span className="text-red-500">*</span>
        </Label>
        <UniversitySearch
          defaultValue={user?.faculdadeNome || ""}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-bold">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ""}
          className="input-border h-12 rounded-2xl px-4"
          placeholder="seu@email.com"
          disabled={isPending}
        />
      </div>

      <input type="hidden" name="idioma" value={user?.idioma || "pt-BR"} />

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full rounded-full primary-border"
          size="lg"
          disabled={isPending}
        >
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
