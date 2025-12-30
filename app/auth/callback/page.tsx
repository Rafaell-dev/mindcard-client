"use client";

import { googleAuthCallbackAction } from "@/app/api/v1/auth/actions";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      googleAuthCallbackAction(token);
    }
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">Autenticando...</div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
