import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/topBar";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dementia App",
  description: "Contacts and daily tasks, in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    



    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TopBar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 md:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
