import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FitGenius AG | Terminal Inteligente de Musculação",
  description: "Sistema Especialista com Algoritmo Genético para Prescrição de Rotinas Semanais Otimizadas até 60 minutos.",
  keywords: ["algoritmo genetico", "treino de musculacao", "fitness", "hipertrofia", "otimizacao"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#070b12] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
