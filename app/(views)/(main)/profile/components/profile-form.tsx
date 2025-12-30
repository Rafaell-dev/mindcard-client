"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { User } from "@/app/api/v1/user/types";
import { updateUserAction } from "@/app/api/v1/user/actions";
import { logoutAction } from "@/app/api/v1/auth/actions";
import { toast } from "sonner";
import { UniversitySearch } from "./university-search";
import { deleteUserAction } from "@/app/api/v1/user/actions";
import { DeleteAccountModal } from "./delete-account-modal";

type ProfileFormProps = {
  user: User | null;
  userId: string;
};

export function ProfileForm({ user, userId }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateUserAction, {});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAccount() {
    setIsDeleting(true);
    const result = await deleteUserAction(userId);
    if (result.error) {
      toast.error("Erro ao excluir conta: " + result.error);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }

  useEffect(() => {
    if (state.success) {
      toast.success("Perfil salvo com sucesso!");
    } else if (state.error) {
      toast.error("Falha ao salvar perfil. Por favor, tente novamente.");
    }
  }, [state]);

  return (
    <div className="mx-auto w-full space-y-6">
      <form action={formAction} className="space-y-6">
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
            Email
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-2xl border bg-muted px-4 py-3 text-sm text-muted-foreground input-border">
              {user?.email}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full input-border"
              onClick={() => logoutAction()}
            >
              Sair da conta
            </Button>
          </div>
          <input type="hidden" name="email" value={user?.email || ""} />
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

      {/* Delete Account Button */}
      <div className="pt-8 border-t">
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Zona de Perigo
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Ao excluir sua conta, todos os seus dados serão permanentemente
          removidos.
        </p>
        <Button
          variant="destructive"
          className="w-full rounded-full input-border"
          size="lg"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isPending || isDeleting}
        >
          Excluir minha conta
        </Button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isPending={isDeleting}
      />
    </div>
  );
}
