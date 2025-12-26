"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/app/api";

const COOKIE_NAME = "token";
const COOKIE_DURATION = 60 * 60 * 24 * 7; // 7 days

type AuthState = {
  success?: boolean;
  error?: string;
};

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await api.post<{ accessToken: string; user: unknown }>(
      "auth/login",
      { email, senha: password }
    );

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, res.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_DURATION,
      path: "/",
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err.status === 404) {
      return { error: "NOT_FOUND" };
    }
    return { error: "INVALID_CREDENTIALS" };
  }
}

export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Create the account
    await api.post("usuario/cadastrar", {
      email,
      senha: password,
      idioma: "PT_BR",
    });

    // 2. Automatically login after registration
    const res = await api.post<{ accessToken: string; user: unknown }>(
      "auth/login",
      { email, senha: password }
    );

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, res.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_DURATION,
      path: "/",
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "REGISTRATION_FAILED" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}

export async function googleAuthCallbackAction(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_DURATION,
    path: "/",
  });
  redirect("/");
}
