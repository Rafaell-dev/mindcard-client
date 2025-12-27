"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteAccountModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-lg z-[101] gap-0 p-0 overflow-hidden p-6 pb-4"
        >
          <DialogHeader>
            <DialogTitle>Excluir conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser
              desfeita e todos os seus dados serão perdidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between gap-3 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-12 rounded-full font-semibold transition-all outline-border"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 h-12 rounded-full font-semibold"
            >
              {isPending ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
