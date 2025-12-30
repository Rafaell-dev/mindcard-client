import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <span className="text-8xl font-black text-primary">404</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription className="text-base">
            Ops! A página que você está procurando não existe ou foi movida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              className="w-full rounded-full primary-border"
              size="lg"
              asChild
            >
              <Link href="/mindcards">
                <Home className="mr-2 h-4 w-4" />
                Ir para o início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
