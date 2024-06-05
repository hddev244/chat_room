import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles.css";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { IUser } from "@/server/models/User.model";
import AppProvider from "../AppProvvider";

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
  let user: IUser | undefined | null = undefined;
  if (userStore) {
    user = JSON.parse(userStore);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className +
        " flex flex-col  justify-start max-h-svh overflow-hidden h-svh "
      }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider inititalToken={token?.value} inititalCurrentUser={user} >
            <div className="flex size-full flex-1">
               {children}
            </div>
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
