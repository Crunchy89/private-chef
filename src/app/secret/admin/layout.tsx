import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import AdminShell from "@/layout/AdminShell";
import { SidebarProvider } from "@/context/SidebarContext";

const outfit = Outfit({
  variable: "--font-outfit-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${outfit.variable} font-outfit antialiased`}>
      <SidebarProvider>
        <AdminShell>{children}</AdminShell>
      </SidebarProvider>
    </div>
  );
}
