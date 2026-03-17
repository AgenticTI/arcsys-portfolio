import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saúde Agendamento",
  description: "Sistema de agendamento de consultas médicas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
