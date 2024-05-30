import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import TopBar from "@/components/TopBar";
import AppProvider from "./AppProvvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HD - ChatApp",
  description:
    "HD - ChatApp is a chat application that allows you to chat with your friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();

  const token = cookieStore.get("token");
  const userStore = cookieStore.get("user")?.value;
  let user : {} | undefined = undefined;
  if (userStore) {
    user = JSON.parse(userStore);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider inititalToken={token?.value} inititalUserLogined={user} >
          <TopBar />
          {children}
        </AppProvider>
      </body>
      <Toaster />
    </html>
  );
}
