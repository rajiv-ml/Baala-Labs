import type { Metadata } from "next";
import "./compiled.css";

export const metadata: Metadata = {
  title: "Baala Labs • QualAI Dashboard",
  description: "AI-Powered Qualitative & Mixed-Methods Research Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
