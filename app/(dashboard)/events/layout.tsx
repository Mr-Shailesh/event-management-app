import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Event Manager",
  description: "View and manage your events",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
