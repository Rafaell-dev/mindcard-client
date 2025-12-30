import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NoAccountPage() {
  return (
    <Card className="mx-auto max-w-sm text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="bg-muted p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl">Conta não encontrada</CardTitle>
        <CardDescription>
          Não encontramos nenhuma conta vinculada a esse email, deseja continuar
          a criação da sua conta ou voltar?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button className="w-full rounded-full primary-border" size="lg">
            Continuar
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full input-border"
            size="lg"
            asChild
          >
            <Link href="/login">Voltar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
