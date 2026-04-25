import type { Metadata } from "next";
import { Toaster } from "sonner";
import { CssBaseline } from "@mui/material";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { FilterProvider } from "@/context/FilterContext";
import { DateLocalizationProvider } from "@/components/DateLocalizationProvider";

export const metadata: Metadata = {
  title: "Event Manager - Manage Your Events",
  description:
    "A comprehensive event management dashboard for creating, organizing, and tracking events",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DateLocalizationProvider>
          <CssBaseline />
          <AuthProvider>
            <EventsProvider>
              <FilterProvider>
                {children}
                <Toaster position="top-right" />
              </FilterProvider>
            </EventsProvider>
          </AuthProvider>
        </DateLocalizationProvider>
      </body>
    </html>
  );
}
