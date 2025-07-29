import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JourneyHub",
  description: "Private social itinerary planner for trips and vacations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}