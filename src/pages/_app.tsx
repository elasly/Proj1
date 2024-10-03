import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { api } from "@/utils/api";

import "@/styles/globals.css";
import Sidebar from "@/components/sidebar";
import TopBar from "@/components/topbar";

const queryClient = new QueryClient()

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider
            attribute="class"
            defaultTheme="Dark"
            enableSystem
            disableTransitionOnChange
          >
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex self-stretch w-full flex-col">
    
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
      </div>
      </div>
      </div>
      </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
