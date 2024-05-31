import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import TopBar from "@/components/TopBar";
import AppProvider from "./AppProvvider";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";

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
  let user: {} | undefined = undefined;
  if (userStore) {
    user = JSON.parse(userStore);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className +
        " flex flex-col h-dvh justify-start"
      }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider inititalToken={token?.value} inititalCurrentUser={user} >
            <TopBar />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            error: 'bg-red-400',
            success: 'text-green-400',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }}
      />
    </html>
  );
}
