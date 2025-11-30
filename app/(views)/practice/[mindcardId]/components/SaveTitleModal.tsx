"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface SaveTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SaveTitleModal({
  isOpen,
  onClose,
  onSave,
  onCancel,
  loading = false,
}: SaveTitleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Salvar alterações?</DialogTitle>
          <DialogDescription>
            Você fez alterações no título. Deseja salvá-las?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="secondary-border rounded-full flex-1"
            size="lg"
          >
            Desfazer
          </Button>
          <Button
            onClick={onSave}
            className="primary-border rounded-full flex-1"
            disabled={loading}
            size="lg"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
