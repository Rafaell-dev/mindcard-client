"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";

type ProfileFormData = {
  faculdade: string;
  email: string;
  idioma: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileFormData>({
    faculdade: "Instituto Federal de Pernambuco",
    email: "rafael@email.com",
    idioma: "pt-BR",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API
    console.log("Profile saved", form);
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="relative w-full overflow-hidden rounded-b-[32px] flex flex-col justify-between bg-accent px-6 py-6 sm:px-8 sm:py-8 h-36 lg:44">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full ring-4 ring-background/40">
              <Image
                src="/avatars/avatar_1.svg"
                alt="Avatar"
                className="rounded-full"
                width={128}
                height={128}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black leading-none">Rafael</h1>
              <span className="text-sm text-fox-gray">@leaf</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
            <span className="mt-2 text-sm text-fox-gray">
              Por aqui desde de 2019
            </span>
          </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 py-6 sm:px-8">
        <form onSubmit={handleSubmit} className="mx-auto w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="faculdade" className="text-base font-bold">
              Faculdade
            </Label>
            <Input
              id="faculdade"
              name="faculdade"
              value={form.faculdade}
              onChange={handleChange}
              className="input-border h-12 rounded-2xl px-4"
              placeholder="Sua instituição"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-bold">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-border h-12 rounded-2xl px-4"
              placeholder="seu@email.com"
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
                className={cn(
                  "input-border h-12 w-full appearance-none rounded-2xl bg-background px-4 text-base",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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
            >
              Salvar alterações
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
