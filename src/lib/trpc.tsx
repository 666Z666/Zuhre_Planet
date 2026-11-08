/**
 * tRPC Client Module
 *
 * Configures the tRPC client for making type-safe API calls from the frontend.
 */

import React, { useState } from "react";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "../../server";
import { SERVER_BASE_URL, secureFetch } from "./apiSecurity";

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return SERVER_BASE_URL;
  }
  // Server-side SSR
  return `http://localhost:${process.env.PORT ?? 4000}`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      // Sunucu yoksa sayfa uzun süre "yükleniyor"da kalmasın; 4xx hatalarını yeniden deneme
      queries: {
        retry: (count, err) => {
          const code = (err as { data?: { httpStatus?: number } })?.data?.httpStatus;
          if (code && code >= 400 && code < 500) return false;
          return count < 1;
        },
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // Çerez gönderimi + CSRF başlığı + 401'de oturum yenileme
          fetch: (url, options) => secureFetch(url, options as RequestInit),
        }),

      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
