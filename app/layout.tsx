import type { Metadata } from "next";
import { Geologica, Roboto, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";
import { Toaster } from "sonner";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mindcard",
  description: "Flashcards automáticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} ${geologica.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased max-w-4xl mx-auto bg-background">
        <main className="h-full">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
