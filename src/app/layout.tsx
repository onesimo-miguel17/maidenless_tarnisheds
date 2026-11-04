import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pambala — Inteligência Agrícola",
  description: "Apoio à decisão agrícola fundamentado nas condições do terreno e nas necessidades das culturas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-AO">
      <body>{children}</body>
    </html>
  );
}
