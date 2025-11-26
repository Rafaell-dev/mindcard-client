"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/app/lib/utils";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { updateUser } from "@/app/api/v1/user/route";
import { UniversitySearch } from "./university-search";

type ProfileFormProps = {
  user: User;
  userId: string;
};

type ProfileFormData = {
  nome: string;
  faculdade: string;
  faculdadeId?: string;
  email: string;
  idioma: string;
};

export function ProfileForm({ user, userId }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileFormData>({
    nome: user.nome,
    faculdade: user.faculdadeNome,
    faculdadeId: undefined,
    email: user.email,
    idioma: user.idioma,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.faculdade) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("nome", form.nome);
      // Only send faculdadeId if it exists (user selected from list)
      if (form.faculdadeId) {
        formData.append("faculdadeId", form.faculdadeId);
      }
      formData.append("email", form.email);
      formData.append("idioma", form.idioma);

      await updateUser(formData);
      toast.success("Perfil salvo com sucesso!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Falha ao salvar perfil. Por favor, tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-base font-bold">
          Nome <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className="input-border h-12 rounded-2xl px-4"
          placeholder="Seu nome completo"
          disabled={saving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="faculdade" className="text-base font-bold">
          Faculdade <span className="text-red-500">*</span>
        </Label>
        <UniversitySearch
          value={form.faculdade}
          onChange={(value, id) =>
            setForm((prev) => ({ ...prev, faculdade: value, faculdadeId: id }))
          }
          disabled={saving}
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
          value={form.email}
          onChange={handleChange}
          className="input-border h-12 rounded-2xl px-4"
          placeholder="seu@email.com"
          disabled={saving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idioma" className="text-base font-bold">
          Idioma
        </Label>
        <div className="relative">
          <select
            id="idioma"
            name="idioma"
            value={form.idioma}
            onChange={handleChange}
            disabled={saving}
            className={cn(
              "input-border h-12 w-full appearance-none rounded-2xl bg-background px-4 text-base",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              saving && "opacity-50 cursor-not-allowed"
            )}
          >
            <option value="pt-BR">Português (PT-BR)</option>
            <option value="en-US">Inglês (EN-US)</option>
            <option value="es-ES">Espanhol (ES-ES)</option>
          </select>
          {/* Caret */}
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-foreground/70">
            ▾
          </span>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full rounded-full primary-border"
          size="lg"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
