import LoadingWrapper from "@/components/LoadingWrapper";
import ProtectedLayout from "@/components/protected-layout";
import ReactQueryProvider from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Futa Admin Dashboard",
  description: "Trang quản trị cho ứng dụng đặt vé xe Futa",
  icons: {
    icon: [
      {
        url: "/logo_square.png",
        href: "/logo_square.png",
      },
    ],
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
            <LoadingWrapper />
          </ReactQueryProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
